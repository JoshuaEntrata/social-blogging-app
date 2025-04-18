import { Article, ArticleRow, Tag } from "../models/article.model";
import { db } from "../database/db";
import {
  DELETE_BY_SLUG,
  FIND_BY_SLUG,
  GET_TAG_ID,
  INSERT_TAG,
  LINK_TAG,
  RETRIVE_TAGS,
  SAVE_ARTICLE,
  UPDATE_ARTICLE,
} from "./queries";

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
    const insertArticle = db.prepare(SAVE_ARTICLE);
    const insertTag = db.prepare(INSERT_TAG);
    const getTagId = db.prepare(GET_TAG_ID);
    const linkTag = db.prepare(LINK_TAG);

    const result = insertArticle.run(
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

    const articleId = result.lastInsertRowid as number;

    for (const tag of article.tagList) {
      insertTag.run(tag);
      const tagRow = getTagId.get(tag) as { id: number };
      linkTag.run(articleId, tagRow.id);
    }
  }

  async update(
    paramSlug: string,
    article: Article
  ): Promise<Article | undefined> {
    db.prepare(UPDATE_ARTICLE).run(
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
      article.author.following ? 1 : 0,
      paramSlug
    );

    return this.findBySlug(article.slug);
  }

  async delete(slug: string) {
    db.prepare(DELETE_BY_SLUG).run(slug);
  }

  async retrieveTags(): Promise<string[] | undefined> {
    const rows = db.prepare(RETRIVE_TAGS).all() as Tag[];
    return rows.map((r) => r.name);
  }
}
