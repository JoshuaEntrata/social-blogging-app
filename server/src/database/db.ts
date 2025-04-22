import Database from "better-sqlite3";
import path from "path";
import {
  createArticleTable,
  createArticleTagTable,
  createFavoriteTable,
  createFollowerTable,
  createTagTable,
  createUserTable,
  // dropAllTables,
} from "./queries";

const dbPath = path.resolve(__dirname, "../../data.sqlite");
const db = new Database(dbPath);

// db.exec(dropAllTables);
db.exec(createArticleTable);
db.exec(createTagTable);
db.exec(createArticleTagTable);
db.exec(createUserTable);
db.exec(createFavoriteTable);
db.exec(createFollowerTable);

export { db };
