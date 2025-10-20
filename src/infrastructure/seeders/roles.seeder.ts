import { db } from '../database/index.js';
import { roles } from '../database/schema.js';

/**
 * Default roles seeder
 * Creates initial roles for RBAC system
 */
export async function seedRoles() {
  console.log('🌱 Seeding roles...');

  const defaultRoles = [
    { name: 'Super Admin' }
  ];

  try {
    // Batch insert roles, skip if already exists
    await db.insert(roles)
      .values(defaultRoles)
      .onConflictDoNothing({ target: roles.name });
  } catch (error) {
    throw error;
  }
}

/**
 * Run seeder if called directly
 */
if (require.main === module) {
  seedRoles()
    .then(() => {
      console.log('🎉 Role seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Role seeding failed:', error);
      process.exit(1);
    });
}