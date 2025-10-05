import { UserRepository } from "../repositories/user.repository";
import { Logger } from "../utils/logger";
import { LoginAttributes, UserCreationAttributes } from "../models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

export class UserService {
  private readonly repo = new UserRepository();

  constructor(private readonly logger: Logger) {}

  async registerUser(user: UserCreationAttributes) {
    const context = "UserService.registerUser";
    this.logger.info(`${context} - Started`);
    try {
      const existing = await this.repo.findByEmail(user.email);

      if (existing) {
        this.logger.warn(`${context} - User "${user.email}" already exists`);
        throw new Error("A user with the same email already exists");
      }

      const hashed = await bcrypt.hash(user.password, 10);
      const userId = await this.repo.create({
        username: user.username,
        email: user.email,
        password: hashed,
        bio: null,
        image: null,
      });

      const token = generateToken(userId);

      return await this.getUser(userId, token);
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async loginUser(userCreds: LoginAttributes) {
    const context = "UserService.loginUser";
    this.logger.info(`${context} - Started`);

    try {
      const { email, password } = userCreds;
      const user = await this.repo.findByEmail(email);

      if (!user) {
        this.logger.warn(`${context} - User not found`);
        throw new Error("Invalid credentials");
      }

      const isMatchPassword = await bcrypt.compare(password, user.password);

      if (!isMatchPassword) {
        this.logger.warn(`${context} - Password mismatch`);
        throw new Error("Invalid credentials");
      }

      const token = generateToken(user.id);
      return await this.getUser(user.id, token);
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async getUser(userId: number, token: string) {
    const context = "UserService.getUser";
    this.logger.info(`${context} - Started`);

    try {
      const user = await this.repo.findById(userId);

      if (!user) {
        this.logger.warn(`${context} - User does not exist`);
        throw new Error("User does not exist");
      }

      const { email, username, bio, image } = user;

      return { email, token, username, bio, image };
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async getProfile(usernameParam: string, userId: number) {
    const context = "UserService.getProfile";
    this.logger.info(`${context} - Started`);

    try {
      let isFollowing = false;
      const following = await this.repo.findByUsername(usernameParam);

      if (!following) {
        this.logger.warn(`${context} - User does not exist`);
        throw new Error("User does not exist");
      }

      if (userId) {
        const follower = await this.repo.findById(userId);
        isFollowing = await this.repo.isFollowing(follower!, following);
      }

      const { username, bio, image } = following;

      return {
        username,
        bio,
        image,
        following: isFollowing,
      };
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async updateUser(
    user: UserCreationAttributes,
    userId: number,
    token: string
  ) {
    const context = "UserService.updateUser";
    this.logger.info(`${context} - Started`);

    try {
      const currentUser = await this.repo.findById(userId);

      if (
        user.email &&
        (await this.repo.emailTakenByOthers(user.email, userId))
      ) {
        this.logger.warn(`${context} - Email is already taken`);
        throw new Error("Email is already taken");
      }

      const updatedUser: UserCreationAttributes = {
        email: user.email ?? currentUser?.email,
        username: user.username ?? currentUser?.username,
        password: user.password
          ? await bcrypt.hash(user.password, 10)
          : currentUser?.password!,
        image: user.image ?? currentUser?.image,
        bio: user.bio ?? currentUser?.bio,
      };

      await this.repo.update(userId, updatedUser);

      return await this.getUser(userId, token);
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async followUser(usernameParam: string, followerId: number) {
    const context = "UserService.followUser";
    this.logger.info(`${context} - Started`);

    try {
      const following = await this.repo.findByUsername(usernameParam);
      const follower = await this.repo.findById(followerId);

      if (!following || !follower) {
        this.logger.warn(`${context} - User does not exist`);
        throw new Error("User does not exist");
      }

      if (following.id === followerId) {
        this.logger.warn(`${context} - User cannot follow itself`);
        throw new Error("User cannot follow itself");
      }

      await this.repo.follow(follower, following);
      const isFollowing = await this.repo.isFollowing(follower, following);
      const { username, bio, image } = following;

      return {
        username,
        bio,
        image,
        following: isFollowing,
      };
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async unfollowUser(usernameParam: string, followerId: number) {
    const context = "UserService.followUser";
    this.logger.info(`${context} - Started`);

    try {
      const following = await this.repo.findByUsername(usernameParam);
      const follower = await this.repo.findById(followerId);

      if (!following || !follower) {
        this.logger.warn(`${context} - User does not exist`);
        throw new Error("User does not exist");
      }

      if (following.id === followerId) {
        this.logger.warn(`${context} - User cannot follow itself`);
        throw new Error("User cannot follow itself");
      }

      await this.repo.unfollow(follower, following);
      const isFollowing = await this.repo.isFollowing(follower, following);
      const { username, bio, image } = following;

      return {
        username,
        bio,
        image,
        following: isFollowing,
      };
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }
}
