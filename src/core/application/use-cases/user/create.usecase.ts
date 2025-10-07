import type { UserRepository } from '../../repositories/user.repository.js';
import type { RoleRepository } from '../../repositories/role.repository.js';
import type { UserRoleRepository } from '../../repositories/userRole.repository.js';
import type { CreateUserData } from '../../../domain/user.entity.js';
import { UserEntity } from '../../../domain/user.entity.js';
import { UserRoleEntity } from '../../../domain/userRole.entity.js';
import * as bcrypt from 'bcrypt';

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private roleRepository?: RoleRepository,
    private userRoleRepository?: UserRoleRepository
  ) {}

  async execute(userData: CreateUserData) {
    // Business logic validation
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Validate roles if provided
    if (userData.roleIds && userData.roleIds.length > 0) {
      if (!this.roleRepository) {
        throw new Error('Role repository is required when assigning roles');
      }
      
      for (const roleId of userData.roleIds) {
        const role = await this.roleRepository.findById(roleId);
        if (!role) {
          throw new Error(`Role with ID ${roleId} not found`);
        }
      }
    }

    // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create domain entity (validation happens here)
    const userDomainData = UserEntity.create(userData);

    // Create user
    const createdUser = await this.userRepository.create({
      ...userDomainData,
      password: hashedPassword,
    });

    // Assign roles if provided
    if (userData.roleIds && userData.roleIds.length > 0 && this.userRoleRepository) {
      for (const roleId of userData.roleIds) {
        const userRoleData = UserRoleEntity.create({
          userId: createdUser.id,
          roleId: roleId,
        });
        await this.userRoleRepository.create(userRoleData);
      }
    }

    return createdUser;
  }
}