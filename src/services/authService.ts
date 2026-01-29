import db from '../config/prisma';
import { hashPassword, comparePassword } from '../lib/passwordHash.utils';
import { isUserExists, getDefaultRoleId } from '../lib/user.utils';
import { VerificationTokenService } from '../lib/verificationToken.utils';
import { AuthMailService } from '../lib/authMail';
import { jwtService } from '@/lib/generateToken.utils';
import { createUserSession } from '@/lib/session.utils';
import { PROVIDER, CREDENTIALS_TYPES, VERIFICATION_TOKEN_TYPES } from '../constant/user';
import logger from '../middleware/logger';
import type { RefreshTokenPayload, UserPayload } from '../types/user';
import message from '../constant/message';
import httpStatus from 'http-status';
import { AppError } from '@/lib/AppError';

type VerificationTokenType = keyof typeof VERIFICATION_TOKEN_TYPES;

export class AuthService {
  constructor(
    private verificationTokenService = VerificationTokenService,
    private authMailService = AuthMailService,
  ) {}

  /*
   *  Register a new user
   * @param displayName - user's display name
   * @param email - user's email
   * @param userName - user's username
   * @param password - user's password
   * @param roleId - user's role ID
   */
  public async registerUser({
    displayName,
    email,
    userName,
    password,
    roleId,
  }: any): Promise<UserPayload> {
    if (await isUserExists(email, userName)) {
      throw new AppError(message.auth.register.REGISTER_USER_EXISTS, httpStatus.CONFLICT);
    }

    const hashedPassword = await hashPassword(password);

    const assignedRoleId = roleId || (await getDefaultRoleId());
    if (!assignedRoleId) {
      throw new AppError(
        message.auth.role.DEFAULT_ROLE_NOT_FOUND,
        httpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const user = await db.user.create({
      data: {
        displayName,
        email,
        userName,
        password: hashedPassword,
        roleId: assignedRoleId,
        accounts: {
          create: {
            type: CREDENTIALS_TYPES.credentials,
            provider: PROVIDER.local,
            providerAccountId: email,
          },
        },
      },
      select: { id: true, displayName: true, email: true, userName: true, roleId: true },
    });

    await this.createAndSendToken(email, VERIFICATION_TOKEN_TYPES.REGISTER_USER);

    return { ...user, role: [] };
  }

  /*
   *  Resend verification email
   * @param email - user's email
   * @returns
   */
  public async resendVerificationEmail(email: string) {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) throw new AppError(message.auth.user.USER_NOT_FOUND, httpStatus.NOT_FOUND);
    if (user.emailVerified)
      throw new AppError(message.auth.email.EMAIL_ALREADY_VERIFIED, httpStatus.BAD_REQUEST);

    await this.createAndSendToken(email, VERIFICATION_TOKEN_TYPES.REGISTER_USER);
  }

  /*
   *  Login User
   * @param email - user's email
   * @param userName - user's username
   * @param password - user's password
   * @param deviceInfo - device info
   * @param ipAddress - IP address
   * @param userAgent - user agent
   * @returns
   */
  public async loginUser({ email, userName, password, deviceInfo, ipAddress, userAgent }: any) {
    const user = await db.user.findFirst({
      where: { OR: [{ email }, { userName }] },
      include: { role: true },
    });

    if (!user) throw new AppError(message.auth.user.USER_NOT_FOUND, httpStatus.NOT_FOUND);
    if (!user.emailVerified)
      throw new AppError(message.auth.email.EMAIL_NOT_VERIFIED, httpStatus.FORBIDDEN);
    if (user.isDisabled) throw new AppError(message.auth.user.USER_DISABLED, httpStatus.FORBIDDEN);
    if (user.isDeleted) throw new AppError(message.auth.user.USER_DELETED, httpStatus.FORBIDDEN);

    const isPasswordValid = await comparePassword(password, user.password!);
    if (!isPasswordValid)
      throw new AppError(message.auth.login.PASSWORD_INVALID, httpStatus.UNAUTHORIZED);

    const userPayload = {
      id: user.id,
      email: user.email,
      userName: user.userName,
      displayName: user.displayName,
      roleId: user.roleId,
      role: user.role ? [{ id: user.role.id, name: user.role.name }] : [],
    };

    const tokens = jwtService.generateAuthTokens(userPayload);
    await createUserSession(user.id, tokens.refreshToken, deviceInfo, ipAddress, userAgent);

    return { user: userPayload, tokens };
  }

  /*
   * Verify email using token + encrypted email
   * @param token - verification token
   * @param email - user's email
   * @returns
   */
  public async verifyEmail(token: string, email: string) {
    if (!token || !email)
      throw new AppError(message.auth.token.TOKEN_INVALID_OR_EXPIRED, httpStatus.BAD_REQUEST);

    const record = await this.verificationTokenService.verify(
      token,
      email,
      VERIFICATION_TOKEN_TYPES.REGISTER_USER,
    );
    if (!record)
      throw new AppError(message.auth.token.TOKEN_INVALID_OR_EXPIRED, httpStatus.BAD_REQUEST);

    await db.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    await this.verificationTokenService.delete(token, email);

    return { email, verified: true };
  }

  /*
   *  Private helper: Create token + send verification email
   *
   * @param email - user's email
   * @param type - verification token type
   * @returns
   */
  public async sendForgetPasswordEmail(email: string) {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) throw new AppError(message.auth.user.USER_NOT_FOUND, httpStatus.NOT_FOUND);

    if (!user.emailVerified)
      throw new AppError(message.auth.email.EMAIL_NOT_VERIFIED, httpStatus.FORBIDDEN);
    if (user.isDisabled) throw new AppError(message.auth.user.USER_DISABLED, httpStatus.FORBIDDEN);
    if (user.isDeleted) throw new AppError(message.auth.user.USER_DELETED, httpStatus.FORBIDDEN);

    const token = await this.verificationTokenService.create(
      email,
      VERIFICATION_TOKEN_TYPES.FORGOT_password,
      5,
      5,
    );

    try {
      await this.authMailService.sendForgetPasswordEmail(email, token);
      logger.info(`Verification email sent to ${email}`);
    } catch (emailError) {
      logger.error(`Failed to send verification email to ${email}`, emailError);
    }
  }

