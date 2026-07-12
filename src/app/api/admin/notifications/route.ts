import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const since = searchParams.get("since");

  const where: any = {};
  if (since) {
    where.createdAt = { gt: new Date(since) };
  }

  const orders = await db.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      orderId: true,
      name: true,
      email: true,
      total: true,
      status: true,
      paymentMethod: true,
      createdAt: true,
    },
  });

  const totalCount = await db.order.count();

  return NextResponse.json({ orders, totalCount });
}
