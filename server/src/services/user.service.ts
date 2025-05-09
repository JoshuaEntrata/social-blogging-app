import { UserRepository } from "../repositories/user.repository";
import { Logger } from "../utils/logger";
import { User, UserAuthentication, UserFollowing } from "../models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
export class UserService {
  private readonly repo = new UserRepository();

  constructor(private readonly logger: Logger) {}

  async registerUser(user: User): Promise<UserAuthentication> {
    const context = "UserService.registerUser";
    this.logger.info(`${context} - Started`);
    try {
      const existing = await this.repo.findByEmail(user.email);

      if (existing) {
        this.logger.warn(`${context} - User "${user.email}" already exists`);
        throw new Error("A user with the same email already exists");
      }

      const hashed = await bcrypt.hash(user.password, 10);
      const userId = await this.repo.save({
        username: user.username,
        email: user.email,
        password: hashed,
        bio: null,
        image: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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

  async loginUser(userCreds: User): Promise<UserAuthentication> {
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

      if (!user || !isMatchPassword) {
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

  async getUser(userId: number, token: string): Promise<UserAuthentication> {
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

  async getProfile(
    usernameParam: string,
    userId: number
  ): Promise<UserFollowing> {
    const context = "UserService.getProfile";
    this.logger.info(`${context} - Started`);

    try {
      const user = await this.repo.findByUsername(usernameParam);

      if (!user) {
        this.logger.warn(`${context} - User does not exist`);
        throw new Error("User does not exist");
      }

      const { username, id, bio, image } = user;
      const isFollowing = await this.repo.isFollowing(id, userId);

      return { username, bio, image, following: isFollowing } as UserFollowing;
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async updateUser(
    user: User,
    userId: number,
    token: string
  ): Promise<UserAuthentication> {
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

      const updatedUser: User = {
        email: user.email ?? currentUser?.email,
        username: user.username ?? currentUser?.username,
        password: user.password
          ? await bcrypt.hash(user.password, 10)
          : currentUser?.password!,
        image: user.image ?? currentUser?.image,
        bio: user.bio ?? currentUser?.bio,
        updatedAt: new Date().toISOString(),
        id: userId,
      } as User;

      await this.repo.update(updatedUser);

      return await this.getUser(userId, token);
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async followUser(
    usernameParam: string,
    followerId: number
  ): Promise<UserFollowing> {
    const context = "UserService.followUser";
    this.logger.info(`${context} - Started`);

    try {
      const user = await this.repo.findByUsername(usernameParam);

      if (!user) {
        this.logger.warn(`${context} - User does not exist`);
        throw new Error("User does not exist");
      }

      if (user.id === followerId) {
        this.logger.warn(`${context} - User cannot follow itself`);
        throw new Error("User cannot follow itself");
      }

      const { username, id, bio, image } = user;
      await this.repo.follow(id, followerId);

      const isFollowing = await this.repo.isFollowing(id, followerId);

      return {
        username,
        bio,
        image,
        following: isFollowing,
      } as UserFollowing;
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async unfollowUser(
    usernameParam: string,
    followerId: number
  ): Promise<UserFollowing> {
    const context = "UserService.followUser";
    this.logger.info(`${context} - Started`);

    try {
      const user = await this.repo.findByUsername(usernameParam);

      if (!user) {
        this.logger.warn(`${context} - User does not exist`);
        throw new Error("User does not exist");
      }

      if (user.id === followerId) {
        this.logger.warn(`${context} - User cannot unfollow itself`);
        throw new Error("User cannot unfollow itself");
      }

      const { username, id, bio, image } = user;
      await this.repo.unfollow(id, followerId);

      const isFollowing = await this.repo.isFollowing(id, followerId);

      return {
        username,
        bio,
        image,
        following: isFollowing,
      } as UserFollowing;
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }
}
