export type ResponseRoleDto = {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  permissions?: Array<{ id: number; name: string }>;
};

export function toRoleResponse(role: any): ResponseRoleDto {
  return {
    id: role.id,
    name: role.name,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
    permissions: role.rolePermissions
      ? role.rolePermissions.map((rp: any) => ({
          id: rp.permission.id,
          name: rp.permission.name,
        }))
      : [],
  };
}
