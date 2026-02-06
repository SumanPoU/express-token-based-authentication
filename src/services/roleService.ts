import db from '../config/prisma';
import { AppError } from '@/lib/AppError';
import httpStatus from 'http-status';
import logger from '../middleware/logger';
import message from '../constant/message';
import { CreateRoleInput, UpdateRoleInput } from '../validation/role.schema';

export class RoleService {
  constructor() {}

  /**
   * Create Role + assign permissions
   */
  public async createRole(input: CreateRoleInput, createdById?: string) {
    try {
      const { permissionIds, pageIds, ...data } = input;

      const role = await db.role.create({
        data: {
          ...data,
          permissions: permissionIds
            ? {
                connect: permissionIds.map((id) => ({ id })),
              }
            : undefined,
          pages: pageIds
            ? {
                connect: pageIds.map((id) => ({ id })),
              }
            : undefined,
        },
      });

      logger.info(`Role created: ${role.id}`);
      return role;
    } catch (error) {
      logger.error('Failed to create role', error);
      throw new AppError(message.role.CREATE_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update Role + sync permissions
   */
  public async updateRole(id: string, input: UpdateRoleInput) {
    try {
      const role = await db.role.findUnique({ where: { id } });
      if (!role) {
        throw new AppError(message.role.NOT_FOUND, httpStatus.NOT_FOUND);
      }

      const { permissionIds, pageIds, ...data } = input;

      const updatedRole = await db.role.update({
        where: { id },
        data: {
          ...data,
          permissions: permissionIds
            ? {
                set: permissionIds.map((pid) => ({ id: pid })),
              }
            : undefined,
          pages: pageIds
            ? {
                set: pageIds.map((pid) => ({ id: pid })),
              }
            : undefined,
        },
      });

      logger.info(`Role updated: ${id}`);
      return updatedRole;
    } catch (error) {
      logger.error(`Failed to update role: ${id}`, error);
      throw error instanceof AppError
        ? error
        : new AppError(message.role.UPDATE_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete Role
   */
  public async deleteRole(id: string) {
    try {
      const role = await db.role.findUnique({ where: { id } });
      if (!role) {
        throw new AppError(message.role.NOT_FOUND, httpStatus.NOT_FOUND);
      }

      await db.role.delete({ where: { id } });

      logger.info(`Role deleted: ${id}`);
      return true;
    } catch (error) {
      logger.error(`Failed to delete role: ${id}`, error);
      throw error instanceof AppError
        ? error
        : new AppError(message.role.DELETE_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Assign permissions to role (append)
   */
  public async assignPermissions(roleId: string, permissionIds: string[], assignedById?: string) {
    try {
      const role = await db.role.findUnique({ where: { id: roleId } });
      if (!role) {
        throw new AppError(message.role.NOT_FOUND, httpStatus.NOT_FOUND);
      }

      await db.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
          assignedById,
        })),
        skipDuplicates: true,
      });

      logger.info(`Permissions assigned to role: ${roleId}`);
      return true;
    } catch (error) {
      logger.error('Failed to assign permissions to role', error);
      throw new AppError(message.role.PERMISSION_ASSIGN_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Remove permissions from role
   */
  public async removePermissions(roleId: string, permissionIds: string[]) {
    try {
      await db.rolePermission.deleteMany({
        where: {
          roleId,
          permissionId: { in: permissionIds },
        },
      });

      logger.info(`Permissions removed from role: ${roleId}`);
      return true;
    } catch (error) {
      logger.error('Failed to remove permissions from role', error);
      throw new AppError(message.role.PERMISSION_REMOVE_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Assign pages to role (append)
   */
  public async assignPages(roleId: string, pageIds: string[]) {
    try {
      const role = await db.role.findUnique({ where: { id: roleId } });
      if (!role) {
        throw new AppError(message.role.NOT_FOUND, httpStatus.NOT_FOUND);
      }

      await db.role.update({
        where: { id: roleId },
        data: {
          pages: {
            connect: pageIds.map((id) => ({ id })),
          },
        },
      });

      logger.info(`Pages assigned to role: ${roleId}`);
      return true;
    } catch (error) {
      logger.error('Failed to assign pages to role', error);
      throw new AppError(message.role.PAGE_ASSIGN_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Remove pages from role
   */
  public async removePages(roleId: string, pageIds: string[]) {
    try {
      await db.role.update({
        where: { id: roleId },
        data: {
          pages: {
            disconnect: pageIds.map((id) => ({ id })),
          },
        },
      });

      logger.info(`Pages removed from role: ${roleId}`);
      return true;
    } catch (error) {
      logger.error('Failed to remove pages from role', error);
      throw new AppError(message.role.PAGE_REMOVE_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
