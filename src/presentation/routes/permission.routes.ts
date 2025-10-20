import { Hono } from 'hono';
import { PermissionController } from '../v1/controllers/permission.controller.js';
import { DrizzlePermissionRepository } from '../../infrastructure/repositories/drizzle.permission.repository.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/permission.middleware.js';
import type { Repositories } from '../../lib/types/repositories.js';
import type { AuthVariables } from '../middleware/auth.middleware.js';

const permissionRoutes = new Hono<{ Variables: AuthVariables }>();

// Initialize dependencies
const repositories: Partial<Repositories> = {
  permission: new DrizzlePermissionRepository(),
};

const permissionController = PermissionController(repositories as Repositories);

// Apply auth middleware to all routes
permissionRoutes.use('*', authMiddleware);

// Permission CRUD routes (require system admin permission)
permissionRoutes.post('/', requirePermission('permissions.create'), (c) => permissionController.createPermission(c));
permissionRoutes.get('/', requirePermission('permissions.view'), (c) => permissionController.getAllPermissions(c));
permissionRoutes.get('/:id', requirePermission('permissions.view'), (c) => permissionController.getPermissionById(c));
permissionRoutes.put('/:id', requirePermission('permissions.update'), (c) => permissionController.updatePermission(c));
permissionRoutes.delete('/:id', requirePermission('permissions.delete'), (c) => permissionController.deletePermission(c));

export { permissionRoutes };