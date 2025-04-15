import { Article, ArticleRow } from "../models/article.model";
import { db } from "../database/db";
import { FIND_BY_SLUG, SAVE_ARTICLE } from "./queries";

export class ArticleRepository {
  async findBySlug(slug: string): Promise<Article | undefined> {
    const row = db.prepare(FIND_BY_SLUG).get(slug) as ArticleRow;

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

  async save(article: Article): Promise<void> {
    db.prepare(SAVE_ARTICLE).run(
      article.slug,
      article.title,
      article.description,
      article.body ?? null,
      JSON.stringify(article.tagList),
      article.createdAt,
      article.updatedAt,
      article.favorited ? 1 : 0,
      article.favoritesCount,
      article.author.username,
      article.author.bio,
      article.author.image,
      article.author.following ? 1 : 0
    );
  }
}
