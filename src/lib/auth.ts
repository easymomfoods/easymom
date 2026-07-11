// EasyMom Foods — Admin auth helpers
// Simple cookie-based session for single admin user.

import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { db } from "./db";

const SESSION_COOKIE = "easymom_admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "easymom-dev-secret-change-in-prod";

export function hashPassword(password: string): string {
  return createHash("sha256").update(password + SESSION_SECRET).digest("hex");
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const inputHash = hashPassword(password);
  try {
    return timingSafeEqual(Buffer.from(inputHash), Buffer.from(hash));
  } catch {
    return false;
  }
}

export async function createSession(username: string): Promise<string> {
  const token = createHash("sha256")
    .update(username + Date.now() + Math.random().toString())
    .digest("hex");

  const store = await import("@/lib/session-store");
  store.sessionStore.set(token, { username, createdAt: Date.now() });

  return token;
}

export async function getSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const store = await import("@/lib/session-store");
  const session = store.sessionStore.get(token);
  if (!session) return null;

  // Session expires after 24 hours
  if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
    store.sessionStore.delete(token);
    return null;
  }

  return { username: session.username };
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    const store = await import("@/lib/session-store");
    store.sessionStore.delete(token);
  }
}

export async function requireAdmin(): Promise<{ username: string }> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
