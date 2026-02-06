import { Router } from 'express';
import { PermissionController } from '../../controllers/permissionController';
import validate from '../../middleware/validate';
import { authenticateAcceessToken } from '@/middleware/authMiddleware';
import * as PermissionSchemas from '@/validation/permission.schema';
import { checkPermission } from '@/middleware/checkPermission';
import permission from '@/constant/permissions';

const router = Router();
const permissionController = new PermissionController();
router.use(authenticateAcceessToken);

router.post(
  '/create-permission-group',
  checkPermission(permission.permissionGroups.create),
  validate({ body: PermissionSchemas.CreatePermissionGroupSchema }),
  permissionController.createPermissionGroup,
);

router.put(
  '/update-permission-group/:id',
  checkPermission(permission.permissionGroups.update),
  validate({
    params: PermissionSchemas.PermissionGroupIdParamSchema,
    body: PermissionSchemas.UpdatePermissionGroupSchema,
  }),
  permissionController.updatePermissionGroup,
);

router.get(
  '/list-permission-groups',
  checkPermission(permission.permissionGroups.list),
  validate({ query: PermissionSchemas.PermissionFilterSchema }),
  permissionController.listPermissionGroups,
);

router.delete(
  '/delete-permission-group/:id',
  checkPermission(permission.permissionGroups.delete),
  validate({ params: PermissionSchemas.PermissionGroupIdParamSchema }),
  permissionController.deletePermissionGroup,
);

router.post(
  '/create-permission',
  checkPermission(permission.permissions.create),
  validate({ body: PermissionSchemas.CreatePermissionSchema }),
  permissionController.createPermission,
);

router.put(
  '/update-permission/:id',
  checkPermission(permission.permissions.update),
  validate({
    params: PermissionSchemas.PermissionIdParamSchema,
    body: PermissionSchemas.UpdatePermissionSchema,
  }),
  permissionController.updatePermission,
);

router.delete(
  '/delete-permission/:id',
  checkPermission(permission.permissions.delete),
  validate({ params: PermissionSchemas.PermissionIdParamSchema }),
  permissionController.deletePermission,
);

export default router;
