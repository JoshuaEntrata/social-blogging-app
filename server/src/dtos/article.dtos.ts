export interface CreateCommentDTO {
  id?: number;
  body: string;
  userId: number;
  articleId: number;
  createdAt: string;
  updatedAt: string;
}
