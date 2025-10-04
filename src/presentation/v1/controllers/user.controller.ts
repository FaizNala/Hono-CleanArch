import type { Context } from 'hono';
import { CreateUserUseCase } from '../../../core/application/use-cases/user/create-user.usecase.js';
import { GetUserByIdUseCase } from '../../../core/application/use-cases/user/get-user-by-id.usecase.js';
import { GetAllUsersUseCase } from '../../../core/application/use-cases/user/get-all-users.usecase.js';
import { UpdateUserUseCase } from '../../../core/application/use-cases/user/update-user.usecase.js';
import { DeleteUserUseCase } from '../../../core/application/use-cases/user/delete-user.usecase.js';
import type { UserRepository } from '../../../core/application/repositories/user.repository.js';

export class UserController {
  private createUserUseCase: CreateUserUseCase;
  private getUserByIdUseCase: GetUserByIdUseCase;
  private getAllUsersUseCase: GetAllUsersUseCase;
  private updateUserUseCase: UpdateUserUseCase;
  private deleteUserUseCase: DeleteUserUseCase;

  constructor(userRepository: UserRepository) {
    this.createUserUseCase = new CreateUserUseCase(userRepository);
    this.getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
    this.getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
    this.updateUserUseCase = new UpdateUserUseCase(userRepository);
    this.deleteUserUseCase = new DeleteUserUseCase(userRepository);
  }

  async getAllUsers(c: Context) {
    try {
      const users = await this.getAllUsersUseCase.execute();
      return c.json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error('Error getting all users:', error);
      return c.json({
        success: false,
        error: 'Internal server error',
      }, 500);
    }
  }

  async getUserById(c: Context) {
    try {
      const id = c.req.param('id');
      const user = await this.getUserByIdUseCase.execute(id);
      
      return c.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Error getting user by ID:', error);
      
      if (error instanceof Error && error.message === 'User not found') {
        return c.json({
          success: false,
          error: 'User not found',
        }, 404);
      }
      
      return c.json({
        success: false,
        error: 'Internal server error',
      }, 500);
    }
  }

  async createUser(c: Context) {
    try {
      const body = await c.req.json();
      const { email, name } = body;

      if (!email || !name) {
        return c.json({
          success: false,
          error: 'Email and name are required',
        }, 400);
      }

      const user = await this.createUserUseCase.execute({ email, name });
      
      return c.json({
        success: true,
        data: user,
      }, 201);
    } catch (error) {
      console.error('Error creating user:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          return c.json({
            success: false,
            error: error.message,
          }, 409);
        }
        
        if (error.message.includes('Invalid') || error.message.includes('must be')) {
          return c.json({
            success: false,
            error: error.message,
          }, 400);
        }
      }
      
      return c.json({
        success: false,
        error: 'Internal server error',
      }, 500);
    }
  }

  async updateUser(c: Context) {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const updated = await this.updateUserUseCase.execute(id, body);
      return c.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      if (error instanceof Error && error.message === 'User not found') {
        return c.json({ success: false, error: 'User not found' }, 404);
      }
      if (error instanceof Error && error.message === 'No update data provided') {
        return c.json({ success: false, error: error.message }, 400);
      }
      return c.json({ success: false, error: 'Internal server error' }, 500);
    }
  }

  async deleteUser(c: Context) {
    try {
      const id = c.req.param('id');
      await this.deleteUserUseCase.execute(id);
      return c.json({ success: true, message: 'User deleted' });
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return c.json({ success: false, error: error.message }, 404);
      }
      return c.json({ success: false, error: 'Internal server error' }, 500);
    }
  }
}
