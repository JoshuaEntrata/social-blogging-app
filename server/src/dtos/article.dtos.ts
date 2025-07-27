export interface CreateCommentDTO {
  id?: number;
  body: string;
  userId: number;
  articleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface FeedArticleDTO {
  limit?: string;
  offset?: string;
}

export interface FilterDTO extends FeedArticleDTO {
  tag?: string;
  author?: string;
  favorited?: string;
}
