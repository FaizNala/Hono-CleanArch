import type { Context } from 'hono';
import { createRoleUseCase } from '../../../core/application/use-cases/role/create.usecase.js';
import { getAllRolesUseCase } from '../../../core/application/use-cases/role/getAll.usecase.js';
import { getRoleByIdUseCase } from '../../../core/application/use-cases/role/getById.usecase.js';
import { updateRoleUseCase } from '../../../core/application/use-cases/role/update.usecase.js';
import { deleteRoleUseCase } from '../../../core/application/use-cases/role/delete.usecase.js';
import type { Repositories } from '../../../lib/types/repositories.js';
import { success } from '../../../lib/utils/response.js';
import { handleError } from '../../../lib/utils/errorHandler.js';
import { getParamId } from '../../../lib/utils/requestHelper.js';
import { CreateRoleSchema, UpdateRoleSchema } from '../../../lib/validation/role.validation.js';
import { toRoleResponse } from '../mappers/role.mapper.js'; 

export function RoleController(repositories: Repositories) {
  return {
    async getAllRoles(c: Context) {
      try {
        const roles = await getAllRolesUseCase(repositories.role);
        return success(c, roles.map(toRoleResponse));
      } catch (err) {
        return handleError(c, err, "getting all roles");
      }
    },

    async getByRoleId(c: Context) {
      try {
        const id = getParamId(c);
        const role = await getRoleByIdUseCase(id, repositories.role);
        return success(c, toRoleResponse(role));
      } catch (err) {
        return handleError(c, err, "getting role by ID");
      }
    },

    async createRole(c: Context) {
      try {
        const body = await c.req.json();
        
        // Validate request body using Zod
        const validatedData = CreateRoleSchema.parse(body);
        
        const role = await createRoleUseCase(validatedData, repositories);
        return success(c, toRoleResponse(role));
      } catch (err) {
        return handleError(c, err, "creating role");
      }
    },


    async updateRole(c: Context) {
      try {
        const id = getParamId(c);
        const body = await c.req.json();
        
        // Validate request body using Zod
        const validatedData = UpdateRoleSchema.parse(body);
        
        const role = await updateRoleUseCase(id, validatedData, repositories);
        return success(c, toRoleResponse(role));
      } catch (err) {
        return handleError(c, err, "updating role");
      }
    },

    async deleteRole(c: Context) {
      try {
        const id = getParamId(c);
        await deleteRoleUseCase(id, repositories.role);
        return success(c, { message: "Role deleted successfully" });
      } catch (err) {
        return handleError(c, err, "deleting role");
      }
    }
  };
}