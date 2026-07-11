// EasyMom Foods — In-memory session store
// For production, consider using Redis (Upstash) for persistence.

interface Session {
  username: string;
  createdAt: number;
}

// Global store to persist across hot reloads in dev
const globalForStore = globalThis as unknown as {
  sessionStore: Map<string, Session> | undefined;
};

export const sessionStore: Map<string, Session> =
  globalForStore.sessionStore ?? new Map<string, Session>();

if (process.env.NODE_ENV !== "production") {
  globalForStore.sessionStore = sessionStore;
}
