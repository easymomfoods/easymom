import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const recipe = await db.recipe.update({
      where: { id },
      data: {
        title: body.title,
        region: body.region,
        time: body.time,
        serves: body.serves,
        difficulty: body.difficulty,
        productSlug: body.productSlug,
        excerpt: body.excerpt,
        steps: JSON.stringify(body.steps || []),
        hue: body.hue,
        active: body.active,
      },
    });
    return NextResponse.json({ ok: true, recipe: { ...recipe, steps: JSON.parse(recipe.steps) } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await db.recipe.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
