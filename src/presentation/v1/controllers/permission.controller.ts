import type { Context } from 'hono';
import { createPermissionUseCase } from '../../../core/application/use-cases/permission/create.usecase.js';
import { getAllPermissionsUseCase } from '../../../core/application/use-cases/permission/getAll.usecase.js';
import { getPermissionByIdUseCase } from '../../../core/application/use-cases/permission/getById.usecase.js';
import { updatePermissionUseCase } from '../../../core/application/use-cases/permission/update.usecase.js';
import { deletePermissionUseCase } from '../../../core/application/use-cases/permission/delete.usecase.js';
import type { Repositories } from '../../../lib/types/repositories.js';
import { success } from '../../../lib/utils/response.js';
import { handleError } from '../../../lib/utils/errorHandler.js';
import { getParamId } from '../../../lib/utils/requestHelper.js';
import { CreatePermissionSchema, UpdatePermissionSchema } from '../../../lib/validation/permission.validation.js';
import { toPermissionResponse } from '../mappers/permission.mapper.js';

export function PermissionController(repositories: Repositories) {
  return {
    async getAllPermissions(c: Context) {
      try {
        const permissions = await getAllPermissionsUseCase(repositories.permission);
        return success(c, permissions.map(toPermissionResponse));
      } catch (err) {
        return handleError(c, err, "getting all permissions");
      }
    },

    async getPermissionById(c: Context) {
      try {
        const id = getParamId(c);
        const permission = await getPermissionByIdUseCase(id, repositories.permission);
        return success(c, toPermissionResponse(permission));
      } catch (err) {
        return handleError(c, err, "getting permission by ID");
      }
    },

    async createPermission(c: Context) {
      try {
        const body = await c.req.json();
        
        // Validate request body using Zod
        const validatedData = CreatePermissionSchema.parse(body);
        
        const permission = await createPermissionUseCase(validatedData, repositories.permission);
        return success(c, toPermissionResponse(permission));
      } catch (err) {
        return handleError(c, err, "creating permission");
      }
    },

    async updatePermission(c: Context) {
      try {
        const id = getParamId(c);
        const body = await c.req.json();
        
        // Validate request body using Zod
        const validatedData = UpdatePermissionSchema.parse(body);
        
        const permission = await updatePermissionUseCase(id, validatedData, repositories.permission);
        return success(c, toPermissionResponse(permission));
      } catch (err) {
        return handleError(c, err, "updating permission");
      }
    },

    async deletePermission(c: Context) {
      try {
        const id = getParamId(c);
        await deletePermissionUseCase(id, repositories.permission);
        return success(c, { message: "Permission deleted successfully" });
      } catch (err) {
        return handleError(c, err, "deleting permission");
      }
    },
  };
}