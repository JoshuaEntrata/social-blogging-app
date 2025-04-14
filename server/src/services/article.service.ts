import { ArticleRepository } from "../repositories/article.repository";
import { Article } from "../models/article.model";

export class ArticleService {
  constructor(private readonly repo = new ArticleRepository()) {}

  async getArticle(slug: string): Promise<Article | undefined> {
    let article;
    const title = "ArticleService.getArticle";
    console.log(`${title} started.`);
    try {
      article = await this.repo.findBySlug(slug);

      if (!article) {
        console.log(`${title} empty.`);
      }
    } catch (err) {
      console.log(`${title} error: ${err}`);
    }
    console.log(`${title} ended.`);
    return article;
  }
}
