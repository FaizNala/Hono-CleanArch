import { CreateUserSchema, UpdateUserSchema } from "../../lib/validation/user.validation.js";
import type { CreateUserData, UpdateUserData } from "../../lib/validation/user.validation.js";

// Domain Entity - Business Rules (Functional approach with Zod validation)
export type User = {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

// Re-export validation types
export type { CreateUserData, UpdateUserData };

// Factory function to create a new User entity with validation
export function createUser(data: CreateUserData): Pick<User, "email" | "name" | "password"> {
  // Validate using Zod schema
  const validatedData = CreateUserSchema.parse(data);
  
  return {
    email: validatedData.email,
    name: validatedData.name,
    password: validatedData.password,
  };
}

// Function to update user details with validation
export function updateUser(currentUser: User, data: UpdateUserData): User {
  // Validate using Zod schema
  const validatedData = UpdateUserSchema.parse(data);
  
  return {
    ...currentUser,
    email: validatedData.email ?? currentUser.email,
    name: validatedData.name ?? currentUser.name,
    password: validatedData.password ?? currentUser.password,
    updatedAt: new Date(),
  };
}
