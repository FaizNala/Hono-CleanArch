export type ResponseUserDto = {
  id: number;
  email: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  roles?: Array<{ id: number; name: string }>;
};

export function toUserResponse(user: any): ResponseUserDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    roles: user.userRoles
      ? user.userRoles.map((ur: any) => ({
          id: ur.role.id,
          name: ur.role.name,
        }))
      : [],
  };
}
