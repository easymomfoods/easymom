import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.categoryId !== undefined) data.category = { connect: { id: body.categoryId } };
    if (body.price !== undefined) data.price = Number(body.price);
    if (body.mrp !== undefined) data.mrp = Number(body.mrp);
    if (body.weight !== undefined) data.weight = body.weight;
    if (body.rating !== undefined) data.rating = Number(body.rating);
    if (body.reviewCount !== undefined) data.reviewCount = Number(body.reviewCount);
    if (body.badge !== undefined) data.badge = body.badge || null;
    if (body.bestSeller !== undefined) data.bestSeller = body.bestSeller;
    if (body.isNew !== undefined) data.isNew = body.isNew;
    if (body.img !== undefined) data.img = body.img || null;
    if (body.images !== undefined) data.images = JSON.stringify(body.images);
    if (body.shortDesc !== undefined) data.shortDesc = body.shortDesc;
    if (body.description !== undefined) data.description = body.description;
    if (body.ingredients !== undefined) data.ingredients = JSON.stringify(body.ingredients);
    if (body.origin !== undefined) data.origin = body.origin;
    if (body.shelfLife !== undefined) data.shelfLife = body.shelfLife;
    if (body.spiceLevel !== undefined) data.spiceLevel = body.spiceLevel;
    if (body.cookingTime !== undefined) data.cookingTime = body.cookingTime;
    if (body.servings !== undefined) data.servings = body.servings;
    if (body.tags !== undefined) data.tags = JSON.stringify(body.tags);
    if (body.hue !== undefined) data.hue = Number(body.hue);
    if (body.active !== undefined) data.active = body.active;

    // Auto-create category if categoryId is changing to a new one
    if (body.categoryId) {
      const existingCat = await db.category.findUnique({ where: { id: body.categoryId } });
      if (!existingCat) {
        const catName = body.categoryId.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        await db.category.create({ data: { id: body.categoryId, name: catName, tagline: catName, description: "", count: 0, accent: "zinc", hue: 0, sortOrder: 99 } });
      }
    }

    const product = await db.product.update({
      where: { id },
      data,
    });

    // Raw SQL for freeItem fields (Prisma libsql adapter doesn't know about ALTER TABLE columns)
    if (body.freeItemName !== undefined || body.freeItemImage !== undefined) {
      const freeName = body.freeItemName !== undefined ? (body.freeItemName || null) : product.freeItemName;
      const freeImg = body.freeItemImage !== undefined ? (body.freeItemImage || null) : product.freeItemImage;
      await db.$executeRawUnsafe("UPDATE Product SET freeItemName = ?, freeItemImage = ? WHERE id = ?", freeName, freeImg, id);
    }

    return NextResponse.json({ ok: true, product: {
      ...product,
      ...await (async () => {
        const rows = await db.$executeRawUnsafe("SELECT freeItemName, freeItemImage FROM Product WHERE id = ?", id) as unknown[];
        return rows.length > 0 ? rows[0] : {};
      })(),
      images: JSON.parse(product.images || "[]"),
      ingredients: JSON.parse(product.ingredients || "[]"),
      tags: JSON.parse(product.tags || "[]"),
    } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
