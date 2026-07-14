import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json({ categories });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const category = await db.category.create({
      data: {
        id: body.id || body.name.toLowerCase().replace(/\s+/g, "-"),
        name: body.name || "",
        tagline: body.tagline || "",
        description: body.description || "",
        count: Number(body.count) || 0,
        accent: body.accent || "zinc",
        hue: Number(body.hue) || 0,
        sortOrder: Number(body.sortOrder) || 0,
      },
    });
    return NextResponse.json({ ok: true, category });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
