import type { Context } from "hono";
import { createUserUseCase } from "../../../core/application/use-cases/user/create.usecase.js";
import { getUserByIdUseCase } from "../../../core/application/use-cases/user/getById.usecase.js";
import { getAllUsersUseCase } from "../../../core/application/use-cases/user/getAll.usecase.js";
import { updateUserUseCase } from "../../../core/application/use-cases/user/update.usecase.js";
import { deleteUserUseCase } from "../../../core/application/use-cases/user/delete.usecase.js";
import { success } from "../../../lib/utils/response.js";
import { handleError } from "../../../lib/utils/errorHandler.js";
import { parseQueryParams, getParamId } from "../../../lib/utils/requestHelper.js";
import { CreateUserSchema, UpdateUserSchema } from "../../../lib/validation/user.validation.js";
import type { Repositories } from "../../../lib/types/repositories.js";
import { toUserResponse } from "../mappers/user.mapper.js";

export function UserController(repositories: Repositories) {
  return {
    async getAllUsers(c: Context) {
      try {
        const filter = parseQueryParams(c);
        const users = await getAllUsersUseCase(filter, repositories.user);
        return success(c, users.map(toUserResponse));
      } catch (err) {
        return handleError(c, err, "getting all users");
      }
    },

    async getUserById(c: Context) {
      try {
        const id = getParamId(c);
        const user = await getUserByIdUseCase(id, repositories.user);
        return success(c, toUserResponse(user));
      } catch (err) {
        return handleError(c, err, "getting user by ID");
      }
    },

    async createUser(c: Context) {
      try {
        const body = await c.req.json();
        
        // Validate request body using Zod
        const validatedData = CreateUserSchema.parse(body);
        
        const user = await createUserUseCase(validatedData, repositories);
        return success(c, toUserResponse(user));
      } catch (err) {
        return handleError(c, err, "creating user");
      }
    },

    async updateUser(c: Context) {
      try {
        const id = getParamId(c);
        const body = await c.req.json();
        
        // Validate request body using Zod
        const validatedData = UpdateUserSchema.parse(body);
        
        const updated = await updateUserUseCase(id, validatedData, repositories);
        return success(c, toUserResponse(updated));
      } catch (err) {
        return handleError(c, err, "updating user");
      }
    },

    async deleteUser(c: Context) {
      try {
        const id = getParamId(c);
        await deleteUserUseCase(id, repositories.user);
        return success(c, { message: "User deleted successfully" });
      } catch (err) {
        return handleError(c, err, "deleting user");
      }
    },
  };
}
