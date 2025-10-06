import type { RoleRepository } from '../../repositories/role.repository.js';
import type { CreateRoleData } from '../../../domain/role.entity.js';
import { RoleEntity } from '../../../domain/role.entity.js';

export class CreateRoleUseCase {
  constructor(private roleRepository: RoleRepository) {}

  async execute(roleData: CreateRoleData) {
    // Business logic validation
    const existingRole = await this.roleRepository.findByName(roleData.name);
    if (existingRole) {
      throw new Error('Role with this name already exists');
    }

    // Create domain entity (validation happens here)
    const roleDomainData = RoleEntity.create(roleData);

    return await this.roleRepository.create(roleDomainData);
  }
}