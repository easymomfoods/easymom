import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await db.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const parsed = {
      ...product,
      images: JSON.parse(product.images || "[]"),
      ingredients: JSON.parse(product.ingredients || "[]"),
      tags: JSON.parse(product.tags || "[]"),
    };

    // Fetch freeItem fields
    const freeRows = await db.$executeRawUnsafe("SELECT freeItemName, freeItemImage FROM Product WHERE id = ?", product.id) as unknown[];
    if (freeRows.length > 0) {
      const free = freeRows[0] as { freeItemName: string; freeItemImage: string };
      if (free.freeItemName) { parsed.freeItemName = free.freeItemName; parsed.freeItemImage = free.freeItemImage; }
    }

    return NextResponse.json({ product: parsed });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
