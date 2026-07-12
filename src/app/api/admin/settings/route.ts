import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin, hashPassword, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function PUT(req: Request) {
  try {
    const session = await requireAdmin();
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Both current and new password required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
    }

    const user = await db.adminUser.findUnique({ where: { username: session.username } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    const newHash = hashPassword(newPassword);
    await db.adminUser.update({
      where: { username: session.username },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
