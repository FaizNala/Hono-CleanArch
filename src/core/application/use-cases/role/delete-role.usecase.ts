import type { RoleRepository } from '../../repositories/role.repository.js';

export class DeleteRoleUseCase {
  constructor(private roleRepository: RoleRepository) {}

  async execute(id: number) {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error('Role not found');
    }

    const deleted = await this.roleRepository.delete(id);
    if (!deleted) {
      throw new Error('Failed to delete role');
    }

    return { success: true, message: 'Role deleted successfully' };
  }
}