import db from '../config/prisma';
import { VERIFICATION_TOKEN_TYPES } from '../constant/user';
import { VerificationTokenHashService } from './VerificaionTokenHash.utils';
import message from '@/constant/message';

type VerificationTokenType =
  (typeof VERIFICATION_TOKEN_TYPES)[keyof typeof VERIFICATION_TOKEN_TYPES];

export class VerificationTokenService {
  /**
   * Create and store a verification token with cooldown
   * Throws error if a valid token or cooldown is active
   *
   * @param identifier - user's email or ID
   * @param type - type of token (REGISTER_USER / FORGOT_PASSWORD)
   * @param expiresMinutes - token expiry time
   * @param cooldownMinutes - cooldown after last request
   */
  static async create(
    identifier: string,
    type: VerificationTokenType,
    expiresMinutes = 5,
    cooldownMinutes = 5,
  ) {
    const now = new Date();

    // Check latest token for this user + type
    const existingToken = await db.verificationToken.findFirst({
      where: { identifier, type },
      orderBy: { createdAt: 'desc' },
    });

    if (existingToken) {
      if (existingToken.expires > now) {
        // Token still valid → cannot request again
        throw new Error(message.auth.token.TOKEN_ALREADY_EXISTS);
      }

      const cooldownEnd = new Date(existingToken.expires);
      cooldownEnd.setMinutes(cooldownEnd.getMinutes() + cooldownMinutes);

      if (cooldownEnd > now) {
        // Still in cooldown window → cannot request
        throw new Error(message.auth.token.TOKEN_COOLDOWN_ACTIVE);
      }

      // Token expired and cooldown over → delete old token
      await db.verificationToken.deleteMany({
        where: { identifier, type },
      });
    }

    // Generate new token
    const token = VerificationTokenHashService.generate();
    // const hashedToken = VerificationTokenHashService.hash(token);

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + expiresMinutes);

    await db.verificationToken.create({
      data: {
        identifier,
        token,
        type,
        expires,
      },
    });

    return token; // raw token returned for email
  }

  static async verify(token: string, identifier: string, type: VerificationTokenType) {
    // const hashed = VerificationTokenHashService.hash(token);

    const record = await db.verificationToken.findFirst({
      where: { token, identifier, type },
    });

    if (!record) return null;
    if (record.expires < new Date()) return null;

    return record;
  }

  static async delete(token: string, identifier: string) {
    // const hashed = VerificationTokenHashService.hash(token);
    await db.verificationToken.deleteMany({
      where: { token, identifier },
    });
  }
}
