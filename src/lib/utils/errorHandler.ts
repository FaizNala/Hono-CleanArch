import type { Context } from "hono";
import { error, STATUS } from "./response.js";

/**
 * Global error handler untuk semua controllers
 * Menangani error secara konsisten berdasarkan jenis error
 */
export function handleError(c: Context, err: unknown, operation: string) {
  console.error(`Error ${operation}:`, err);
  
  if (!(err instanceof Error)) {
    return error(c, "Internal server error", STATUS.SERVER_ERROR);
  }

  const message = err.message.toLowerCase();

  // Not Found errors
  if (message.includes("not found")) {
    return error(c, err.message, STATUS.NOT_FOUND);
  }

  // Conflict errors (already exists)
  if (message.includes("already exists")) {
    return error(c, err.message, STATUS.CONFLICT);
  }

  // Validation errors
  if (
    message.includes("invalid") ||
    message.includes("must be") ||
    message.includes("required") ||
    message.includes("validation") ||
    message.includes("no update data provided")
  ) {
    return error(c, err.message, STATUS.BAD_REQUEST);
  }

  // Zod validation errors
  if (err.name === "ZodError") {
    return error(c, "Validation failed: " + err.message, STATUS.BAD_REQUEST);
  }

  // Default server error
  return error(c, "Internal server error", STATUS.SERVER_ERROR);
}

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