import type { Context } from 'hono';
import { CreateUserUseCase } from '../../../core/application/use-cases/user/create-user.usecase.js';
import { GetUserByIdUseCase } from '../../../core/application/use-cases/user/get-user-by-id.usecase.js';
import { GetAllUsersUseCase } from '../../../core/application/use-cases/user/get-all-users.usecase.js';
import { UpdateUserUseCase } from '../../../core/application/use-cases/user/update-user.usecase.js';
import { DeleteUserUseCase } from '../../../core/application/use-cases/user/delete-user.usecase.js';
import type { UserRepository } from '../../../core/application/repositories/user.repository.js';
import type { RoleRepository } from '../../../core/application/repositories/role.repository.js';
import type { UserRoleRepository } from '../../../core/application/repositories/user-role.repository.js';
import { success, error, STATUS } from '../../../utils/response';

export class UserController {
  private createUserUseCase: CreateUserUseCase;
  private getUserByIdUseCase: GetUserByIdUseCase;
  private getAllUsersUseCase: GetAllUsersUseCase;
  private updateUserUseCase: UpdateUserUseCase;
  private deleteUserUseCase: DeleteUserUseCase;
  public userRepository: UserRepository;

  constructor(
    userRepository: UserRepository,
    roleRepository?: RoleRepository,
    userRoleRepository?: UserRoleRepository
  ) {
    this.userRepository = userRepository;
    this.createUserUseCase = new CreateUserUseCase(userRepository, roleRepository, userRoleRepository);
    this.getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
    this.getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
    this.updateUserUseCase = new UpdateUserUseCase(userRepository);
    this.deleteUserUseCase = new DeleteUserUseCase(userRepository);
  }

  async getAllUsers(c: Context) {
    try {
      const preload = c.req.query('preload') === 'true';
      if (preload && typeof this.userRepository.findByIdWithRoles === 'function') {
        // Ambil semua user dan preload roles
        const users = await this.getAllUsersUseCase.execute();
        const usersWithRoles = await Promise.all(users.map(async (u) => {
          return await this.userRepository.findByIdWithRoles(u.id);
        }));
        return success(c, usersWithRoles);
      } else {
        const users = await this.getAllUsersUseCase.execute();
        return success(c, users);
      }
    } catch (err) {
      console.error('Error getting all users:', err);
      return error(c, 'Internal server error', STATUS.SERVER_ERROR);
    }
  }

  async getUserById(c: Context) {
    try {
      const id = c.req.param('id');
      const preload = c.req.query('preload') === 'true';
      let user;
      if (preload && typeof this.userRepository.findByIdWithRoles === 'function') {
        user = await this.userRepository.findByIdWithRoles(id);
      } else {
        user = await this.getUserByIdUseCase.execute(id);
      }
      if (!user) {
        return error(c, 'User not found', STATUS.NOT_FOUND);
      }
      return success(c, user);
    } catch (err) {
      console.error('Error getting user by ID:', err);
      return error(c, 'Internal server error', STATUS.SERVER_ERROR);
    }
  }

  async createUser(c: Context) {
    try {
      const body = await c.req.json();
      const { email, name, password, roleIds } = body;
      if (!email || !name || !password) {
        return error(c, 'Email, name, and password are required', STATUS.BAD_REQUEST);
      }
      const user = await this.createUserUseCase.execute({ email, name, password, roleIds });
      return success(c, user, STATUS.CREATED);
    } catch (err) {
      console.error('Error creating user:', err);
      if (err instanceof Error) {
        if (err.message.includes('already exists')) {
          return error(c, err.message, STATUS.CONFLICT);
        }
        if (err.message.includes('Invalid') || err.message.includes('must be') || err.message.includes('not found')) {
          return error(c, err.message, STATUS.BAD_REQUEST);
        }
      }
      return error(c, 'Internal server error', STATUS.SERVER_ERROR);
    }
  }

  async updateUser(c: Context) {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const updated = await this.updateUserUseCase.execute(id, body);
      return success(c, updated);
    } catch (err) {
      console.error('Error updating user:', err);
      if (err instanceof Error && err.message === 'User not found') {
        return error(c, 'User not found', STATUS.NOT_FOUND);
      }
      if (err instanceof Error && err.message === 'No update data provided') {
        return error(c, err.message, STATUS.BAD_REQUEST);
      }
      return error(c, 'Internal server error', STATUS.SERVER_ERROR);
    }
  }

  async deleteUser(c: Context) {
    try {
      const id = c.req.param('id');
      await this.deleteUserUseCase.execute(id);
      return success(c, { message: 'User deleted' });
    } catch (err) {
      console.error('Error deleting user:', err);
      if (err instanceof Error && err.message.includes('not found')) {
        return error(c, err.message, STATUS.NOT_FOUND);
      }
      return error(c, 'Internal server error', STATUS.SERVER_ERROR);
    }
  }
}
