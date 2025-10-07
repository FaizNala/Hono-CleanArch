import { Hono } from 'hono';
import { UserController } from '../controllers/user.controller.js';
import { DrizzleUserRepository } from '../../../infrastructure/repositories/user.drizzle.repository.js';
import { DrizzleRoleRepository } from '../../../infrastructure/repositories/role.drizzle.repository.js';
import { DrizzleUserRoleRepository } from '../../../infrastructure/repositories/userRole.drizzle.repository.js';

// Create router
const userRoutes = new Hono();

// Initialize dependencies
const userRepository = new DrizzleUserRepository();
const roleRepository = new DrizzleRoleRepository();
const userRoleRepository = new DrizzleUserRoleRepository();
const userController = new UserController(userRepository, roleRepository, userRoleRepository);

// Routes
userRoutes.get('/', (c) => userController.getAllUsers(c));
userRoutes.get('/:id', (c) => userController.getUserById(c));
userRoutes.post('/', (c) => userController.createUser(c));
userRoutes.put('/:id', (c) => userController.updateUser(c));
userRoutes.delete('/:id', (c) => userController.deleteUser(c));

export { userRoutes };
