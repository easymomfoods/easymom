import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const lastCheckedRecord = await db.siteContent.findUnique({ where: { key: "admin_notif_last_checked" } });
    const lastChecked = lastCheckedRecord?.value || null;

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const orders = await db.order.findMany({
      where: { createdAt: { gte: twentyFourHoursAgo } },
      orderBy: { createdAt: "desc" },
      select: {
        orderId: true,
        name: true,
        email: true,
        total: true,
        paymentMethod: true,
        status: true,
        createdAt: true,
      },
    });

    const ordersWithReadStatus = orders.map((o) => ({
      ...o,
      read: lastChecked ? new Date(o.createdAt) <= new Date(lastChecked) : false,
    }));

    const unreadCount = ordersWithReadStatus.filter((o) => !o.read).length;

    return NextResponse.json({
      orders: ordersWithReadStatus,
      unreadCount,
      lastChecked,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
