export const STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

export function success(c: any, data: any, status = STATUS.OK) {
  return c.json({ success: true, data }, status);
}

export function error(c: any, message: string, status = STATUS.SERVER_ERROR) {
  return c.json({ success: false, error: message }, status);
}
