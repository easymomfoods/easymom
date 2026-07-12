// EasyMom Foods — Session store using Upstash Redis
// Works with Vercel serverless (no in-memory issues)
// Lazy initialization — only connects when actually called at runtime.

import { Redis } from "@upstash/redis";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

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
const SESSION_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

// File-based fallback for local dev (survives hot reloads)
const SESSION_FILE = join(process.cwd(), ".dev-sessions.json");

function loadFileSessions(): Map<string, Session> {
  try {
    if (existsSync(SESSION_FILE)) {
      const data = JSON.parse(readFileSync(SESSION_FILE, "utf-8"));
      return new Map(Object.entries(data));
    }
  } catch {}
  return new Map();
}

function saveFileSessions(map: Map<string, Session>) {
  try {
    writeFileSync(SESSION_FILE, JSON.stringify(Object.fromEntries(map)));
  } catch {}
}

let memoryFallback = loadFileSessions();

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
    saveFileSessions(memoryFallback);
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
    saveFileSessions(memoryFallback);
  }
}
