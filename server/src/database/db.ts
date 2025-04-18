import Database from "better-sqlite3";
import path from "path";
import {
  createArticleTable,
  createArticleTagTable,
  createTagTable,
} from "./queries";

const dbPath = path.resolve(__dirname, "../../data.sqlite");
const db = new Database(dbPath);

db.exec(createArticleTable);
db.exec(createTagTable);
db.exec(createArticleTagTable);

export { db };
