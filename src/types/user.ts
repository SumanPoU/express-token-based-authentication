export interface RolePayload {
  id: string;
  name: string;
}

export interface UserPayload {
  id: string;
  email: string;
  userName?: string | null;
  displayName?: string | null;
  roleId?: string | null;
  role?: RolePayload[];
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  userName?: string | null;
  displayName?: string | null;
  roleId?: string | null;
  role?: RolePayload[]; // <-- strongly typed
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
  role?: RolePayload[];
}
