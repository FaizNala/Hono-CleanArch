import type { Context } from 'hono';
import { CreateRoleUseCase } from '../../../core/application/use-cases/role/create.usecase.js';
import { GetAllRolesUseCase } from '../../../core/application/use-cases/role/getAll.usecase.js';
import { GetRoleByIdUseCase } from '../../../core/application/use-cases/role/getById.usecase.js';
import { UpdateRoleUseCase } from '../../../core/application/use-cases/role/update.usecase.js';
import { DeleteRoleUseCase } from '../../../core/application/use-cases/role/delete.usecase.js';
import { DrizzleRoleRepository } from '../../../infrastructure/repositories/drizzle-role.repository.js';
import { success, error, STATUS } from '../../../utils/response.js';

const roleRepository = new DrizzleRoleRepository();

export class RoleController {
  static async create(c: Context) {
    try {
      const roleData = await c.req.json();
      const createRoleUseCase = new CreateRoleUseCase(roleRepository);
      const role = await createRoleUseCase.execute(roleData);
      return success(c, role, STATUS.CREATED);
    } catch (err) {
      return error(c, err instanceof Error ? err.message : 'Failed to create role');
    }
  }

  static async getAll(c: Context) {
    try {
      const getAllRolesUseCase = new GetAllRolesUseCase(roleRepository);
      const roles = await getAllRolesUseCase.execute();
      return success(c, roles);
    } catch (err) {
      return error(c, err instanceof Error ? err.message : 'Failed to get roles');
    }
  }

  static async getById(c: Context) {
    try {
      const id = parseInt(c.req.param('id'));
      if (isNaN(id)) {
        return error(c, 'Invalid role ID');
      }
      
      const getRoleByIdUseCase = new GetRoleByIdUseCase(roleRepository);
      const role = await getRoleByIdUseCase.execute(id);
      return success(c, role);
    } catch (err) {
      return error(c, err instanceof Error ? err.message : 'Failed to get role');
    }
  }

  static async update(c: Context) {
    try {
      const id = parseInt(c.req.param('id'));
      if (isNaN(id)) {
        return error(c, 'Invalid role ID');
      }
      
      const roleData = await c.req.json();
      const updateRoleUseCase = new UpdateRoleUseCase(roleRepository);
      const role = await updateRoleUseCase.execute(id, roleData);
      return success(c, role);
    } catch (err) {
      return error(c, err instanceof Error ? err.message : 'Failed to update role');
    }
  }

  static async delete(c: Context) {
    try {
      const id = parseInt(c.req.param('id'));
      if (isNaN(id)) {
        return error(c, 'Invalid role ID');
      }
      
      const deleteRoleUseCase = new DeleteRoleUseCase(roleRepository);
      const result = await deleteRoleUseCase.execute(id);
      return success(c, result);
    } catch (err) {
      return error(c, err instanceof Error ? err.message : 'Failed to delete role');
    }
  }
}