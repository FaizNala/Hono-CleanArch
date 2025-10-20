import type { PermissionRepository } from '../../core/application/repositories/permission.repository.js';
import type { Permission } from '../../core/domain/permission.entity.js';
import type { CreatePermissionData, UpdatePermissionData } from '../../core/domain/permission.entity.js';
import { db } from '../database/index.js';
import { permissions } from '../database/schema.js';
import { eq } from 'drizzle-orm';

export class DrizzlePermissionRepository implements PermissionRepository {
  // ---  Finder ---
  async findAll(): Promise<Permission[]> {
    return await db.select().from(permissions);
  }

  async findById(id: number): Promise<Permission | null> {
    const result = await db.select().from(permissions).where(eq(permissions.id, id));
    return result[0] || null;
  }

  async findByName(name: string): Promise<Permission | null> {
    const result = await db.select().from(permissions).where(eq(permissions.name, name));
    return result[0] || null;
  }

  // --- CRUD Operations ---
  async create(permissionData: CreatePermissionData): Promise<Permission> {
    const result = await db.insert(permissions).values(permissionData).returning();
    return result[0];
  }

  async update(id: number, permissionData: UpdatePermissionData): Promise<Permission | null> {
    const result = await db
      .update(permissions)
      .set({ ...permissionData, updatedAt: new Date() })
      .where(eq(permissions.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await db.delete(permissions).where(eq(permissions.id, id)).returning();
    return result.length > 0;
  }
}