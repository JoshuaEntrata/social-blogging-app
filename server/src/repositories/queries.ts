export const FIND_BY_SLUG = "SELECT * FROM articles WHERE slug = ?";

export const SAVE_ARTICLE = `
    INSERT INTO articles (
        slug, title, description, body, tagList,
        createdAt, updatedAt, favorited, favoritesCount,
        authorUsername, authorBio, authorImage, authorFollowing
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
