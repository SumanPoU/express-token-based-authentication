import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PageService } from '@/services/pageService';
import { sendSuccess, sendError } from '../middleware/response';
import message from '../constant/message';

const pageService = new PageService();

/*
 * Controller: PageController
 */
export class PageController {
  /**
   * Create a new page
   */
  public createPage = async (req: Request, res: Response) => {
    try {
      const page = await pageService.createPage(req.body);

      return sendSuccess(res, message.page.CREATE_SUCCESS, { page }, httpStatus.CREATED);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.page.CREATE_FAILED,
        undefined,
        err.status || httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  /**
   * Update a page
   */
  public updatePage = async (req: Request, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      const page = await pageService.updatePage(id, req.body);

      return sendSuccess(res, message.page.UPDATE_SUCCESS, { page }, httpStatus.OK);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.page.UPDATE_FAILED,
        undefined,
        err.status || httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  /**
   * Delete a page
   */
  public deletePage = async (req: Request, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      const page = await pageService.deletePage(id);

      return sendSuccess(res, message.page.DELETE_SUCCESS, { page }, httpStatus.OK);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.page.DELETE_FAILED,
        undefined,
        err.status || httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  /**
   * List pages (pagination + search)
   */
  public listPages = async (req: Request, res: Response) => {
    try {
      const pages = await pageService.listPages({
        ...req.query,
      });

      return sendSuccess(res, message.page.LIST_SUCCESS, pages, httpStatus.OK);
    } catch (err: any) {
      return sendError(
        res,
        err.message || message.page.LIST_FAILED,
        undefined,
        err.status || httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };
}
