import { z } from 'zod';

/**
 * Safe string helper: blocks dangerous characters and SQL keywords
 * No .transform() here to keep string methods like .email() and .url()
 */
export const safeString = (fieldName: string, min = 1, max = 255) =>
  z
    .string()
    .min(min, `${fieldName} is required`)
    .max(max, `${fieldName} is too long`)
    .refine(
      (val) =>
        !/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|EXEC|UNION)\b|;|--|'|"|`)/i.test(val),
      { message: `${fieldName} contains invalid characters or SQL keywords` },
    );

/**
 * Username: letters, numbers, underscores only + safe
 */
export const safeUsername = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(32, 'Username too long')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
  .refine(
    (val) => !/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|EXEC|UNION)\b)/i.test(val),
    {
      message: 'Username cannot contain SQL keywords',
    },
  );

/**
 * Display Name: letters, spaces, basic punctuation + safe
 */
export const safeDisplayName = z
  .string()
  .min(1, 'Name is required')
  .max(64, 'Name too long')
  .regex(/^[a-zA-Z0-9 .'-]+$/, 'Name contains invalid characters')
  .refine(
    (val) => !/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|EXEC|UNION)\b)/i.test(val),
    {
      message: 'Display name cannot contain SQL keywords',
    },
  );

/**
 * Strong password
 */
export const StrongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password must be at most 64 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Email OR Username
 */
const IdentifierSchema = z
  .object({
    email: z.string().email('Invalid email address').optional(),
    userName: safeUsername.optional(),
  })
  .refine((data) => data.email || data.userName, {
    message: 'Either email or username is required',
    path: ['email'],
  });

/**
 * Auth Schemas
 */

// Register
export const RegisterSchema = z
  .object({
    displayName: safeDisplayName,
    userName: safeUsername.optional(),
    email: z.string().email('Invalid email address'),
    password: StrongPasswordSchema,
    confirmPassword: z.string(),
    image: z.string().url('Invalid image URL').optional(),
    isDisabled: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    roleIds: z.array(z.string().uuid()).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

// Login
export const LoginSchema = IdentifierSchema.extend({
  password: StrongPasswordSchema,
  deviceInfo: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

// Set First Login Password
export const SetFirstLoginPasswordSchema = IdentifierSchema.extend({
  newPassword: StrongPasswordSchema,
  confirmPassword: z.string(),
  deviceInfo: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

// Forgot Password
export const ForgotPasswordSchema = IdentifierSchema;

// Reset Password
export const ForgetPasswordSetSchema = IdentifierSchema.extend({
  token: safeString('forget password token'),
  password: StrongPasswordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

// Confirm Password
export const ConfirmPasswordSchema = z.object({
  password: StrongPasswordSchema,
});

// Change Password
export const ChangePasswordSchema = z
  .object({
    currentPassword: StrongPasswordSchema,
    newPassword: StrongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

// Resend Verification
export const ResendVerificationSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Verify Email
export const VerifyEmailSchema = z.object({
  token: safeString('verify email token'),
  email: z.string().email('Invalid email address'),
});

// Logout
export const LogoutSchema = z.object({
  refreshToken: safeString('refreshToken'),
});

// Get user roles
export const GetUserRolesSchema = z.object({
 accessToken: safeString('accessToken'),
});

/**
 * Types
 */
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ForgetPasswordSetInput = z.infer<typeof ForgetPasswordSetSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type ConfirmPasswordInput = z.infer<typeof ConfirmPasswordSchema>;
export type ResendVerificationInput = z.infer<typeof ResendVerificationSchema>;
