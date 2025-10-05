import { Hono } from 'hono';
import { RoleController } from '../controllers/role.controller.js';

const roleRoutes = new Hono();

roleRoutes.post('/', RoleController.create);
roleRoutes.get('/', RoleController.getAll);
roleRoutes.get('/:id', RoleController.getById);
roleRoutes.put('/:id', RoleController.update);
roleRoutes.delete('/:id', RoleController.delete);

export { roleRoutes };