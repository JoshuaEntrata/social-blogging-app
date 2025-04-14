export const createArticleTable = `
    CREATE TABLE IF NOT EXISTS articles (
        slug TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        body TEXT,
        tagList TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        favorited INTEGER NOT NULL,
        favoritesCount INTEGER NOT NULL,
        authorUsername TEXT NOT NULL,
        authorBio TEXT NOT NULL,
        authorImage TEXT NOT NULL,
        authorFollowing INTEGER NOT NULL
    );
`;
