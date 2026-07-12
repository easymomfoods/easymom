import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [], recipes: [] });
  }

  try {
    const [products, recipes] = await Promise.all([
      db.product.findMany({
        where: {
          active: true,
          OR: [
            { name: { contains: q } },
            { shortDesc: { contains: q } },
            { description: { contains: q } },
            { tags: { contains: q } },
            { ingredients: { contains: q } },
          ],
        },
        take: 10,
      }),
      db.recipe.findMany({
        where: {
          active: true,
          OR: [
            { title: { contains: q } },
            { excerpt: { contains: q } },
            { region: { contains: q } },
          ],
        },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id, name: p.name, slug: p.slug, img: p.img, price: p.price, shortDesc: p.shortDesc,
      })),
      recipes: recipes.map((r) => ({
        id: r.id, title: r.title, region: r.region, excerpt: r.excerpt,
      })),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
