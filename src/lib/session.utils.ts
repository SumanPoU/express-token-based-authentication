import db from '../config/prisma';
import config from '../config/config';

/**
 * Create a new session for a user with refresh token and expiry
 * @param userId - User ID
 * @param refreshToken - JWT refresh token
 * @param deviceInfo - Optional device info
 * @param ipAddress - Optional IP address
 * @param userAgent - Optional user agent
 */
export const createUserSession = async (
  userId: string,
  refreshToken: string,
  deviceInfo?: string,
  ipAddress?: string,
  userAgent?: string,
) => {
  // Calculate refresh token expiry from JWT config
  const expires = new Date();
  const refreshTokenExpiresIn = config.jwt.refreshToken.expiresIn as string;

  // Convert JWT duration string (like "30d") into days
  if (refreshTokenExpiresIn.endsWith('d')) {
    const days = parseInt(refreshTokenExpiresIn.slice(0, -1));
    expires.setDate(expires.getDate() + days);
  } else if (refreshTokenExpiresIn.endsWith('h')) {
    const hours = parseInt(refreshTokenExpiresIn.slice(0, -1));
    expires.setHours(expires.getHours() + hours);
  } else if (refreshTokenExpiresIn.endsWith('m')) {
    const minutes = parseInt(refreshTokenExpiresIn.slice(0, -1));
    expires.setMinutes(expires.getMinutes() + minutes);
  } else {
    expires.setDate(expires.getDate() + 30);
  }

  return db.session.create({
    data: {
      userId,
      sessionToken: refreshToken,
      expires,
      deviceInfo,
      ipAddress,
      userAgent,
    },
  });
};
