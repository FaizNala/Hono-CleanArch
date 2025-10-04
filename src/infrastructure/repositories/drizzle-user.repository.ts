import { eq } from 'drizzle-orm';
import type { UserRepository } from '../../core/application/repositories/user.repository.js';
import type { User, CreateUserData, UpdateUserData } from '../../core/domain/user.entity.js';
import { db } from '../database/index.js';
import { users } from '../database/user.schema.js';

export class DrizzleUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
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
