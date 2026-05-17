import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { logger, Logger } from "../utils/logger";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ApiError, formatLogError, sendErrorResponse } from "../utils/apiError";

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
        log.info(`${context} - User created`);

        res.status(201).json({
          user: registeredUser,
        });
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    login: async (req: Request, res: Response) => {
      context = "UserController.login";
      log.info(`${context} - Started`);
      try {
        const { user } = req.body;

        if (!user?.email || !user?.password) {
          log.warn(`${context} - Missing required fields`);
          res.status(400).json({ message: "Missing required fields" });
          return;
        }

        const userDetails = await service.loginUser(user);
        log.info(`${context} - User logged in`);

        res.status(200).json({
          user: userDetails,
        });
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
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
          log.warn(`${context} - Unauthorized access. | Reason: User ID is missing.`);
          throw new ApiError(401, "Unauthorized access");
        }

        const user = await service.getUser(userId, token!);

        res.status(200).json({ user });
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
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

        if (!userId) {
          log.warn(`${context} - Unauthorized access. | Reason: User ID is missing.`);
          throw new ApiError(401, "Unauthorized access");
        }

        if (
          !user?.username &&
          !user?.email &&
          !user?.password &&
          !user?.bio &&
          !user?.image
        ) {
          log.warn(`${context} - Missing required fields`);
          throw new ApiError(400, "Missing required fields");
        }

        const updatedUser = await service.updateUser(user, userId, token!);

        res.status(200).json({ user: updatedUser });
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
      } finally {
        log.info(`${context} - Ended`);
      }
    },

    getProfile: async (req: AuthRequest, res: Response) => {
      context = "UserController.getProfile";
      log.info(`${context} - Started`);

      try {
        const userId = req.user?.id;
        const { username } = req.params;

        const profile = await service.getProfile(username, userId);

        res.status(200).json({ profile });
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
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

        if (!userId) {
          log.warn(`${context} - Unauthorized access. | Reason: User ID is missing.`);
          throw new ApiError(401, "Unauthorized access");
        }

        const profile = await service.followUser(username, userId);

        res.status(200).json({ profile });
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
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

        if (!userId) {
          log.warn(`${context} - Unauthorized access. | Reason: User ID is missing.`);
          throw new ApiError(401, "Unauthorized access");
        }

        const profile = await service.unfollowUser(username, userId);

        res.status(200).json({ profile });
      } catch (err) {
        logger.error(`${context} - ${formatLogError(err)}`);
        sendErrorResponse(res, err);
      } finally {
        log.info(`${context} - Ended`);
      }
    },
  };
};
