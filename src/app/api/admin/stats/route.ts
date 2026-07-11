import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalOrders, todayOrders, weekOrders, monthOrders, pendingOrders, totalProducts, totalSubscribers] =
      await Promise.all([
        db.order.count(),
        db.order.count({ where: { createdAt: { gte: todayStart } } }),
        db.order.count({ where: { createdAt: { gte: weekStart } } }),
        db.order.count({ where: { createdAt: { gte: monthStart } } }),
        db.order.count({ where: { status: { in: ["confirmed", "packed"] } } }),
        db.product.count(),
        db.newsletterSub.count(),
      ]);

    // Revenue calculations
    const [monthRevenue, pendingRevenue] = await Promise.all([
      db.order.aggregate({
        where: { createdAt: { gte: monthStart }, paymentStatus: "paid" },
        _sum: { total: true },
      }),
      db.order.aggregate({
        where: { paymentStatus: "pending" },
        _sum: { total: true },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalOrders,
        todayOrders,
        weekOrders,
        monthOrders,
        pendingOrders,
        totalProducts,
        totalSubscribers,
        monthRevenue: monthRevenue._sum.total || 0,
        pendingRevenue: pendingRevenue._sum.total || 0,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
