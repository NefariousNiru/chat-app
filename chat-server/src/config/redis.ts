// file: src/config/redis.ts

import { createClient, type RedisClientType } from "redis";
import { env } from "./env.js";

let client: RedisClientType | null = null;

/**
 * Establishes a singleton Redis connection for the process.
 * Repeated calls are safe and return the existing instance.
 */
export async function connectRedis(): Promise<RedisClientType> {
  if (client) return client;

  client = createClient({ url: env.REDIS_URL });

  // Redis client buffers commands until connected; awaiting connect fails fast on bad config.
  await client.connect();

  return client;
}

/**
 * Returns the connected Redis client, connecting on demand if needed.
 */
export async function getRedis(): Promise<RedisClientType> {
  return connectRedis();
}

/**
 * Executes a lightweight ping command against Redis.
 * Throws if the server is unreachable or authentication fails.
 */
export async function pingRedis(): Promise<void> {
  const r = await getRedis();
  await r.ping();
}

/**
 * Closes the Redis client and clears module-level singleton.
 * Safe to call multiple times.
 */
export async function closeRedis(): Promise<void> {
  if (!client) return;
  await client.quit();
  client = null;
}
