import { UserRepository } from "../repositories/user.repository";
import { Logger } from "../utils/logger";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

export class UserService {
  private readonly repo = new UserRepository();

  constructor(private readonly logger: Logger) {}

  async registerUser(user: User): Promise<string> {
    const context = "UserService.registerUser";
    this.logger.info(`${context} - Started.`);
    try {
      const { username, email, password } = user;

      const existing = await this.repo.findByEmail(email);

      if (existing) {
        this.logger.warn(`${context} - User "${email}" already exists`);
        throw new Error("A user with the same email already exists");
      }

      const hashed = await bcrypt.hash(password, 10);
      const id = await this.repo.save({
        username: username,
        email: email,
        password: hashed,
        bio: null,
        image: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const token = generateToken(id);
      return token;
    } catch (err) {
      this.logger.error(`${context} - Error: ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }

  async loginUser(userCreds: User): Promise<string> {
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
      return token;
    } catch (err) {
      this.logger.error(`${context} - Error: ${err}`);
      throw err;
    } finally {
      this.logger.info(`${context} - Ended.`);
    }
  }
}
