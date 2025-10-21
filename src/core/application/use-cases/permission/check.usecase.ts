import type { Repositories } from '../../../../lib/types/repositories.js';
import { sql, eq, and } from 'drizzle-orm';
import { permissionCache } from '../../../../lib/utils/permissionCache.js';

/**
 * Ultra-optimized permission check with smart caching
 * Performance: ~1-5ms (cached) or ~5-20ms (DB query)
 */
export async function checkPermissionUseCase(
  userId: number,
  permissionName: string,
  repositories: Repositories
): Promise<boolean> {
  const startTime = performance.now();
  
  try {
    // 🚀 Try cache first (sub-millisecond)
    const cached = permissionCache.get(userId, permissionName);
    if (cached !== null) {
      const endTime = performance.now();
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ Cached permission check for user ${userId}: ${(endTime - startTime).toFixed(2)}ms`);
      }
      return cached;
    }

    // Import schemas
    const { db } = await import('../../../../infrastructure/database/index.js');
    const { userRoles, rolePermissions, permissions } = await import('../../../../infrastructure/database/schema.js');

    // Get all user permissions for caching
    const userPermissions = await db
      .select({ name: permissions.name })
      .from(userRoles)
      .innerJoin(rolePermissions, eq(userRoles.roleId, rolePermissions.roleId))
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(userRoles.userId, userId));

    const permissionNames = userPermissions.map(p => p.name);
    const hasPermission = permissionNames.includes(permissionName);

    // Cache all user permissions for future requests
    permissionCache.set(userId, permissionNames);

    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Log performance for optimization monitoring
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 DB permission check for user ${userId} (cached ${permissionNames.length} permissions): ${duration.toFixed(2)}ms`);
    }

    return hasPermission;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.error(`❌ Permission check failed (${duration.toFixed(2)}ms):`, error);
    throw error;
  }
}
