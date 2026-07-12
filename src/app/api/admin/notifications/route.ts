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

  // Get last checked timestamp from DB
  const lastCheckedRecord = await db.siteContent.findUnique({ where: { key: "admin_notif_last_checked" } });
  const lastChecked = lastCheckedRecord?.value || null;

  // Fetch all orders from last 24 hours
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

  // Mark each order as read/unread
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
}
