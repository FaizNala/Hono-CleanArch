import type { UserRepository } from "../../core/application/repositories/user.repository.js";
import type { RoleRepository } from "../../core/application/repositories/role.repository.js";
import type { UserRoleRepository } from "../../core/application/repositories/userRole.repository.js";
import type { PermissionRepository } from "../../core/application/repositories/permission.repository.js";
import type { RolePermissionRepository } from "../../core/application/repositories/rolePermission.repository.js";

/**
 * Global repositories type untuk dependency injection
 * Bisa di-extend untuk entity lain
 */
export type Repositories = {
  user: UserRepository;
  role: RoleRepository;
  userRole: UserRoleRepository;
  permission: PermissionRepository;
  rolePermission: RolePermissionRepository;
};