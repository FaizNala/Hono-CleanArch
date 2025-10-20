import type { UserRepository } from '../../repositories/user.repository.js';

export async function deleteUserUseCase( id: number, userRepository: UserRepository ) {
  const deleted = await userRepository.delete(id);
  if (!deleted) {
    throw new Error('failed to delete user');
  }  
  return deleted;
}
