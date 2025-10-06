import type { RoleRepository } from '../../repositories/role.repository.js';

export class GetAllRolesUseCase {
  constructor(private roleRepository: RoleRepository) {}

  async execute() {
    return await this.roleRepository.findAll();
  }
}