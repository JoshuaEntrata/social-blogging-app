import { sequelize } from "../database/sequelize";
import { User } from "./user.model";
import { Article } from "./article.model";
import { Comment } from "./comment.model";
import { Tag } from "./tag.model";
import { setupAssociations } from "./associations";

setupAssociations();

export const db = { sequelize, User, Article, Comment, Tag };
