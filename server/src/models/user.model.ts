export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface UserDetails {
  username: string;
  bio: string;
  image: string | null;
}

export interface UserAuthentication extends UserDetails {
  email: string;
  token: string;
}

export interface Profile extends UserDetails {
  following: boolean;
}
