import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cacheGet, cacheSet, CACHE_TTL } from "@/lib/cache";

export const runtime = "nodejs";

const SITE_CONTENT_KEYS = [
  "hero", "brand-story", "featured", "our-products",
  "recipes-section", "testimonials-section", "instagram-feed",
  "trust-strip", "store-locations",
] as const;

export async function GET() {
  try {
    const cached = await cacheGet<any>("init");
    if (cached) return NextResponse.json(cached);

    const [products, categories, recipes, testimonials] = await Promise.all([
      (async () => {
        const p = await db.product.findMany({ orderBy: { createdAt: "desc" } });
        const parsed = p.map((x) => ({
          ...x,
          images: JSON.parse(x.images || "[]"),
          ingredients: JSON.parse(x.ingredients || "[]"),
          tags: JSON.parse(x.tags || "[]"),
        }));
        try {
          const freeRows = await db.$queryRawUnsafe(
            "SELECT id, freeItemName, freeItemImage FROM Product WHERE freeItemName IS NOT NULL"
          );
          if (Array.isArray(freeRows) && freeRows.length > 0) {
            const freeMap = new Map<string, { freeItemName: string; freeItemImage: string }>();
            for (const row of freeRows as { id: string; freeItemName: string; freeItemImage: string }[]) {
              freeMap.set(row.id, { freeItemName: row.freeItemName, freeItemImage: row.freeItemImage });
            }
            return parsed.map((p) => {
              const free = freeMap.get(p.id);
              return free ? { ...p, ...free } : p;
            });
          }
        } catch { /* freeItem columns may not exist */ }
        return parsed;
      })(),
      db.category.findMany({ orderBy: { sortOrder: "asc" } }),
      db.recipe.findMany({ where: { active: true } }).then((r) =>
        r.map((x) => ({ ...x, steps: JSON.parse(x.steps || "[]") }))
      ),
      db.testimonial.findMany({ where: { active: true } }),
    ]);

    const siteContentRecords = await db.siteContent.findMany({
      where: { key: { in: SITE_CONTENT_KEYS as unknown as string[] } },
    });
    const siteContent: Record<string, string | null> = {};
    for (const key of SITE_CONTENT_KEYS) {
      siteContent[key] = siteContentRecords.find((r) => r.key === key)?.value ?? null;
    }

    const data = { products, categories, recipes, testimonials, siteContent };
    await cacheSet("init", data, 60);
    return NextResponse.json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
