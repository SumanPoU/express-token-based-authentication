import { Router } from 'express';
import { RoleController } from '../../controllers/roleController';
import validate from '../../middleware/validate';
import { authenticateAcceessToken } from '@/middleware/authMiddleware';
import * as RoleSchemas from '@/validation/role.schema';
import { checkPermission } from '@/middleware/checkPermission';
import permission from '@/constant/permissions';

const router = Router();
const roleController = new RoleController();
router.use(authenticateAcceessToken);

router.post(
  '/create-role',
  checkPermission(permission.roles.create),
  validate({ body: RoleSchemas.CreateRoleSchema }),
  roleController.createRole,
);

router.put(
  'update-role/:id',
  checkPermission(permission.roles.update),
  validate({
    params: RoleSchemas.RoleIdParamSchema,
    body: RoleSchemas.UpdateRoleSchema,
  }),
  roleController.updateRole,
);

router.delete(
  'delete-role/:id',
  checkPermission(permission.roles.delete),
  validate({ params: RoleSchemas.RoleIdParamSchema }),
  roleController.deleteRole,
);

router.post(
  '/assign-permissions',
  checkPermission(permission.roles.assignPermissions),
  validate({
    params: RoleSchemas.RoleIdParamSchema,
    body: RoleSchemas.AssignPermissionsSchema,
  }),
  roleController.assignPermissions,
);

router.post(
  '/remove-permissions',
  checkPermission(permission.roles.removePermissions),
  validate({
    params: RoleSchemas.RoleIdParamSchema,
    body: RoleSchemas.RemovePermissionsSchema,
  }),
  roleController.removePermissions,
);

router.post(
  '/assign-pages',
  checkPermission(permission.roles.assignPages),
  validate({
    params: RoleSchemas.RoleIdParamSchema,
    body: RoleSchemas.AssignPagesSchema,
  }),
  roleController.assignPages,
);

router.post(
  '/remove-pages',
  checkPermission(permission.roles.removePages),
  validate({
    params: RoleSchemas.RoleIdParamSchema,
    body: RoleSchemas.RemovePagesSchema,
  }),
  roleController.removePages,
);

export default router;
