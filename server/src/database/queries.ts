export const createArticleTable = `
    CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE,
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

export const createTagTable = `
    CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
    );
`;

export const createArticleTagTable = `
    CREATE TABLE IF NOT EXISTS article_tags (
        article_id INTEGER,
        tag_id INTEGER,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id)
    );
`;

export const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        bio TEXT,
        image TEXT,
        createdAt DATETIME,
        updatedAt DATETIME
    )
`;
