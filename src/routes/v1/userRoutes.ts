import { Router } from 'express';
import { UserController } from '../../controllers/userController';
import validate from '../../middleware/validate';
import { authenticateAcceessToken } from '@/middleware/authMiddleware';
import * as UserSchemas from '@/validation/user.schema';

const router = Router();
const userController = new UserController();
router.use(authenticateAcceessToken);
router.post('/create-user', validate({ body: UserSchemas.CreateUserSchema }), userController.createUser);

router.put(
  'update-user/:id',
  validate({
    params: UserSchemas.UserIdParamSchema,
    body: UserSchemas.UpdateUserSchema,
  }),
  userController.updateUser,
);

router.delete(
  'hard-delete-user/:id',
  validate({ params: UserSchemas.UserIdParamSchema }),
  userController.deleteUser,
);

router.patch(
  '/:id/soft-delete',
  validate({
    params: UserSchemas.UserIdParamSchema,
    body: UserSchemas.SoftDeleteUserSchema,
  }),
  userController.softDeleteUser,
);

router.patch(
  '/:id/status',
  validate({
    params: UserSchemas.UserIdParamSchema,
    body: UserSchemas.SetUserStatusSchema,
  }),
  userController.setUserStatus,
);

router.get('/get-users', validate({ query: UserSchemas.UserFilterSchema }), userController.listUsers);

export default router;
