export const createArticleTable = `
    CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        body TEXT,
        authorId INTEGER,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
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
        articleId INTEGER,
        tagId INTEGER,
        PRIMARY KEY (articleId, tagId),
        FOREIGN KEY (articleId) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (tagId) REFERENCES tags(id)
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

export const createFavoriteTable = `
    CREATE TABLE IF NOT EXISTS favorites (
        userId INTEGER,
        articleId INTEGER,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (articleId) REFERENCES articles(id) ON DELETE CASCADE,
        PRIMARY KEY (userId, articleId)
    )
`;

export const createFollowerTable = `
    CREATE TABLE IF NOT EXISTS followers (
        userId INTEGER,
        followerId INTEGER,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (followerId) REFERENCES users(id),
        PRIMARY KEY (userId, followerId)
    )
`;

export const createCommentTable = `
    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        body TEXT NOT NULL,
        userId INTEGER,
        articleId INTEGER,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (articleId) REFERENCES articles(id)
    )
`;

export const dropAllTables = `
    DROP TABLE IF EXISTS article_tags;
    DROP TABLE IF EXISTS articles;
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS users;
`;
