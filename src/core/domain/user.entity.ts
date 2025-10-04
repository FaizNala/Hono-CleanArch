// Domain Entity - Business Rules
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  name: string;
}

export interface UpdateUserData {
  name?: string;
}

// Domain validation rules
export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validateEmail(email);
    this.validateName(name);
  }

  static create(data: CreateUserData): Pick<User, 'email' | 'name'> {
    const entity = new UserEntity('', data.email, data.name, new Date(), new Date());
    return {
      email: entity.email,
      name: entity.name
    };
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
  }

  update(data: UpdateUserData): User {
    return new UserEntity(
      this.id,
      this.email,
      data.name ?? this.name,
      this.createdAt,
      new Date()
    );
  }
}
