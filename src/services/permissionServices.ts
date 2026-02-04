import db from '../config/prisma';
import { AppError } from '@/lib/AppError';
import httpStatus from 'http-status';
import logger from '../middleware/logger';
import message from '../constant/message';
import {
  CreatePermissionGroupInput,
  UpdatePermissionGroupInput,
  CreatePermissionInput,
  UpdatePermissionInput,
  PermissionFilterInput,
  PermissionWithGroups,
} from '../validation/permission.schema';
import { paginate, PaginationParams, PaginatedResult } from '../lib/pagination.utils';

export class PermissionService {
  constructor() {}

  /**
   * Create a new permission group
   */
  public async createPermissionGroup(input: CreatePermissionGroupInput) {
    try {
      const { permissionIds, ...data } = input;

      const group = await db.permissionGroup.create({
        data: {
          ...data,
          permissions: permissionIds
            ? {
                connect: permissionIds.map((id) => ({ id })),
              }
            : undefined,
        },
      });

      logger.info(`Permission group created: ${group.id}`);
      return group;
    } catch (error) {
      logger.error('Failed to create permission group', error);
      throw new AppError(message.permissionGroup.CREATE_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update a permission group
   */
  public async updatePermissionGroup(id: string, input: UpdatePermissionGroupInput) {
    try {
      const group = await db.permissionGroup.findUnique({ where: { id } });
      if (!group) {
        logger.warn(`Attempted to update non-existent permission group: ${id}`);
        throw new AppError(message.permissionGroup.NOT_FOUND, httpStatus.NOT_FOUND);
      }

      const updatedGroup = await db.permissionGroup.update({
        where: { id },
        data: input,
      });

      logger.info(`Permission group updated: ${id}`);
      return updatedGroup;
    } catch (error) {
      logger.error(`Failed to update permission group: ${id}`, error);
      throw error instanceof AppError
        ? error
        : new AppError(message.permissionGroup.UPDATE_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * List permission groups with its asscoiated premissions with pagination + filter
   */
  public async listPermissions(pagination: PaginationParams & PermissionFilterInput): Promise<
    PaginatedResult<{
      groupName: string;
      permissions: PermissionWithGroups[];
    }>
  > {
    const { page = 1, limit = 10, search } = pagination;

    const filter: any = {};
    if (search) {
      filter.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    try {
      const result = await paginate<any>(
        db.permission,
        { page, limit, filter },
        {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
        {
          groups: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      );

      const dataWithSN = result.data.map((permission, idx) => ({
        sn: (page - 1) * limit + idx + 1,
        ...permission,
      }));

      /** Group permissions */
      const grouped: Record<string, PermissionWithGroups[]> = {};

      for (const permission of dataWithSN) {
        if (!permission.groups || permission.groups.length === 0) {
          grouped['Others'] = grouped['Others'] || [];
          grouped['Others'].push(permission);
        } else {
          for (const group of permission.groups) {
            grouped[group.name] = grouped[group.name] || [];
            grouped[group.name].push(permission);
          }
        }
      }

      const groupedResult = Object.entries(grouped).map(([groupName, permissions]) => ({
        groupName,
        permissions,
      }));

      logger.info(
        `Listed permissions: page ${page}, limit ${limit}, filter ${JSON.stringify(filter)}`,
      );

      return {
        data: groupedResult,
        meta: result.meta,
      };
    } catch (error) {
      logger.error('Failed to list permissions', error);
      throw new AppError(
        message.permission.PERMISSION_LIST_FAILURE,
        httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete a permission group
   */
  public async deletePermissionGroup(id: string) {
    try {
      const group = await db.permissionGroup.findUnique({ where: { id } });
      if (!group) {
        logger.warn(`Attempted to delete non-existent permission group: ${id}`);
        throw new AppError(message.permissionGroup.NOT_FOUND, httpStatus.NOT_FOUND);
      }

      const deletedGroup = await db.permissionGroup.delete({ where: { id } });
      logger.info(`Permission group deleted: ${id}`);
      return deletedGroup;
    } catch (error) {
      logger.error(`Failed to delete permission group: ${id}`, error);
      throw error instanceof AppError
        ? error
        : new AppError(message.permissionGroup.DELETE_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Create a new permission
   */
  public async createPermission(input: CreatePermissionInput) {
    try {
      const { groupIds, ...data } = input;

      const permission = await db.permission.create({
        data: {
          ...data,
          groups: groupIds
            ? {
                connect: groupIds.map((id) => ({ id })),
              }
            : undefined,
        },
      });

      logger.info(`Permission created: ${permission.id}`);
      return permission;
    } catch (error) {
      logger.error('Failed to create permission', error);
      throw new AppError(
        message.permission.PERMISSION_CREATE_FAILURE,
        httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update a permission
   */
  public async updatePermission(id: string, input: UpdatePermissionInput) {
    try {
      const permission = await db.permission.findUnique({ where: { id } });
      if (!permission) {
        logger.warn(`Attempted to update non-existent permission: ${id}`);
        throw new AppError(message.permission.PERMISSION_NOT_FOUND, httpStatus.NOT_FOUND);
      }

      const updatedPermission = await db.permission.update({
        where: { id },
        data: input,
      });

      logger.info(`Permission updated: ${id}`);
      return updatedPermission;
    } catch (error) {
      logger.error(`Failed to update permission: ${id}`, error);
      throw error instanceof AppError
        ? error
        : new AppError(
            message.permission.PERMISSION_UPDATE_FAILURE,
            httpStatus.INTERNAL_SERVER_ERROR,
          );
    }
  }

  /**
   * Delete a permission
   */
  public async deletePermission(id: string) {
    try {
      const permission = await db.permission.findUnique({ where: { id } });
      if (!permission) {
        logger.warn(`Attempted to delete non-existent permission: ${id}`);
        throw new AppError(message.permission.PERMISSION_NOT_FOUND, httpStatus.NOT_FOUND);
      }

      const deletedPermission = await db.permission.delete({ where: { id } });
      logger.info(`Permission deleted: ${id}`);
      return deletedPermission;
    } catch (error) {
      logger.error(`Failed to delete permission: ${id}`, error);
      throw error instanceof AppError
        ? error
        : new AppError(
            message.permission.PERMISSION_DELETE_FAILURE,
            httpStatus.INTERNAL_SERVER_ERROR,
          );
    }
  }
}
