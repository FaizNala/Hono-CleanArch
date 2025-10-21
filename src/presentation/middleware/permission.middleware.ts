import type { Context, Next } from 'hono';
import { error, StatusCode } from '../../lib/utils/response.js';
import { checkPermissionUseCase } from '../../core/application/use-cases/permission/check.usecase.js';
import type { Repositories } from '../../lib/types/repositories.js';
import { DrizzleUserRepository } from '../../infrastructure/repositories/drizzle.user.repository.js';
import { DrizzleRoleRepository } from '../../infrastructure/repositories/drizzle.role.repository.js';
import { DrizzleUserRoleRepository } from '../../infrastructure/repositories/drizzle.userRole.repository.js';
import { DrizzlePermissionRepository } from '../../infrastructure/repositories/drizzle.permission.repository.js';
import { DrizzleRolePermissionRepository } from '../../infrastructure/repositories/drizzle.rolePermission.repository.js';

// Initialize repositories for permission checks
const repositories: Repositories = {
  user: new DrizzleUserRepository(),
  role: new DrizzleRoleRepository(),
  userRole: new DrizzleUserRoleRepository(),
  permission: new DrizzlePermissionRepository(),
  rolePermission: new DrizzleRolePermissionRepository(),
};

/**
 * Optimized permission checking middleware
 * Uses direct existence query for better performance
 */
export function requirePermission(permissionName: string) {
  return async (c: Context, next: Next) => {
    try {
      // Extract user from JWT payload (set by authMiddleware)
      const payload = c.get('jwtPayload');
      
      if (!payload || !payload.userId) {
        return error(c, 'Authentication required', StatusCode.UNAUTHORIZED);
      }

      // Optimized permission check - single query
      const hasPermission = await checkPermissionUseCase(
        payload.userId,
        permissionName,
        repositories
      );

      if (!hasPermission) {
        return error(c, 'Insufficient permissions', StatusCode.FORBIDDEN);
      }

      // Store user ID in context for controllers
      c.set('userId', payload.userId);

      return next();
    } catch (err) {
      console.error('Permission check error:', err);
      return error(c, 'Permission check failed', StatusCode.SERVER_ERROR);
    }
  };
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
        const hasPermission = await checkPermissionUseCase(
          payload.userId,
          permissionName,
          repositories
        );
        
        c.set('hasPermission', hasPermission);
        c.set('userId', payload.userId);
      }

      return next();
    } catch (err) {
      console.error('Optional permission check error:', err);
      // Continue without permission for optional middleware
      return next();
    }
  };
}