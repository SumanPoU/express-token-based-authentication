import bcrypt from 'bcrypt';
import config from '../config/config';
import crypto from 'crypto';

/**
 * Hash a password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, config.security.bcryptRounds);
};

/**
 * Compare a plain password with a hashed password
 */
export const comparePassword = async (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};

/**
 * Generate a random password
 */
export function generatePassword(length = 12): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!%*?';

  const randomBytes = crypto.randomBytes(length);

  return Array.from(randomBytes)
    .map((byte) => charset[byte % charset.length])
    .join('');
}
