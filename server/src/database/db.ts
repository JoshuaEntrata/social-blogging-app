import Database from "better-sqlite3";
import path from "path";
import {
  createArticleTable,
  createArticleTagTable,
  createTagTable,
  createUserTable,
} from "./queries";

const dbPath = path.resolve(__dirname, "../../data.sqlite");
const db = new Database(dbPath);

db.exec(createArticleTable);
db.exec(createTagTable);
db.exec(createArticleTagTable);
db.exec(createUserTable);

export { db };
