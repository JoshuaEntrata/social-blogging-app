import { User, UserCreationAttributes } from "../models/user.model";

export class UserRepository {
  async findByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }

  async findById(id: number) {
    return await User.findByPk(id);
  }

  async findByUsername(username: string) {
    return await User.findOne({ where: { username } });
  }

  async emailTakenByOthers(email: string, userId: number) {
    const user = await this.findByEmail(email);
    return !!user && user.id !== userId;
  }

  async create(user: UserCreationAttributes) {
    const userCreated = await User.create(user);
    return userCreated.id;
  }

  async update(id: number, user: UserCreationAttributes) {
    await User.update(user, { where: { id } });
    return await this.findById(id);
  }

  async follow(follower: User, following: User) {
    await follower.addFollowing(following);
  }

  async unfollow(follower: User, following: User) {
    await follower.removeFollowing(following);
  }

  async isFollowing(follower: User, following: User) {
    return await follower.hasFollowing(following);
  }
}
