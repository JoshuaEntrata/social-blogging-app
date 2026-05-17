import { ApiError } from "./apiError";

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function parseQueryInt(
  value: unknown,
  name: "limit" | "offset"
): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new ApiError(400, `${name} must be a number`);
  }

  const parsed = Number(value);
  const min = name === "limit" ? 1 : 0;

  if (!Number.isInteger(parsed) || parsed < min) {
    throw new ApiError(
      400,
      `${name} must be ${name === "limit" ? "a positive" : "a non-negative"} integer`
    );
  }

  return parsed;
}
