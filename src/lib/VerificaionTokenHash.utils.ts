import crypto from 'crypto';

export class VerificationTokenHashService {
  /**
   * Hash a token securely
   * @param token - raw token
   * @returns hashed token
   */
  static hash(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Compare raw token with hashed token
   * @param token - raw token from user
   * @param hashed - hashed token from DB
   * @returns boolean
   */
  static verify(token: string, hashed: string) {
    const hashedToken = this.hash(token);
    return hashedToken === hashed;
  }

  /**
   * Generate a secure random token (hex)
   */
  static generate(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }
}
