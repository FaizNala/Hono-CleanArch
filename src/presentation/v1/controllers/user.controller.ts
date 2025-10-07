import type { Context } from "hono";
import { CreateUserUseCase } from "../../../core/application/use-cases/user/create.usecase.js";
import { GetUserByIdUseCase } from "../../../core/application/use-cases/user/getById.usecase.js";
import { GetAllUsersUseCase } from "../../../core/application/use-cases/user/getAll.usecase.js";
import { UpdateUserUseCase } from "../../../core/application/use-cases/user/update.usecase.js";
import { DeleteUserUseCase } from "../../../core/application/use-cases/user/delete.usecase.js";
import type { UserRepository } from "../../../core/application/repositories/user.repository.js";
import type { RoleRepository } from "../../../core/application/repositories/role.repository.js";
import type { UserRoleRepository } from "../../../core/application/repositories/userRole.repository.js";
import { success, error, STATUS } from "../../../utils/response";

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
    this.updateUserUseCase = new UpdateUserUseCase(userRepository, roleRepository, userRoleRepository);
    this.deleteUserUseCase = new DeleteUserUseCase(userRepository);
  }

  async getAllUsers(c: Context) {
    try {
      // Parse query parameters
      const preload = c.req.query("preload") === "true";
      const roleIdsParam = c.req.query("roleIds");
      const roleIds = roleIdsParam ? roleIdsParam.split(",").map(Number) : undefined;

      // Create filter object
      const filter = { preload, roleIds };

      // Execute use case with filter
      const users = await this.getAllUsersUseCase.execute(filter);
      return success(c, users);
    } catch (err) {
      console.error("Error getting all users:", err);
      return error(c, "Internal server error", STATUS.SERVER_ERROR);
    }
  }

  async getUserById(c: Context) {
    try {
      const id = c.req.param("id");
      let user;
      user = await this.getUserByIdUseCase.execute(id);
      if (!user) {
        return error(c, "User not found", STATUS.NOT_FOUND);
      }
      return success(c, user);
    } catch (err) {
      console.error("Error getting user by ID:", err);
      return error(c, "Internal server error", STATUS.SERVER_ERROR);
    }
  }

  async createUser(c: Context) {
    try {
      const body = await c.req.json();
      const { email, name, password, roleIds } = body;
      if (!email || !name || !password) {
        return error(c, 'Email, name, and password are required', STATUS.BAD_REQUEST);
      }
      const user = await this.createUserUseCase.execute(body);
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
      if (err instanceof Error) {
        if (err.message === 'User not found') {
          return error(c, 'User not found', STATUS.NOT_FOUND);
        }
        if (err.message === 'No update data provided') {
          return error(c, err.message, STATUS.BAD_REQUEST);
        }
        if (err.message.includes('Role with ID') && err.message.includes('not found')) {
          return error(c, err.message, STATUS.BAD_REQUEST);
        }
        if (err.message.includes('Invalid') || err.message.includes('must be')) {
          return error(c, err.message, STATUS.BAD_REQUEST);
        }
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
