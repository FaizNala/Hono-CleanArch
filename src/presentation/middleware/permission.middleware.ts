import type { Context, Next } from 'hono';
import { DrizzleUserRepository } from '../../infrastructure/repositories/drizzle.user.repository.js';
import { error, StatusCode } from '../../lib/utils/response.js';

/**
 * Permission checking middleware
 * Verifies if the authenticated user has the required permission
 */
export function requirePermission(permissionName: string) {
  return async (c: Context, next: Next) => {
    try {
      // Extract user from JWT payload (set by authMiddleware)
      const payload = c.get('jwtPayload');
      
      if (!payload || !payload.userId) {
        return error(c, 'Authentication required', StatusCode.UNAUTHORIZED);
      }

      // Get user with roles and permissions
      const userRepository = new DrizzleUserRepository();
      const user = await userRepository.findById(payload.userId) as any;

      if (!user) {
        return error(c, 'User not found', StatusCode.UNAUTHORIZED);
      }

      // Check if user has the required permission through their roles
      const hasPermission = await checkUserPermission(user, permissionName);

      if (!hasPermission) {
        return error(c, 'Insufficient permissions', StatusCode.FORBIDDEN);
      }

      // Store user permissions in context for further use
      c.set('user', user);
      c.set('userPermissions', await getUserPermissions(user));

      return next();
    } catch (err) {
      console.error('Permission check error:', err);
      return error(c, 'Permission check failed', StatusCode.SERVER_ERROR);
    }
  };
}

/**
 * Check if user has specific permission through their roles
 */
async function checkUserPermission(user: any, permissionName: string): Promise<boolean> {
  if (!user.userRoles || user.userRoles.length === 0) {
    return false;
  }

  // Get all permissions for user's roles
  const userPermissions = await getUserPermissions(user);
  
  return userPermissions.some(permission => permission.name === permissionName);
}

/**
 * Get all permissions for a user through their roles
 */
async function getUserPermissions(user: any): Promise<any[]> {
  if (!user.userRoles || user.userRoles.length === 0) {
    return [];
  }

  const { db } = await import('../../infrastructure/database/index.js');
  const { permissions, rolePermissions } = await import('../../infrastructure/database/schema.js');
  const { eq, inArray } = await import('drizzle-orm');

  // Get role IDs for the user
  const roleIds = user.userRoles.map((ur: any) => ur.role.id);

  if (roleIds.length === 0) {
    return [];
  }

  // Get all permissions for these roles
  const userPermissions = await db
    .select({
      id: permissions.id,
      name: permissions.name,
    })
    .from(permissions)
    .innerJoin(rolePermissions, eq(permissions.id, rolePermissions.permissionId))
    .where(inArray(rolePermissions.roleId, roleIds));

  return userPermissions;
}

/**
 * Optional permission checking middleware
 * Allows routes to work with or without specific permissions
 */
export function optionalPermission(permissionName: string) {
  return async (c: Context, next: Next) => {
    try {
      const payload = c.get('jwtPayload');
      
      if (payload && payload.userId) {
        const userRepository = new DrizzleUserRepository();
        const user = await userRepository.findById(payload.userId) as any;
        
        if (user) {
          const hasPermission = await checkUserPermission(user, permissionName);
          c.set('hasPermission', hasPermission);
          c.set('user', user);
          c.set('userPermissions', await getUserPermissions(user));
        }
      }

      return next();
    } catch (err) {
      console.error('Optional permission check error:', err);
      // Continue without permission for optional middleware
      return next();
    }
  };
}