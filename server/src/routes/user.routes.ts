import express, { Request, Response } from "express";
import { UserController } from "../controllers/user.controller";
import { logger } from "../utils/logger";

const router = express.Router();
const controller = UserController(logger);

router.post("/users/login", controller.login);

router.post("/users", controller.register);

router.get("/users", (req: Request, res: Response) => {
  // Get Current User
  res.send("Get Current User Endpoint");
});

router.put("/users", (req: Request, res: Response) => {
  // Update User
});

router.get("/profiles/:username", (req: Request, res: Response) => {
  // Get Profile
});

router.post("/profiles/:username/follow", (req: Request, res: Response) => {
  // Follow User
});

router.delete("/profiles/:username/follow", (req: Request, res: Response) => {
  // Unfollow User
});

export { router as userRoutes };
