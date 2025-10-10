import type { User } from '../../domain/user.entity.js';
import type { CreateUserData, UpdateUserData } from '../../domain/user.entity.js';

// Repository Type - Contract for data access (Functional approach)
export type UserRepository = {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<User | null>;
  withPreload(): Promise<any[]>;
  withPreloadWhere(whereClause: any): Promise<User[]>;
  withWhere(whereClause: any): Promise<User[]>;
  create(userData: CreateUserData): Promise<User>;
  update(id: string, userData: UpdateUserData): Promise<User | null>;
  delete(id: string): Promise<boolean>;
};