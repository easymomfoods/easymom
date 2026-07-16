import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key);
    return data ?? null;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, data: unknown, ttlSeconds = 60): Promise<void> {
  try {
    await redis.set(key, data, { ex: ttlSeconds });
  } catch {
    // silently fail — cache is optional
  }
}

export async function cacheDel(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  } catch {
    // silently fail
  }
}

export const CACHE_TTL = {
  PRODUCTS: 60,
  CATEGORIES: 120,
  SITE_CONTENT: 180,
  RECIPES: 180,
  TESTIMONIALS: 300,
};
