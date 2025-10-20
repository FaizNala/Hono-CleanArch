import { Hono } from 'hono';
import { userRoutes } from './user.routes.js';
import { roleRoutes } from './role.routes.js';
import { authRoutes } from './auth.routes.js';
import { permissionRoutes } from './permission.routes.js';

const routes = new Hono();

routes.route('/v1/auth', authRoutes);
routes.route('/v1/users', userRoutes);
routes.route('/v1/roles', roleRoutes);
routes.route('/v1/permissions', permissionRoutes);

export { routes };