import express from "express";
import { ArticleController } from "../controllers/article.controller";
import { logger } from "../utils/logger";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../middlewares/auth.middleware";

const router = express.Router();
const controller = ArticleController(logger);

router.get("/articles", optionalAuthMiddleware, controller.listArticles);

router.get(
  "/articles/feed",
  optionalAuthMiddleware,
  controller.listFeedArticles
);

router.get(
  "/articles/:id/:slug",
  optionalAuthMiddleware,
  controller.getArticleById
);

router.post("/articles", authMiddleware, controller.createArticle);

router.put("/articles/:id/:slug", authMiddleware, controller.updateArticle);

router.delete("/articles/:id/:slug", authMiddleware, controller.deleteArticle);

router.post("/articles/:id/:slug/comments", authMiddleware, controller.addComment);

router.get(
  "/articles/:id/:slug/comments",
  optionalAuthMiddleware,
  controller.getComments
);

router.delete(
  "/articles/:id/:slug/comments/:commentId",
  authMiddleware,
  controller.deleteComment
);

router.post(
  "/articles/:id/:slug/favorite",
  authMiddleware,
  controller.favoriteArticle
);

router.delete(
  "/articles/:id/:slug/favorite",
  authMiddleware,
  controller.unfavoriteArticle
);

router.get("/tags", controller.getAllTags);

export { router as articleRoutes };
