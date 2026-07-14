import { Ratelimit } from "@upstash/ratelimit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let redisClient: any = undefined;

function getRedis() {
  if (redisClient !== undefined) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token || url === "YOUR_URL_HERE") {
    redisClient = null;
    return redisClient;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Redis } = require("@upstash/redis");
  redisClient = new Redis({ url, token });
  return redisClient;
}

const limiters = new Map<string, Ratelimit>();

function getLimiter(name: string, limit: number) {
  const redis = getRedis();
  if (!redis) return null;
  const key = `${name}-${limit}`;
  if (!limiters.has(key)) {
    limiters.set(
      key,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, "60 s"),
        analytics: false,
      })
    );
  }
  return limiters.get(key)!;
}

export async function rateLimit(name: string, identifier: string, limit = 10) {
  const limiter = getLimiter(name, limit);
  if (!limiter) return { success: true, remaining: 999 };
  return limiter.limit(identifier);
}
