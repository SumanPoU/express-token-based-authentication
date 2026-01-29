import type { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { sendSuccess, sendError } from '../middleware/response';
import message from '../constant/message';

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
      return sendSuccess(res, message.auth.register.REGISTER_SUCCESS, { user }, 201);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.register.REGISTER_FAILURE,
        undefined,
        err.status || 500,
      );
    }
  };

  /*
   * Controller: Resend verification email
   */
  public resendVerificationEmail = async (req: Request, res: Response) => {
    try {
      await authService.resendVerificationEmail(req.body.email);
      return sendSuccess(res, message.auth.email.VERIFICATION_EMAIL_SENT, {}, 200);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.register.REGISTER_FAILURE,
        undefined,
        err.status || 500,
      );
    }
  };

  /*
   * Controller: Login user
   */
  public loginUser = async (req: Request, res: Response) => {
    try {
      const result = await authService.loginUser(req.body);
      return sendSuccess(res, message.auth.login.LOGIN_SUCCESS, result, 200);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.login.LOGIN_FAILURE,
        undefined,
        err.status || 500,
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
      return sendSuccess(res, message.auth.verifyEmail.VERIFY_EMAIL_SUCCESS, result, 200);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.verifyEmail.VERIFY_EMAIL_FAILURE,
        undefined,
        err.status || 500,
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
      return sendSuccess(res, message.auth.email.FORGOT_PASSWORD_SUCCESS_MAIL_SENT, result, 200);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.email.EMAIL_SEND_FAILURE,
        undefined,
        err.status || 500,
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
      return sendSuccess(res, message.auth.resetPassword.RESET_PASSWORD_SUCCESS, result, 200);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.resetPassword.RESET_PASSWORD_FAILURE,
        undefined,
        err.status || 500,
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
      return sendSuccess(res, message.auth.resetPassword.RESET_PASSWORD_SUCCESS, result, 200);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.resetPassword.RESET_PASSWORD_FAILURE,
        undefined,
        err.status || 500,
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
      return sendSuccess(res, message.auth.logout.LOGOUT_SUCCESS, result, 200);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.logout.LOGOUT_FAILURE,
        undefined,
        err.status || 500,
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
      return sendSuccess(res, message.auth.logout.LOGOUT_FROM_ALL_DEVICES_SUCCESS, result, 200);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.auth.logout.LOGOUT_FAILURE,
        undefined,
        err.status || 500,
      );
    }
  };
}
