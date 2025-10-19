import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { logger, Logger } from "../utils/logger";
import { ArticleService } from "../services/article.service";

export const ArticleController = (log: Logger = logger) => {
  const service = new ArticleService(log);
  let context;

  return {
    getArticleBySlug: async (req: AuthRequest, res: Response) => {
      context = "ArticleController.getArticleBySlug";
      log.info(`${context} - Started`);

      try {
        const { slug } = req.params;
        const userId = req.user?.id ?? 0;

        const article = await service.getArticle(slug, userId);

        res.status(200).json({ article });
      } catch (err) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: err });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    createArticle: async (req: AuthRequest, res: Response) => {
      context = "ArticleController.createArticle";
      log.info(`${context} - Started`);

      try {
        const { article } = req.body;
        const userId = req.user?.id;

        if (!userId) {
          log.warn(`${context} - Unauthorized access`);
          res.status(401).json({ message: "Unauthorized access" });
          return;
        }

        if (!article?.title || !article?.description || !article?.body) {
          log.warn(`${context} - Missing required fields`);
          log.warn(JSON.stringify(article));
          res.status(400).json({ message: "Missing required fields" });
          return;
        }

        const result = await service.createArticle(article, userId);
        log.info(`${context} - Article created`);

        res.status(201).json({ article: result });
      } catch (err: any) {
        logger.error(`${context} - ${err}`);

        if (err.message.includes("already exists")) {
          res.status(409).json({ message: err.message });
          return;
        }

        res.status(500).json({ message: err.message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    updateArticle: async (req: AuthRequest, res: Response) => {
      context = "ArticleController.updateArticle";
      log.info(`${context} - Started`);

      try {
        const { slug } = req.params;
        const { article } = req.body;
        const userId = req.user?.id;

        if (!userId) {
          log.warn(`${context} - Unauthorized access`);
          res.status(401).json({ message: "Unauthorized access" });
          return;
        }

        if (!article || typeof article !== "object") {
          log.warn(`${context} - Invalid request body`);
          res.status(400).json({ message: "Invalid request body format" });
          return;
        }

        const allowedFields = ["title", "description", "body"];
        const submittedFields = Object.keys(article);

        const hasValidFields = submittedFields.some((key) =>
          allowedFields.includes(key)
        );

        if (!hasValidFields) {
          log.warn(`${context} - No updatable fields provided`);
          res.status(400).json({
            message: "At least one valid field is required to update",
          });
          return;
        }

        const hasInvalidFields = submittedFields.some(
          (key) => !allowedFields.includes(key)
        );

        if (hasInvalidFields) {
          log.warn(`${context} - Contains unsupported fields`);
          res
            .status(400)
            .json({ message: "Request contains unsupported fields" });
          return;
        }

        const result = await service.updateArticle(slug, article, userId);
        log.info(`${context} - Article updated`);

        res.status(200).json({ article: result });
      } catch (err: any) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: err.message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    deleteArticle: async (req: AuthRequest, res: Response) => {
      context = "ArticleController.deleteArticle";
      log.info(`${context} - Started`);

      try {
        const { slug } = req.params;
        const userId = req.user?.id;

        if (!userId) {
          log.warn(`${context} - Unauthorized access`);
          res.status(401).json({ message: "Unauthorized access" });
          return;
        }

        const result = await service.deleteArticle(slug, userId);

        res.status(200).json(result);
      } catch (err: any) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: err.message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    listFeedArticles: async (req: AuthRequest, res: Response) => {
      const context = "ArticleController.listFeedArticles";
      log.info(`${context} - Started`);

      try {
        const { limit, offset } = req.query;
        const userId = req.user?.id ?? 0;

        const articles = await service.listFeedArticles(
          {
            limit: limit ? parseInt(limit as string) : undefined,
            offset: offset ? parseInt(offset as string) : undefined,
          },
          userId
        );

        res.status(200).json({ articles, articlesCount: articles.length });
      } catch (err: any) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: err.message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    listArticles: async (req: AuthRequest, res: Response) => {
      const context = "ArticleController.listArticles";
      log.info(`${context} - Started`);

      try {
        const { tag, author, favorited, limit, offset } = req.query;
        const userId = req.user?.id ?? 0;

        const articles = await service.listArticles(
          {
            tag: tag as string | undefined,
            author: author as string | undefined,
            favorited: favorited as string | undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            offset: offset ? parseInt(offset as string) : undefined,
          },
          userId
        );

        res.status(200).json({ articles, articlesCount: articles.length });
      } catch (err: any) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: err.message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    favoriteArticle: async (req: AuthRequest, res: Response) => {
      context = "ArticleController.favoriteArticle";
      log.info(`${context} - Started`);

      try {
        const { slug } = req.params;
        const userId = req.user?.id;

        if (!userId) {
          log.warn(`${context} - Unauthorized access`);
          res.status(401).json({ message: "Unauthorized access" });
          return;
        }

        const article = await service.favoriteArticle(slug, userId);

        res.status(200).json({ article });
      } catch (err: any) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: err.message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    unfavoriteArticle: async (req: AuthRequest, res: Response) => {
      context = "ArticleController.unfavoriteArticle";
      log.info(`${context} - Started`);

      try {
        const { slug } = req.params;
        const userId = req.user?.id;

        if (!userId) {
          log.warn(`${context} - Unauthorized access`);
          res.status(401).json({ message: "Unauthorized access" });
          return;
        }

        const article = await service.unfavoriteArticle(slug, userId);

        res.status(200).json({ article });
      } catch (err: any) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: err.message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    getAllTags: async (req: Request, res: Response) => {
      context = "ArticleController.getAllTags";
      log.info(`${context} - Started`);

      try {
        const tags = await service.getAllTags();

        res.status(200).json({ tags });
      } catch (err: any) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: err.message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    addComment: async (req: AuthRequest, res: Response) => {
      context = "ArticleController.addComment";
      log.info(`${context} - Started`);

      try {
        const { comment } = req.body;
        const { slug } = req.params;
        const userId = req.user?.id;

        if (!userId) {
          log.warn(`${context} - Unauthorized access`);
          res.status(401).json({ message: "Unauthorized access" });
          return;
        }

        const result = await service.addComment(comment.body, userId, slug);
        log.info(`${context} - Comment added`);

        res.status(201).json({ comment: result });
      } catch (err: any) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: err.message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    getComments: async (req: AuthRequest, res: Response) => {
      context = "ArticleController.getComments";
      log.info(`${context} - Started`);

      try {
        const { slug } = req.params;
        const userId = req.user?.id ?? 1;

        const result = await service.getComments(slug, userId);
        log.info(`${context} - Comments for ${slug} retrieved.`);

        res.status(200).json({ comments: result });
      } catch (err: any) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: err.message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    deleteComment: async (req: AuthRequest, res: Response) => {
      context = "ArticleController.deleteComment";
      log.info(`${context} - Started`);

      try {
        const { id, slug } = req.params;
        const userId = req.user?.id;

        if (!userId) {
          log.warn(`${context} - Unauthorized access`);
          res.status(401).json({ message: "Unauthorized access" });
          return;
        }

        const commentId = parseInt(id);
        const result = await service.deleteComment(commentId, slug, userId);

        res.status(200).json(result);
      } catch (err: any) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: err.message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },
  };
};
