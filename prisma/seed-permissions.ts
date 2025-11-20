import { PrismaClient, Action } from '@prisma/client';
import { Roles } from '../src/lib/permissions/permissions';

export async function seedPermissions(prismaClient?: PrismaClient) {
  const prisma = prismaClient || new PrismaClient();
  
  console.log('🔐 Seeding permissions...');

  // Define all resources and their actions
  const resources = [
    { name: 'users', actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
    { name: 'updates', actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
    { name: 'roles', actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
    { name: 'permissions', actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
  ];

  // Create all permissions using upserts
  const permissions = [];
  for (const resource of resources) {
    for (const action of resource.actions) {
      const permission = await prisma.permission.upsert({
        where: {
          resource_action: {
            resource: resource.name,
            action: action,
          },
        },
        update: {
          description: `${action} ${resource.name}`,
        },
        create: {
          resource: resource.name,
          action: action,
          description: `${action} ${resource.name}`,
        },
      });
      permissions.push(permission);
      console.log(`  ✓ Permission: ${permission.resource}:${permission.action}`);
    }
  }

  console.log(`✅ Created/updated ${permissions.length} permissions\n`);

  // Create roles
  console.log('👥 Seeding roles...');

  const adminRole = await prisma.role.upsert({
    where: { name: Roles.ADMIN },
    update: {
      description: 'Full system access - can manage everything',
    },
    create: {
      name: Roles.ADMIN,
      description: 'Full system access - can manage everything',
    },
  });
  console.log('  ✓ Role: admin');

  const editorRole = await prisma.role.upsert({
    where: { name: Roles.EDITOR },
    update: {
      description: 'Can create and manage content',
    },
    create: {
      name: Roles.EDITOR,
      description: 'Can create and manage content',
    },
  });
  console.log('  ✓ Role: editor');

  const viewerRole = await prisma.role.upsert({
    where: { name: Roles.VIEWER },
    update: {
      description: 'Read-only access',
    },
    create: {
      name: Roles.VIEWER,
      description: 'Read-only access',
    },
  });
  console.log('  ✓ Role: viewer');

  console.log('✅ Created/updated 3 roles\n');

  // Assign permissions to roles
  console.log('🔗 Assigning permissions to roles...');

  // Admin gets ALL permissions
  let adminPermCount = 0;
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
    adminPermCount++;
  }
  console.log(`  ✓ Admin: ${adminPermCount} permissions`);

  // Editor gets CRUD on updates, READ on users
  const editorPermissions = permissions.filter(
    (p) =>
      p.resource === 'updates' ||
      (p.resource === 'users' && p.action === Action.READ)
  );
  let editorPermCount = 0;
  for (const permission of editorPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: editorRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: editorRole.id,
        permissionId: permission.id,
      },
    });
    editorPermCount++;
  }
  console.log(`  ✓ Editor: ${editorPermCount} permissions`);

  // Viewer gets READ on updates and users only
  const viewerPermissions = permissions.filter(
    (p) =>
      (p.resource === 'updates' || p.resource === 'users') &&
      p.action === Action.READ
  );
  let viewerPermCount = 0;
  for (const permission of viewerPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: viewerRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: viewerRole.id,
        permissionId: permission.id,
      },
    });
    viewerPermCount++;
  }
  console.log(`  ✓ Viewer: ${viewerPermCount} permissions`);

  console.log('✅ Permissions assigned to roles\n');

  // Assign admin role to the earliest created user (if one exists)
  console.log('👤 Assigning admin role to earliest user...');
  
  const earliestUser = await prisma.user.findFirst({
    orderBy: { createdAt: 'asc' },
  });

  if (earliestUser) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: earliestUser.id,
          roleId: adminRole.id,
        },
      },
      update: {},
      create: {
        userId: earliestUser.id,
        roleId: adminRole.id,
      },
    });
    console.log(`  ✓ Admin role assigned to: ${earliestUser.email}`);
  } else {
    console.log('  ℹ No users found in database');
  }

  console.log('✅ User role assignment complete\n');

  return {
    permissions,
    roles: {
      admin: adminRole,
      editor: editorRole,
      viewer: viewerRole,
    },
  };
}

// Allow running this file directly
if (require.main === module) {
  const prisma = new PrismaClient();
  
  seedPermissions(prisma)
    .then(() => {
      console.log('✅ Permission seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error seeding permissions:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
