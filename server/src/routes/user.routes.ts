import express, { Request, Response } from "express";
import { UserController } from "../controllers/user.controller";
import { logger } from "../utils/logger";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();
const controller = UserController(logger);

router.post("/users/login", controller.login);

router.post("/users", controller.register);

router.get("/user", authMiddleware, controller.currentUser);

router.put("/users", (req: Request, res: Response) => {
  // Update User
});

router.get("/profiles/:username", authMiddleware, controller.getProfile);

router.post("/profiles/:username/follow", (req: Request, res: Response) => {
  // Follow User
});

router.delete("/profiles/:username/follow", (req: Request, res: Response) => {
  // Unfollow User
});

export { router as userRoutes };
