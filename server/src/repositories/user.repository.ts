import { db } from "../database/db";
import {
  FIND_USER_BY_EMAIL,
  FIND_USER_BY_ID,
  FIND_USER_BY_USERNAME,
  SAVE_USER,
} from "./queries";
import { User } from "../models/user.model";

export class UserRepository {
  async findByEmail(email: string): Promise<User> {
    return db.prepare(FIND_USER_BY_EMAIL).get(email) as User;
  }

  async findById(id: number): Promise<User> {
    return db.prepare(FIND_USER_BY_ID).get(id) as User;
  }

  async findByUsername(userName: string): Promise<User> {
    return db.prepare(FIND_USER_BY_USERNAME).get(userName) as User;
  }

  async save(user: Omit<User, "id">): Promise<number> {
    const result = db
      .prepare(SAVE_USER)
      .run(
        user.username,
        user.email,
        user.password,
        user.bio,
        user.image,
        user.createdAt,
        user.updatedAt
      );
    return result.lastInsertRowid as number;
  }
}
