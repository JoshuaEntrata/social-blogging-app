export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  bio?: string | null;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}
