import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { logger, Logger } from "../utils/logger";

export const UserController = (log: Logger = logger) => {
  const service = new UserService(log);
  let context;

  return {
    registerUser: async (req: Request, res: Response) => {
      context = "UserController.registerUser";
      log.info(`${context} - Started`);
      try {
        const { user } = req.body;

        if (!user?.username || !user?.email || !user?.password) {
          log.warn(`${context} - Missing required fields`);
          res.status(400).json({ message: "Missing required fields" });
          return;
        }

        const result = await service.registerUser(user);
        log.info(`${context} - User created`);

        res.status(201).json({
          user: {
            username: user.username,
            email: user.email,
            token: result,
          },
        });
      } catch (err) {
        logger.error(`${context} - Error: ${err}`);
        res.status(500).json({ message: (err as Error).message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },
  };
};
