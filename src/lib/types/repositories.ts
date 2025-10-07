import type { UserRepository } from "../../core/application/repositories/user.repository.js";
import type { RoleRepository } from "../../core/application/repositories/role.repository.js";
import type { UserRoleRepository } from "../../core/application/repositories/userRole.repository.js";

/**
 * Global repositories type untuk dependency injection
 * Bisa di-extend untuk entity lain
 */
export type Repositories = {
  user: UserRepository;
  role: RoleRepository;
  userRole: UserRoleRepository;
};