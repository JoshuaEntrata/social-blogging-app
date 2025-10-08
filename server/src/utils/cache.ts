import { initializedRedisClient } from "./redis.client";
import { logger } from "./logger";

export async function getCache(key: string) {
  try {
    const client = await initializedRedisClient();
    const cached = await client.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    logger.error(`getCache error for key "${key}":`, err);
    return null;
  }
}

export async function setCache(key: string, value: any, ttlSeconds = 3600) {
  try {
    const client = await initializedRedisClient();
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (err) {
    logger.error(`setCache error for key "${key}":`, err);
  }
}

export async function delCache(key: string) {
  try {
    const client = await initializedRedisClient();
    await client.del(key);
  } catch (err) {
    logger.error(`delCache error for key "${key}":`, err);
  }
}

export async function delCacheByPattern(pattern: string) {
  try {
    const client = await initializedRedisClient();
    const iter = client.scanIterator({
      MATCH: pattern,
    });

    for await (const key of iter) {
      if (Array.isArray(key)) {
        for (const k of key) {
          await client.del(k);
        }
      } else {
        await client.del(key);
      }
    }
  } catch (err) {
    logger.error(`delCacheByPattern error for pattern "${pattern}":`, err);
  }
}

export async function clearAllCache() {
  const client = await initializedRedisClient();
  await client.flushAll();
}
