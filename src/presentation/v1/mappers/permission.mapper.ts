export type ResponsePermissionDto = {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export function toPermissionResponse(permission: any): ResponsePermissionDto {
  return {
    id: permission.id,
    name: permission.name,
    createdAt: permission.createdAt,
    updatedAt: permission.updatedAt,
  };
}