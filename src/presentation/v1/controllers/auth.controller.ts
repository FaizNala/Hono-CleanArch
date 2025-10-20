import type { Context } from 'hono';
import { loginUseCase } from '../../../core/application/use-cases/auth/login.usecase.js';
import { registerUseCase } from '../../../core/application/use-cases/auth/register.usecase.js';
import type { Repositories } from '../../../lib/types/repositories.js';
import { success } from '../../../lib/utils/response.js';
import { handleError } from '../../../lib/utils/errorHandler.js';
import { LoginSchema, RegisterSchema } from '../../../lib/validation/auth.validation.js';

export function AuthController(repositories: Repositories) {
  return {
    async login(c: Context) {
      try {
        const body = await c.req.json();
        
        // Validate request body using Zod
        const validatedData = LoginSchema.parse(body);
        
        const authResponse = await loginUseCase(validatedData, repositories.user);
        return success(c, authResponse);
      } catch (err) {
        return handleError(c, err, "login");
      }
    },

    async register(c: Context) {
      try {
        const body = await c.req.json();
        
        // Validate request body using Zod
        const validatedData = RegisterSchema.parse(body);
        
        const authResponse = await registerUseCase(validatedData, repositories);
        return success(c, authResponse);
      } catch (err) {
        return handleError(c, err, "register");
      }
    },
  };
}