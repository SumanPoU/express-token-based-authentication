import type { AccessTokenPayload, RefreshTokenPayload, RolePayload } from './user';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        userName?: string;
        displayName?: string;
        roleId?: string;
        role?: RolePayload[];
      };
    }
  }
}
