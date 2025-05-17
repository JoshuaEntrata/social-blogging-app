import express, { Request, Response } from "express";
import { ArticleController } from "../controllers/article.controller";
import { logger } from "../utils/logger";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();
const controller = ArticleController(logger);

router.get("/articles", controller.listArticles);

router.get("/articles/feed", (req: Request, res: Response) => {
  // Feed Articles
});

router.get("/articles/:slug", authMiddleware, controller.getArticleBySlug);

router.post("/articles", authMiddleware, controller.createArticle);

router.put("/articles/:slug", authMiddleware, controller.updateArticle);

router.delete("/articles/:slug", authMiddleware, controller.deleteArticle);

router.post("/articles/:slug/comments", authMiddleware, controller.addComment);

router.get("/articles/:slug/comments", controller.getComments);

router.delete(
  "/articles/:slug/comments/:id",
  authMiddleware,
  controller.deleteComment
);

router.post(
  "/articles/:slug/favorite",
  authMiddleware,
  controller.favoriteArticle
);

router.delete(
  "/articles/:slug/favorite",
  authMiddleware,
  controller.unfavoriteArticle
);

router.get("/tags", authMiddleware, controller.getAllTags);

export { router as articleRoutes };
