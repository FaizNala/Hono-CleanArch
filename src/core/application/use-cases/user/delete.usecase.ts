import type { UserRepository } from '../../repositories/user.repository.js';

export async function deleteUserUseCase( id: string, userRepository: UserRepository ) {
  if (!id) throw new Error('User ID is required');
  const deleted = await userRepository.delete(id);
  if (!deleted) throw new Error('User not found or already deleted');
  return deleted;
}
