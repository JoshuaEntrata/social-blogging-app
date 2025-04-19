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

export interface UserAuthentication {
  email: string;
  token: string;
  username: string;
  bio?: string | null;
  image?: string | null;
}

export interface UserFollowing extends User {
  following: boolean;
}
