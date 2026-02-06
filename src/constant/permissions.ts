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
  roles: {
    create: 'create:role',
    update: 'update:role',
    delete: 'delete:role',
    assignPermissions: 'patch:assignPermissions:role',
    removePermissions: 'patch:removePermissions:role',
    assignPages: 'patch:assignPages:role',
    removePages: 'patch:removePages:role',
  },
  pages: {
    create: 'create:page',
    update: 'update:page',
    delete: 'delete:page',
    list: 'get:pages',
  },
};

export default permissions;
