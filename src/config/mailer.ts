import nodemailer, { type Transporter } from 'nodemailer';
import logger from '../middleware/logger';
import config from './config';

let transporter: Transporter | null = null;

const createTestAccount = async () => {
  try {
    const account = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    logger.info(`📧 Nodemailer test account created: ${account.user}`);
  } catch (error) {
    logger.error('❌ Failed to create test email account', error);
  }
};

if (config.nodeEnv === 'production') {
  transporter = nodemailer.createTransport({
    host: config.email.smtp.host,
    port: Number(config.email.smtp.port),
    secure: config.email.smtp.secure,
    auth: {
      user: config.email.smtp.auth.user,
      pass: config.email.smtp.auth.pass,
    },
  });

  logger.info('📨 SMTP transporter initialized for production');
} else {
  void createTestAccount();
}

/**
 * Send email helper
 */
export const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  if (!transporter) {
    logger.error('❌ Email transporter not initialized');
    throw new Error('Email service not ready');
  }

  const info = await transporter.sendMail({
    from: `"${config.appName}" <${config.email.from}>`,
    to,
    subject,
    html,
  });

  logger.info(`📨 Email sent to ${to}: ${info.messageId}`);

  // Preview URL for dev/test
  if (config.nodeEnv !== 'production') {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      logger.info(`🔍 Preview email URL: ${previewUrl}`);
    }
  }

  return info;
};
