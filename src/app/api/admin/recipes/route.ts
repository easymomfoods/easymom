import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const recipes = await db.recipe.findMany({ orderBy: { createdAt: "desc" } });
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

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const recipe = await db.recipe.create({
      data: {
        title: body.title || "",
        region: body.region || "",
        time: body.time || "5 min",
        serves: body.serves || "4",
        difficulty: body.difficulty || "Easy",
        productSlug: body.productSlug || "",
        excerpt: body.excerpt || "",
        steps: JSON.stringify(body.steps || []),
        hue: body.hue || 0,
        active: body.active !== false,
      },
    });
    return NextResponse.json({ ok: true, recipe: { ...recipe, steps: JSON.parse(recipe.steps) } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
