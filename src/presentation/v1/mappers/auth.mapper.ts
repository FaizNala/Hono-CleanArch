// src/presentation/mappers/auth.mapper.ts
import type {
  AuthResponse,
  RegisterResponse,
} from "../../../core/domain/auth.entity.js";

export function toAuthResponse(user: any, token: string): AuthResponse {
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.userRoles
        ? user.userRoles.map((ur: any) => ({
            id: ur.role.id,
            name: ur.role.name,
          }))
        : [],
      permissions: user.userRoles
        ? user.userRoles
            .flatMap((ur: any) =>
              ur.role.rolePermissions
                ? ur.role.rolePermissions.map((rp: any) => ({
                    id: rp.permission.id,
                    name: rp.permission.name,
                  }))
                : []
            )
            .filter(
              (permission: any, index: number, self: any[]) =>
                index === self.findIndex((p: any) => p.id === permission.id)
            )
        : [],
    },
  };
}

export function toRegisterResponse(user: any): RegisterResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
