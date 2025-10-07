import { Hono } from 'hono';
import { RoleController } from '../controllers/role.controller.js';
import { DrizzleRoleRepository } from '../../../infrastructure/repositories/drizzle.role.repository.js';

const roleRoutes = new Hono();

// Initialize dependencies
const roleRepository = new DrizzleRoleRepository();
const roleController = RoleController(roleRepository);

roleRoutes.post('/', (c) => roleController.create(c));
roleRoutes.get('/', (c) => roleController.getAll(c));
roleRoutes.get('/:id', (c) => roleController.getById(c));
roleRoutes.put('/:id', (c) => roleController.update(c));
roleRoutes.delete('/:id', (c) => roleController.delete(c));

export { roleRoutes };