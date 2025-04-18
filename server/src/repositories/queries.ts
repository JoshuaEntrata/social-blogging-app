export const FIND_BY_SLUG = "SELECT * FROM articles WHERE slug = ?";

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

export const RETRIVE_TAGS = `
    SELECT DISTINCT name FROM tags
`;
