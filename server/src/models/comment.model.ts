import { DataTypes, Model, Optional, Association } from "sequelize";
import { sequelize } from "../database/sequelize";

interface CommentAttributes {
  id: number;
  body: string;
  userId: number;
  articleId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type CommentCreationAttributes = Optional<
  CommentAttributes,
  "id" | "createdAt" | "updatedAt"
>;

class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  public id!: number;
  public body!: string;
  public userId!: number;
  public articleId!: number;
}

Comment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    body: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    articleId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "Comment", tableName: "comments", timestamps: true }
);

export { Comment, CommentAttributes, CommentCreationAttributes };
