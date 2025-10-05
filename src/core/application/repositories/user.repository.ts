import type { User, CreateUserData, UpdateUserData } from '../../domain/user.entity.js';

// Repository Interface - Contract for data access
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(userData: CreateUserData): Promise<User>;
  update(id: string, userData: UpdateUserData): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  findByIdWithRoles(id: string): Promise<any | null>;
}
