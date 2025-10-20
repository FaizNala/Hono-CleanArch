import { Hono } from 'hono';
import { UserController } from '../v1/controllers/user.controller.js';
import { DrizzleUserRepository } from '../../infrastructure/repositories/drizzle.user.repository.js';
import { DrizzleRoleRepository } from '../../infrastructure/repositories/drizzle.role.repository.js';
import { DrizzleUserRoleRepository } from '../../infrastructure/repositories/drizzle.userRole.repository.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/permission.middleware.js';
import type { Repositories } from '../../lib/types/repositories.js';
import type { AuthVariables } from '../middleware/auth.middleware.js';

// Create router with Auth Variables
const userRoutes = new Hono<{ Variables: AuthVariables }>();

// Initialize only needed repositories using Partial
const repositories: Partial<Repositories> = {
  user: new DrizzleUserRepository(),
  role: new DrizzleRoleRepository(),
  userRole: new DrizzleUserRoleRepository(),
};

// Cast to full Repositories jika controller membutuhkannya
const userController = UserController(repositories as Repositories);

// Apply auth middleware to all routes
userRoutes.use('*', authMiddleware);

// Routes with permission-based access control
userRoutes.get('/', requirePermission('users.view'), (c) => userController.getAllUsers(c));
userRoutes.get('/:id', requirePermission('users.view'), (c) => userController.getUserById(c));
userRoutes.post('/', requirePermission('users.create'), (c) => userController.createUser(c));
userRoutes.put('/:id', requirePermission('users.update'), (c) => userController.updateUser(c));
userRoutes.delete('/:id', requirePermission('users.delete'), (c) => userController.deleteUser(c));

export { userRoutes };