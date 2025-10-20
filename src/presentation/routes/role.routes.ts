import { Hono } from 'hono';
import { RoleController } from '../v1/controllers/role.controller.js';
import { DrizzleRoleRepository } from '../../infrastructure/repositories/drizzle.role.repository.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import type { AuthVariables } from '../middleware/auth.middleware.js';

const roleRoutes = new Hono<{ Variables: AuthVariables }>();

// Initialize dependencies
const roleRepository = new DrizzleRoleRepository();
const roleController = RoleController(roleRepository);

// Apply auth middleware to all routes
roleRoutes.use('*', authMiddleware);

// Routes (all protected)
roleRoutes.post('/', (c) => roleController.createRole(c));
roleRoutes.get('/', (c) => roleController.getAllRoles(c));
roleRoutes.get('/:id', (c) => roleController.getByRoleId(c));
roleRoutes.put('/:id', (c) => roleController.updateRole(c));
roleRoutes.delete('/:id', (c) => roleController.deleteRole(c));

export { roleRoutes };