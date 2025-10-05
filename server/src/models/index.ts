import { sequelize } from "../database/sequelize";
import { User } from "./user.model";

export const db = {
  sequelize,
  User,
};
