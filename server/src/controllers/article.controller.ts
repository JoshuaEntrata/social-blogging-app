import { Request, Response } from "express";
import { logger, Logger } from "../utils/logger";
import { ArticleService } from "../services/article.service";

export const ArticleController = (log: Logger = logger) => {
  const service = new ArticleService(log);
  let context;

  return {
    getArticleBySlug: async (req: Request, res: Response) => {
      context = "ArticleController.getArticleBySlug";
      log.info(`${context} - Started`);

      try {
        const { slug } = req.params;
        const article = await service.getArticle(slug);

        res.status(200).json({ article });
      } catch (err) {
        logger.error(`${context} - Error: ${err}`);
        res.status(500).json({ message: "Internal server error" });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    createArticle: async (req: Request, res: Response) => {
      context = "ArticleController.createArticle";
      log.info(`${context} - Started`);

      try {
        const { article } = req.body;

        if (!article?.title || !article?.description || !article?.body) {
          log.warn(`${context} - Missing required fields`);
          res.status(400).json({ message: "Missing required fields" });
          return;
        }

        const createdArticle = await service.createArticle(article);
        log.info(`${context} - Article created`);

        res.status(201).json({ article: createdArticle });
      } catch (err: any) {
        logger.error(`${context} - Error: ${err}`);

        if (err.message.includes("already exists")) {
          res.status(409).json({ message: err.message });
          return;
        }

        res.status(500).json({ message: "Internal server error" });
      } finally {
        log.info(`${context} - Ended`);
      }
    },
  };
};
