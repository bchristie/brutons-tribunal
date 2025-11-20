import { PrismaClient } from '@prisma/client';
import { permissionRepository } from './src/lib/prisma';

const prisma = new PrismaClient();

async function test() {
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: 'asc' }
  });
  
  if (!user) {
    console.log('No user found');
    return;
  }
  
  console.log('Testing user:', user.email);
  console.log('User ID:', user.id);
  
  try {
    const perms = await permissionRepository.getUserPermissions(user.id);
    console.log('\nRoles:', perms.roles);
    console.log('Permissions count:', perms.permissions.size);
    console.log('Sample permissions:', Array.from(perms.permissions).slice(0, 5));
  } catch (error) {
    console.error('Error getting permissions:', error);
  }
  
  await prisma.$disconnect();
}

test();
