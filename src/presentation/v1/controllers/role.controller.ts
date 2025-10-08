import type { Context } from 'hono';
import { createRoleUseCase } from '../../../core/application/use-cases/role/create.usecase.js';
import { getAllRolesUseCase } from '../../../core/application/use-cases/role/getAll.usecase.js';
import { getRoleByIdUseCase } from '../../../core/application/use-cases/role/getById.usecase.js';
import { updateRoleUseCase } from '../../../core/application/use-cases/role/update.usecase.js';
import { deleteRoleUseCase } from '../../../core/application/use-cases/role/delete.usecase.js';
import type { RoleRepository } from '../../../core/application/repositories/role.repository.js';
import { success } from '../../../lib/utils/response.js';
import { handleError } from '../../../lib/utils/errorHandler.js';
import { getNumericParamId } from '../../../lib/utils/requestHelper.js';
import { CreateRoleSchema, UpdateRoleSchema } from '../../../lib/validation/role.validation.js';

export function RoleController(roleRepository: RoleRepository) {
  return {
    async create(c: Context) {
      try {
        const body = await c.req.json();
        
        // Validate request body using Zod
        const validatedData = CreateRoleSchema.parse(body);
        
        const role = await createRoleUseCase(validatedData, roleRepository);
        return success(c, role);
      } catch (err) {
        return handleError(c, err, "creating role");
      }
    },

    async getAll(c: Context) {
      try {
        const roles = await getAllRolesUseCase(roleRepository);
        return success(c, roles);
      } catch (err) {
        return handleError(c, err, "getting all roles");
      }
    },

    async getById(c: Context) {
      try {
        const id = getNumericParamId(c);
        const role = await getRoleByIdUseCase(id, roleRepository);
        return success(c, role);
      } catch (err) {
        return handleError(c, err, "getting role by ID");
      }
    },

    async update(c: Context) {
      try {
        const id = getNumericParamId(c);
        const body = await c.req.json();
        
        // Validate request body using Zod
        const validatedData = UpdateRoleSchema.parse(body);
        
        const role = await updateRoleUseCase(id, validatedData, roleRepository);
        return success(c, role);
      } catch (err) {
        return handleError(c, err, "updating role");
      }
    },

    async delete(c: Context) {
      try {
        const id = getNumericParamId(c);
        const result = await deleteRoleUseCase(id, roleRepository);
        return success(c, result);
      } catch (err) {
        return handleError(c, err, "deleting role");
      }
    }
  };
}