"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

interface Stats {
  totalOrders: number;
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalSubscribers: number;
  monthRevenue: number;
  pendingRevenue: number;
}

interface Order {
  id: string;
  orderId: string;
  name: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: { name: string; price: number; qty: number }[];
}

export default function AnalyticsContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/orders").then((r) => r.json()),
    ])
      .then(([statsData, ordersData]) => {
        if (statsData.stats) setStats(statsData.stats);
        if (ordersData.orders) setOrders(ordersData.orders);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function inr(amount: number) {
    return "₹" + amount.toLocaleString("en-IN");
  }

  // Compute analytics
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length ? Math.round(totalRevenue / orders.length) : 0;
  const codOrders = orders.filter((o) => o.paymentMethod === "cod").length;
  const upiOrders = orders.filter((o) => o.paymentMethod === "upi_qr").length;

  // Trend calculations (this week vs last week)
  const now = new Date();
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(thisWeekStart);
  lastWeekEnd.setMilliseconds(-1);

  const thisWeekOrders = orders.filter((o) => new Date(o.createdAt) >= thisWeekStart);
  const lastWeekOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    return d >= lastWeekStart && d < thisWeekStart;
  });

  const thisWeekRevenue = thisWeekOrders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0);
  const lastWeekRevenue = lastWeekOrders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0);
  const revenueTrend = lastWeekRevenue > 0 ? Math.round(((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100) : 0;

  const thisWeekAvg = thisWeekOrders.length ? Math.round(thisWeekRevenue / thisWeekOrders.length) : 0;
  const lastWeekAvg = lastWeekOrders.length ? Math.round(lastWeekRevenue / lastWeekOrders.length) : 0;
  const avgTrend = lastWeekAvg > 0 ? Math.round(((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100) : 0;

  // Status breakdown
  const statusBreakdown = [
    { label: "Confirmed", count: orders.filter((o) => o.status === "confirmed").length, color: "#3b82f6" },
    { label: "Packed", count: orders.filter((o) => o.status === "packed").length, color: "#f59e0b" },
    { label: "Shipped", count: orders.filter((o) => o.status === "shipped").length, color: "#a855f7" },
    { label: "Delivered", count: orders.filter((o) => o.status === "delivered").length, color: "#10b981" },
    { label: "Cancelled", count: orders.filter((o) => o.status === "cancelled").length, color: "#ef4444" },
  ];

  // Top products by revenue
  const productRevenue: Record<string, { name: string; revenue: number; count: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!productRevenue[item.name]) {
        productRevenue[item.name] = { name: item.name, revenue: 0, count: 0 };
      }
      productRevenue[item.name].revenue += item.price * item.qty;
      productRevenue[item.name].count += item.qty;
    });
  });
  const topProducts = Object.values(productRevenue)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Orders by day (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayOrders = orders.filter((o) => o.createdAt.startsWith(dateStr));
    return {
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
      orders: dayOrders.length,
      revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
    };
  });
  const maxDayOrders = Math.max(...last7Days.map((d) => d.orders), 1);

  // Orders by hour (last 24 hours)
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hourOrders = orders.filter((o) => {
      const h = new Date(o.createdAt).getHours();
      return h === i;
    });
    return { hour: i, count: hourOrders.length };
  });
  const maxHourly = Math.max(...hourlyData.map((h) => h.count), 1);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-stone-200/60 rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-stone-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-80 bg-white rounded-xl border border-stone-100" />
          <div className="h-80 bg-white rounded-xl border border-stone-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Analytics</h1>
          <p className="text-sm text-stone-500 mt-0.5">Performance insights and trends</p>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-stone-500">
          <Calendar className="h-4 w-4" />
          <span>Last 30 days</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={inr(totalRevenue)} trend={lastWeekRevenue > 0 ? `${revenueTrend > 0 ? "+" : ""}${revenueTrend}%` : "N/A"} trendUp={revenueTrend >= 0} icon={<IndianRupee className="h-5 w-5" />} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard label="Avg. Order Value" value={inr(avgOrderValue)} trend={lastWeekAvg > 0 ? `${avgTrend > 0 ? "+" : ""}${avgTrend}%` : "N/A"} trendUp={avgTrend >= 0} icon={<BarChart3 className="h-5 w-5" />} iconBg="bg-[#891816]/8" iconColor="text-[#891816]" />
        <StatCard label="COD Orders" value={String(codOrders)} trend={`${upiOrders} UPI`} trendUp={false} icon={<ShoppingCart className="h-5 w-5" />} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard label="Total Orders" value={String(orders.length)} trend={thisWeekOrders.length > 0 ? `${thisWeekOrders.length} this week` : "No orders yet"} trendUp icon={<Activity className="h-5 w-5" />} iconBg="bg-purple-50" iconColor="text-purple-600" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Orders by Day */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[14px] font-semibold text-stone-900">Orders This Week</h3>
            <span className="text-[12px] text-stone-500 bg-stone-50 px-2.5 py-1 rounded-md">Last 7 days</span>
          </div>
          <div className="flex items-end gap-3 h-48">
            {last7Days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[11px] font-medium text-stone-600">{d.orders}</span>
                <div className="w-full relative group">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-[#891816] to-[#c23a3a] transition-all hover:from-[#6d1311] hover:to-[#891816]"
                    style={{ height: `${(d.orders / maxDayOrders) * 140}px`, minHeight: "4px" }}
                  />
                </div>
                <span className="text-[11px] text-stone-400 font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-xl border border-stone-100 p-5">
          <h3 className="text-[14px] font-semibold text-stone-900 mb-5">Order Status</h3>
          <div className="space-y-3">
            {statusBreakdown.map((s, i) => {
              const pct = orders.length ? Math.round((s.count / orders.length) * 100) : 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-[13px] text-stone-700">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-stone-900">{s.count}</span>
                      <span className="text-[11px] text-stone-400">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Split */}
          <div className="mt-5 pt-4 border-t border-stone-100">
            <p className="text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-3">Payment Split</p>
            <div className="flex gap-3">
              <div className="flex-1 bg-stone-50 rounded-lg p-3 text-center">
                <p className="text-[11px] text-stone-500">COD</p>
                <p className="text-lg font-bold text-stone-900">{codOrders}</p>
              </div>
              <div className="flex-1 bg-stone-50 rounded-lg p-3 text-center">
                <p className="text-[11px] text-stone-500">UPI</p>
                <p className="text-lg font-bold text-stone-900">{upiOrders}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products */}
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100">
            <h3 className="text-[14px] font-semibold text-stone-900">Top Products by Revenue</h3>
          </div>
          <div className="divide-y divide-stone-50">
            {topProducts.length === 0 ? (
              <div className="px-5 py-8 text-center text-[13px] text-stone-400">No data yet</div>
            ) : (
              topProducts.map((p, i) => {
                const maxRev = topProducts[0]?.revenue || 1;
                const pct = Math.round((p.revenue / maxRev) * 100);
                return (
                  <div key={i} className="px-5 py-3.5 hover:bg-stone-50/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[13px] font-bold text-stone-400 w-5">#{i + 1}</span>
                        <span className="text-[13px] font-medium text-stone-900">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[12px] text-stone-500">{p.count} sold</span>
                        <span className="text-[13px] font-semibold text-stone-900">{inr(p.revenue)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden ml-8">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#891816] to-[#c23a3a]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Hourly Activity */}
        <div className="bg-white rounded-xl border border-stone-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[14px] font-semibold text-stone-900">Order Activity by Hour</h3>
            <span className="text-[12px] text-stone-500 bg-stone-50 px-2.5 py-1 rounded-md">24h</span>
          </div>
          <div className="flex items-end gap-1 h-40">
            {hourlyData.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t-sm bg-[#c8a960]/60 hover:bg-[#c8a960] transition-colors"
                  style={{ height: `${(h.count / maxHourly) * 120}px`, minHeight: h.count > 0 ? "3px" : "0" }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-stone-400">
            <span>12am</span>
            <span>6am</span>
            <span>12pm</span>
            <span>6pm</span>
            <span>12am</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Peak Day" value={last7Days.sort((a, b) => b.orders - a.orders)[0]?.day || "—"} desc={`${last7Days.sort((a, b) => b.orders - a.orders)[0]?.orders || 0} orders`} />
        <SummaryCard title="Best Product" value={topProducts[0]?.name || "—"} desc={topProducts[0] ? inr(topProducts[0].revenue) : "No data"} />
        <SummaryCard title="Pending Revenue" value={inr(stats?.pendingRevenue || 0)} desc={`${stats?.pendingOrders || 0} orders`} />
        <SummaryCard title="Delivered Rate" value={`${orders.length ? Math.round((orders.filter((o) => o.status === "delivered").length / orders.length) * 100) : 0}%`} desc={`${orders.filter((o) => o.status === "delivered").length} of ${orders.length}`} />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
  trendUp,
  icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-100 p-4 hover:border-stone-200 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[12px] font-medium ${trendUp ? "text-emerald-600" : "text-stone-500"}`}>
          {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend}
        </div>
      </div>
      <p className="text-[13px] text-stone-500">{label}</p>
      <p className="text-xl font-bold text-stone-900 tracking-tight mt-0.5">{value}</p>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  desc,
}: {
  title: string;
  value: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-100 p-4 hover:border-stone-200 transition-colors">
      <p className="text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-2">{title}</p>
      <p className="text-[15px] font-bold text-stone-900">{value}</p>
      <p className="text-[12px] text-stone-500 mt-0.5">{desc}</p>
    </div>
  );
}
