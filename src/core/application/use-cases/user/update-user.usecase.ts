import type { UserRepository } from "../../repositories/user.repository.js";
import type { UpdateUserData } from "../../../domain/user.entity.js";
import { UserEntity } from "../../../domain/user.entity.js";
import * as bcrypt from "bcrypt";

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

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
    return await this.userRepository.update(id, {
      email: updatedEntity.email,
      name: updatedEntity.name,
      password: updatedEntity.password,
    });
  }
}
