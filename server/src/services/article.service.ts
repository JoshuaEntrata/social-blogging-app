import { ArticleRepository } from "../repositories/article.repository";
import { Article } from "../models";

export class ArticleService {
  constructor(private readonly repo = new ArticleRepository()) {}

  async getArticle(slug: string): Promise<Article | undefined> {
    return this.repo.findBySlug(slug);
  }
}
