import type { UserRepository } from '../../repositories/user.repository.js';

export interface GetAllUsersFilter {
  preload?: boolean;
  roleIds?: number[];
}

export class GetAllUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(filter: GetAllUsersFilter = {}): Promise<any[]> {
    // Jika preload true, gunakan withPreloads untuk preload roles
    if (filter.preload) {
      return await this.userRepository.withPreload();
    }
    // Jika tidak preload, gunakan findAll biasa
    return await this.userRepository.findAll();
  }
}