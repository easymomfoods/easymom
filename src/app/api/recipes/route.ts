import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const recipes = await db.recipe.findMany({
      where: { active: true },
    });

    const parsed = recipes.map((r) => ({
      ...r,
      steps: JSON.parse(r.steps || "[]"),
    }));

    return NextResponse.json({ recipes: parsed });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
