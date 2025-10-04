import type { UserRepository } from '../../repositories/user.repository.js';

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string) {
    if (!id) throw new Error('User ID is required');
    const deleted = await this.userRepository.delete(id);
    if (!deleted) throw new Error('User not found or already deleted');
    return deleted;
  }
}
