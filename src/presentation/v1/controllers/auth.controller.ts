import type { Context } from 'hono';
import { loginUseCase } from '../../../core/application/use-cases/auth/login.usecase.js';
import { registerUseCase } from '../../../core/application/use-cases/auth/register.usecase.js';
import type { Repositories } from '../../../lib/types/repositories.js';
import { success } from '../../../lib/utils/response.js';
import { handleError } from '../../../lib/utils/errorHandler.js';
import { LoginSchema, RegisterSchema } from '../../../lib/validation/auth.validation.js';
import { toLoginResponse, toRegisterResponse } from '../mappers/auth.mapper.js';

export function AuthController(repositories: Repositories) {
  return {
    async login(c: Context) {
      try {
        const body = await c.req.json();
        
        // Validate request body using Zod
        const validatedData = LoginSchema.parse(body);
        
        const authResponse = await loginUseCase(validatedData, repositories.user);
        return success(c, toLoginResponse(authResponse.user, authResponse.token));
      } catch (err) {
        return handleError(c, err, "login");
      }
    },

    async register(c: Context) {
      try {
        const body = await c.req.json();
        
        // Validate request body using Zod
        const validatedData = RegisterSchema.parse(body);
        
        const registerResponse = await registerUseCase(validatedData, repositories);
        return success(c, toRegisterResponse(registerResponse));
      } catch (err) {
        return handleError(c, err, "register");
      }
    },
  };
}