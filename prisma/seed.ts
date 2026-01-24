import { PrismaClient, Role, Permission, User } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Roles
  const rolesData: { name: string; description: string; isDefault: boolean }[] = [
    {
      name: 'SuperAdmin',
      description: 'Super administrator with all permissions',
      isDefault: false,
    },
    { name: 'Admin', description: 'Administrator role with full access', isDefault: false },
    { name: 'User', description: 'Default user role', isDefault: true },
  ];

  const roles: Role[] = [];
  for (const role of rolesData) {
    const createdRole = await prisma.role.create({ data: role });
    roles.push(createdRole);
  }

  const superAdminRole = roles.find((r) => r.name === 'SuperAdmin')!;
  const adminRole = roles.find((r) => r.name === 'Admin')!;
  const userRole = roles.find((r) => r.name === 'User')!;

  // Permission Groups
  const permissionGroupsData: { name: string; description: string }[] = [
    { name: 'User Management', description: 'Permissions related to user management' },
  ];

  const permissionGroups = [];
  for (const group of permissionGroupsData) {
    const createdGroup = await prisma.permissionGroup.create({ data: group });
    permissionGroups.push(createdGroup);
  }

  const userMgmtGroup = permissionGroups[0];

  // Permissions
  const permissionsData: { name: string; description: string; groupId: string }[] = [
    { name: 'CREATE_USER', description: 'Create a new user', groupId: userMgmtGroup.id },
    { name: 'DELETE_USER', description: 'Delete a user', groupId: userMgmtGroup.id },
  ];

  const permissions: Permission[] = [];
  for (const perm of permissionsData) {
    const createdPerm = await prisma.permission.create({
      data: {
        name: perm.name,
        description: perm.description,
        groups: { connect: { id: perm.groupId } },
      },
    });
    permissions.push(createdPerm);
  }

  // Users
  const usersData: {
    displayName: string;
    userName: string;
    email: string;
    password: string;
    roleId: string;
  }[] = [
    {
      displayName: 'Super Admin',
      userName: 'superadmin',
      email: 'superadmin@gmail.com',
      password: 'password123',
      roleId: superAdminRole.id,
    },
    {
      displayName: 'Admin User',
      userName: 'admin',
      email: 'admin@gmail.com',
      password: 'password123',
      roleId: adminRole.id,
    },
    {
      displayName: 'User',
      userName: 'user',
      email: 'user@gmail.com',
      password: 'password123',
      roleId: userRole.id,
    },
  ];

  const users: User[] = [];
  for (const user of usersData) {
    const createdUser = await prisma.user.create({ data: user });
    users.push(createdUser);
  }

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
