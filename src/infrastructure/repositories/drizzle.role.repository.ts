import type { RoleRepository } from '../../core/application/repositories/role.repository.js';
import type { Role } from '../../core/domain/role.entity.js';
import type { CreateRoleData, UpdateRoleData } from '../../lib/validation/role.validation.js';
import { db } from '../database/index.js';
import { roles } from '../database/schema.js';
import { eq } from 'drizzle-orm';

export class DrizzleRoleRepository implements RoleRepository {
  // ---  Finder ---
  async findAll(): Promise<Role[]> {
    return await db.select().from(roles);
  }

  async findById(id: number): Promise<Role | null> {
    const result = await db.select().from(roles).where(eq(roles.id, id));
    return result[0];
  }

  // --- CRUD Operations ---
  async create(roleData: CreateRoleData): Promise<Role> {
    const result = await db.insert(roles).values(roleData).returning();
    return result[0];
  }

  async update(id: number, roleData: UpdateRoleData): Promise<Role | null> {
    const result = await db
      .update(roles)
      .set({ ...roleData, updatedAt: new Date() })
      .where(eq(roles.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<boolean> {
    const result = await db.delete(roles).where(eq(roles.id, id)).returning();
    return result.length > 0;
  }
}