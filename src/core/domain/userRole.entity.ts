// Domain Entity - Business Rules (Functional approach)
export type UserRole = {
  userId: number;
  roleId: number;
};

export type CreateUserRoleData = {
  userId: number;
  roleId: number;
};

// Factory function to create a new UserRole entity
export function createUserRole(data: CreateUserRoleData): UserRole {
  return {
    userId: data.userId,
    roleId: data.roleId,
  };
}