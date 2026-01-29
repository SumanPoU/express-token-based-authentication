import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../lib/generateToken.utils';
import { sendError } from './response';
import httpStatus from 'http-status';
import message from '../constant/message';
import type { AccessTokenPayload, RefreshTokenPayload } from '../types/user';

const getBearerToken = (req: Request, res: Response): string | null => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(
      res,
      message.middleware.AUTHORIZATION_HEADER_MISSING,
      undefined,
      httpStatus.UNAUTHORIZED,
    );
    return null;
  }

  return authHeader.split(' ')[1];
};

const handleAuthError = (res: Response) =>
  sendError(res, message.middleware.INVALID_OR_EXPIRED_TOKEN, undefined, httpStatus.UNAUTHORIZED);

/**
 * Middleware to check Bearer token in Authorization header
 * Attaches standardized user info to req.user
 */
export const authenticateAcceessToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getBearerToken(req, res);
    if (!token) return;

    const payload = jwtService.verifyAccessToken(token) as AccessTokenPayload;

    req.user = {
      id: payload.sub,
      email: payload.email,
      userName: payload.userName || undefined,
      displayName: payload.displayName || undefined,
      roleId: payload.roleId || undefined,
      role: payload.role ?? [],
    };

    next();
  } catch {
    return handleAuthError(res);
  }
};

/**
 * Middleware to check Bearer Refresh Token
 * Used ONLY for /auth/refresh, /auth/logout etc.
 */
export const authenticateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getBearerToken(req, res);
    if (!token) return;

    const payload = jwtService.verifyRefreshToken(token) as RefreshTokenPayload;

    req.user = { id: payload.sub };

    next();
  } catch {
    return handleAuthError(res);
  }
};
