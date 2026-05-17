import { Response } from "express";

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function sendErrorResponse(res: Response, err: unknown) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : "Unexpected error";

  res.status(statusCode).json({ message });
}

export function formatLogError(err: unknown) {
  if (err instanceof ApiError) {
    return `${err.name} ${err.statusCode}: ${err.message}`;
  }

  if (err instanceof Error) {
    return `${err.name}: Unexpected error | Reason: ${err.message}`;
  }

  return "Unexpected error";
}
