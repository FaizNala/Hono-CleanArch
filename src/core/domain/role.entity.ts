// Domain Entity - Business Rules
export interface Role {
  id: number;
  name: string;
}

export interface CreateRoleData {
  name: string;
}

export interface UpdateRoleData {
  name?: string;
}

// Domain validation rules
export class RoleEntity {
  constructor(
    public readonly id: number,
    public readonly name: string
  ) {
    this.validateName(name);
  }
  
  // Validation methods
  private validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error("Role name must be at least 2 characters long");
    }
    if (name.trim().length > 100) {
      throw new Error("Role name must not exceed 100 characters");
    }
  }

  // Factory method to create a new Role entity
  static create(data: CreateRoleData): Pick<Role, "name"> {
    const entity = new RoleEntity(0, data.name);
    return {
      name: entity.name,
    };
  }

  // Method to update role details
  update(data: UpdateRoleData): Role {
    if (data.name) {
      this.validateName(data.name);
    }
    return new RoleEntity(
      this.id,
      data.name ?? this.name
    );
  }
}