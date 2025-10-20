import type { UpdateUserData } from "../../../../lib/validation/user.validation.js";
import { updateUser } from "../../../domain/user.entity.js";
import { createUserRole } from "../../../domain/userRole.entity.js";
import type { Repositories } from "../../../../lib/types/repositories.js";
import * as bcrypt from "bcrypt";

export async function updateUserUseCase(id: number, data: UpdateUserData, repositories: Repositories) {
  const existing = await repositories.user.findById(id);
  if (!existing) {
    throw new Error("User not found");
  }

  // Hash password jika ada perubahan
  let password = existing.password;
  if (data.password) {
    password = await bcrypt.hash(data.password, 10);
  }

  // Validasi dan update via domain function
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
