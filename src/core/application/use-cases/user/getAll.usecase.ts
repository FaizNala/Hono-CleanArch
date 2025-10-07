import type { UserRepository } from '../../repositories/user.repository.js';

export type GetAllUsersFilter = {
  preload?: boolean;
  roleIds?: number[];
};

export async function getAllUsersUseCase(filter: GetAllUsersFilter = {}, userRepository: UserRepository): Promise<any[]> {
  // Jika preload true, gunakan withPreloads untuk preload roles
  if (filter.preload) {
    return await userRepository.withPreload();
  }
  // Jika tidak preload, gunakan findAll biasa
  return await userRepository.findAll();
}