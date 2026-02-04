const permissions = {
  users: {
    create: 'create:user',
    update: 'update:user',
    delete: 'delete:user',
    softDelete: 'patch:softDelete:user',
    status: 'patch:status:user',
    get: 'get:users',
  },
  permissionGroups: {
    create: 'create:permissionGroup',
    update: 'update:permissionGroup',
    delete: 'delete:permissionGroup',
    list: 'get:permissionGroups',
  },
  permissions: {
    create: 'create:permission',
    update: 'update:permission',
    delete: 'delete:permission',
    list: 'get:permissions',
  },
};

export default permissions;
