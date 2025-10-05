import { ArticleRepository } from "../repositories/article.repository";
import { Logger } from "../utils/logger";
import { generateSlug } from "../utils/helper";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "./user.service";
import { ArticleCreationAttributes } from "../models/article.model";

export class ArticleService {
  private readonly articleRepo = new ArticleRepository();
  private readonly userRepo = new UserRepository();
  private readonly userService = new UserService(this.logger);

  constructor(private readonly logger: Logger) {}

  async getArticle(slug: string, userId: number) {
    const context = "ArticleService.getArticle";
    this.logger.info(`${context} - Started.`);
    try {
      const article = await this.articleRepo.findBySlug(slug);

      if (!article) {
        this.logger.warn(`${context} - Article not found.`);
        throw new Error("Article not found");
      }

      const plainArticle = article.get({ plain: true });
      const { id: articleId, authorId, ...articleDetails } = plainArticle;

      const tags = await this.articleRepo.getTagsByArticleId(articleId);
      const isFavorited = await this.articleRepo.isFavorited(userId, articleId);
      const favoritesCount = await this.articleRepo.countFavorites(articleId);

      const authorDetails = await this.userRepo.findById(authorId!);
      const author = {
        username: authorDetails?.username,
        bio: authorDetails?.bio,
        image: authorDetails?.image,
        following: true,
      };

      return {
        ...articleDetails,
        author: author,
        tagList: tags,
        favorited: isFavorited,
        favoritesCount: favoritesCount,
      };
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async createArticle(data: ArticleCreationAttributes, userId: number) {
    const context = "ArticleService.createArticle";
    this.logger.info(`${context} - Started.`);

    try {
      const title = data.title!;
      const slug = generateSlug(title);

      const existing = await this.articleRepo.findBySlug(slug);

      if (existing) {
        this.logger.warn(
          `${context} - Article with title "${title}" already exists`
        );
        throw new Error("An article with the same title already exists");
      }

      const article = {
        description: data.description,
        body: data.body,
        authorId: userId,
        slug,
        title,
      };
      const tagList = (data as any).tagList ?? [];
      await this.articleRepo.create(article, tagList);

      return await this.getArticle(article.slug, userId);
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async updateArticle(
    paramSlug: string,
    data: ArticleCreationAttributes,
    userId: number
  ) {
    const context = "ArticleService.updateArticle";
    this.logger.info(`${context} - Started.`);

    try {
      const original = await this.articleRepo.findBySlug(paramSlug);

      if (!original) {
        this.logger.warn(`${context} - Article does not exist`);
        throw new Error("Article does not exist");
      }

      if (original.authorId !== userId) {
        this.logger.warn(`${context} - Unauthorized to edit this`);
        throw new Error("Unauthorized to edit this");
      }

      const articleSlug = data.title ? generateSlug(data.title) : original.slug;

      const article = {
        slug: articleSlug,
        title: data.title ?? original.title,
        description: data.description ?? original.description,
        body: data.body ?? original.body,
        authorId: userId,
      };

      const updatedArticle = await this.articleRepo.update(paramSlug, article);

      const result = await this.getArticle(updatedArticle?.slug!, userId);
      return result;
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async deleteArticle(slug: string, userId: number) {
    const context = "ArticleService.deleteArticle";
    this.logger.info(`${context} - Started`);

    try {
      const existing = await this.articleRepo.findBySlug(slug);

      if (!existing) {
        this.logger.warn(
          `${context} - Article with title "${slug}" does not exist`
        );
        throw new Error("Article does not exist.");
      }

      const article = await this.articleRepo.findBySlug(slug);
      if (!article) {
        throw new Error("article not found");
      }

      if (article.authorId !== userId) {
        this.logger.warn(`${context} - Unauthorized to delete this`);
        throw new Error("Unauthorized to delete this");
      }

      await this.articleRepo.delete(article.slug);
      this.logger.info(`${context} - Article deleted`);
      return { message: "Article deleted." };
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async getArticleDetails(
    articles: ArticleCreationAttributes[],
    userId?: number
  ) {
    const context = "ArticleService.getArticleDetails";
    this.logger.info(`${context} - Started.`);

    try {
      const result = [];
      for (const article of articles) {
        const tags = await this.articleRepo.getTagsByArticleId(article.id!);
        const isFavorited = userId
          ? await this.articleRepo.isFavorited(userId, article.id!)
          : false;
        const favoritesCount = await this.articleRepo.countFavorites(
          article.id!
        );

        const user = await this.userRepo.findById(article.authorId!);
        if (!user) {
          throw Error("no user");
        }
        const author = await this.userService.getProfile(
          user.username,
          userId!
        );

        result.push({
          ...article,
          author,
          tagList: tags,
          favorited: isFavorited,
          favoritesCount,
        });
      }

      return result;
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async listFeedArticles(
    filters: { limit?: number; offset?: number },
    userId?: number
  ) {
    const context = "ArticleService.listFeedArticles";
    this.logger.info(`${context} - Started.`);

    try {
      const articles = await this.articleRepo.listFeedArticles(filters);
      const plainArticles = articles.map((a) => a.get({ plain: true }));
      return await this.getArticleDetails(plainArticles, userId);
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async listArticles(
    filters: {
      tag?: string;
      author?: string;
      favorited?: string;
      limit?: number;
      offset?: number;
    },
    userId?: number
  ) {
    const context = "ArticleService.listArticles";
    this.logger.info(`${context} - Started.`);
    try {
      const articles = await this.articleRepo.listArticles(filters);
      const plainArticles = articles.map((a) => a.get({ plain: true }));
      return await this.getArticleDetails(plainArticles, userId);
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async favoriteArticle(slug: string, userId: number) {
    const context = "ArticleService.favoriteArticle";
    this.logger.info(`${context} - Started.`);

    try {
      const article = await this.articleRepo.findBySlug(slug);
      if (!article) {
        this.logger.warn(`${context} - Article does not exist`);
        throw new Error("Article does not exist");
      }

      await this.articleRepo.favorite(userId, article.id);
      return await this.getArticle(article.slug, userId);
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async unfavoriteArticle(slug: string, userId: number) {
    const context = "ArticleService.unfavoriteArticle";
    this.logger.info(`${context} - Started.`);

    try {
      const article = await this.articleRepo.findBySlug(slug);
      if (!article) {
        this.logger.warn(`${context} - Article does not exist`);
        throw new Error("Article does not exist");
      }

      await this.articleRepo.unfavorite(userId, article.id);
      return await this.getArticle(article.slug, userId);
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async getAllTags(): Promise<string[]> {
    const context = "ArticleService.getAllTags";
    this.logger.info(`${context} - Started.`);
    try {
      const tags = await this.articleRepo.retrieveTags();

      if (!tags) this.logger.warn(`${context} - Empty tags.`);

      return tags;
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async addComment(body: string, userId: number, slug: string) {
    const context = "ArticleService.addComment";
    this.logger.info(`${context} - Started.`);

    try {
      const article = await this.articleRepo.findBySlug(slug);

      if (!article) {
        this.logger.warn(`${context} - Article does not exist`);
        throw new Error("Article does not exist");
      }

      const data = {
        body: body,
        userId: userId,
        articleId: article.id,
      };
      const comment = await this.articleRepo.addComment(data);

      const author = await this.userRepo.findById(comment.userId);
      const commenter = await this.userRepo.findById(userId);
      if (!author || !commenter) {
        throw new Error("User not found");
      }

      const isFollowing = await this.userRepo.isFollowing(commenter, author);

      return {
        id: comment.id,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        body: comment.body,
        author: {
          username: author.username,
          bio: author.bio!,
          image: author.image!,
          following: isFollowing,
        },
      };
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async getComments(slug: string, userId: number) {
    const context = "ArticleService.getComments";
    this.logger.info(`${context} - Started.`);
    try {
      const article = await this.articleRepo.findBySlug(slug);

      if (!article) {
        this.logger.warn(`${context} - Article does not exist`);
        throw new Error("Article does not exist");
      }

      const comments = await this.articleRepo.getCommentsByArticleId(
        article.id!
      );
      const commentDetails = [];

      for (const comment of comments) {
        const author = await this.userRepo.findById(comment.userId);
        const commenter = await this.userRepo.findById(userId);
        if (!author || !commenter) {
          throw new Error("User not found");
        }

        const isFollowing = await this.userRepo.isFollowing(commenter, author);

        commentDetails.push({
          id: comment.id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          body: comment.body,
          author: {
            username: author.username,
            bio: author.bio ?? "",
            image: author.image ?? "",
            following: isFollowing,
          },
        });
      }

      return commentDetails;
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended`);
    }
  }

  async deleteComment(commentId: number, slug: string, userId: number) {
    const context = "ArticleService.deleteComment";
    this.logger.info(`${context} - Started`);

    try {
      const article = await this.articleRepo.findBySlug(slug);

      if (!article) {
        this.logger.warn(`${context} - Article does not exist`);
        return { message: "Article does not exist." };
      }

      const comment = await this.articleRepo.getCommentById(commentId);
      if (!comment) {
        this.logger.warn(`${context} - Comment does not exist`);
        return { message: "Comment does not exist." };
      }

      if (comment.userId !== userId) {
        this.logger.warn(`${context} - Unauthorized to delete this`);
        throw new Error("Unauthorized to delete this");
      }

      await this.articleRepo.deleteCommentById(commentId, article.id!);
      this.logger.info(`${context} - Comment deleted`);
      return { message: "Comment deleted." };
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }
}
