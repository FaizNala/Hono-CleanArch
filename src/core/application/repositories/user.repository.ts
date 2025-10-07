import type { User, CreateUserData, UpdateUserData } from '../../domain/user.entity.js';

// Repository Interface - Contract for data access
export interface UserRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  withPreload(): Promise<any[]>;
  create(userData: CreateUserData): Promise<User>;
  update(id: string, userData: UpdateUserData): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}