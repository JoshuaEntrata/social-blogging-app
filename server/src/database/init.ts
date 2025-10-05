import { sequelize } from "./sequelize";
import { logger } from "../utils/logger";
import { db } from "../models";

async function initDB() {
  try {
    await db.sequelize.authenticate();
    logger.info("Database connected...");

    await sequelize.sync();
    logger.info("Models synced...");
  } catch (err) {
    logger.error("DB init error:", err);
    process.exit(1);
  }
}

export default initDB;
