import { ArticleRepository } from "../repositories/article.repository";
import { Logger } from "../utils/logger";
import { generateSlug } from "../utils/helper";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "./user.service";
import { ArticleCreationAttributes } from "../models/article.model";
import {
  getCache,
  setCache,
  delCache,
  delCacheByPattern,
} from "../utils/cache";
import { ApiError, formatLogError } from "../utils/apiError";

export class ArticleService {
  private readonly articleRepo = new ArticleRepository();
  private readonly userRepo = new UserRepository();
  private readonly userService = new UserService(this.logger);

  constructor(private readonly logger: Logger) {}

  async getArticle(id: string, userId: number) {
    const context = "ArticleService.getArticle";
    this.logger.info(`${context} - Started.`);

    try {
      const cacheKey = `article:${id}:user:${userId}`;

      const cached = await getCache(cacheKey);
      if (cached) {
        this.logger.info(`${context} - Cache hit.`);
        return cached;
      }
      
      const article = await this.articleRepo.findById(id);
      if (!article) {
        this.logger.warn(`${context} - Article not found.`);
        throw new ApiError(404, "Article not found");
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

      const result = {
        ...articleDetails,
        id,
        author: author,
        tagList: tags,
        favorited: isFavorited,
        favoritesCount: favoritesCount,
      };

      await setCache(cacheKey, result);
      return result;
    } catch (err) {
      this.logger.error(`${context} - ${formatLogError(err)}`);
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
        this.logger.warn(`${context} - Article already exists`);
        throw new ApiError(409, "An article with the same title already exists");
      }

      const article = {
        description: data.description,
        body: data.body,
        authorId: userId,
        slug,
        title,
      };
      const tagList = (data as any).tagList ?? [];
      const created = await this.articleRepo.create(article, tagList);

      await delCacheByPattern("articles:all*");
      await delCacheByPattern(`feed:${userId}*`);
      await delCacheByPattern(`article:*:user:*`);
      await delCache("tags:all");

      return await this.getArticle(created.id as string, userId);
    } catch (err) {
      this.logger.error(`${context} - ${formatLogError(err)}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async updateArticle(
    paramId: string,
    data: ArticleCreationAttributes,
    userId: number
  ) {
    const context = "ArticleService.updateArticle";
    this.logger.info(`${context} - Started.`);

    try {
      const original = await this.articleRepo.findById(paramId);

      if (!original) {
        this.logger.warn(`${context} - Article does not exist`);
        throw new ApiError(404, "Article does not exist");
      }

      if (original.authorId !== userId) {
        this.logger.warn(`${context} - Unauthorized to edit this`);
        throw new ApiError(403, "Unauthorized to edit this");
      }

      const articleSlug = data.title ? generateSlug(data.title) : original.slug;

      const article = {
        slug: articleSlug,
        title: data.title ?? original.title,
        description: data.description ?? original.description,
        body: data.body ?? original.body,
        authorId: userId,
      };

      const updatedArticle = await this.articleRepo.updateById(paramId, article as any);
      const newSlug = updatedArticle?.slug ?? articleSlug;

      await delCacheByPattern("articles:all*");
      await delCacheByPattern(`feed:${userId}*`);
      await delCacheByPattern(`article:*:user:*`);

      const result = await this.getArticle(paramId, userId);
      return result;
    } catch (err) {
      this.logger.error(`${context} - ${formatLogError(err)}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async deleteArticle(id: string, userId: number) {
    const context = "ArticleService.deleteArticle";
    this.logger.info(`${context} - Started`);

    try {
      const existing = await this.articleRepo.findById(id);

      if (!existing) {
        this.logger.warn(`${context} - Article does not exist`);
        throw new ApiError(404, "Article does not exist.");
      }

      const article = await this.articleRepo.findById(id);
      if (!article) {
        throw new ApiError(404, "Article not found");
      }

      if (article.authorId !== userId) {
        this.logger.warn(`${context} - Unauthorized to delete this`);
        throw new ApiError(403, "Unauthorized to delete this");
      }

      await this.articleRepo.deleteById(article.id as string);
      this.logger.info(`${context} - Article deleted`);

      await delCacheByPattern("articles:all*");
      await delCacheByPattern(`feed:${userId}*`);
      await delCacheByPattern(`article:*:user:*`);

      return { message: "Article deleted." };
    } catch (err) {
      this.logger.error(`${context} - ${formatLogError(err)}`);
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
          throw new ApiError(404, "Author not found");
        }
        const author = await this.userService.getProfile(user.username, userId);

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
      this.logger.error(`${context} - ${formatLogError(err)}`);
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
      const cacheKey = `feed:${userId}:${JSON.stringify(filters)}`;
      const cached = await getCache(cacheKey);
      if (cached) {
        this.logger.info(`${context} - Cache hit.`);
        return cached;
      }

      const { rows, count } = await this.articleRepo.listFeedArticles(filters);
      const plainArticles = rows.map((a) => a.get({ plain: true }));
      const articles = await this.getArticleDetails(plainArticles, userId);
      const result = { articles, articlesCount: count };

      await setCache(cacheKey, result);
      return result;
    } catch (err) {
      this.logger.error(`${context} - ${formatLogError(err)}`);
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
      const cacheKey = `articles:all:user:${userId ?? 0}:${JSON.stringify(
        filters
      )}`;
      const cached = await getCache(cacheKey);

      if (cached) {
        this.logger.info(`${context} - Cache hit.`);
        return cached;
      }

      const { rows, count } = await this.articleRepo.listArticles(filters);
      const plainArticles = rows.map((a) => a.get({ plain: true }));
      const articles = await this.getArticleDetails(plainArticles, userId);
      const result = { articles, articlesCount: count };

      await setCache(cacheKey, result);
      return result;
    } catch (err) {
      this.logger.error(`${context} - ${formatLogError(err)}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async favoriteArticle(id: string, userId: number) {
    const context = "ArticleService.favoriteArticle";
    this.logger.info(`${context} - Started.`);

    try {
      const article = await this.articleRepo.findById(id);
      if (!article) {
        this.logger.warn(`${context} - Article does not exist`);
        throw new ApiError(404, "Article does not exist");
      }

      await this.articleRepo.favorite(userId, article.id);
      await delCacheByPattern("articles:all*");
      await delCacheByPattern(`feed:${userId}*`);
      await delCacheByPattern(`article:*:user:*`);

      return await this.getArticle(article.id as string, userId);
    } catch (err) {
      this.logger.error(`${context} - ${formatLogError(err)}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async unfavoriteArticle(id: string, userId: number) {
    const context = "ArticleService.unfavoriteArticle";
    this.logger.info(`${context} - Started.`);

    try {
      const article = await this.articleRepo.findById(id);
      if (!article) {
        this.logger.warn(`${context} - Article does not exist`);
        throw new ApiError(404, "Article does not exist");
      }

      await this.articleRepo.unfavorite(userId, article.id);
      await delCacheByPattern("articles:all*");
      await delCacheByPattern(`feed:${userId}*`);
      await delCacheByPattern(`article:*:user:*`);

      return await this.getArticle(article.id as string, userId);
    } catch (err) {
      this.logger.error(`${context} - ${formatLogError(err)}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async getAllTags(): Promise<string[]> {
    const context = "ArticleService.getAllTags";
    this.logger.info(`${context} - Started.`);
    try {
      const cacheKey = "tags:all";
      const cached = await getCache(cacheKey);
      if (cached) {
        this.logger.info(`${context} - Cache hit.`);
        return cached;
      }

      const tags = await this.articleRepo.retrieveTags();
      if (!tags) this.logger.warn(`${context} - Empty tags.`);

      await setCache(cacheKey, tags);
      return tags;
    } catch (err) {
      this.logger.error(`${context} - ${formatLogError(err)}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async addComment(body: string, userId: number, id: string) {
    const context = "ArticleService.addComment";
    this.logger.info(`${context} - Started.`);

    try {
      const article = await this.articleRepo.findById(id);

      if (!article) {
        this.logger.warn(`${context} - Article does not exist`);
        throw new ApiError(404, "Article does not exist");
      }

      const data = {
        body: body,
        userId: userId,
        articleId: article.id,
      } as any;
      const comment = await this.articleRepo.addComment(data);

      const author = await this.userRepo.findById(comment.userId);
      const commenter = await this.userRepo.findById(userId);
      if (!author || !commenter) {
        throw new ApiError(404, "User not found");
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
      this.logger.error(`${context} - ${formatLogError(err)}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async getComments(id: string, userId?: number) {
    const context = "ArticleService.getComments";
    this.logger.info(`${context} - Started.`);
    try {
      const article = await this.articleRepo.findById(id);

      if (!article) {
        this.logger.warn(`${context} - Article does not exist`);
        throw new ApiError(404, "Article does not exist");
      }

      const comments = await this.articleRepo.getCommentsByArticleId(
        article.id as string
      );
      const commentDetails = [];
      const commenter = userId ? await this.userRepo.findById(userId) : null;

      for (const comment of comments) {
        const author = await this.userRepo.findById(comment.userId);
        if (!author) {
          throw new ApiError(404, "User not found");
        }

        const isFollowing = commenter
          ? await this.userRepo.isFollowing(commenter, author)
          : false;

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
      this.logger.error(`${context} - ${formatLogError(err)}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended`);
    }
  }

  async deleteComment(commentId: number, id: string, userId: number) {
    const context = "ArticleService.deleteComment";
    this.logger.info(`${context} - Started`);

    try {
      const article = await this.articleRepo.findById(id);

      if (!article) {
        this.logger.warn(`${context} - Article does not exist`);
        throw new ApiError(404, "Article does not exist.");
      }

      const comment = await this.articleRepo.getCommentById(commentId);
      if (!comment) {
        this.logger.warn(`${context} - Comment does not exist`);
        throw new ApiError(404, "Comment does not exist.");
      }

      if (comment.userId !== userId) {
        this.logger.warn(`${context} - Unauthorized to delete this`);
        throw new ApiError(403, "Unauthorized to delete this");
      }

      await this.articleRepo.deleteCommentById(commentId, article.id as string);
      this.logger.info(`${context} - Comment deleted`);
      return { message: "Comment deleted." };
    } catch (err) {
      this.logger.error(`${context} - ${formatLogError(err)}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }
}
