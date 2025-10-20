import { jwt } from 'hono/jwt';
import type { JwtVariables } from 'hono/jwt';
import type { Context, Next } from 'hono';
import { getJWTSecret } from '../../lib/utils/jwt.js';

/**
 * JWT Authentication Middleware
 * Protects routes by verifying JWT tokens
 */

export const authMiddleware = (c: Context, next: Next) => {
  const jwtMiddleware = jwt({
    secret: getJWTSecret(),
  });
  return jwtMiddleware(c, next);
};

/**
 * Optional Authentication Middleware
 * Allows routes to work with or without authentication
 */
export const optionalAuthMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // If token exists, validate it
    return authMiddleware(c, next);
  }
  
  // If no token, continue without authentication
  return next();
};


/**
 * Type definition for JWT Variables
 */
export type AuthVariables = JwtVariables;