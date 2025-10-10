import { eq } from "drizzle-orm";
import type { UserRepository } from "../../core/application/repositories/user.repository.js";
import type { User } from "../../core/domain/user.entity.js";
import type { CreateUserData, UpdateUserData } from "../../lib/validation/user.validation.js";
import { db } from "../database/index.js";
import { users } from "../database/user.schema.js";

export class DrizzleUserRepository implements UserRepository {
  // --- Finder ---
  async findAll(): Promise<User[]> {
    return await db.select().from(users);
  }

  async findById(id: string): Promise<any | null> {
    const result = await db.query.users.findMany({
      where: eq(users.id, id),
      with: {
        userRoles: {
          with: {
            role: true,
          },
        },
      },
    });
    return result[0];
  }

  async withPreload(): Promise<any[]> {
    return await db.query.users.findMany({
      with: {
        userRoles: {
          with: {
            role: true,
          },
        },
      },
    });
  }

  async withPreloadWhere(whereClause: any): Promise<User[]> {
    const result = await db.query.users.findMany({
      where: whereClause,
      with: {
        userRoles: {
          with: {
            role: true,
          },
        },
      },
    });
    return result;
  }

  async withWhere(whereClause: any): Promise<User[]> {
    return await db.select().from(users).where(whereClause);
  }

  // --- CRUD Operations ---
  async create(userData: CreateUserData): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  async update(id: string, userData: UpdateUserData): Promise<User | null> {
    const result = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }
}
