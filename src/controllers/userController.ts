import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import httpStatus from 'http-status';
import message from '../constant/message';
import { sendSuccess, sendError } from '@/middleware/response';

const userService = new UserService();

export class UserController {
  /**
   * Create a new user
   */
  public async createUser(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      return sendSuccess(res, message.auth.user.USER_CREATE_SUCCESS, user);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.auth.user.USER_CREATE_FAILURE,
      );
    }
  }

  /**
   * Update a user
   */
  public async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const user = await userService.updateUser(id, req.body);
      return sendSuccess(res, message.auth.user.USER_UPDATE_SUCCESS, user);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.auth.user.USER_UPDATE_FAILURE,
      );
    }
  }

  /**
   * Hard Delete a user
   */
  public async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const user = await userService.deleteUser(id);
      return sendSuccess(res, message.auth.user.USER_DELETE_SUCCESS, user);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.auth.user.USER_DELETE_FAILURE,
      );
    }
  }

  /**
   * Soft Delete a user
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public async softDeleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const { isDeleted } = req.body;
      const user = await userService.softDeleteUser(id, isDeleted);
      return sendSuccess(res, message.auth.user.USER_SOFT_DELETE_SUCCESS, user);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.auth.user.USER_SOFT_DELETE_FAILURE,
      );
    }
  }

  /**
   * Enable or Disable a user
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public async setUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const { isDisabled } = req.body;
      const user = await userService.setUserStatus(id, isDisabled);
      return sendSuccess(res, message.auth.user.USER_UPDATE_SUCCESS, user);
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.auth.user.USER_UPDATE_FAILURE,
      );
    }
  }

  /**
   * List users with pagination & filter
   */
  public async listUsers(req: Request, res: Response) {
    try {
      const query = req.query;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await userService.listUsers({
        ...query,
        page,
        limit,
      });

      return sendSuccess(res, message.auth.user.USER_RETRIEVE_SUCCESS, {
        users: result.data,
        meta: result.meta,
      });
    } catch (error: any) {
      return sendError(
        res,
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || message.auth.user.USER_RETRIEVE_FAILURE,
      );
    }
  }
}
