import type { UserRepository } from '../../repositories/user.repository.js';
import type { UpdateUserData } from '../../../domain/user.entity.js';

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, data: UpdateUserData) {
    if (!id) throw new Error('User ID is required');
    if (!data || Object.keys(data).length === 0) throw new Error('No update data provided');
    const updated = await this.userRepository.update(id, data);
    if (!updated) throw new Error('User not found');
    return updated;
  }
}
