import { db } from "../database/db";
import mock from "./mockArticles.json";
import { Article } from "../models/article.model";

const insertArticle = db.prepare(`
  INSERT INTO articles (
    slug, title, description, body, tagList,
    createdAt, updatedAt, favorited, favoritesCount,
    authorUsername, authorBio, authorImage, authorFollowing
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertMany = db.transaction((articles: Article[]) => {
  for (const article of articles) {
    insertArticle.run(
      article.slug,
      article.title,
      article.description,
      article.body ?? null,
      JSON.stringify(article.tagList),
      article.createdAt,
      article.updatedAt,
      article.favorited ? 1 : 0,
      article.favoritesCount,
      article.author.username,
      article.author.bio,
      article.author.image,
      article.author.following ? 1 : 0
    );
  }
});

insertMany(mock.articles);
console.log("✅ Seeded mock articles into the database.");

// db.exec("DROP TABLE IF EXISTS articles;");
// console.log("✅ Dropped TABLE articles in the database.");
