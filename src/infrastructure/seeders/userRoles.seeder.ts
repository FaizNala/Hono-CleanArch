import { db } from '../database/index.js';
import { users, roles, userRoles } from '../database/schema.js';
import { eq, inArray } from 'drizzle-orm';

/**
 * Assign roles to users seeder
 * Creates initial user-role assignments
 */
export async function seedUserRoles() {
  console.log('🌱 Seeding user-role assignments...');

  try {
    // Define assignments
    const assignments = [
      { userEmail: 'superadmin@example.com', roleName: 'Super Admin' },
    ];

    // Collect unique emails and role names for batch queries
    const userEmails = [...new Set(assignments.map(a => a.userEmail))];
    const roleNames = [...new Set(assignments.map(a => a.roleName))];

    // Batch query users and roles
    const [usersData, rolesData] = await Promise.all([
      db.select({ id: users.id, email: users.email })
        .from(users)
        .where(inArray(users.email, userEmails)),
      db.select({ id: roles.id, name: roles.name })
        .from(roles)
        .where(inArray(roles.name, roleNames))
    ]);

    // Create maps for quick lookup
    const userMap = new Map(usersData.map(u => [u.email, u.id]));
    const roleMap = new Map(rolesData.map(r => [r.name, r.id]));

    // Build assignments data
    const userRolesData = assignments
      .map(assignment => {
        const userId = userMap.get(assignment.userEmail);
        const roleId = roleMap.get(assignment.roleName);
        return userId && roleId ? { userId, roleId } : null;
      })
      .filter(Boolean) as { userId: number; roleId: number }[];

    // Batch insert
    if (userRolesData.length > 0) {
      await db.insert(userRoles)
        .values(userRolesData)
        .onConflictDoNothing({ target: [userRoles.userId, userRoles.roleId] });
    }

    console.log(`✅ Successfully seeded ${userRolesData.length} user-role relationships`);
  } catch (error) {
    console.error('❌ Error seeding user-role assignments:', error);
    throw error;
  }
}

/**
 * Run seeder if called directly
 */
if (require.main === module) {
  seedUserRoles()
    .then(() => {
      console.log('🎉 User-role assignment seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 User-role assignment seeding failed:', error);
      process.exit(1);
    });
}