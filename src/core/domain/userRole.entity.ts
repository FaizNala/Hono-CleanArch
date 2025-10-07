// Domain Entity - Business Rules
export interface UserRole {
  userId: string;
  roleId: number;
}

export interface CreateUserRoleData {
  userId: string;
  roleId: number;
}

// Domain validation rules
export class UserRoleEntity {
  constructor(
    public readonly userId: string,
    public readonly roleId: number
  ) {
    this.validateUserId(userId);
    this.validateRoleId(roleId);
  }
  
  // Validation methods
  private validateUserId(userId: string): void {
    if (!userId || userId.trim().length === 0) {
      throw new Error("User ID is required");
    }
  }

  private validateRoleId(roleId: number): void {
    if (!roleId || roleId <= 0) {
      throw new Error("Role ID must be a positive number");
    }
  }

  // Factory method to create a new UserRole entity
  static create(data: CreateUserRoleData): UserRole {
    const entity = new UserRoleEntity(data.userId, data.roleId);
    return {
      userId: entity.userId,
      roleId: entity.roleId,
    };
  }
}