import { Redis } from '@upstash/redis';

let redisInstance = null;

export function getRedis() {
  if (redisInstance) return redisInstance;

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    redisInstance = new Redis({ url, token });
    return redisInstance;
  }

  // Fallback in-memory map for local testing if env variables are not yet set
  return null;
}
