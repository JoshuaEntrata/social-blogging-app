import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { logger, Logger } from "../utils/logger";
import { ArticleService } from "../services/article.service";
import { ApiError, formatLogError, sendErrorResponse } from "../utils/apiError";
import { parseQueryInt } from "../utils/helper";

export const ArticleController = (log: Logger = logger) => {
  const service = new ArticleService(log);
  let context;

  return {
    getArticleById: async (req: AuthRequest, res: Response) => {
      context = "ArticleController.getArticleById";
      log.info(`${context} - Started`);

      try {
        const { id } = req.params;
        const userId = req.user?.id ?? 0;

        const article = await service.getArticle(id, userId);

        res.status(200).json({ article });
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
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
          log.warn(`${context} - Unauthorized access. | Reason: User ID is missing.`);
          throw new ApiError(401, "Unauthorized access");
        }

        if (!article?.title || !article?.description || !article?.body) {
          log.warn(`${context} - Missing required fields`);
          res.status(400).json({ message: "Missing required fields" });
          return;
        }

        const result = await service.createArticle(article, userId);
        log.info(`${context} - Article created`);

        res.status(201).json({ article: result });
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    updateArticle: async (req: AuthRequest, res: Response) => {
      context = "ArticleController.updateArticle";
      log.info(`${context} - Started`);

      try {
        const { id } = req.params;
        const { article } = req.body;
        const userId = req.user?.id;

        if (!userId) {
          log.warn(`${context} - Unauthorized access`);
          throw new ApiError(401, "Unauthorized access. | Reason: User ID is missing.");
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

        const result = await service.updateArticle(id, article, userId);
        log.info(`${context} - Article updated`);

        res.status(200).json({ article: result });
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    deleteArticle: async (req: AuthRequest, res: Response) => {
      context = "ArticleController.deleteArticle";
      log.info(`${context} - Started`);

      try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
          log.warn(`${context} - Unauthorized access`);
          throw new ApiError(401, "Unauthorized access. | Reason: User ID is missing.");
        }

        const result = await service.deleteArticle(id, userId);

        res.status(200).json(result);
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    listFeedArticles: async (req: AuthRequest, res: Response) => {
      const context = "ArticleController.listFeedArticles";
      log.info(`${context} - Started`);

      try {
        const userId = req.user?.id ?? 0;

        const result = await service.listFeedArticles(
          {
            limit: parseQueryInt(req.query.limit, "limit"),
            offset: parseQueryInt(req.query.offset, "offset"),
          },
          userId
        );

        res.status(200).json(result);
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    listArticles: async (req: AuthRequest, res: Response) => {
      const context = "ArticleController.listArticles";
      log.info(`${context} - Started`);

      try {
        const { tag, author, favorited } = req.query;
        const userId = req.user?.id ?? 0;

        const result = await service.listArticles(
          {
            tag: tag as string | undefined,
            author: author as string | undefined,
            favorited: favorited as string | undefined,
            limit: parseQueryInt(req.query.limit, "limit"),
            offset: parseQueryInt(req.query.offset, "offset"),
          },
          userId
        );

        res.status(200).json(result);
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    favoriteArticle: async (req: AuthRequest, res: Response) => {
      context = "ArticleController.favoriteArticle";
      log.info(`${context} - Started`);

      try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
          log.warn(`${context} - Unauthorized access`);
          throw new ApiError(401, "Unauthorized access. | Reason: User ID is missing.");
        }

        const article = await service.favoriteArticle(id, userId);

        res.status(200).json({ article });
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    unfavoriteArticle: async (req: AuthRequest, res: Response) => {
      context = "ArticleController.unfavoriteArticle";
      log.info(`${context} - Started`);

      try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
          log.warn(`${context} - Unauthorized access`);
          throw new ApiError(401, "Unauthorized access. | Reason: User ID is missing.");
        }

        const article = await service.unfavoriteArticle(id, userId);

        res.status(200).json({ article });
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
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
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    addComment: async (req: AuthRequest, res: Response) => {
      context = "ArticleController.addComment";
      log.info(`${context} - Started`);

      try {
        const { comment } = req.body;
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
          log.warn(`${context} - Unauthorized access`);
          throw new ApiError(401, "Unauthorized access. | Reason: User ID is missing.");
        }

        if (!comment?.body) {
          log.warn(`${context} - Missing required fields`);
          throw new ApiError(400, "Missing required fields");
        }

        const result = await service.addComment(comment.body, userId, id);
        log.info(`${context} - Comment added`);

        res.status(201).json({ comment: result });
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    getComments: async (req: AuthRequest, res: Response) => {
      context = "ArticleController.getComments";
      log.info(`${context} - Started`);

      try {
        const { id } = req.params;
        const userId = req.user?.id;

        const result = await service.getComments(id, userId);
        log.info(`${context} - Comments retrieved`);

        res.status(200).json({ comments: result });
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    deleteComment: async (req: AuthRequest, res: Response) => {
      context = "ArticleController.deleteComment";
      log.info(`${context} - Started`);

      try {
        const { commentId, id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
          log.warn(`${context} - Unauthorized access`);
          throw new ApiError(401, "Unauthorized access. | Reason: User ID is missing.");
        }

        const parsedCommentId = parseInt(commentId as string);
        if (!Number.isInteger(parsedCommentId)) {
          throw new ApiError(400, "Comment id must be a number");
        }
        const result = await service.deleteComment(parsedCommentId, id, userId);

        res.status(200).json(result);
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
      } finally {
        log.info(`${context} - Ended`);
      }
    },
  };
};
