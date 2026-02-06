import db from '../config/prisma';
import { AppError } from '@/lib/AppError';
import httpStatus from 'http-status';
import logger from '../middleware/logger';
import message from '../constant/message';
import * as PageSchemas from '@/validation/page.schema';
import { paginate, PaginationParams } from '@/lib/pagination.utils';
import { SlugUtils } from '@/lib/slug.utils';

export class PageService {
  constructor(private slugUtils = SlugUtils) {}

  /**
   * Create a new page
   */
  public async createPage(input: PageSchemas.CreatePageInput) {
    try {
      const { slug, title, ...data } = input;

      let finalSlug: string;

      if (slug) {
        await this.slugUtils.validateSlugUniqueness(slug, db.page);
        finalSlug = slug;
      } else {
        finalSlug = await this.slugUtils.generateSlug(title, db.page);
      }

      const page = await db.page.create({
        data: {
          ...data,
          title,
          slug: finalSlug,
        },
      });

      logger.info(`Page created: ${page.id}`);
      return page;
    } catch (error) {
      logger.error('Failed to create page', error);
      throw error instanceof AppError
        ? error
        : new AppError(message.page.CREATE_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update a page
   */
  public async updatePage(id: string, input: PageSchemas.UpdatePageInput) {
    try {
      const page = await db.page.findUnique({ where: { id } });
      if (!page) {
        throw new AppError(message.page.NOT_FOUND, httpStatus.NOT_FOUND);
      }

      const data: any = { ...input };

      if (input.slug && input.slug !== page.slug) {
        await this.slugUtils.validateSlugUniqueness(input.slug, db.page, id);
        data.slug = input.slug;
      } else {
        delete data.slug;
      }

      const updatedPage = await db.page.update({
        where: { id },
        data,
      });

      logger.info(`Page updated: ${id}`);
      return updatedPage;
    } catch (error) {
      logger.error(`Failed to update page: ${id}`, error);
      throw error instanceof AppError
        ? error
        : new AppError(message.page.UPDATE_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete a page
   */
  public async deletePage(id: string) {
    try {
      const page = await db.page.findUnique({ where: { id } });
      if (!page) {
        logger.warn(`Attempted to delete non-existent page: ${id}`);
        throw new AppError(message.page.NOT_FOUND, httpStatus.NOT_FOUND);
      }

      const deletedPage = await db.page.delete({ where: { id } });
      logger.info(`Page deleted: ${id}`);
      return deletedPage;
    } catch (error) {
      logger.error(`Failed to delete page: ${id}`, error);
      throw error instanceof AppError
        ? error
        : new AppError(message.page.DELETE_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * List pages with pagination + filter
   */
  public async listPages(pagination: PaginationParams & PageSchemas.PageFilterInput) {
    const { page = 1, limit = 10, search } = pagination;

    const filter: any = {};
    if (search) {
      filter.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    try {
      const result = await paginate<any>(
        db.page,
        { page, limit, filter },
        {
          id: true,
          title: true,
          slug: true,
          staticText: true,
          createdAt: true,
          updatedAt: true,
        },
        {
          allowedRoles: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      );

      const dataWithSN = result.data.map((page, idx) => ({
        sn: (page - 1) * limit + idx + 1,
        ...page,
      }));

      logger.info(`Listed pages: page ${page}, limit ${limit}, filter ${JSON.stringify(filter)}`);
      return { data: dataWithSN, meta: result.meta };
    } catch (error) {
      logger.error('Failed to list pages', error);
      throw new AppError(message.page.LIST_FAILED, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
