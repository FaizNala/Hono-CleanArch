import { eq } from "drizzle-orm";
import type { UserRepository } from "../../core/application/repositories/user.repository.js";
import type {
  User,
  CreateUserData,
  UpdateUserData,
} from "../../core/domain/user.entity.js";
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
            role: true
          }
        }
      }
    });
    if (!result[0]) return null;
    const { userRoles, ...userData } = result[0];
    return {
      ...userData,
      roles: userRoles.map(ur => ur.role)
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0] || null;
  }

async withPreload(): Promise<any[]> {
    const result = await db.query.users.findMany({
      with: {
        userRoles: {
          with: {
            role: true
          }
        }
      }
    });
    
    // Mapping hasil query: hapus userRoles, tambahkan roles sebagai array
    return result.map(u => {
      const { userRoles, ...userData } = u;
      return {
        ...userData,
        roles: userRoles.map(ur => ur.role)
      };
    });
}

  // --- CUD Operations ---
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

    return result[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }
}
