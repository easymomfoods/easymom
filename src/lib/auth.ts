// EasyMom Foods — Admin auth helpers
// Cookie-based session with Upstash Redis persistence.

import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { createSession, getSession, deleteSession as deleteRedisSession } from "./session-store";

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

export async function createAdminSession(username: string): Promise<string> {
  const token = createHash("sha256")
    .update(username + Date.now() + Math.random().toString())
    .digest("hex");

  await createSession(token, { username, createdAt: Date.now() });
  return token;
}

export async function getAdminSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await getSession(token);
  return session ? { username: session.username } : null;
}

export async function deleteAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await deleteRedisSession(token);
  }
}

export async function requireAdmin(): Promise<{ username: string }> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
