import express, { Request, Response } from "express";

const router = express.Router();

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

router.get("/articles/:slug", (req: Request, res: Response) => {
  // Get Article
});

router.post("/articles", (req: Request, res: Response) => {
  // Create Article
});

router.put("/articles/:slug", (req: Request, res: Response) => {
  // Update Article
});

router.delete("/articles/:slug", (req: Request, res: Response) => {
  // Delete Article
});

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

router.get("/tags", (req: Request, res: Response) => {
  // Get Tags
});

export { router as articleRoutes };
