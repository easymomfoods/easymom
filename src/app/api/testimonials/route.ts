import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cacheGet, cacheSet, CACHE_TTL } from "@/lib/cache";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cached = await cacheGet<any[]>("testimonials");
    if (cached) return NextResponse.json({ testimonials: cached });

    const testimonials = await db.testimonial.findMany({
      where: { active: true },
    });

    await cacheSet("testimonials", testimonials, CACHE_TTL.TESTIMONIALS);
    return NextResponse.json({ testimonials });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
