// EasyMom Foods — Admin auth helpers
// Cookie-based session with Upstash Redis persistence.

import { createHash, timingSafeEqual, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { createSession, getSession, deleteSession as deleteRedisSession } from "./session-store";

const SESSION_COOKIE = "easymom_admin_session";

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret === "easymom-dev-secret-change-in-prod") {
    throw new Error("SESSION_SECRET env var must be set in production");
  }
  return secret;
}

export function hashPassword(password: string): string {
  const bcrypt = require("bcryptjs");
  return bcrypt.hashSync(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$")) {
    const bcrypt = require("bcryptjs");
    return bcrypt.compareSync(password, hash);
  }
  // Legacy fallback — should not be used for new passwords
  try {
    const secret = getSessionSecret();
    const inputHash = createHash("sha256").update(password + secret).digest("hex");
    return timingSafeEqual(Buffer.from(inputHash), Buffer.from(hash));
  } catch {
    return false;
  }
}

export async function createAdminSession(username: string): Promise<string> {
  const token = randomBytes(32).toString("hex");

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
