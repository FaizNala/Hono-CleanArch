// Domain Entity - Business Rules (Functional approach)
export type UserRole = {
  userId: string;
  roleId: number;
};

export type CreateUserRoleData = {
  userId: string;
  roleId: number;
};

// Validation functions
export function validateUserId(userId: string): void {
  if (!userId || userId.trim().length === 0) {
    throw new Error("User ID is required");
  }
}

export function validateRoleId(roleId: number): void {
  if (!roleId || roleId <= 0) {
    throw new Error("Role ID must be a positive number");
  }
}

// Factory function to create a new UserRole entity
export function createUserRole(data: CreateUserRoleData): UserRole {
  validateUserId(data.userId);
  validateRoleId(data.roleId);
  
  return {
    userId: data.userId,
    roleId: data.roleId,
  };
}