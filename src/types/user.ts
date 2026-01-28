export interface UserPayload {
  id: string;
  email: string;
  userName?: string | null;
  displayName?: string | null;
  roleId?: string | null;
  role?: any[];
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  userName?: string | null;
  displayName?: string | null;
  roleId?: string | null;
  role?: any[];
}

export interface RefreshTokenPayload {
  sub: string;
  tokenVersion?: number;
}

export interface User {
  id: string;
  email: string;
  userName?: string | null;
  displayName?: string | null;
  roleId?: string | null;
  emailVerified?: Date | null;
  password?: string | null;
  image?: string | null;
  isDisabled?: boolean | null;
  isDeleted?: boolean | null;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  role?: any[];
}
