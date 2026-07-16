import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cacheGet, cacheSet, CACHE_TTL } from "@/lib/cache";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cached = await cacheGet<any[]>("categories");
    if (cached) return NextResponse.json({ categories: cached });

    const categories = await db.category.findMany({
      orderBy: { sortOrder: "asc" },
    });

    await cacheSet("categories", categories, CACHE_TTL.CATEGORIES);
    return NextResponse.json({ categories });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
