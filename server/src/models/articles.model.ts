import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/sequelize";
import { User } from "./user.model";
import { Tag } from "./tag.model";

interface ArticleAttributes {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  authorId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type ArticleCreationAttributes = Optional<
  ArticleAttributes,
  "id" | "createdAt" | "updatedAt"
>;

class Article
  extends Model<ArticleAttributes, ArticleCreationAttributes>
  implements ArticleAttributes
{
  public id!: number;
  public slug!: string;
  public title!: string;
  public description!: string;
  public body!: string;
  public authorId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Article.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "Article", tableName: "articles", timestamps: true }
);

export { Article, ArticleAttributes, ArticleCreationAttributes };
