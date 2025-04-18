import express, { Request, Response } from "express";
import { UserController } from "../controllers/user.controller";
import { logger } from "../utils/logger";

const router = express.Router();
const controller = UserController(logger);

router.post("/users", controller.registerUser);

export { router as userRoutes };
