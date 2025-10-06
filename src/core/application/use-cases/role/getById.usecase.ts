import type { RoleRepository } from '../../repositories/role.repository.js';

export class GetRoleByIdUseCase {
  constructor(private roleRepository: RoleRepository) {}

  async execute(id: number) {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error('Role not found');
    }
    return role;
  }
}