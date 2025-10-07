import type { UpdateUserData } from "../../../../lib/validation/user.validation.js";
import { updateUser } from "../../../domain/user.entity.js";
import { createUserRole } from "../../../domain/userRole.entity.js";
import type { Repositories } from "../../../../lib/types/repositories.js";
import * as bcrypt from "bcrypt";

export async function updateUserUseCase(
  id: string,
  data: UpdateUserData,
  repositories: Repositories
) {
  if (!id) throw new Error("User ID is required");
  if (!data || Object.keys(data).length === 0)
    throw new Error("No update data provided");

  const existing = await repositories.user.findById(id);
  if (!existing) throw new Error("User not found");

  // Hash password jika ada perubahan
  let password = existing.password;
  if (data.password) {
    password = await bcrypt.hash(data.password, 10);
  }

  // Validasi dan update via domain function (dengan Zod validation)
  const updatedEntity = updateUser(existing, {
    ...data,
    password: data.password ? password : undefined,
  });

  // Simpan ke repository
  const updatedUser = await repositories.user.update(id, {
    email: updatedEntity.email,
    name: updatedEntity.name,
    password: updatedEntity.password,
  });

  // Update roles jika ada roleIds
  if (data.roleIds) {
    // Validasi roles sebelum update
    for (const roleId of data.roleIds) {
      const role = await repositories.role.findById(roleId);
      if (!role) throw new Error(`Role with ID ${roleId} not found`);
    }

    // Hapus semua relasi user-role lama
    await repositories.userRole.delete(id);
    
    // Tambahkan relasi baru
    for (const roleId of data.roleIds) {
      const userRoleData = createUserRole({ userId: id, roleId });
      await repositories.userRole.create(userRoleData);
    }
  }

  return updatedUser;
}
