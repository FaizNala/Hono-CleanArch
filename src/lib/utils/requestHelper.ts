import type { Context } from "hono";
/**
 * Helper untuk parsing query parameters
 */
export function parseQueryParams(c: Context) {
  // Filter params
  const preload = c.req.query("preload") === "true";
  const roleIdsParam = c.req.query("roleIds");
  const roleIds = roleIdsParam ? roleIdsParam.split(",").map(Number) : undefined;
  const name = c.req.query("name");
  const email = c.req.query("email");

  // Pagination params
  const cursorParam = c.req.query("cursor");
  const cursor = cursorParam ? parseInt(cursorParam) : undefined;
  const pageSizeParam = c.req.query("pageSize");
  const pageSize = pageSizeParam ? parseInt(pageSizeParam) : undefined;
  const direction = c.req.query("direction");

  return { preload, roleIds, name, email, cursor, pageSize, direction };
}

/**
 * Helper untuk mendapatkan ID parameter dan memvalidasinya
 */
export function getParamId(c: Context, paramName: string = "id"): number {
  const id = parseInt(c.req.param(paramName));
  if (isNaN(id)) {
    throw new Error(`Invalid ${paramName} format`);
  }
  return id;
}