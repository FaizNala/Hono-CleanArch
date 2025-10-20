import { SQL } from 'drizzle-orm';
import type { User } from '../../domain/user.entity.js';
import type { CreateUserData, UpdateUserData } from '../../domain/user.entity.js';

// Repository Type - Contract for data access (Functional approach)
export type UserRepository = {
  findAll(): Promise<any[]>;
  findById(id: number): Promise<User | null>;
  withPreload(): Promise<any[]>;
  withPreloadWhere(whereClause: any): Promise<User[]>;
  withWhere(whereClause: any): Promise<User[]>;
  withPaginate(cursor?: number, pageSize?: number, direction?: string): Promise<User[]>;
  withRawQuery(query: SQL): Promise<any[]>;
  create(userData: CreateUserData): Promise<User>;
  update(id: number, userData: UpdateUserData): Promise<User | null>;
  delete(id: number): Promise<boolean>;
};