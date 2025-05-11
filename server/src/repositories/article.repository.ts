import { Article, ArticleUserFavorite, Tag } from "../models/article.model";
import { db } from "../database/db";
import {
  ADD_COMMENT,
  ADD_FAVORITE,
  COUNT_FAVORITES,
  DELETE_ARTICLE_BY_SLUG,
  DELETE_COMMENT_BY_ID,
  FIND_ARTICLE_BY_SLUG,
  FIND_COMMENT,
  GET_COMMENT_BY_ID,
  GET_COMMENTS_BY_ARTICLE_ID,
  GET_TAG_ID,
  GET_TAGS_BY_ARTICLE_ID,
  INSERT_TAG,
  IS_FAVORITED,
  LINK_TAG,
  REMOVE_FAVORITE,
  RETRIVE_TAGS,
  SAVE_ARTICLE,
  UPDATE_ARTICLE,
} from "./queries";
import { CreateCommentDTO } from "../dtos/article.dtos";

export class ArticleRepository {
  async findBySlug(slug: string): Promise<Article> {
    const row = db.prepare(FIND_ARTICLE_BY_SLUG).get(slug) as Article;

    const article: Article = {
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      body: row.body,
      authorId: row.authorId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };

    return article;
  }

  async save(article: Article, tagList?: string[]): Promise<void> {
    const row = db
      .prepare(SAVE_ARTICLE)
      .run(
        article.slug,
        article.title,
        article.description,
        article.body,
        article.authorId,
        article.createdAt,
        article.updatedAt
      );

    if (tagList) {
      const insertTag = db.prepare(INSERT_TAG);
      const getTagId = db.prepare(GET_TAG_ID);
      const linkTag = db.prepare(LINK_TAG);
      const articleId = row.lastInsertRowid as number;

      for (const tag of tagList) {
        insertTag.run(tag);
        const tagRow = getTagId.get(tag) as { id: number };
        linkTag.run(articleId, tagRow.id);
      }
    }
  }

  async update(paramSlug: string, article: Article): Promise<Article> {
    db.prepare(UPDATE_ARTICLE).run(
      article.slug,
      article.title,
      article.description,
      article.body,
      article.updatedAt,
      paramSlug
    );

    return await this.findBySlug(article.slug);
  }

  async delete(slug: string) {
    db.prepare(DELETE_ARTICLE_BY_SLUG).run(slug);
  }

  async retrieveTags(): Promise<string[]> {
    const rows = db.prepare(RETRIVE_TAGS).all() as Tag[];
    return rows.map((r) => r.name);
  }

  async getTagsByArticleId(articleId: number): Promise<string[]> {
    const rows = db.prepare(GET_TAGS_BY_ARTICLE_ID).all(articleId) as Tag[];
    return rows.map((row) => row.name);
  }

  async favorite(ids: ArticleUserFavorite): Promise<void> {
    db.prepare(ADD_FAVORITE).run(ids.userId, ids.articleId);
  }

  async unfavorite(ids: ArticleUserFavorite): Promise<void> {
    db.prepare(REMOVE_FAVORITE).run(ids.userId, ids.articleId);
  }

  async isFavorited(ids: ArticleUserFavorite): Promise<boolean> {
    const row = db.prepare(IS_FAVORITED).get(ids.userId, ids.articleId) as {
      count: number;
    };
    return row.count > 0;
  }

  async countFavorites(articleId: number): Promise<number> {
    const row = db.prepare(COUNT_FAVORITES).get(articleId) as {
      count: number;
    };
    return row.count;
  }

  async findComment(id: number): Promise<CreateCommentDTO> {
    return db.prepare(FIND_COMMENT).get(id) as CreateCommentDTO;
  }

  async addComment(data: CreateCommentDTO): Promise<number> {
    const result = db
      .prepare(ADD_COMMENT)
      .run(
        data.body,
        data.userId,
        data.articleId,
        data.createdAt,
        data.updatedAt
      );

    return result.lastInsertRowid as number;
  }

  async getCommentsByArticleId(articleId: number): Promise<CreateCommentDTO[]> {
    return db
      .prepare(GET_COMMENTS_BY_ARTICLE_ID)
      .all(articleId) as CreateCommentDTO[];
  }

  async getCommentById(commentId: number): Promise<CreateCommentDTO> {
    return db.prepare(GET_COMMENT_BY_ID).get(commentId) as CreateCommentDTO;
  }

  async deleteCommentById(commentId: number, articleId: number) {
    db.prepare(DELETE_COMMENT_BY_ID).run(commentId, articleId);
  }
}
