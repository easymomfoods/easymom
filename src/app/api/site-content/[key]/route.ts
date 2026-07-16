import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { cacheGet, cacheSet, cacheDel, CACHE_TTL } from "@/lib/cache";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const cacheKey = `sc:${key}`;
    const cached = await cacheGet<string>(cacheKey);
    if (cached !== null) return NextResponse.json({ value: cached });

    const record = await db.siteContent.findUnique({ where: { key } });
    const value = record?.value ?? null;
    if (value !== null) await cacheSet(cacheKey, value, CACHE_TTL.SITE_CONTENT);
    return NextResponse.json({ value });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
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

  try {
    const { key } = await params;
    const { value } = await req.json();
    const record = await db.siteContent.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    await cacheDel(`sc:${key}`);
    await cacheDel("init");
    return NextResponse.json({ ok: true, value: record.value });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
