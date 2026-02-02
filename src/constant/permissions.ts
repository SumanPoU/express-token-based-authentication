const permissions = {
  users: {
    create: 'create:user',
    update: 'update:user',
    delete: 'delete:user',
    softDelete: 'patch:softDelete:user',
    status: 'patch:status:user',
    get: 'get:users',
  },
};

export default permissions;
