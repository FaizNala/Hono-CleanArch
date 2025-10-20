import { Hono } from 'hono';
import { RoleController } from '../v1/controllers/role.controller.js';
import { DrizzleRoleRepository } from '../../infrastructure/repositories/drizzle.role.repository.js';
import { DrizzlePermissionRepository } from '../../infrastructure/repositories/drizzle.permission.repository.js';
import { DrizzleRolePermissionRepository } from '../../infrastructure/repositories/drizzle.rolePermission.repository.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/permission.middleware.js';
import type { Repositories } from '../../lib/types/repositories.js';
import type { AuthVariables } from '../middleware/auth.middleware.js';

const roleRoutes = new Hono<{ Variables: AuthVariables }>();

// Initialize dependencies
const repositories: Partial<Repositories> = {
  role: new DrizzleRoleRepository(),
  permission: new DrizzlePermissionRepository(),
  rolePermission: new DrizzleRolePermissionRepository(),
};

const roleController = RoleController(repositories as Repositories);

// Apply auth middleware to all routes
roleRoutes.use('*', authMiddleware);

// Routes with permission-based access control
roleRoutes.post('/', requirePermission('roles.create'), (c) => roleController.createRole(c));
roleRoutes.get('/', requirePermission('roles.view'), (c) => roleController.getAllRoles(c));
roleRoutes.get('/:id', requirePermission('roles.view'), (c) => roleController.getByRoleId(c));
roleRoutes.put('/:id', requirePermission('roles.update'), (c) => roleController.updateRole(c));
roleRoutes.delete('/:id', requirePermission('roles.delete'), (c) => roleController.deleteRole(c));

export { roleRoutes };