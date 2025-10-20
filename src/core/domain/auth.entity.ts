// Domain Entity - Auth Business Rules
export type AuthResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    roles?: Array<{ id: number; name: string }>;
  };
};

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