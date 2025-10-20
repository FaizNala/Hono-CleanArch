// Domain Entity - Business Rules (Functional approach, tanpa validasi Zod)
export type User = {
  id: number;
  email: string;
  name: string;
  password: string;
};

export type CreateUserData = {
  email: string;
  name: string;
  password: string;
  roleIds?: number[];
};

export type UpdateUserData = {
  email?: string;
  name?: string;
  password?: string;
  roleIds?: number[];
};

// Factory function to create a new User entity (data sudah pasti valid dari controller)
export function createUser(data: CreateUserData): Pick<User, "email" | "name" | "password"> {
  return {
    email: data.email,
    name: data.name,
    password: data.password,
  };
}

// Function to update user details (data sudah pasti valid dari controller)
export function updateUser(currentUser: User, data: UpdateUserData): User {
  return {
    ...currentUser,
    email: data.email ?? currentUser.email,
    name: data.name ?? currentUser.name,
    password: data.password ?? currentUser.password,
  };
}
