import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.registerUser);
router.post('/resend-verification', authController.resendVerificationEmail);
router.post('/login', authController.loginUser);
router.get('/verify-email', authController.verifyEmail);

export default router;
