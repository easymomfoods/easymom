import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://easymom.co.in";

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/recipes`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await db.product.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    });
    productPages = products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB may not be available at build time
  }

  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const categories = await db.category.findMany({
      select: { slug: true, updatedAt: true },
    });
    categoryPages = categories.map((c) => ({
      url: `${base}/shop/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB may not be available at build time
  }

  return [...staticPages, ...productPages, ...categoryPages];
}
