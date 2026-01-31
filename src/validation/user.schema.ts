import { z } from 'zod';
import { safeUsername, safeDisplayName, safeString } from './authSchema';

// Common param schema
export const UserIdParamSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
});

// Create User
export const CreateUserSchema = z.object({
  displayName: safeDisplayName,
  userName: safeUsername.optional(),
  email: safeString('email').email('Invalid email'),
  roleIds: z.array(z.string().uuid()).optional(),
  isDisabled: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

// Update User
export const UpdateUserSchema = z.object({
  displayName: safeDisplayName.optional(),
  userName: safeUsername.optional(),
  roleIds: z.array(z.string().uuid()).optional(),
  isDisabled: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

// Soft Delete User
export const SoftDeleteUserSchema = z.object({
  isDeleted: z.boolean(),
});

// Set User Status
export const SetUserStatusSchema = z.object({
  isDisabled: z.boolean(),
});

// User Filter
export const UserFilterSchema = z.object({
  search: safeString('search').optional(),
  roleId: z.string().uuid().optional(),
  isDisabled: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

// Types
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UserFilterInput = z.infer<typeof UserFilterSchema>;
export type SoftDeleteUserInput = z.infer<typeof SoftDeleteUserSchema>;
export type SetUserStatusInput = z.infer<typeof SetUserStatusSchema>;
