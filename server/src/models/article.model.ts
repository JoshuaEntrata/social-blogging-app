import { UserFollowing } from "./user.model";

export interface Author {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface Article {
  id?: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  authorId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleDetails extends Article {
  tagList: string[];
  favorited: boolean;
  favoritesCount: number;
  author: Author | UserFollowing;
}

export interface CreateArticle {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

export interface Tag {
  name: string;
}
export interface ArticleUserFavorite {
  userId: number;
  articleId: number;
}

export interface CommentDetails {
  id?: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: Author;
}
