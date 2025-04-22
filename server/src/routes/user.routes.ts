import express, { Request, Response } from "express";
import { UserController } from "../controllers/user.controller";
import { logger } from "../utils/logger";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();
const controller = UserController(logger);

router.post("/users/login", controller.login);

router.post("/users", controller.register);

router.get("/user", authMiddleware, controller.currentUser);

router.put("/user", authMiddleware, controller.updateUser);

router.get("/profiles/:username", authMiddleware, controller.getProfile);

router.post(
  "/profiles/:username/follow",
  authMiddleware,
  controller.followUser
);

router.delete(
  "/profiles/:username/follow",
  authMiddleware,
  controller.unfollowUser
);

export { router as userRoutes };
