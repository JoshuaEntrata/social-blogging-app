import { DataTypes, Model, Optional, Association } from "sequelize";
import { sequelize } from "../database/sequelize";

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  bio?: string | null;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LoginAttributes {
  email: string;
  password: string;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "bio" | "image" | "createdAt" | "updatedAt"
>;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public bio!: string | null;
  public image!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public addFollower!: (user: User) => Promise<void>;
  public removeFollower!: (user: User) => Promise<void>;
  public hasFollower!: (user: User) => Promise<boolean>;

  public addFollowing!: (user: User) => Promise<void>;
  public removeFollowing!: (user: User) => Promise<void>;
  public hasFollowing!: (user: User) => Promise<boolean>;

  public getFollowers!: () => Promise<User[]>;
  public getFollowing!: () => Promise<User[]>;

  public static associations: {
    Followers: Association<User, User>;
    Following: Association<User, User>;
  };
}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    bio: { type: DataTypes.TEXT },
    image: { type: DataTypes.TEXT },
  },
  { sequelize, modelName: "User", tableName: "users", timestamps: true }
);

User.belongsToMany(User, {
  through: "followers",
  as: "Followers",
  foreignKey: "userId",
  otherKey: "followerId",
});

User.belongsToMany(User, {
  through: "followers",
  as: "Following",
  foreignKey: "followerId",
  otherKey: "userId",
});

export { User, UserAttributes, LoginAttributes, UserCreationAttributes };
