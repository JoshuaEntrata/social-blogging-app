import { UserRepository } from "../repositories/user.repository";
import { Logger } from "../utils/logger";
import { User, UserAuthentication } from "../models/user.model";
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

      return await this.getUser(userId);
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

      return await this.getUser(user.id);
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async getUser(userId: number): Promise<UserAuthentication> {
    const context = "UserService.getUser";
    this.logger.info(`${context} - Started`);

    try {
      const user = await this.repo.findById(userId);

      if (!user) {
        this.logger.warn(`${context} - User does not exist`);
        throw new Error("User does not exist");
      }

      const token = generateToken(userId);

      const { email, username, bio, image } = user;

      return { email, token, username, bio, image };
    } catch (err) {
      this.logger.error(`${context} - ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }
}
