import type { Request, Response } from 'express';
import { PermissionService } from '../services/permissionServices';
import { sendSuccess, sendError } from '../middleware/response';
import message from '../constant/message';
import httpStatus from 'http-status';

const permissionService = new PermissionService();

/*
 * Controller: PermissionController
 */

export class PermissionController {
  /*
   * Controller: Create a new permission group
   */
  public async createPermissionGroup(req: Request, res: Response) {
    try {
      const permissionGroup = await permissionService.createPermissionGroup(req.body);
      return sendSuccess(res, message.permissionGroup.CREATE_SUCCESS, permissionGroup);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.permissionGroup.CREATE_FAILED,
      );
    }
  }

  /*
   * Controller: Update a permission group
   */
  public async updatePermissionGroup(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const permissionGroup = await permissionService.updatePermissionGroup(id, req.body);
      return sendSuccess(res, message.permissionGroup.UPDATE_SUCCESS, permissionGroup);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.permissionGroup.UPDATE_FAILED,
      );
    }
  }

  /*
   * Controller: List permission groups with pagination + filter
   */
  public async listPermissionGroups(req: Request, res: Response) {
    try {
      const result = await permissionService.listPermissions(req.query);
      return sendSuccess(res, message.permissionGroup.LIST_SUCCESS, result);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.permissionGroup.LIST_FAILED,
      );
    }
  }

  /*
   * Controller: Delete a permission group
   */
  public async deletePermissionGroup(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const deletedPermissionGroup = await permissionService.deletePermissionGroup(id);
      return sendSuccess(res, message.permissionGroup.DELETE_SUCCESS, deletedPermissionGroup);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.permissionGroup.DELETE_FAILED,
      );
    }
  }

  /*
   * Controller: Create a new permission
   */
  public async createPermission(req: Request, res: Response) {
    try {
      const permission = await permissionService.createPermission(req.body);
      return sendSuccess(res, message.permission.CREATE_SUCCESS, permission);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.permission.CREATE_FAILED,
      );
    }
  }

  /*
   * Controller: Update a permission
   */
  public async updatePermission(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const permission = await permissionService.updatePermission(id, req.body);
      return sendSuccess(res, message.permission.UPDATE_SUCCESS, permission);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.permission.UPDATE_FAILED,
      );
    }
  }

  /*
   * Controller: Delete a permission
   */
  public async deletePermission(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const deletedPermission = await permissionService.deletePermission(id);
      return sendSuccess(res, message.permission.DELETE_SUCCESS, deletedPermission);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.permission.DELETE_FAILED,
      );
    }
  }
}
