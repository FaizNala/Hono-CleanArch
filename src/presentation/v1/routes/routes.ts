import { Hono } from 'hono';
import { userRoutes } from './user.routes.js';
import { roleRoutes } from './role.routes.js';

const routes = new Hono();

routes.route('/v1/users', userRoutes);
routes.route('/v1/roles', roleRoutes);

export { routes };