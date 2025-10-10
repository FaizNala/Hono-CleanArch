export type ResponseRoleDto = {
    id: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export function toRoleResponse(role: any): ResponseRoleDto {
    return {
        id: role.id,
        name: role.name,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
    };
}