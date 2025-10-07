import type { UserRepository } from "../../repositories/user.repository.js";
import type { RoleRepository } from "../../repositories/role.repository.js";
import type { UserRoleRepository } from "../../repositories/userRole.repository.js";
import type { UpdateUserData } from "../../../domain/user.entity.js";
import { UserEntity } from "../../../domain/user.entity.js";
import { UserRoleEntity } from "../../../domain/userRole.entity.js";
import * as bcrypt from "bcrypt";

export class UpdateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private roleRepository?: RoleRepository,
    private userRoleRepository?: UserRoleRepository
  ) {}

  // async execute(id: string, data: UpdateUserData & { roleIds?: number[] }) {
  async execute(id: string, data: UpdateUserData) {
    if (!id) throw new Error("User ID is required");
    if (!data || Object.keys(data).length === 0)
      throw new Error("No update data provided");

    const existing = await this.userRepository.findById(id);
    if (!existing) throw new Error("User not found");

    // Hash password jika ada perubahan
    let password = existing.password;
    if (data.password) {
      password = await bcrypt.hash(data.password, 10);
    }

    // Buat entity dari data lama (dengan password baru jika ada)
    const entity = new UserEntity(
      existing.id,
      existing.email,
      existing.name,
      password,
      existing.createdAt,
      existing.updatedAt
    );

    // Validasi dan update via entity
    const updatedEntity = entity.update(data);

    // Simpan ke repository
    const updatedUser = await this.userRepository.update(id, {
      email: updatedEntity.email,
      name: updatedEntity.name,
      password: updatedEntity.password,
    });

    // Update roles jika ada roleIds
    if (data.roleIds && this.userRoleRepository) {
      // Validasi roles sebelum update
      if (this.roleRepository) {
        for (const roleId of data.roleIds) {
          const role = await this.roleRepository.findById(roleId);
          if (!role) throw new Error(`Role with ID ${roleId} not found`);
        }
      }

      // Hapus semua relasi user-role lama
      await this.userRoleRepository.delete(id);
      
      // Tambahkan relasi baru
      for (const roleId of data.roleIds) {
        const userRoleData = UserRoleEntity.create({ userId: id, roleId });
        await this.userRoleRepository.create(userRoleData);
      }
    }

    return updatedUser;
  }
}
