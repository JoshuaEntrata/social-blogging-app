import jwt from "jsonwebtoken";

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
}

export function verifyToken(token: string): { userId: number } {
  return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
}
