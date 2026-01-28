import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import config from '../config/config';
import type { UserPayload, AccessTokenPayload, RefreshTokenPayload } from '../types/user';

if (!config.jwt.accessToken.secret || !config.jwt.refreshToken.secret) {
  throw new Error('JWT secrets are not defined');
}

export class JwtService {
  private accessSecret: Secret = config.jwt.accessToken.secret;
  private refreshSecret: Secret = config.jwt.refreshToken.secret;

  private accessOptions: SignOptions = {
    expiresIn: config.jwt.accessToken.expiresIn as any,
  };

  private refreshOptions: SignOptions = {
    expiresIn: config.jwt.refreshToken.expiresIn as any,
  };

  generateAccessToken(user: UserPayload): string {
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      userName: user.userName,
      displayName: user.displayName,
      roleId: user.roleId,
      role: user.role,
    };
    return jwt.sign(payload, this.accessSecret, this.accessOptions);
  }

  generateRefreshToken(user: UserPayload, tokenVersion = 0): string {
    const payload: RefreshTokenPayload = {
      sub: user.id,
      tokenVersion,
    };
    return jwt.sign(payload, this.refreshSecret, this.refreshOptions);
  }

  generateAuthTokens(user: UserPayload, tokenVersion = 0) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user, tokenVersion),
    };
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, this.accessSecret) as AccessTokenPayload;
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, this.refreshSecret) as RefreshTokenPayload;
  }
}

export const jwtService = new JwtService();
