import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const record = await db.siteContent.findUnique({ where: { key } });
  if (!record) return NextResponse.json({ value: null });
  return NextResponse.json({ value: record.value });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  const { value } = await req.json();
  const record = await db.siteContent.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  return NextResponse.json({ ok: true, value: record.value });
}
