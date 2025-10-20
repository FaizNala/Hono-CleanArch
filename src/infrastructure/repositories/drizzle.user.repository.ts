import { asc, desc, eq, gt, lt, SQL } from "drizzle-orm";
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

  async findById(id: number): Promise<any | null> {
    const result = await db.query.users.findMany({
      where: eq(users.id, id),
      with: {
        userRoles: {
          with: {
            role: {
              with: {
                rolePermissions: {
                  with: {
                    permission: true,
                  },
                },
              },
            },
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
            role: {
              with: {
                rolePermissions: {
                  with: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return result;
  }

  async withWhere(whereClause: any): Promise<User[]> {
    return await db.select().from(users).where(whereClause);
  }

  async withRawQuery(query: SQL): Promise<any[]> {
    return await db.execute(query);
  }

  async withPaginate(cursor?: number, pageSize: number = 10, direction?: string): Promise<User[]> {
    const isPrev = direction === "prev";
    const whereClause = cursor
      ? isPrev
        ? lt(users.id, cursor)
        : gt(users.id, cursor)
      : undefined;
    const order = isPrev ? desc(users.id) : asc(users.id);

    const result = await db
      .select()
      .from(users)
      .where(whereClause)
      .limit(pageSize)
      .orderBy(order);

    return isPrev ? result.reverse() : result;
  }

  // --- CRUD Operations ---
  async create(userData: CreateUserData): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  async update(id: number, userData: UpdateUserData): Promise<User | null> {
    const result = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }
}
