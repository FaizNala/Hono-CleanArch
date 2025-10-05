// Domain Entity - Business Rules
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  roleIds?: number[];
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  password?: string;
}

// Validation methods

// Domain validation rules
export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly password: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validateEmail(email);
    this.validateName(name);
  }
  
  // Validation methods
  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters long");
    }
  }

  // Fact
  // ory method to create a new User entity
  static create(
    data: CreateUserData
  ): Pick<User, "email" | "name" | "password"> {
    const entity = new UserEntity(
      "",
      data.email,
      data.name,
      data.password,
      new Date(),
      new Date()
    );
    return {
      email: entity.email,
      name: entity.name,
      password: entity.password,
    };
  }

  // Method to update user details
  update(data: UpdateUserData): User {
    if (data.email) {
      this.validateEmail(data.email);
    }
    if (data.name) {
      this.validateName(data.name);
    }
    return new UserEntity(
      this.id,
      data.email ?? this.email,
      data.name ?? this.name,
      data.password ?? this.password,
      this.createdAt,
      new Date()
    );
  }
}
