import { ArticleRepository } from "../repositories/article.repository";
import { Article } from "../models/article.model";
import { Logger } from "../utils/logger";

export class ArticleService {
  private readonly repo = new ArticleRepository();

  constructor(private readonly logger: Logger) {}

  async getArticle(slug: string): Promise<Article | undefined> {
    const context = "ArticleService.getArticle";
    this.logger.info(`${context} - Started.`);
    try {
      const article = await this.repo.findBySlug(slug);

      if (!article) this.logger.warn(`${context} - Article not found.`);

      return article;
    } catch (err) {
      this.logger.error(`${context} - Error: ${err}`);
      throw new Error();
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }
}
