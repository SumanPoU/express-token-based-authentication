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

      // ✅ Validate body
      if (!token || typeof token !== 'string') {
        return sendError(res, message.auth.token.VERIFICATION_TOKEN_REQUIRED, undefined, 400);
      }

      if (!email || typeof email !== 'string') {
        return sendError(res, message.auth.email.EMAIL_REQUIRED, undefined, 400);
      }

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
}
