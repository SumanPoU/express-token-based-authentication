import { z } from 'zod';
import { safeString } from './authSchema';

export const UUIDSchema = z.string().uuid();

/* 
   PERMISSION GROUP
 */

// Permission Group ID Param
export const PermissionGroupIdParamSchema = z.object({
  id: z.string().uuid('Invalid permission group ID'),
});

// Add Permission Group
export const CreatePermissionGroupSchema = z.object({
  name: safeString('Name', 3, 100),
  description: safeString('Description', 0, 255).optional(),
  permissionIds: z.array(UUIDSchema).optional(),
});

// Edit Permission Group
export const UpdatePermissionGroupSchema = z.object({
  name: safeString('Name', 3, 100).optional(),
  description: safeString('Description', 0, 255).optional(),
  permissionIds: z.array(UUIDSchema).optional(),
});

/* 
PERMISSION
 */

// Permission ID Param
export const PermissionIdParamSchema = z.object({
  id: z.string().uuid('Invalid permission ID'),
});

// Add Permission
export const CreatePermissionSchema = z.object({
  name: safeString('Name', 3, 100),
  description: safeString('Description', 0, 255).optional(),
  groupIds: z.array(UUIDSchema).optional(),
});

// Edit Permission
export const UpdatePermissionSchema = z.object({
  name: safeString('Name', 3, 100).optional(),
  description: safeString('Description', 0, 255).optional(),
  groupIds: z.array(UUIDSchema).optional(),
});

export const PermissionFilterSchema = z.object({
  search: safeString('search').optional(),
});

export type PermissionWithGroups = {
  id: string;
  name: string;
  description?: string | null;
  groups: { id: string; name: string }[];
  createdAt: Date;
  updatedAt: Date;
  sn: number;
};

export type PermissionFilterInput = z.infer<typeof PermissionFilterSchema>;
export type CreatePermissionGroupInput = z.infer<typeof CreatePermissionGroupSchema>;
export type UpdatePermissionGroupInput = z.infer<typeof UpdatePermissionGroupSchema>;
export type CreatePermissionInput = z.infer<typeof CreatePermissionSchema>;
export type UpdatePermissionInput = z.infer<typeof UpdatePermissionSchema>;
