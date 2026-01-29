import { z } from 'zod';

/**
 * Helper: Disallow dangerous characters commonly used in SQL injection
 */
const noSqlInjection = (fieldName: string) =>
  z
    .string()
    .min(1, `${fieldName} is required`)
    .max(255, `${fieldName} is too long`)
    .refine((val) => !/[;'"\-\-]/.test(val), {
      message: `${fieldName} contains invalid characters`,
    })
    .transform((val) => val.trim());

/**
 * Username: letters, numbers, underscores only
 */
const safeUsername = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(32, 'Username too long')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

/**
 * Display Name: letters, spaces, basic punctuation
 */
const safeDisplayName = z
  .string()
  .min(1, 'Name is required')
  .max(64, 'Name too long')
  .regex(/^[a-zA-Z0-9 .'-]+$/, 'Name contains invalid characters');

/**
 * Strong password (unchanged)
 */
const StrongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password must be at most 64 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Email OR Username (at least one)
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
});

// Forgot Password
export const ForgotPasswordSchema = IdentifierSchema;

// Reset Password
export const ForgetPasswordSetSchema = IdentifierSchema.extend({
  token: noSqlInjection('forget password token'),
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

//verify email
export const VerifyEmailSchema = z.object({
  token: noSqlInjection('verify email token'),
  email: z.string().email('Invalid email address'),
});

export const LogoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
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
