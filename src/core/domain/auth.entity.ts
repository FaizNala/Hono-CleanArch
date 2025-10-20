// Domain Entity - Auth Business Rules
export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  name: string;
  password: string;
  roleIds?: number[];
};

export type JWTPayload = {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
};