  /**
   * Set new password using forgot password token
   *
   * @param token - forgot password token
   * @param email - user's email
   * @param newPassword - new password
   * @returns
   */
  public async forgetPasswordSet(token: string, email: string, newPassword: string) {
    const record = await this.verificationTokenService.verify(
      token,
      email,
      VERIFICATION_TOKEN_TYPES.FORGOT_password,
    );
    if (!record)
      throw new AppError(
        message.auth.resetPassword.RESET_PASSWORD_INVALID_TOKEN,
        httpStatus.BAD_REQUEST,
      );

    const hashedPassword = await hashPassword(newPassword);
    await db.user.update({ where: { email }, data: { password: hashedPassword } });

    await this.verificationTokenService.delete(token, email);
  }

  /**
   * Reset password
   *
   * @param email - user's email
   * @param oldPassword - current password
   * @param newPassword - new password
   * @returns
   *
   */
  public async resetPassword(email: string, oldPassword: string, newPassword: string) {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) throw new AppError(message.auth.user.USER_NOT_FOUND, httpStatus.NOT_FOUND);

    const isPasswordValid = await comparePassword(oldPassword, user.password!);
    if (!isPasswordValid)
      throw new AppError(message.auth.login.PASSWORD_INVALID, httpStatus.UNAUTHORIZED);

    const hashedPassword = await hashPassword(newPassword);
    await db.user.update({ where: { email }, data: { password: hashedPassword } });
  }

  /**
   * Logout user from current device
   *
   * @param refreshToken - current user's refresh token
   * @returns
   */
  public async logoutUser(refreshToken: string) {
    try {
      const payload = jwtService.verifyRefreshToken(refreshToken) as RefreshTokenPayload;

      const deleted = await db.session.deleteMany({
        where: { sessionToken: refreshToken, userId: payload.sub },
      });
      if (deleted.count === 0)
        throw new AppError(message.auth.logout.SESSION_NOT_FOUND, httpStatus.BAD_REQUEST);

      return { success: true, message: message.auth.logout.LOGOUT_SUCCESS };
    } catch (err: any) {
      if (err instanceof AppError) throw err;
      throw new AppError(message.middleware.INVALID_OR_EXPIRED_TOKEN, httpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Logout user from all devices
   *
   * @param refreshToken - current user's refresh token
   * @returns
   *
   *
   */
  public async logoutUserFromAllDevices(refreshToken: string) {
    try {
      const payload = jwtService.verifyRefreshToken(refreshToken) as RefreshTokenPayload;

      await db.session.deleteMany({ where: { userId: payload.sub } });

      return { success: true, message: message.auth.logout.LOGOUT_FROM_ALL_DEVICES_SUCCESS };
    } catch (err: any) {
      throw new AppError(message.middleware.INVALID_OR_EXPIRED_TOKEN, httpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Private helper: create token + send verification email
   *
   * @param email - user's email
   * @param type - verification token type
   * @returns
   *
   */
  private async createAndSendToken(email: string, type: VerificationTokenType): Promise<string> {
    const token = await this.verificationTokenService.create(email, type, 5, 5);

    try {
      await this.authMailService.sendVerificationEmail(email, token);
      logger.info(`Verification email sent to ${email}`);
    } catch (emailError) {
      logger.error(`Failed to send verification email to ${email}`, emailError);
    }

    return token;
  }
}
