import { db } from '../database/index.js';
import { users } from '../database/schema.js';
import * as bcrypt from 'bcrypt';

/**
 * Default users seeder
 * Creates initial admin and test users
 */
export async function seedUsers() {
  console.log('🌱 Seeding users...');

  // Hash password for default users
  const defaultPassword = await bcrypt.hash('password123', 10);

  const defaultUsers = [
    {
      email: 'superadmin@example.com',
      name: 'Super Admin',
      password: defaultPassword,
    }
  ];

  try {
    // Batch insert users, skip if already exists
    await db.insert(users)
      .values(defaultUsers)
      .onConflictDoNothing({ target: users.email });
  } catch (error) {
    throw error;
  }
}

/**
 * Run seeder if called directly
 */
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('🎉 User seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 User seeding failed:', error);
      process.exit(1);
    });
}