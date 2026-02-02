import type { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { sendSuccess, sendError } from '../middleware/response';
import message from '../constant/message';
import httpStatus from 'http-status';

const authService = new AuthService();

/*
 * Controller: AuthController
 */

export class AuthController {
  /*
   * Controller: Register a new user
   */

  public registerUser = async (req: Request, res: Response) => {
    try {
      const user = await authService.registerUser(req.body);
      return sendSuccess(res, message.auth.register.REGISTER_SUCCESS, { user }, httpStatus.CREATED);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.register.REGISTER_FAILURE,
        undefined,
        err.status || httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  /*
   * Controller: Resend verification email
   */
  public resendVerificationEmail = async (req: Request, res: Response) => {
    try {
      await authService.resendVerificationEmail(req.body.email);
      return sendSuccess(res, message.auth.email.VERIFICATION_EMAIL_SENT, {}, httpStatus.OK);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.register.REGISTER_FAILURE,
        undefined,
        err.status || httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  /*
   * Controller: Login user
   */
  public loginUser = async (req: Request, res: Response) => {
    try {
      const result = await authService.loginUser(req.body);
      if (result.isFirstLogin && result.user) {
        return sendSuccess(
          res,
          message.auth.login.FIRST_LOGIN_PASSWORD_REQUIRED,
          result.user,
          httpStatus.PRECONDITION_REQUIRED,
        );
      }
      return sendSuccess(res, message.auth.login.LOGIN_SUCCESS, result, httpStatus.OK);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.login.LOGIN_FAILURE,
        undefined,
        err.status || httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  public setFirstLoginPassword = async (req: Request, res: Response) => {
    try {
      const result = await authService.setFirstLoginPassword({
        userId: req.body.userId,
        newPassword: req.body.newPassword,
        deviceInfo: req.body.deviceInfo,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      return sendSuccess(res, message.auth.login.PASSWORD_SET_SUCCESS, result, httpStatus.OK);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.login.PASSWORD_SET_FAILURE,
        undefined,
        err.status || httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  /*
   * Controller: Verify email
   */
  public verifyEmail = async (req: Request, res: Response) => {
    try {
      const { token, email } = req.body;
      const result = await authService.verifyEmail(token, email);
      return sendSuccess(res, message.auth.verifyEmail.VERIFY_EMAIL_SUCCESS, result, httpStatus.OK);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.verifyEmail.VERIFY_EMAIL_FAILURE,
        undefined,
        err.status || httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  /*
   * Controller: Forgot Password
   */
  public SendForgotPasswordEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const result = await authService.sendForgetPasswordEmail(email);
      return sendSuccess(
        res,
        message.auth.email.FORGOT_PASSWORD_SUCCESS_MAIL_SENT,
        result,
        httpStatus.OK,
      );
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.email.EMAIL_SEND_FAILURE,
        undefined,
        err.status || httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  /*
   * Controller: Forgot Password Set
   */
  public ForgetPasswordSet = async (req: Request, res: Response) => {
    try {
      const { token, email, password } = req.body;
      const result = await authService.forgetPasswordSet(token, email, password);
      return sendSuccess(
        res,
        message.auth.resetPassword.RESET_PASSWORD_SUCCESS,
        result,
        httpStatus.OK,
      );
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.resetPassword.RESET_PASSWORD_FAILURE,
        undefined,
        err.status || httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  /*
   * Controller: Reset Password
   */
  public ResetPassword = async (req: Request, res: Response) => {
    try {
      const { email, oldPassword, newPassword } = req.body;
      const result = await authService.resetPassword(email, oldPassword, newPassword);
      return sendSuccess(
        res,
        message.auth.resetPassword.RESET_PASSWORD_SUCCESS,
        result,
        httpStatus.OK,
      );
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.resetPassword.RESET_PASSWORD_FAILURE,
        undefined,
        err.status || httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  /*
   * Controller: Logout
   */
  public logout = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      const result = await authService.logoutUser(refreshToken);
      return sendSuccess(res, message.auth.logout.LOGOUT_SUCCESS, result, httpStatus.OK);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.logout.LOGOUT_FAILURE,
        undefined,
        err.status || httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  /*
   * Controller: Logout from all devices
   */
  public logoutFromAllDevices = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      const result = await authService.logoutUserFromAllDevices(refreshToken);
      return sendSuccess(
        res,
        message.auth.logout.LOGOUT_FROM_ALL_DEVICES_SUCCESS,
        result,
        httpStatus.OK,
      );
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.logout.LOGOUT_FAILURE,
        undefined,
        err.status || httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };
}
