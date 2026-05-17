import { createClient, type RedisClientType } from "redis";
import { logger } from "./logger";
import dotenv from "dotenv";
import { formatLogError } from "./apiError";

dotenv.config();

let client: RedisClientType | null = null;
let connectingPromise: Promise<RedisClientType> | null = null;

export async function initializedRedisClient(): Promise<RedisClientType> {
  if (client) return client;

  if (connectingPromise) return connectingPromise;

  connectingPromise = (async () => {
    const redisClient: RedisClientType = createClient({
      url: process.env.REDIS_LOCALHOST,
      password: process.env.REDIS_PASSWORD,
    });

    redisClient.on("error", (error) =>
      logger.error(`Redis error - ${formatLogError(error)}`)
    );
    redisClient.on("connect", () => logger.info("Redis connected..."));

    await redisClient.connect();
    client = redisClient;
    connectingPromise = null;
    return redisClient;
  })();

  return connectingPromise;
}
