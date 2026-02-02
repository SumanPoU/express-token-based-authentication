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

  /**
   * Send login credentials to a user created by the admin (via admin panel)
   */
  static async sendAdminEmail(email: string, name: string, password: string) {
    const html = `
    <p>Hi ${name}, 👋</p>

    <p>Your account has been successfully created by the administrator.</p>

    <p><strong>Login details:</strong></p>
    <p>Email: <strong>${email}</strong></p>
    <p>Password: <strong>${password}</strong></p>

    <p>Please log in and change your password immediately for security reasons.</p>

    <p>Welcome aboard! 🎉</p>
  `;

    try {
      const info = await sendMail({
        to: email,
        subject: 'Your Account Login Credentials',
        html,
      });

      logger.info(`📧 Login credentials sent to ${email}`);
      return info;
    } catch (error) {
      logger.error('❌ Failed to send login credentials', error);
      throw error;
    }
  }
}
