import express, { Request, Response } from "express";
import { ArticleController } from "../controllers/article.controller";
import { logger } from "../utils/logger";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();
const controller = ArticleController(logger);

router.get("/articles", (req: Request, res: Response) => {
  // List Articles
  // ?tag=
  // ?author=
  // ?favorited=
  // ?limit=20
  // ?offset=0
  res.send("List Articles Endpoint");
});

router.get("/articles/feed", (req: Request, res: Response) => {
  // Feed Articles
});

router.get("/articles/:slug", authMiddleware, controller.getArticleBySlug);

router.post("/articles", authMiddleware, controller.createArticle);

router.put("/articles/:slug", authMiddleware, controller.updateArticle);

router.delete("/articles/:slug", authMiddleware, controller.deleteArticle);

router.post("/articles/:slug/comments", (req: Request, res: Response) => {
  // Add Comments to an Article
});

router.get("/articles/:slug/comments", (req: Request, res: Response) => {
  // Get Comments from an Article
});

router.delete("/articles/:slug/comments/:id", (req: Request, res: Response) => {
  // Delete Comment
});

router.post("/articles/:slug/favorite", (req: Request, res: Response) => {
  // Favorite Article
});

router.delete("/articles/:slug/favorite", (req: Request, res: Response) => {
  // Unfavorite Article
});

router.get("/tags", authMiddleware, controller.getAllTags);

export { router as articleRoutes };
