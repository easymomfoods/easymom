import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date().toISOString();
    await db.siteContent.upsert({
      where: { key: "admin_notif_last_checked" },
      update: { value: now },
      create: { key: "admin_notif_last_checked", value: now },
    });

    return NextResponse.json({ ok: true, lastChecked: now });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
