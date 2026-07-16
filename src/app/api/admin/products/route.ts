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
    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    const parsed = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images || "[]"),
      ingredients: JSON.parse(p.ingredients || "[]"),
      tags: JSON.parse(p.tags || "[]"),
    }));

    return NextResponse.json({ products: parsed });
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
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Product with this slug already exists" }, { status: 409 });
    }

    // Auto-create category if it doesn't exist
    const categoryId = body.categoryId || slug;
    const existingCategory = await db.category.findUnique({ where: { id: categoryId } });
    if (!existingCategory) {
      const catName = categoryId.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      await db.category.create({
        data: {
          id: categoryId,
          name: catName,
          tagline: catName,
          description: "",
          count: 0,
          accent: "zinc",
          hue: 0,
          sortOrder: 99,
        },
      });
    }

    const product = await db.product.create({
      data: {
        name: body.name || "",
        slug,
        categoryId: categoryId,
        price: Number(body.price) || 0,
        mrp: Number(body.mrp) || 0,
        weight: body.weight || "100 g",
        rating: Number(body.rating) || 0,
        reviewCount: Number(body.reviewCount) || 0,
        badge: body.badge || null,
        bestSeller: body.bestSeller || false,
        isNew: body.isNew || false,
        img: body.img || null,
        images: JSON.stringify(body.images || []),
        shortDesc: body.shortDesc || "",
        description: body.description || "",
        ingredients: JSON.stringify(body.ingredients || []),
        origin: body.origin || "",
        shelfLife: body.shelfLife || "6 months",
        spiceLevel: body.spiceLevel || "Medium",
        cookingTime: body.cookingTime || "5 min",
        servings: body.servings || "Serves 4",
        tags: JSON.stringify(body.tags || []),
        hue: Number(body.hue) || 0,
        active: body.active !== false,
      },
    });

    // Raw SQL for freeItem fields
    if (body.freeItemName || body.freeItemImage) {
      await db.$executeRawUnsafe("UPDATE Product SET freeItemName = ?, freeItemImage = ? WHERE id = ?", body.freeItemName || null, body.freeItemImage || null, product.id);
    }

    // Increment category count
    await db.category.update({ where: { id: categoryId }, data: { count: { increment: 1 } } }).catch(() => {});

    return NextResponse.json({ ok: true, product: {
      ...product,
      images: JSON.parse(product.images || "[]"),
      ingredients: JSON.parse(product.ingredients || "[]"),
      tags: JSON.parse(product.tags || "[]"),
    } });
  } catch (e) {
    console.error("PRODUCT_CREATE_ERROR:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
