import type { Context } from "hono";
import { error, StatusCode } from "./response.js";

/**
 * Global error handler untuk semua controllers
 * Menangani error secara konsisten berdasarkan jenis error
 */
export function handleError(c: Context, err: unknown, operation: string) {
  console.error(`Error ${operation}:`, err);
  
  // Jika bukan instance Error, return generic error
  if (!(err instanceof Error)) {
    return error(c, "Internal server error", StatusCode.SERVER_ERROR);
  }

  // 1. PRIORITAS TERTINGGI: PostgreSQL Database Errors
  const pgError = err as any;
  const code = pgError.code || pgError.cause?.code;
  
  if (code) {
    switch (code) {
      case "23505": // Unique violation
        return error(c, "Data already exists. Please use different values.", StatusCode.CONFLICT);
      case "23503": // Foreign key violation
        return error(c, "Related data not found. Please check your references.", StatusCode.BAD_REQUEST);
      case "23502": // Not null violation
        return error(c, "Required field is missing. Please provide all necessary data.", StatusCode.BAD_REQUEST);
      case "22P02": // Invalid input syntax/type mismatch
        return error(c, "Invalid data format. Please check your input.", StatusCode.BAD_REQUEST);
      case "42703": // Undefined column
        return error(c, "Invalid field specified. Please check your request.", StatusCode.BAD_REQUEST);
      default: // PostgreSQL error dengan code lain
        return error(c, "Database operation failed. Please try again.", StatusCode.SERVER_ERROR);
    }
  }

  // 2. Zod Validation Errors
  if (err.name === "ZodError") {
    const zodErr = err as any;
    const messages = zodErr.issues.map((e: any) => e.message).join("; ");
    return error(c, messages, StatusCode.BAD_REQUEST);
  }

  // 3. JSON Parsing Errors
  if (err instanceof SyntaxError && err.message.includes("JSON")) {
    return error(c, "Invalid JSON format. Please check your request body.", StatusCode.BAD_REQUEST);
  }

  // 4. Custom Application Errors (berdasarkan message content)
  const message = err.message.toLowerCase();

  // Not Found errors
  if (message.includes("not found")) {
    return error(c, err.message, StatusCode.NOT_FOUND);
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
    return error(c, "Request timeout. Please try again.", StatusCode.SERVER_ERROR);
  }

  // Generic validation errors (fallback)
  if (
    message.includes("must be") ||
    message.includes("required") ||
    message.includes("validation") ||
    message.includes("no update data provided")
  ) {
    return error(c, err.message, StatusCode.BAD_REQUEST);
  }

  // 5. Default fallback untuk semua error lainnya
  return error(c, "Internal server error", StatusCode.SERVER_ERROR);
}
