import { db } from "../database/db";
import {
  FIND_USER_BY_EMAIL,
  FIND_USER_BY_ID,
  FIND_USER_BY_USERNAME,
  FOLLOW_USER,
  IS_FOLLOWING,
  SAVE_USER,
  UNFOLLOW_USER,
  UPDATE_USER,
} from "./queries";
import { User } from "../models/user.model";

export class UserRepository {
  async findByEmail(email: string): Promise<User | undefined> {
    return db.prepare(FIND_USER_BY_EMAIL).get(email) as User | undefined;
  }

  async findById(id: number): Promise<User> {
    return db.prepare(FIND_USER_BY_ID).get(id) as User;
  }

  async findByUsername(userName: string): Promise<User> {
    return db.prepare(FIND_USER_BY_USERNAME).get(userName) as User;
  }

  async emailTakenByOthers(email: string, userId: number): Promise<boolean> {
    const user = await this.findByEmail(email);
    return !!user && user.id !== userId;
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

  async update(user: User): Promise<User> {
    db.prepare(UPDATE_USER).run(
      user.email,
      user.username,
      user.password,
      user.image,
      user.bio,
      user.updatedAt,
      user.id
    );

    return (await this.findById(user.id)) as User;
  }

  async follow(userId: number, followerId: number): Promise<void> {
    db.prepare(FOLLOW_USER).run(userId, followerId);
  }

  async unfollow(userId: number, followerId: number): Promise<void> {
    db.prepare(UNFOLLOW_USER).run(userId, followerId);
  }

  async isFollowing(userId: number, followerId: number): Promise<boolean> {
    const row = db.prepare(IS_FOLLOWING).get(userId, followerId) as {
      count: number;
    };
    return row.count > 0;
  }
}
