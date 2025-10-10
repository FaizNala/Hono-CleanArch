import type { UserRepository } from '../../repositories/user.repository.js';

export async function getUserByIdUseCase(id: string, userRepository: UserRepository) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}