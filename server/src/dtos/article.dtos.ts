export interface CreateCommentDTO {
  id?: number;
  body: string;
  userId: number;
  articleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface FilterDTO {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: string;
  offset?: string;
}
