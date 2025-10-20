import { db } from '../database/index.js';
import { permissions } from '../database/schema.js';

/**
 * Default permissions seeder
 * Generates common RBAC permissions for different modules
 */
export async function seedPermissions() {
  console.log('🌱 Seeding permissions...');

  const defaultPermissions = [
    // User Management Permissions
    { name: 'users.view' },
    { name: 'users.create' },
    { name: 'users.update' },
    { name: 'users.delete' },
    { name: 'users.viewOwn' },

    // Role Management Permissions
    { name: 'roles.view' },
    { name: 'roles.create' },
    { name: 'roles.update' },
    { name: 'roles.delete' },
    { name: 'roles.viewOwn' },

    // Permission Management Permissions
    { name: 'permissions.view' },
    { name: 'permissions.create' },
    { name: 'permissions.update' },
    { name: 'permissions.delete' },
    { name: 'permissions.viewOwn' },
  ];

  try {
    // Batch insert permissions, skip if already exists
    await db.insert(permissions)
      .values(defaultPermissions)
      .onConflictDoNothing({ target: permissions.name });
  } catch (error) {
    throw error;
  }
}

/**
 * Run seeder if called directly
 */
if (require.main === module) {
  seedPermissions()
    .then(() => {
      console.log('🎉 Permission seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Permission seeding failed:', error);
      process.exit(1);
    });
}