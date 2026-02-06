import { Router } from 'express';
import { PageController } from '../../controllers/pageController';
import validate from '../../middleware/validate';
import { authenticateAcceessToken } from '@/middleware/authMiddleware';
import * as PageSchemas from '@/validation/page.schema';
import { checkPermission } from '@/middleware/checkPermission';
import permission from '@/constant/permissions';

const router = Router();
const pageController = new PageController();
router.use(authenticateAcceessToken);

router.post(
  '/create-page',
  checkPermission(permission.pages.create),
  validate({ body: PageSchemas.CreatePageSchema }),
  pageController.createPage,
);

router.put(
  'update-page/:id',
  checkPermission(permission.pages.update),
  validate({
    params: PageSchemas.PageIdentifierParamSchema,
    body: PageSchemas.UpdatePageSchema,
  }),
  pageController.updatePage,
);

router.delete(
  '/delete-page/:id',
  checkPermission(permission.pages.delete),
  validate({ params: PageSchemas.PageIdentifierParamSchema }),
  pageController.deletePage,
);

router.get(
  '/list-pages',
  checkPermission(permission.pages.list),
  validate({ query: PageSchemas.PageFilterSchema }),
  pageController.listPages,
);

export default router;
