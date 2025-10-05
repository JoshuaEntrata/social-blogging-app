import { User } from "./user.model";
import { Article } from "./article.model";
import { Comment } from "./comment.model";
import { Tag } from "./tag.model";

export function setupAssociations() {
  // User ↔ Article
  User.hasMany(Article, { foreignKey: "authorId", as: "articles" });
  Article.belongsTo(User, { foreignKey: "authorId", as: "author" });

  // Article ↔ Tag (many-to-many)
  Article.belongsToMany(Tag, {
    through: "article_tags",
    as: "tags",
    foreignKey: "articleId",
    otherKey: "tagId",
    onDelete: "CASCADE",
  });
  Tag.belongsToMany(Article, {
    through: "article_tags",
    as: "articles",
    foreignKey: "tagId",
    otherKey: "articleId",
  });

  // Article ↔ Comment
  Article.hasMany(Comment, { foreignKey: "articleId", as: "comments" });
  Comment.belongsTo(Article, { foreignKey: "articleId" });

  // User ↔ Comment
  User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
  Comment.belongsTo(User, { foreignKey: "userId", as: "author" });

  // User ↔ User (followers)
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

  // User ↔ Article (favorites)
  User.belongsToMany(Article, {
    through: "favorites",
    as: "favoritedArticles",
    foreignKey: "userId",
    otherKey: "articleId",
    onDelete: "CASCADE",
  });
  Article.belongsToMany(User, {
    through: "favorites",
    as: "favoritedBy",
    foreignKey: "articleId",
    otherKey: "userId",
  });
}
