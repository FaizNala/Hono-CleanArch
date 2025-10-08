import type { Context } from "hono";
import { error, StatusCode } from "./response.js";

/**
 * Global error handler untuk semua controllers
 * Menangani error secara konsisten berdasarkan jenis error
 */
export function handleError(c: Context, err: unknown, operation: string) {
  console.error(`Error ${operation}:`, err);
  
  if (!(err instanceof Error)) {
    return error(c, "Internal server error", StatusCode.SERVER_ERROR);
  }

  const message = err.message.toLowerCase();

  // Not Found errors
  if (message.includes("not found")) {
    return error(c, err.message, StatusCode.NOT_FOUND);
  }

  // Conflict errors (already exists)
  if (message.includes("already exists")) {
    return error(c, err.message, StatusCode.CONFLICT);
  }

  // Unauthorized errors
  if (message.includes("unauthorized") || message.includes("not authorized")) {
    return error(c, err.message, StatusCode.UNAUTHORIZED);
  }

  // Forbidden errors
  if (message.includes("forbidden") || message.includes("not allowed") || message.includes("permission denied")) {
    return error(c, err.message, StatusCode.FORBIDDEN);
  }

  // Timeout errors
  if (message.includes("timeout") || message.includes("timed out")) {
    return error(c, err.message, StatusCode.SERVER_ERROR);
  }

  // Database errors
  if (message.includes("database") || message.includes("db error") || message.includes("sql")) {
    return error(c, "Database error: " + err.message, StatusCode.SERVER_ERROR);
  }

  // Validation errors
  if (
    message.includes("invalid") ||
    message.includes("must be") ||
    message.includes("required") ||
    message.includes("validation") ||
    message.includes("no update data provided")
  ) {
    return error(c, err.message, StatusCode.BAD_REQUEST);
  }

  // Zod validation errors
  if (err.name === "ZodError") {
    return error(c, "Validation failed: " + err.message, StatusCode.BAD_REQUEST);
  }

  // Default server error
  return error(c, "Internal server error", StatusCode.SERVER_ERROR);
}
