import { eq, inArray } from 'drizzle-orm';
import type { UserRepository } from '../../core/application/repositories/user.repository.js';
import type { User, CreateUserData, UpdateUserData } from '../../core/domain/user.entity.js';
import { db } from '../database/index.js';
import { users } from '../database/user.schema.js';
import { userRoles } from '../database/user-role.schema.js';
import { roles } from '../database/role.schema.js';

export class DrizzleUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  }

  async findByIdWithRoles(id: string): Promise<any | null> {
    const userResult = await db.select().from(users).where(eq(users.id, id)).limit(1);
    const user = userResult[0];
    if (!user) return null;

    // Get roles for user
    const userRoleRows = await db.select().from(userRoles).where(eq(userRoles.userId, id));
    const roleIds = userRoleRows.map((ur) => ur.roleId);
    let rolesResult: any[] = [];
    if (roleIds.length > 0) {
      rolesResult = await db.select().from(roles).where(inArray(roles.id, roleIds));
    }
    return {
      ...user,
      roles: rolesResult,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] || null;
  }

  async findAll(): Promise<User[]> {
    return await db.select().from(users);
  }

  async create(userData: CreateUserData): Promise<User> {
    const result = await db.insert(users)
      .values({
        email: userData.email,
        name: userData.name,
        password: userData.password,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    return result[0];
  }

  async update(id: string, userData: UpdateUserData): Promise<User | null> {
    const result = await db.update(users)
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
