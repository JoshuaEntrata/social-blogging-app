import { Article, ArticleRow } from "../models/article.model";
import { db } from "../database/db";

export class ArticleRepository {
  async findBySlug(slug: string): Promise<Article | undefined> {
    const row = db
      .prepare("SELECT * FROM articles WHERE slug = ?")
      .get(slug) as ArticleRow;

    if (!row) return undefined;

    const article: Article = {
      slug: row.slug,
      title: row.title,
      description: row.description,
      body: row.body ?? undefined,
      tagList: JSON.parse(row.tagList),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      favorited: !!row.favorited,
      favoritesCount: row.favoritesCount,
      author: {
        username: row.authorUsername,
        bio: row.authorBio,
        image: row.authorImage,
        following: !!row.authorFollowing,
      },
    };

    return article;
  }
}
