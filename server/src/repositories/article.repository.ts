import { Article } from "../models";
import mockArticles from "../models/mockArticles.json";

const articles: Article[] = mockArticles.articles;

export class ArticleRepository {
  async findBySlug(slug: string): Promise<Article | undefined> {
    return articles.find((article) => article.slug === slug);
  }
}
