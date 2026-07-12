import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const review = await db.review.update({ where: { id }, data: { active: body.active } });

    // Recalculate product rating from approved reviews only
    const stats = await db.review.aggregate({
      where: { productId: review.productId, active: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await db.product.update({
      where: { id: review.productId },
      data: {
        rating: Math.round((stats._avg.rating || 0) * 10) / 10,
        reviewCount: stats._count.rating,
      },
    });

    return NextResponse.json({ ok: true, review });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const review = await db.review.delete({ where: { id } });

    // Recalculate product rating
    const stats = await db.review.aggregate({
      where: { productId: review.productId, active: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await db.product.update({
      where: { id: review.productId },
      data: {
        rating: Math.round((stats._avg.rating || 0) * 10) / 10,
        reviewCount: stats._count.rating,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
