export type LoginResponseDto = {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    roles?: Array<{ id: number; name: string }>;
    permissions?: Array<{ id: number; name: string }>;
  };
};

export type RegisterResponseDto = {
  id: number;
  email: string;
  name: string;
  roles?: Array<{ id: number; name: string }>;
  permissions?: Array<{ id: number; name: string }>;
};

export function toLoginResponse(user: any, token: string): LoginResponseDto {
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

export function toRegisterResponse(user: any): RegisterResponseDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
