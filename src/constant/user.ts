export const VERIFICATION_TOKEN_TYPES = {
  FORGOT_password: 'FORGOT_password',
  REGISTER_USER: 'REGISTER_USER',
} as const;

export const PROVIDER = {
  local: 'local',
  google: 'google',
  github: 'github',
} as const;

export const CREDENTIALS_TYPES = {
  credentials: 'credentials',
  oauth: 'oauth',
} as const;
