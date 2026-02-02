import { Router } from 'express';
import { UserController } from '../../controllers/userController';
import validate from '../../middleware/validate';
import { authenticateAcceessToken } from '@/middleware/authMiddleware';
import * as UserSchemas from '@/validation/user.schema';
import { checkPermission } from '@/middleware/checkPermission';
import permission from '@/constant/permissions';

const router = Router();
const userController = new UserController();
router.use(authenticateAcceessToken);
router.post(
  '/create-user',
  checkPermission(permission.users.create),
  validate({ body: UserSchemas.CreateUserSchema }),
  userController.createUser,
);

router.put(
  'update-user/:id',
  checkPermission(permission.users.update),
  validate({
    params: UserSchemas.UserIdParamSchema,
    body: UserSchemas.UpdateUserSchema,
  }),
  userController.updateUser,
);

router.delete(
  'hard-delete-user/:id',
  checkPermission(permission.users.delete),
  validate({ params: UserSchemas.UserIdParamSchema }),
  userController.deleteUser,
);

router.patch(
  '/:id/soft-delete',
  checkPermission(permission.users.softDelete),
  validate({
    params: UserSchemas.UserIdParamSchema,
    body: UserSchemas.SoftDeleteUserSchema,
  }),
  userController.softDeleteUser,
);

router.patch(
  '/:id/status',
  checkPermission(permission.users.status),
  validate({
    params: UserSchemas.UserIdParamSchema,
    body: UserSchemas.SetUserStatusSchema,
  }),
  userController.setUserStatus,
);

router.get(
  '/get-users',
  checkPermission(permission.users.get),
  validate({ query: UserSchemas.UserFilterSchema }),
  userController.listUsers,
);

export default router;
