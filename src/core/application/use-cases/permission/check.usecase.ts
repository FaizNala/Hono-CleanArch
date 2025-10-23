import type { Repositories } from '../../../../lib/types/repositories.js';
import { sql } from 'drizzle-orm';
import { permissionCache } from '../../../../lib/utils/permissionCache.js';

/**
 * Check if user has specific permission with smart caching
 */
export async function checkPermissionUseCase(
  userId: number,
  permissionName: string,
  repositories: Repositories
): Promise<boolean> {
  // 🚀 Check cache first
  const cached = permissionCache.get(userId, permissionName);
  if (cached !== null) return cached;

  // 🔍 Query database for user permissions
  const rawQuery = sql`
    SELECT DISTINCT p.name 
    FROM user_roles ur
    INNER JOIN role_permissions rp ON ur.role_id = rp.role_id
    INNER JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = ${userId}
  `;
  
  const userPermissions = await repositories.user.withRawQuery(rawQuery);
  const permissionNames = userPermissions.map((p: any) => p.name);
  
  // Cache all permissions for future requests
  permissionCache.set(userId, permissionNames);
  
  return permissionNames.includes(permissionName);
}
