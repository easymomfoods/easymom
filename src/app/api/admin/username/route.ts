import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await requireAdmin();
    return NextResponse.json({ username: session.username });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await requireAdmin();
    const { username } = await req.json();

    if (!username || username.trim().length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
    }

    const trimmed = username.trim();

    const existing = await db.adminUser.findUnique({ where: { username: trimmed } });
    if (existing && existing.username !== session.username) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    await db.adminUser.update({
      where: { username: session.username },
      data: { username: trimmed },
    });

    return NextResponse.json({ ok: true, username: trimmed });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
