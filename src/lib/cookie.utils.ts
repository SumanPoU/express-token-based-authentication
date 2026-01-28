import type { Response } from 'express';
import config from '../config/config';

/**
 * Options for setting cookies
 */
const defaultCookieOptions = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

/**
 * Set Access Token in cookie
 */
export function setAccessTokenCookie(res: Response, token: string) {
  res.cookie(config.jwt.accessToken.cookieName, token, {
    ...defaultCookieOptions,
    maxAge: parseDurationToMs(config.jwt.accessToken.expiresIn),
  });
}

/**
 * Set Refresh Token in cookie
 */
export function setRefreshTokenCookie(res: Response, token: string) {
  res.cookie(config.jwt.refreshToken.cookieName, token, {
    ...defaultCookieOptions,
    maxAge: parseDurationToMs(config.jwt.refreshToken.expiresIn),
  });
}

/**
 * Clear access & refresh token cookies
 */
export function clearAuthCookies(res: Response) {
  res.clearCookie(config.jwt.accessToken.cookieName, { path: '/' });
  res.clearCookie(config.jwt.refreshToken.cookieName, { path: '/' });
}

/**
 * Helper: convert jwt expiresIn string (e.g. "20m", "1d") to milliseconds
 */
function parseDurationToMs(duration: string | number): number {
  if (typeof duration === 'number') return duration * 1000;
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 0;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}
