import type { UserRoleRepository } from "../../core/application/repositories/userRole.repository.js";
import type {
  UserRole,
  CreateUserRoleData,
} from "../../core/domain/userRole.entity.js";
import { db } from "../database/index.js";
import { userRoles } from "../database/schema.js";
import { eq, and } from "drizzle-orm";

export class DrizzleUserRoleRepository implements UserRoleRepository {
  async create(userRoleData: CreateUserRoleData): Promise<UserRole> {
    const result = await db.insert(userRoles).values(userRoleData).returning();
    return result[0];
  }

  async delete(userId: string, roleId?: number): Promise<boolean> {
    if (roleId !== undefined) {
      const result = await db.delete(userRoles).where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId))).returning();
      return result.length > 0;
    }
    const result = await db.delete(userRoles).where(eq(userRoles.userId, userId)).returning();
    return result.length > 0;
  }
}