import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { cacheDel } from "@/lib/cache";

export const runtime = "nodejs";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const testimonial = await db.testimonial.update({
      where: { id },
      data: {
        name: body.name,
        location: body.location,
        role: body.role,
        quote: body.quote,
        rating: body.rating,
        product: body.product,
        active: body.active,
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

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await db.testimonial.delete({ where: { id } });
    await cacheDel("testimonials");
    await cacheDel("init");
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
