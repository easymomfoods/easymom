import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cacheGet, cacheSet, CACHE_TTL } from "@/lib/cache";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cacheKey = `product:${slug}`;
    const cached = await cacheGet<any>(cacheKey);
    if (cached) return NextResponse.json({ product: cached });

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

    await cacheSet(cacheKey, parsed, CACHE_TTL.PRODUCTS);
    return NextResponse.json({ product: parsed });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
