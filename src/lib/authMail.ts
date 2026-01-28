import { sendMail } from '../config/mailer';
import logger from '../middleware/logger';

export class AuthMailService {
  /**
   * Send email to user with verification token (NO URL)
   */
  static async sendVerificationEmail(email: string, token: string) {
    const html = `
      <p>Welcome 🎉</p>
      <p>Your email verification token is:</p>
      <h2 style="letter-spacing: 3px;">${token}</h2>
      <p>Please enter this token in the app to verify your email.</p>
    `;

    try {
      const info = await sendMail({
        to: email,
        subject: 'Email Verification Code',
        html,
      });
      logger.info(`📧 Verification token sent to ${email}`);
      return info;
    } catch (error) {
      logger.error('❌ Failed to send verification token', error);
      throw error;
    }
  }

  /**
   * Send email to user with reset password token (NO URL)
   */
  static async sendForgetPasswordEmail(email: string, token: string) {
    const html = `
      <p>You requested to reset your password.</p>
      <p>Your password reset token is:</p>
      <h2 style="letter-spacing: 3px;">${token}</h2>
      <p>Please enter this token in the app to continue.</p>
    `;

    try {
      const info = await sendMail({
        to: email,
        subject: 'Password Reset Code',
        html,
      });
      logger.info(`📧 Reset token sent to ${email}`);
      return info;
    } catch (error) {
      logger.error('❌ Failed to send reset token', error);
      throw error;
    }
  }
}
