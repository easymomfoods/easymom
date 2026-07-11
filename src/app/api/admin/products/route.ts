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

    const product = await db.product.create({
      data: {
        name: body.name || "",
        slug,
        categoryId: body.categoryId || "",
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

    return NextResponse.json({ ok: true, product });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
