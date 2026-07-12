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

    // Top selling products — count how many times each product appears in orders
    const allOrders = await db.order.findMany({
      where: { createdAt: { gte: monthStart } },
      select: { itemsJson: true },
    });
    const productSales: Record<string, { name: string; count: number; img: string }> = {};
    for (const order of allOrders) {
      try {
        const items = JSON.parse(order.itemsJson);
        for (const item of items) {
          const name = item.name || "Unknown";
          if (!productSales[name]) {
            productSales[name] = { name, count: 0, img: item.img || "/brand/products/green-curry1.png" };
          }
          productSales[name].count += item.qty || 1;
        }
      } catch {}
    }
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    // Daily revenue for the bar chart (last 12 days)
    const twelveDaysAgo = new Date(now);
    twelveDaysAgo.setDate(twelveDaysAgo.getDate() - 11);
    twelveDaysAgo.setHours(0, 0, 0, 0);
    const dailyOrders = await db.order.findMany({
      where: { createdAt: { gte: twelveDaysAgo } },
      select: { total: true, createdAt: true },
    });
    const dailyRevenue: number[] = new Array(12).fill(0);
    for (const order of dailyOrders) {
      const dayIndex = Math.floor((order.createdAt.getTime() - twelveDaysAgo.getTime()) / (24 * 60 * 60 * 1000));
      if (dayIndex >= 0 && dayIndex < 12) {
        dailyRevenue[dayIndex] += order.total;
      }
    }
    const maxDaily = Math.max(...dailyRevenue, 1);
    const barHeights = dailyRevenue.map((r) => Math.round((r / maxDaily) * 100));

    // Bar chart labels (last 12 days)
    const barLabels: string[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(twelveDaysAgo);
      d.setDate(d.getDate() + i);
      barLabels.push(d.getDate() + " " + d.toLocaleString("en-IN", { month: "short" }));
    }

    // Average rating from reviews
    const reviews = await db.review.findMany({ select: { rating: true } });
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

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
        avgRating: parseFloat(avgRating),
        totalReviews: reviews.length,
      },
      topProducts,
      barChart: { heights: barHeights, labels: barLabels, values: dailyRevenue },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
