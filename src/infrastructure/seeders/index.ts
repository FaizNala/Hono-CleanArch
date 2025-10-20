import { seedPermissions } from './permissions.seeder.js';
import { seedRoles } from './roles.seeder.js';
import { seedUsers } from './users.seeder.js';
import { seedUserRoles } from './userRoles.seeder.js';
import { seedRolePermissions } from './rolePermissions.seeder.js';

/**
 * Main seeder that runs all seeders in correct order
 */
export async function runAllSeeders() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // 1. Seed permissions first (no dependencies)
    await seedPermissions();
    
    // 2. Seed roles (no dependencies)
    await seedRoles();
    
    // 3. Seed users (no dependencies)
    await seedUsers();
    
    // 4. Seed user-role relationships (depends on users and roles)
    await seedUserRoles();
    
    // 5. Seed role-permission relationships (depends on roles and permissions)
    await seedRolePermissions();
    
    console.log('🎉 All seeders completed successfully!');
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    throw error;
  }
}

/**
 * Run all seeders if called directly
 */
if (require.main === module) {
  runAllSeeders()
    .then(() => {
      console.log('✅ Database seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database seeding failed:', error);
      process.exit(1);
    });
}