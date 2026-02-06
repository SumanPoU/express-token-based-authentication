import { z } from 'zod';
import { safeString } from './authSchema';

export const RoleIdParamSchema = z.object({
  id: z.string().uuid('Invalid role ID'),
});

// Create Role
export const CreateRoleSchema = z.object({
  name: safeString('Name', 3, 100),
  description: safeString('Description', 0, 255).optional(),
  permissionIds: z.array(z.string().uuid()).optional(),
  pageIds: z.array(z.string().uuid()).optional(),
  isDefault: z.boolean().optional(),
});

// Edit Role
export const UpdateRoleSchema = z.object({
  name: safeString('Name', 3, 100).optional(),
  description: safeString('Description', 0, 255).optional(),
  permissionIds: z.array(z.string().uuid()).optional(),
  pageIds: z.array(z.string().uuid()).optional(),
  isDefault: z.boolean().optional(),
});

// Role Filter
export const RoleFilterSchema = z.object({
  search: safeString('search').optional(),
});

// Assign Permissions
export const AssignPermissionsSchema = z.object({
  permissionIds: z.array(z.string().uuid()),
});

// Remove Permissions
export const RemovePermissionsSchema = z.object({
  permissionIds: z.array(z.string().uuid()),
});

// Assign Pages
export const AssignPagesSchema = z.object({
  pageIds: z.array(z.string().uuid()),
});

// Remove Pages
export const RemovePagesSchema = z.object({
  pageIds: z.array(z.string().uuid()),
});

export type RoleFilterInput = z.infer<typeof RoleFilterSchema>;
export type CreateRoleInput = z.infer<typeof CreateRoleSchema>;
export type UpdateRoleInput = z.infer<typeof UpdateRoleSchema>;
export type AssignPermissionsInput = z.infer<typeof AssignPermissionsSchema>;
export type RemovePermissionsInput = z.infer<typeof RemovePermissionsSchema>;
export type AssignPagesInput = z.infer<typeof AssignPagesSchema>;
export type RemovePagesInput = z.infer<typeof RemovePagesSchema>;
