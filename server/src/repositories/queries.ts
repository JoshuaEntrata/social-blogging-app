export const FIND_ARTICLE_BY_SLUG = `
    SELECT * FROM articles WHERE slug = ?
`;

export const SAVE_ARTICLE = `
    INSERT INTO articles (
        slug, title, description, body, authorId,
        createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
`;

export const INSERT_TAG = `
    INSERT OR IGNORE INTO tags (name) VALUES (?)
`;

export const GET_TAG_ID = `
    SELECT id FROM tags WHERE name = ?
`;

export const LINK_TAG = `
    INSERT INTO article_tags (articleId, tagId) VALUES (?, ?)
`;

export const GET_TAGS_BY_ARTICLE_ID = `
  SELECT t.name
  FROM article_tags tl
  JOIN tags t ON t.id = tl.tagId
  WHERE tl.articleId = ?;
`;

export const UPDATE_ARTICLE = `
  UPDATE articles
  SET
    slug = ?,
    title = ?,
    description = ?,
    body = ?,
    updatedAt = ?
  WHERE slug = ?
`;

export const DELETE_ARTICLE_BY_SLUG = `
    DELETE FROM articles WHERE slug = ?
`;

export const RETRIVE_TAGS = `
    SELECT DISTINCT name FROM tags
`;

export const FIND_USER_BY_EMAIL = `
    SELECT * FROM users WHERE email = ?
`;

export const FIND_USER_BY_USERNAME = `
    SELECT * FROM users WHERE username = ?
`;

export const SAVE_USER = `
    INSERT INTO users (
        username, email, password,
        bio, image,
        createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
`;

export const FIND_USER_BY_ID = `
    SELECT * FROM users WHERE id = ?
`;

export const ADD_FAVORITE = `
  INSERT OR IGNORE INTO favorites (userId, articleId)
  VALUES (?, ?);
`;

export const REMOVE_FAVORITE = `
  DELETE FROM favorites
  WHERE userId = ? AND articleId = ?;
`;

export const IS_FAVORITED = `
  SELECT COUNT(*) as count FROM favorites
  WHERE userId = ? AND articleId = ?;
`;

export const COUNT_FAVORITES = `
  SELECT COUNT(*) as count FROM favorites
  WHERE articleId = ?;
`;

export const UPDATE_USER = `
  UPDATE users
  SET
    email = ?,
    username = ?,
    password = ?,
    image = ?,
    bio = ?,
    updatedAt = ?
  WHERE id = ?
`;

export const FOLLOW_USER = `
  INSERT OR IGNORE INTO followers (userId, followerId)
  VALUES (?, ?);
`;

export const UNFOLLOW_USER = `
  DELETE FROM followers
  WHERE userId = ? AND followerId = ?;
`;

export const IS_FOLLOWING = `
  SELECT COUNT(*) as count FROM followers
  WHERE userId = ? AND followerId = ?;
`;

export const ADD_COMMENT = `
  INSERT into comments (
    body, userId, articleId, createdAt, updatedAt
  ) VALUES (?, ?, ?, ?, ?)
`;

export const FIND_COMMENT = `
    SELECT * FROM comments 
    WHERE id = ?;
`;

export const GET_COMMENTS_BY_ARTICLE_ID = `
  SELECT * FROM comments
  WHERE articleId = ?;
`;
