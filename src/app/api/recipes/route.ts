import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cacheGet, cacheSet, CACHE_TTL } from "@/lib/cache";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cached = await cacheGet<any[]>("recipes");
    if (cached) return NextResponse.json({ recipes: cached });

    const recipes = await db.recipe.findMany({
      where: { active: true },
    });

    const parsed = recipes.map((r) => ({
      ...r,
      steps: JSON.parse(r.steps || "[]"),
    }));

    await cacheSet("recipes", parsed, CACHE_TTL.RECIPES);
    return NextResponse.json({ recipes: parsed });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
