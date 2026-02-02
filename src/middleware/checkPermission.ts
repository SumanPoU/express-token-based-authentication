import { Request, Response, NextFunction } from 'express';
import db from '../config/prisma';
import { sendError } from './response';
import httpStatus from 'http-status';
import message from '../constant/message';

/**
 * Middleware to check if the authenticated user has the required permission.
 * @param permissionName The name of the permission to check
 */
export const checkPermission =
  (permissionName: string) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return sendError(
          res,
          message.auth.user.USER_NOT_AUTHENTICATED,
          undefined,
          httpStatus.UNAUTHORIZED,
        );
      }

      // Check if user has the permission directly
      const user = await db.user.findUnique({
        where: { id: userId },
        include: { permissions: true }, // Direct permissions assigned to user
      });

      if (!user) {
        return sendError(res, message.auth.user.USER_NOT_FOUND, undefined, httpStatus.NOT_FOUND);
      }

      const hasPermission = user.permissions.some((perm) => perm.name === permissionName);

      if (!hasPermission) {
        return sendError(
          res,
          `${message.auth.user.USER_NOT_AUTHENTICATED}: ${message.permission.PERISSION_NOT_AUTHENTICATED}`,
          undefined,
          httpStatus.FORBIDDEN,
        );
      }

      next();
    } catch (err) {
      console.error(err);
      return sendError(
        res,
        message.permission.FAILED_TO_CHECK_PERMISSION,
        undefined,
        httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };
