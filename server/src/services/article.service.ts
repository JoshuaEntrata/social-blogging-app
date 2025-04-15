import { ArticleRepository } from "../repositories/article.repository";
import { Article } from "../models/article.model";
import { Logger } from "../utils/logger";
import { generateSlug } from "../utils/helper";

const mockAuthorDetails = {
  username: "Joshua Kyle",
  bio: "Author buo placeholder",
  image: "https://placehold.co/400",
};
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

  async createArticle(data: Partial<Article>): Promise<Article> {
    const context = "ArticleService.createArticle";
    this.logger.info(`${context} - Started.`);

    const title = data.title!;
    const slug = generateSlug(title);

    const existing = await this.repo.findBySlug(slug);
    if (existing) {
      this.logger.warn(
        `${context} - Article with title "${title}" already exists`
      );
      throw new Error("An article with the same title already exists");
    }

    const now = new Date().toISOString();

    const article: Article = {
      slug,
      title: title,
      description: data.description!,
      body: data.body!,
      tagList: data.tagList ?? [],
      createdAt: now,
      updatedAt: now,
      favorited: false,
      favoritesCount: 0,
      author: {
        username: mockAuthorDetails.username,
        bio: mockAuthorDetails.bio,
        image: mockAuthorDetails.image,
        following: false,
      },
    };

    this.repo.save(article);
    return article;
  }
}
