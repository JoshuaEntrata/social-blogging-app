export interface Author {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  body?: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Author;
}

export interface Articles {
  articles: Article[];
  articlesCount: number;
}

export interface ArticleRow {
  slug: string;
  title: string;
  description: string;
  body: string | null;
  tagList: string;
  createdAt: string;
  updatedAt: string;
  favorited: number;
  favoritesCount: number;
  authorUsername: string;
  authorBio: string;
  authorImage: string;
  authorFollowing: number;
}

export interface Tag {
  name: string;
}
