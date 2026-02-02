import { Router } from 'express';
import { AuthController } from '../../controllers/authController';
import validate from '../../middleware/validate';
import {
  RegisterSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ForgetPasswordSetSchema,
  ChangePasswordSchema,
  ResendVerificationSchema,
  VerifyEmailSchema,
  LogoutSchema,
  SetFirstLoginPasswordSchema,
} from '../../validation/authSchema';
import { authenticateAcceessToken, authenticateRefreshToken } from '@/middleware/authMiddleware';

const router = Router();
const authController = new AuthController();

router.post('/register', validate({ body: RegisterSchema }), authController.registerUser);
router.post(
  '/resend-verification',
  validate({ body: ResendVerificationSchema }),
  authController.resendVerificationEmail,
);
router.post('/login', validate({ body: LoginSchema }), authController.loginUser);
router.post(
  '/set-first-login-password',
  validate({ body: SetFirstLoginPasswordSchema }),
  authController.setFirstLoginPassword,
);
router.post('/verify-email', validate({ body: VerifyEmailSchema }), authController.verifyEmail);
router.post(
  '/send-forgot-password-email',
  validate({ body: ForgotPasswordSchema }),
  authController.SendForgotPasswordEmail,
);
router.post(
  '/forget-password-set',
  validate({ body: ForgetPasswordSetSchema }),
  authController.ForgetPasswordSet,
);
router.post(
  '/reset-password',
  validate({ body: ChangePasswordSchema }),
  authenticateAcceessToken,
  authController.ResetPassword,
);

router.post(
  '/logout',
  validate({ body: LogoutSchema }),
  authenticateRefreshToken,
  authController.logout,
);
router.post(
  '/logout-all-devices',
  validate({ body: LogoutSchema }),
  authenticateRefreshToken,
  authController.logoutFromAllDevices,
);

export default router;
