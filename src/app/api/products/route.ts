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

    return NextResponse.json({ products: parsed });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
