// EasyMom Foods — Session store using Upstash Redis
// Works with Vercel serverless (no in-memory issues)
// Lazy initialization — only connects when actually called at runtime.

import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

interface Session {
  username: string;
  createdAt: number;
}

const SESSION_PREFIX = "admin:session:";
const SESSION_TTL = 24 * 60 * 60; // 24 hours in seconds

// Fallback to in-memory if Redis is not configured (local dev without Upstash)
const memoryFallback = new Map<string, Session>();

function isRedisConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN &&
    !process.env.UPSTASH_REDIS_REST_URL.includes("YOUR_URL_HERE")
  );
}

export async function createSession(token: string, session: Session): Promise<void> {
  if (isRedisConfigured()) {
    await getRedis().set(SESSION_PREFIX + token, JSON.stringify(session), { ex: SESSION_TTL });
  } else {
    memoryFallback.set(token, session);
  }
}

export async function getSession(token: string): Promise<Session | null> {
  if (isRedisConfigured()) {
    const data = await getRedis().get<string>(SESSION_PREFIX + token);
    if (!data) return null;
    try {
      const session: Session = typeof data === "string" ? JSON.parse(data) : data;
      if (Date.now() - session.createdAt > SESSION_TTL * 1000) {
        await getRedis().del(SESSION_PREFIX + token);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  } else {
    const session = memoryFallback.get(token);
    if (!session) return null;
    if (Date.now() - session.createdAt > SESSION_TTL * 1000) {
      memoryFallback.delete(token);
      return null;
    }
    return session;
  }
}

export async function deleteSession(token: string): Promise<void> {
  if (isRedisConfigured()) {
    await getRedis().del(SESSION_PREFIX + token);
  } else {
    memoryFallback.delete(token);
  }
}
