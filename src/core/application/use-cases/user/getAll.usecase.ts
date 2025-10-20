import type { UserRepository } from '../../repositories/user.repository.js';
import { users } from "../../../../infrastructure/database/schema.js";
import { ilike, and } from "drizzle-orm";

export type GetAllUsersFilter = {
  preload?: boolean;
  name?: string;
  email?: string;
  cursor?: number;
  pageSize?: number;
  direction?: string;
};

export async function getAllUsersUseCase(filter: GetAllUsersFilter = {}, userRepository: UserRepository): Promise<any[]> {
  // Pagination
  if (filter.cursor !== undefined || filter.pageSize !== undefined || filter.direction !== undefined) {
    return await userRepository.withPaginate(filter.cursor, filter.pageSize ?? 10, filter.direction ?? "next");
  }
  
  // Filter and Preload
  const whereClauses: any[] = [];
  if (filter.name) whereClauses.push(ilike(users.name,`%${filter.name}%`));
  if (filter.email) whereClauses.push(ilike(users.email,`%${filter.email}%`));

  if (filter.preload && whereClauses.length > 0) {
    return await userRepository.withPreloadWhere(and(...whereClauses));
  } 
  if (filter.preload) {
    return await userRepository.withPreload();
  } 
  if (whereClauses.length > 0) {
    return await userRepository.withWhere(and(...whereClauses));
  }
  return await userRepository.findAll();
}