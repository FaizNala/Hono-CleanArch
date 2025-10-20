import type { RolePermissionRepository } from "../../core/application/repositories/rolePermission.repository.js";
import type { RolePermission, CreateRolePermissionData } from "../../core/domain/rolePermission.entity.js";
import { db } from "../database/index.js";
import { rolePermissions } from "../database/schema.js";
import { eq, and } from "drizzle-orm";

export class DrizzleRolePermissionRepository implements RolePermissionRepository {
  async create(rolePermissionData: CreateRolePermissionData): Promise<RolePermission> {
    const result = await db.insert(rolePermissions).values(rolePermissionData).returning();
    return result[0];
  }

  async delete(roleId: number, permissionId?: number): Promise<boolean> {
    if (permissionId !== undefined) {
      const result = await db.delete(rolePermissions).where(
        and(
          eq(rolePermissions.roleId, roleId), 
          eq(rolePermissions.permissionId, permissionId)
        )
      ).returning();
      return result.length > 0;
    }
    const result = await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId)).returning();
    return result.length > 0;
  }
}