import { Article, ArticleCreationAttributes } from "../models/article.model";
import { Tag } from "../models/tag.model";
import { User } from "../models/user.model";
import { Comment } from "../models/comment.model";

export class ArticleRepository {
  async findBySlug(slug: string) {
    return await Article.findOne({ where: { slug } });
  }

  async findById(id: string) {
    return await Article.findByPk(id);
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

  async updateById(id: string, article: Partial<ArticleCreationAttributes>) {
    await Article.update(article, { where: { id } });
    return await this.findById(id);
  }

  async delete(slug: string) {
    await Article.destroy({ where: { slug } });
    return;
  }

  async deleteById(id: string) {
    await Article.destroy({ where: { id } });
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
      {
        model: User,
        as: "author",
        attributes: ["id", "username"],
        ...(author ? { where: { username: author }, required: true } : {}),
      },
      {
        model: Tag,
        as: "tags",
        attributes: ["name"],
        through: { attributes: [] },
        ...(tag ? { where: { name: tag }, required: true } : {}),
      },
    ];

    if (favorited) {
      include.push({
        model: User,
        as: "favoritedBy",
        where: { username: favorited },
        through: { attributes: [] },
        required: true,
      });
    }

    return await Article.findAndCountAll({
      where,
      include,
      limit,
      offset,
      distinct: true,
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
    return await Article.findAndCountAll({
      include: [{ model: User, as: "author", attributes: ["id", "username"] }],
      limit,
      offset,
      distinct: true,
      order: [["createdAt", "DESC"]],
    });
  }

  async retrieveTags() {
    const tags = await Tag.findAll({ attributes: ["name"] });
    return tags.map((t) => t.name);
  }

  async getTagsByArticleId(articleId: string) {
    const article = await Article.findByPk(articleId, {
      include: [{ model: Tag, as: "tags", attributes: ["name"] }],
    });
    return article ? article.tags?.map((t: any) => t.name) : [];
  }

  async favorite(userId: number, articleId: string) {
    const article = await Article.findByPk(articleId);
    const user = await User.findByPk(userId);
    if (article && user) await (user as any).addFavoritedArticle(article);
  }

  async unfavorite(userId: number, articleId: string) {
    const article = await Article.findByPk(articleId);
    const user = await User.findByPk(userId);
    if (article && user) await (user as any).removeFavoritedArticle(article);
  }

  async isFavorited(userId: number, articleId: string) {
    const user = await User.findByPk(userId);
    if (!user) return false;
    return await (user as any).hasFavoritedArticle(articleId);
  }

  async countFavorites(articleId: string) {
    const article = await Article.findByPk(articleId, {
      include: [{ model: User, as: "favoritedBy" }],
    });
    return article ? article.favoritedBy?.length : 0;
  }

  async findComment(id: number) {
    return await Comment.findOne({ where: { id } });
  }

  async addComment(data: { body: string; userId: number; articleId: string }) {
    return await Comment.create(data as any);
  }

  async getCommentsByArticleId(articleId: string) {
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

  async deleteCommentById(commentId: number, articleId: string) {
    await Comment.destroy({ where: { id: commentId, articleId } });
  }
}
