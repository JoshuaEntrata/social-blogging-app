import { Request, Response } from "express";
import { logger, Logger } from "../utils/logger";
import { ArticleService } from "../services/article.service";

export const ArticleController = (log: Logger = logger) => {
  const service = new ArticleService(log);

  return {
    getArticleBySlug: async (req: Request, res: Response) => {
      const context = "ArticleController.getArticleBySlug";
      log.info(`${context} - Started`);
      try {
        const { slug } = req.params;
        const article = await service.getArticle(slug);

        res.json({ article });
      } catch (err) {
        logger.error(`${context} - Error: ${err}`);
        throw new Error();
      } finally {
        log.info(`${context} - Ended`);
      }
    },
  };
};
