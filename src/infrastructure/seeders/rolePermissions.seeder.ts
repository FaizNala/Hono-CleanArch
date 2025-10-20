import { db } from '../database/index.js';
import { roles, permissions, rolePermissions } from '../database/schema.js';
import { inArray } from 'drizzle-orm';

/**
 * Assign permissions to roles seeder
 * Creates initial role-permission assignments
 */
export async function seedRolePermissions() {
  console.log('🌱 Seeding role-permission assignments...');

  try {
    // Define assignments
    const assignments = [
      {
        roleName: 'Super Admin',
        permissions: [
          'users.view', 'users.create', 'users.update', 'users.delete', 'users.viewOwn',
          'roles.view', 'roles.create', 'roles.update', 'roles.delete', 'roles.viewOwn',
          'permissions.view', 'permissions.create', 'permissions.update', 'permissions.delete', 'permissions.viewOwn'
        ]
      },
    ];

    // Collect unique role names and permission names for batch queries
    const roleNames = [...new Set(assignments.map(a => a.roleName))];
    const permissionNames = [...new Set(assignments.flatMap(a => a.permissions))];

    // Batch query roles and permissions
    const [rolesData, permissionsData] = await Promise.all([
      db.select({ id: roles.id, name: roles.name })
        .from(roles)
        .where(inArray(roles.name, roleNames)),
      db.select({ id: permissions.id, name: permissions.name })
        .from(permissions)
        .where(inArray(permissions.name, permissionNames))
    ]);

    // Create maps for quick lookup
    const roleMap = new Map(rolesData.map(r => [r.name, r.id]));
    const permissionMap = new Map(permissionsData.map(p => [p.name, p.id]));

    // Build assignments data
    const rolePermissionsData = assignments
      .flatMap(assignment => {
        const roleId = roleMap.get(assignment.roleName);
        return roleId ? assignment.permissions.map(permName => {
          const permissionId = permissionMap.get(permName);
          return permissionId ? { roleId, permissionId } : null;
        }).filter(Boolean) : [];
      })
      .filter(Boolean) as { roleId: number; permissionId: number }[];

    // Batch insert
    if (rolePermissionsData.length > 0) {
      await db.insert(rolePermissions)
        .values(rolePermissionsData)
        .onConflictDoNothing({ target: [rolePermissions.roleId, rolePermissions.permissionId] });
    }

    console.log(`✅ Successfully seeded ${rolePermissionsData.length} role-permission relationships`);
  } catch (error) {
    console.error('❌ Error seeding role-permission assignments:', error);
    throw error;
  }
}

/**
 * Run seeder if called directly
 */
if (require.main === module) {
  seedRolePermissions()
    .then(() => {
      console.log('🎉 Role-permission assignment seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Role-permission assignment seeding failed:', error);
      process.exit(1);
    });
}