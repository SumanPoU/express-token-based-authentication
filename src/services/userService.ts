import db from '../config/prisma';
import { paginate, PaginationParams, PaginatedResult } from '../lib/pagination.utils';
import { CreateUserInput, UpdateUserInput, UserFilterInput } from '../validation/user.schema';
import { AppError } from '@/lib/AppError';
import httpStatus from 'http-status';
import { User } from '../types/user';
import { Role } from '../types/role';
import logger from '../middleware/logger';
import { CREDENTIALS_TYPES, PROVIDER } from '../constant/user';
import message from '../constant/message';
import { generatePassword, hashPassword } from '@/lib/passwordHash.utils';
import { AuthMailService } from '@/lib/authMail';

export class UserService {
  private authMailService = AuthMailService;

  constructor() {}

  /**
   * Create a new user
   */
  public async createUser(input: CreateUserInput) {
    try {
      const plainPassword = generatePassword();
      const hashedPassword = await hashPassword(plainPassword);
      const user = await db.user.create({
        data: {
          ...input,
          password: hashedPassword,
          isFirstLogin: true,
          accounts: {
            create: {
              type: CREDENTIALS_TYPES.credentials,
              provider: PROVIDER.local,
              providerAccountId: input.email,
            },
          },
        },
      });

      await this.authMailService.sendAdminEmail(
        user.email,
        user.displayName ?? 'User',
        plainPassword,
      );

      logger.info(`User created: ${user.id} (${user.email})`);
      return user;
    } catch (error) {
      logger.error('Failed to create user', error);
      throw new AppError(message.auth.user.USER_CREATE_FAILURE, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update a user
   */
  public async updateUser(id: string, input: UpdateUserInput) {
    try {
      const user = await db.user.findUnique({ where: { id } });
      if (!user) {
        logger.warn(`Attempted to update non-existent user: ${id}`);
        throw new AppError(message.auth.user.USER_NOT_FOUND, httpStatus.NOT_FOUND);
      }

      const updatedUser = await db.user.update({
        where: { id },
        data: input,
      });

      logger.info(`User updated: ${id}`);
      return updatedUser;
    } catch (error) {
      logger.error(`Failed to update user: ${id}`, error);
      throw error instanceof AppError
        ? error
        : new AppError(message.auth.user.USER_UPDATE_FAILURE, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Hard Delete a user
   */
  public async deleteUser(id: string) {
    try {
      const user = await db.user.findUnique({ where: { id } });
      if (!user) {
        logger.warn(`Attempted to delete non-existent user: ${id}`);
        throw new AppError(message.auth.user.USER_NOT_FOUND, httpStatus.NOT_FOUND);
      }

      const deletedUser = await db.user.delete({ where: { id } });
      logger.info(`User deleted: ${id} (${user.email})`);
      return deletedUser;
    } catch (error) {
      logger.error(`Failed to delete user: ${id}`, error);
      throw error instanceof AppError
        ? error
        : new AppError(message.auth.user.USER_DELETE_FAILURE, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Soft Delete a user
   */
  public async softDeleteUser(id: string, isDeleted: boolean) {
    try {
      const user = await db.user.findUnique({ where: { id } });
      if (!user) {
        logger.warn(`Attempted to soft delete non-existent user: ${id}`);
        throw new AppError(message.auth.user.USER_NOT_FOUND, httpStatus.NOT_FOUND);
      }

      const updatedUser = await db.user.update({
        where: { id },
        data: { isDeleted },
      });

      logger.info(`User ${isDeleted ? 'soft deleted' : 'restored'}: ${id} (${user.email})`);
      return updatedUser;
    } catch (error) {
      logger.error(`Failed to ${isDeleted ? 'soft delete' : 'restore'} user: ${id}`, error);
      throw error instanceof AppError
        ? error
        : new AppError(
            message.auth.user.USER_SOFT_DELETE_FAILURE,
            httpStatus.INTERNAL_SERVER_ERROR,
          );
    }
  }

  /**
   * Enable or Disable a user
   */
  public async setUserStatus(id: string, isDisabled: boolean) {
    try {
      const user = await db.user.findUnique({ where: { id } });

      if (!user) {
        logger.warn(`Attempted to update status for non-existent user: ${id}`);
        throw new AppError(message.auth.user.USER_NOT_FOUND, httpStatus.NOT_FOUND);
      }

      const updatedUser = await db.user.update({
        where: { id },
        data: { isDisabled },
      });

      logger.info(`User ${isDisabled ? 'disabled' : 'enabled'}: ${id} (${user.email})`);

      return updatedUser;
    } catch (error) {
      logger.error(`Failed to update user status: ${id}`, error);

      throw error instanceof AppError
        ? error
        : new AppError(message.auth.user.USER_UPDATE_FAILURE, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * List users with pagination + filter + sn
   */
  public async listUsers(
    pagination: PaginationParams & UserFilterInput,
  ): Promise<PaginatedResult<User & { role?: Role[] } & { sn: number }>> {
    const { page = 1, limit = 10, search, roleId, isDisabled, isDeleted } = pagination;

    const filter: any = {};
    if (search) filter.OR = [{ email: { contains: search } }, { userName: { contains: search } }];
    if (roleId) filter.roleId = roleId;
    if (typeof isDisabled === 'boolean') filter.isDisabled = isDisabled;
    if (typeof isDeleted === 'boolean') filter.isDeleted = isDeleted;

    try {
      const result = await paginate<User & { role?: Role[] }>(
        db.user,
        { page, limit, filter },
        {
          id: true,
          displayName: true,
          email: true,
          userName: true,
          roleId: true,
          isDisabled: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
        },
        { role: true },
      );

      const dataWithSN = result.data.map((user, idx) => ({
        sn: (page - 1) * limit + idx + 1,
        ...user,
      }));

      logger.info(`Listed users: page ${page}, limit ${limit}, filter ${JSON.stringify(filter)}`);
      return { data: dataWithSN, meta: result.meta };
    } catch (error) {
      logger.error('Failed to list users', error);
      throw new AppError(message.auth.user.USER_LIST_FAILURE, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
