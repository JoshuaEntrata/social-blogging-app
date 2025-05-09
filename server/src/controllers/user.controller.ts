import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { logger, Logger } from "../utils/logger";
import { AuthRequest } from "../middlewares/auth.middleware";

export const UserController = (log: Logger = logger) => {
  const service = new UserService(log);
  let context;

  return {
    register: async (req: Request, res: Response) => {
      context = "UserController.register";
      log.info(`${context} - Started`);
      try {
        const { user } = req.body;

        if (!user?.username || !user?.email || !user?.password) {
          log.warn(`${context} - Missing required fields`);
          res.status(400).json({ message: "Missing required fields" });
          return;
        }

        const registeredUser = await service.registerUser(user);
        log.info(`${context} - User "${user.email}" created`);

        res.status(201).json({
          user: registeredUser,
        });
      } catch (err) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: (err as Error).message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    login: async (req: Request, res: Response) => {
      context = "UserController.register";
      log.info(`${context} - Started`);
      try {
        const { user } = req.body;

        if (!user?.email || !user?.password) {
          log.warn(`${context} - Missing required fields`);
          res.status(400).json({ message: "Missing required fields" });
          return;
        }

        const token = await service.loginUser(user);
        log.info(`${context} - User "${user.email}" logged in.`);

        res.status(200).json({
          user: {
            username: user.username,
            email: user.email,
            token: token,
          },
        });
      } catch (err) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: (err as Error).message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    currentUser: async (req: AuthRequest, res: Response) => {
      context = "UserController.currentUser";
      log.info(`${context} - Started`);

      try {
        const userId = req.user?.id;
        const token = req.headers.authorization?.split(" ")[1];

        if (!userId) {
          log.warn(`${context} - Unauthorized access`);
          res.status(401).json({ message: "Unauthorized access" });
          return;
        }

        const user = await service.getUser(userId, token!);

        res.status(200).json({ user: { ...user, token } });
      } catch (err) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: (err as Error).message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    updateUser: async (req: AuthRequest, res: Response) => {
      context = "UserController.updateUser";
      log.info(`${context} - Started`);

      try {
        const userId = req.user?.id;
        const { user } = req.body;
        const token = req.headers.authorization?.split(" ")[1];

        if (
          !user?.username &&
          !user?.email &&
          !user?.password &&
          !user?.bio &&
          !user?.image
        ) {
          log.warn(`${context} - Missing required fields`);
          res.status(400).json({ message: "Missing required fields" });
          return;
        }

        const updatedUser = await service.updateUser(user, userId!, token!);

        res.status(200).json({ user: updatedUser });
      } catch (err) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: (err as Error).message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    getProfile: async (req: AuthRequest, res: Response) => {
      context = "UserController.currentUser";
      log.info(`${context} - Started`);

      try {
        const userId = req.user?.id;
        const { username } = req.params;

        const profile = await service.getProfile(username, userId!);

        res.status(200).json({ profile });
      } catch (err) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: (err as Error).message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    followUser: async (req: AuthRequest, res: Response) => {
      context = "UserController.followUser";
      log.info(`${context} - Started`);

      try {
        const userId = req.user?.id;
        const { username } = req.params;

        const profile = await service.followUser(username, userId!);

        res.status(200).json({ profile });
      } catch (err) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: (err as Error).message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    unfollowUser: async (req: AuthRequest, res: Response) => {
      context = "UserController.unfollowUser";
      log.info(`${context} - Started`);

      try {
        const userId = req.user?.id;
        const { username } = req.params;

        const profile = await service.unfollowUser(username, userId!);

        res.status(200).json({ profile });
      } catch (err) {
        logger.error(`${context} - ${err}`);
        res.status(500).json({ message: (err as Error).message });
      } finally {
        log.info(`${context} - Ended`);
      }
    },
  };
};
