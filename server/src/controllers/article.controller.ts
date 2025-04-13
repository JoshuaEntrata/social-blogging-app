import { Request, Response } from "express";
import { ArticleService } from "../services/article.service";

const service = new ArticleService();

export const getArticle = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const article = await service.getArticle(slug);

  //   if (!article) {
  //     return res.status(404).json({
  //       message: "Not found",
  //     });
  //   }

  res.json({ article });
};
