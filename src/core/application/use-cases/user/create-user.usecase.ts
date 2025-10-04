import type { UserRepository } from '../../repositories/user.repository.js';
import type { CreateUserData } from '../../../domain/user.entity.js';
import { UserEntity } from '../../../domain/user.entity.js';

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: CreateUserData) {
    // Business logic validation
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create domain entity (validation happens here)
    const userDomainData = UserEntity.create(userData);

    // Persist via repository
    return await this.userRepository.create(userDomainData);
  }
}