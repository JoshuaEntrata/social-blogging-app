import { db } from "../database/db";
import { FIND_USER_BY_EMAIL, FIND_USER_BY_ID, SAVE_USER } from "./queries";
import { User } from "../models/user.model";

export class UserRepository {
  async findByEmail(email: string): Promise<User | undefined> {
    return db.prepare(FIND_USER_BY_EMAIL).get(email) as User | undefined;
  }

  async findById(id: number): Promise<User | undefined> {
    return db.prepare(FIND_USER_BY_ID).get(id) as User | undefined;
  }

  async save(user: Omit<User, "id">): Promise<number> {
    const result = db
      .prepare(SAVE_USER)
      .run(user.username, user.email, user.password);
    return result.lastInsertRowid as number;
  }
}
