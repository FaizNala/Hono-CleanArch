import type { UserRepository } from '../../repositories/user.repository.js';

export class GetAllUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute() {
    return await this.userRepository.findAll();
  }
} 