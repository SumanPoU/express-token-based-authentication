import { Request, Response } from 'express';
import { RoleService } from '../services/roleService';
import httpStatus from 'http-status';
import message from '../constant/message';
import { sendSuccess, sendError } from '@/middleware/response';

const roleService = new RoleService();

export class RoleController {
  /**
   * Create a new role
   */
  public async createRole(req: Request, res: Response) {
    try {
      const role = await roleService.createRole(req.body);
      return sendSuccess(res, message.role.CREATE_SUCCESS, role);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.role.CREATE_FAILED,
      );
    }
  }

  /**
   * Update a role
   */
  public async updateRole(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const role = await roleService.updateRole(id, req.body);
      return sendSuccess(res, message.role.UPDATE_SUCCESS, role);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.role.UPDATE_FAILED,
      );
    }
  }

  /**
   * Delete a role
   */
  public async deleteRole(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const deletedRole = await roleService.deleteRole(id);
      return sendSuccess(res, message.role.DELETE_SUCCESS, deletedRole);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.role.DELETE_FAILED,
      );
    }
  }

  /**
   * Assign permissions to role
   */
  public async assignPermissions(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const { permissionIds } = req.body;
      const assignedRole = await roleService.assignPermissions(id, permissionIds);
      return sendSuccess(res, message.role.PERMISSION_ASSIGN_SUCCESS, assignedRole);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.role.PERMISSION_ASSIGN_FAILED,
      );
    }
  }

  /**
   * Remove permissions from role
   */
  public async removePermissions(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const { permissionIds } = req.body;
      const removedRole = await roleService.removePermissions(id, permissionIds);
      return sendSuccess(res, message.role.PERMISSION_REMOVE_SUCCESS, removedRole);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.role.PERMISSION_REMOVE_FAILED,
      );
    }
  }

  /**
   * Assign pages to role
   */
  public async assignPages(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const { pageIds } = req.body;
      const assignedRole = await roleService.assignPages(id, pageIds);
      return sendSuccess(res, message.role.PAGE_ASSIGN_SUCCESS, assignedRole);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.role.PAGE_ASSIGN_FAILED,
      );
    }
  }

  /**
   * Remove pages from role
   */
  public async removePages(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const { pageIds } = req.body;
      const removedRole = await roleService.removePages(id, pageIds);
      return sendSuccess(res, message.role.PAGE_REMOVE_SUCCESS, removedRole);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.role.PAGE_REMOVE_FAILED,
      );
    }
  }
}
