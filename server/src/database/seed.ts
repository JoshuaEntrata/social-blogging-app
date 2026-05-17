import bcrypt from "bcrypt";
import { db } from "../models";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function seed() {
  try {
    await db.sequelize.authenticate();
    console.log("DB connected for seeding...");

    await db.sequelize.sync();

    const password = await bcrypt.hash("password", 10);

    const [alice] = await db.User.findOrCreate({
      where: { email: "alice@example.com" },
      defaults: { username: "alice", email: "alice@example.com", password },
    });

    const [bob] = await db.User.findOrCreate({
      where: { email: "bob@example.com" },
      defaults: { username: "bob", email: "bob@example.com", password },
    });

    const tagNames = ["javascript", "webdev", "react", "nodejs"];
    const tagPromises = tagNames.map((name) =>
      db.Tag.findOrCreate({ where: { name }, defaults: { name } })
    );
    const tagResults = await Promise.all(tagPromises);
    const tags = tagResults.map((r) => r[0]);

    const articlesData = [
      {
        title: "Getting started with React",
        description: "Intro to React",
        body: "This is a short guide to get started with React.",
        authorId: alice.id,
        tags: ["react", "javascript"],
      },
      {
        title: "Building APIs with Node.js",
        description: "Create REST APIs",
        body: "How to build APIs using Express and Node.js.",
        authorId: bob.id,
        tags: ["nodejs", "webdev"],
      },
    ];

    for (const a of articlesData) {
      const slug = slugify(a.title);
      const [article] = await db.Article.findOrCreate({
        where: { slug },
        defaults: {
          slug,
          title: a.title,
          description: a.description,
          body: a.body,
          authorId: a.authorId,
        },
      });

      const articleTags = tags.filter((t) => a.tags.includes(t.name));
      if (articleTags.length) {
        await (article as any).setTags(articleTags);
      }
    }

    const firstArticle = await db.Article.findOne();
    if (firstArticle) {
      await db.Comment.create({
        body: "Nice article!",
        userId: bob.id,
        articleId: firstArticle.id,
      });
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
