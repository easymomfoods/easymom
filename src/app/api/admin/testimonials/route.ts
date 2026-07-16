import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from '@/lib/auth';
import { cacheDel } from '@/lib/cache';

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const testimonials = await db.testimonial.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json({ testimonials });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const testimonial = await db.testimonial.create({
      data: {
        name: body.name || "",
        location: body.location || "",
        role: body.role || "",
        quote: body.quote || "",
        rating: body.rating || 5,
        product: body.product || "",
        active: body.active !== false,
      },
    });
    await cacheDel("testimonials");
    await cacheDel("init");
    return NextResponse.json({ ok: true, testimonial });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

