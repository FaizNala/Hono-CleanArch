import type { RoleRepository } from '../../repositories/role.repository.js';
import type { UpdateRoleData } from '../../../domain/role.entity.js';
import { RoleEntity } from '../../../domain/role.entity.js';

export class UpdateRoleUseCase {
  constructor(private roleRepository: RoleRepository) {}

  async execute(id: number, roleData: UpdateRoleData) {
    // Check if role exists
    const existingRole = await this.roleRepository.findById(id);
    if (!existingRole) {
      throw new Error('Role not found');
    }

    // Check if name is unique (if being updated)
    if (roleData.name && roleData.name !== existingRole.name) {
      const roleWithSameName = await this.roleRepository.findByName(roleData.name);
      if (roleWithSameName) {
        throw new Error('Role with this name already exists');
      }
    }

    // Create entity from existing data and update
    const roleEntity = new RoleEntity(existingRole.id, existingRole.name);
    const updatedRoleData = roleEntity.update(roleData);

    return await this.roleRepository.update(id, {
      name: updatedRoleData.name,
    });
  }
}