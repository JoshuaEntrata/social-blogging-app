import { Article, ArticleCreationAttributes } from "../models/article.model";
import { Tag } from "../models/tag.model";
import { User } from "../models/user.model";
import { Comment } from "../models/comment.model";

export class ArticleRepository {
  async findBySlug(slug: string) {
    return await Article.findOne({ where: { slug } });
  }

  async create(article: ArticleCreationAttributes, tagList?: string[]) {
    const articleCreated = await Article.create(article);

    if (tagList && tagList.length > 0) {
      for (const tagName of tagList) {
        const [tag] = await Tag.findOrCreate({ where: { name: tagName } });
        await (articleCreated as any).addTag(tag);
      }
    }

    return articleCreated;
  }

  async update(slug: string, article: ArticleCreationAttributes) {
    await Article.update(article, { where: { slug } });
    return await this.findBySlug(slug);
  }

  async delete(slug: string) {
    await Article.destroy({ where: { slug } });
    return;
  }

  async listArticles(filters: {
    tag?: string;
    author?: string;
    favorited?: string;
    limit?: number;
    offset?: number;
  }) {
    const { tag, author, favorited, limit = 20, offset = 0 } = filters;
    const where: any = {};
    const include: any[] = [
      { model: User, as: "author", attributes: ["id", "username"] },
      {
        model: Tag,
        as: "tags",
        attributes: ["name"],
        through: { attributes: [] },
      },
    ];

    if (tag) {
      include.push({
        model: Tag,
        as: "tags",
        where: { name: tag },
        through: { attributes: [] },
      });
    }

    if (author) {
      include.push({
        model: User,
        as: "author",
        where: { username: author },
      });
    }

    if (favorited) {
      include.push({
        model: User,
        as: "favoritedBy",
        where: { username: favorited },
        through: { attributes: [] },
      });
    }

    return await Article.findAll({
      where,
      include,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
  }

  async listFeedArticles({
    limit = 20,
    offset = 0,
  }: {
    limit?: number;
    offset?: number;
  }) {
    return await Article.findAll({
      include: [{ model: User, as: "author", attributes: ["id", "username"] }],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
  }

  async retrieveTags() {
    const tags = await Tag.findAll({ attributes: ["name"] });
    return tags.map((t) => t.name);
  }

  async getTagsByArticleId(articleId: number) {
    const article = await Article.findByPk(articleId, {
      include: [{ model: Tag, as: "tags", attributes: ["name"] }],
    });
    return article ? article.tags?.map((t: any) => t.name) : [];
  }

  async favorite(userId: number, articleId: number) {
    const article = await Article.findByPk(articleId);
    const user = await User.findByPk(userId);
    if (article && user) await (user as any).addFavoritedArticle(article);
  }

  async unfavorite(userId: number, articleId: number) {
    const article = await Article.findByPk(articleId);
    const user = await User.findByPk(userId);
    if (article && user) await (user as any).removeFavoritedArticle(article);
  }

  async isFavorited(userId: number, articleId: number) {
    const user = await User.findByPk(userId);
    if (!user) return false;
    return await (user as any).hasFavoritedArticle(articleId);
  }

  async countFavorites(articleId: number) {
    const article = await Article.findByPk(articleId, {
      include: [{ model: User, as: "favoritedBy" }],
    });
    return article ? article.favoritedBy?.length : 0;
  }

  async findComment(id: number) {
    return await Comment.findOne({ where: { id } });
  }

  async addComment(data: { body: string; userId: number; articleId: number }) {
    return await Comment.create(data);
  }

  async getCommentsByArticleId(articleId: number) {
    return await Comment.findAll({
      where: { articleId },
      include: [
        { model: User, as: "author", attributes: ["id", "username", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async getCommentById(commentId: number) {
    return await Comment.findByPk(commentId, {
      include: [{ model: User, as: "author", attributes: ["username"] }],
    });
  }

  async deleteCommentById(commentId: number, articleId: number) {
    await Comment.destroy({ where: { id: commentId, articleId } });
  }
}
