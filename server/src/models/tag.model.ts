import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/sequelize";
import "./associations";

interface TagAttributes {
  id: number;
  name: string;
}

type TagCreationAttributes = Optional<TagAttributes, "id">;

class Tag
  extends Model<TagAttributes, TagCreationAttributes>
  implements TagAttributes
{
  public id!: number;
  public name!: string;
}

Tag.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { sequelize, modelName: "Tag", tableName: "tags", timestamps: false }
);

export { Tag, TagAttributes, TagCreationAttributes };
