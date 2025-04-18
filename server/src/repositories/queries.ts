export const FIND_ARTICLE_BY_SLUG = `
    SELECT * FROM articles WHERE slug = ?
`;

export const SAVE_ARTICLE = `
    INSERT INTO articles (
        slug, title, description, body, tagList,
        createdAt, updatedAt, favorited, favoritesCount,
        authorUsername, authorBio, authorImage, authorFollowing
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

export const INSERT_TAG = `
    INSERT OR IGNORE INTO tags (name) VALUES (?)
`;

export const GET_TAG_ID = `
    SELECT id FROM tags WHERE name = ?
`;

export const LINK_TAG = `
    INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)
`;

export const UPDATE_ARTICLE = `
  UPDATE articles
  SET
    slug = ?,
    title = ?,
    description = ?,
    body = ?,
    tagList = ?,
    createdAt = ?,
    updatedAt = ?,
    favorited = ?,
    favoritesCount = ?,
    authorUsername = ?,
    authorBio = ?,
    authorImage = ?,
    authorFollowing = ?
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

export const SAVE_USER = `
    INSERT INTO users (username, email, password) VALUES (?, ?, ?)
`;

export const FIND_USER_BY_ID = `
    SELECT * FROM users WHERE id = ?
`;
