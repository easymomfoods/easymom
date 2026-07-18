"use client";

import { useEffect, useState } from "react";
import { useUI } from "@/lib/ui-store";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  MoreHorizontal,
  ShoppingBag,
  IndianRupee,
  Users,
  Star,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  avgRating: number;
  totalReviews: number;
}

interface Order {
  id: string;
  orderId: string;
  name: string;
  total: number;
  status: string;
  createdAt: string;
  items: { name: string; img?: string }[];
}

interface TopProduct {
  name: string;
  count: number;
  img: string;
}

interface BarChart {
  heights: number[];
  labels: string[];
  values: number[];
}

export default function DashboardContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [barChart, setBarChart] = useState<BarChart>({ heights: [], labels: [], values: [] });
  const [sparklines, setSparklines] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(true);
  const go = useUI((s) => s.go);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/orders").then((r) => r.json()),
    ]).then(([statsData, ordersData]) => {
      if (statsData.stats) setStats(statsData.stats);
      if (statsData.topProducts) setTopProducts(statsData.topProducts);
      if (statsData.barChart) setBarChart(statsData.barChart);
      if (statsData.sparklines) setSparklines(statsData.sparklines);
      if (ordersData.orders) setOrders(ordersData.orders.slice(0, 5));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  function inr(amount: number) {
    return "₹" + amount.toLocaleString("en-IN");
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  const statusColor: Record<string, string> = {
    confirmed: "bg-blue-50 text-blue-600",
    packed: "bg-amber-50 text-amber-600",
    shipped: "bg-purple-50 text-purple-600",
    delivered: "bg-emerald-50 text-emerald-600",
    cancelled: "bg-red-50 text-red-600",
  };

  const defaultProductImages: Record<string, string> = {
    "Green Curry": "/brand/products/green-curry1.webp",
    "Ghee Roast Masala": "/brand/products/ghee-roast1.webp",
    "Red Curry": "/brand/products/red-curry1.webp",
    "Fish Curry Masala": "/brand/products/fish-curry1.webp",
    "Pepper Chilli Masala": "/brand/products/pepper-chilli-masala1.webp",
    "Palli Curry": "/brand/products/palli-curry1.webp",
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 bg-stone-200/60 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-stone-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="h-80 bg-white rounded-xl border border-stone-100" />
          <div className="h-80 bg-white rounded-xl border border-stone-100" />
          <div className="h-80 bg-white rounded-xl border border-stone-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a0f0a] via-[#2a1810] to-[#1a0f0a] min-h-[200px] lg:min-h-[240px]">
        <div className="absolute inset-0">
          <img
            src="/brand/products/fish-curry1.webp"
            alt=""
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0f0a]/95 via-[#1a0f0a]/70 to-transparent" />
        </div>
        <div className="relative z-10 p-6 lg:p-8 flex flex-col justify-center h-full min-h-[200px] lg:min-h-[240px] max-w-lg">
          <p className="text-[11px] font-bold text-[#c8a960] uppercase tracking-[0.2em] mb-2">EasyMom</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
            {stats?.todayOrders ? (
              <>Today&apos;s Orders,<br /><span className="text-[#c8a960]">{stats.todayOrders} order{stats.todayOrders !== 1 ? "s" : ""} today</span></>
            ) : (
              <>No Orders Today<br /><span className="text-[#c8a960]">Start selling!</span></>
            )}
          </h2>
          <p className="text-sm text-white/60 mt-2 max-w-xs leading-relaxed">
            {stats?.pendingOrders ? `${stats.pendingOrders} pending order${stats.pendingOrders !== 1 ? "s" : ""} awaiting processing` : "All caught up — no pending orders."}
          </p>
          <button onClick={() => go({ name: "admin-products" })} className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#c8a960] text-[#1a0f0a] text-[13px] font-semibold rounded-lg hover:bg-[#d4b86a] transition-colors w-fit">
            Explore Products <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Orders"
          value={String(stats?.totalOrders || 0)}
          trend={stats?.weekOrders ? `+${stats.weekOrders} this week` : "No orders yet"}
          trendUp={!!stats?.weekOrders}
          icon={<ShoppingBag className="h-5 w-5" />}
          iconBg="bg-[#891816]/8"
          iconColor="text-[#891816]"
          sparkline={sparklines.orders}
        />
        <StatCard
          label="This Month Revenue"
          value={inr(stats?.monthRevenue || 0)}
          trend={stats?.monthRevenue ? `+${inr(stats.monthRevenue)} earned` : "No revenue yet"}
          trendUp={!!stats?.monthRevenue}
          icon={<IndianRupee className="h-5 w-5" />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          sparkline={sparklines.revenue}
        />
        <StatCard
          label="Subscribers"
          value={String(stats?.totalSubscribers || 0)}
          trend={stats?.totalSubscribers ? `${stats.totalSubscribers} total` : "No subscribers yet"}
          trendUp={!!stats?.totalSubscribers}
          icon={<Users className="h-5 w-5" />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          sparkline={sparklines.subscribers}
        />
        <StatCard
          label="Avg. Rating"
          value={`${stats?.avgRating || 0}/5`}
          trend={stats?.totalReviews ? `${stats.totalReviews} reviews` : "No reviews yet"}
          trendUp={!!stats?.totalReviews}
          icon={<Star className="h-5 w-5" />}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          sparkline={sparklines.rating}
        />
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h3 className="text-[14px] font-semibold text-stone-900">Top Selling Products</h3>
            <button
              onClick={() => go({ name: "admin-products" })}
              className="text-[12px] text-[#891816] font-medium hover:underline inline-flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-stone-50">
            {topProducts.length === 0 ? (
              <div className="px-5 py-8 text-center text-[13px] text-stone-400">No sales data yet</div>
            ) : (
              topProducts.map((p, i) => (
                <div
                  key={i}
                  onClick={() => go({ name: "admin-products" })}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50/50 transition-colors cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                    <img src={p.img || defaultProductImages[p.name] || "/brand/products/green-curry1.webp"} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-stone-900 truncate">{p.name}</p>
                    <p className="text-[12px] text-stone-500">{p.count} sold</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sales Overview (Area Line Chart) */}
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h3 className="text-[14px] font-semibold text-stone-900">Sales Overview</h3>
            <span className="text-[12px] text-stone-500 bg-stone-50 px-2.5 py-1 rounded-md">Last 12 Days</span>
          </div>
          <div className="p-5">
            <div className="h-48 mb-2">
              {barChart.heights.length === 0 ? (
                <div className="flex items-center justify-center h-full text-[13px] text-stone-400">No data</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={barChart.labels.map((label, i) => ({
                      label,
                      revenue: barChart.values[i] || 0,
                    }))}
                    margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c8a960" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#c8a960" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#a8a29e" }}
                      interval="preserveStartEnd"
                      minTickGap={40}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#a8a29e" }}
                      tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1c1917",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                        padding: "8px 12px",
                      }}
                      formatter={(value: number) => [inr(value), "Revenue"]}
                      labelStyle={{ color: "#a8a29e", fontSize: "11px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#c8a960"
                      strokeWidth={2.5}
                      fill="url(#revenueGradient)"
                      dot={false}
                      activeDot={{ r: 5, fill: "#c8a960", stroke: "#fff", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-100">
              <div>
                <p className="text-[11px] text-stone-500">Revenue</p>
                <p className="text-[14px] font-bold text-stone-900">{inr(stats?.monthRevenue || 0)}</p>
              </div>
              <div>
                <p className="text-[11px] text-stone-500">Orders</p>
                <p className="text-[14px] font-bold text-stone-900">{stats?.totalOrders || 0}</p>
              </div>
              <div>
                <p className="text-[11px] text-stone-500">Avg. Value</p>
                <p className="text-[14px] font-bold text-stone-900">
                  {stats?.monthOrders ? inr(Math.round((stats?.monthRevenue || 0) / stats.monthOrders)) : "₹0"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h3 className="text-[14px] font-semibold text-stone-900">Recent Orders</h3>
            <button
              onClick={() => go({ name: "admin-orders" })}
              className="text-[12px] text-[#891816] font-medium hover:underline inline-flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-stone-50">
            {orders.length === 0 ? (
              <div className="px-5 py-8 text-center text-[13px] text-stone-400">No orders yet</div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => go({ name: "admin-orders" })}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50/50 transition-colors cursor-pointer"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center shrink-0">
                    <span className="text-[12px] font-bold text-stone-600">
                      {order.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-medium text-stone-900 truncate">{order.name}</p>
                      <span className="text-[11px] text-stone-400 font-mono">{order.orderId}</span>
                    </div>
                    <p className="text-[12px] text-stone-500">{timeAgo(order.createdAt)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-semibold text-stone-900">{inr(order.total)}</p>
                    <span className={`inline-block text-[11px] font-medium px-1.5 py-0.5 rounded ${statusColor[order.status] || "bg-stone-50 text-stone-500"}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
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
  sparkline,
}: {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  sparkline?: number[];
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-100 p-4 hover:border-stone-200 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
        <button className="p-1 rounded-md hover:bg-stone-50 text-stone-400">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <p className="text-[13px] text-stone-500 mb-0.5">{label}</p>
      <p className="text-xl font-bold text-stone-900">{value}</p>
      <div className="flex items-center gap-1.5 mt-2">
        {trendUp ? (
          <TrendingUp className="h-3 w-3 text-emerald-500" />
        ) : (
          <TrendingDown className="h-3 w-3 text-stone-400" />
        )}
        <span className={`text-[12px] font-medium ${trendUp ? "text-emerald-600" : "text-stone-400"}`}>
          {trend}
        </span>
      </div>
      {sparkline && sparkline.length > 0 && (
        <div className="flex items-end gap-px h-6 mt-2">
          {sparkline.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm transition-all"
              style={{
                height: `${Math.max(h, 5)}%`,
                backgroundColor: trendUp ? "oklch(0.65 0.15 155 / 0.3)" : "oklch(0.60 0.17 25 / 0.3)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
