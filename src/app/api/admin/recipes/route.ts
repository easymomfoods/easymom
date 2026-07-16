import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from '@/lib/auth';
import { cacheDel } from '@/lib/cache';

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
        title: String(body.title || ""),
        region: String(body.region || ""),
        time: String(body.time || "5 min"),
        serves: String(body.serves || "4"),
        difficulty: String(body.difficulty || "Easy"),
        productSlug: String(body.productSlug || ""),
        excerpt: String(body.excerpt || ""),
        steps: JSON.stringify(body.steps || []),
        hue: Number(body.hue) || 0,
        active: body.active !== false,
      } as never,
    });
    await cacheDel("recipes");
    return NextResponse.json({ ok: true, recipe: { ...recipe, steps: JSON.parse(recipe.steps) } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

