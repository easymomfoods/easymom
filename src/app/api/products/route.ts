import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
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

    // Fetch freeItem fields (added via ALTER TABLE, Prisma doesn't know them)
    const freeRows = await db.$executeRawUnsafe("SELECT id, freeItemName, freeItemImage FROM Product WHERE freeItemName IS NOT NULL") as unknown[];
    const freeMap = new Map<string, { freeItemName: string; freeItemImage: string }>();
    for (const row of freeRows as { id: string; freeItemName: string; freeItemImage: string }[]) {
      freeMap.set(row.id, { freeItemName: row.freeItemName, freeItemImage: row.freeItemImage });
    }
    const merged = parsed.map((p) => {
      const free = freeMap.get(p.id);
      return free ? { ...p, ...free } : p;
    });

    return NextResponse.json({ products: merged });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
