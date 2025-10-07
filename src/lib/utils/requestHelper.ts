import type { Context } from "hono";
/**
 * Helper untuk parsing query parameters
 */
export function parseQueryParams(c: Context) {
  const preload = c.req.query("preload") === "true";
  const roleIdsParam = c.req.query("roleIds");
  const roleIds = roleIdsParam ? roleIdsParam.split(",").map(Number) : undefined;
  
  return { preload, roleIds };
}

/**
 * Helper untuk mendapatkan ID parameter dan memvalidasinya
 */
export function getParamId(c: Context, paramName: string = "id"): string {
  const id = c.req.param(paramName);
  if (!id) {
    throw new Error(`${paramName} parameter is required`);
  }
  return id;
}

/**
 * Helper untuk mendapatkan numeric ID parameter
 */
export function getNumericParamId(c: Context, paramName: string = "id"): number {
  const id = parseInt(c.req.param(paramName));
  if (isNaN(id)) {
    throw new Error(`Invalid ${paramName} format`);
  }
  return id;
}