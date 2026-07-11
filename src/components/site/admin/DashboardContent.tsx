"use client";

import { useEffect, useState } from "react";
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
  createdAt: string;
  items: { name: string; img?: string }[];
}

export default function DashboardContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/orders").then((r) => r.json()),
    ]).then(([statsData, ordersData]) => {
      if (statsData.stats) setStats(statsData.stats);
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
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/brand/products/fish-curry1.png"
            alt=""
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0f0a]/95 via-[#1a0f0a]/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 lg:p-8 flex flex-col justify-center h-full min-h-[200px] lg:min-h-[240px] max-w-lg">
          <p className="text-[11px] font-bold text-[#c8a960] uppercase tracking-[0.2em] mb-2">EasyMom</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
            Today&apos;s Orders,<br />
            <span className="text-[#c8a960]">Today&apos;s Freshness</span>
          </h2>
          <p className="text-sm text-white/60 mt-2 max-w-xs leading-relaxed">
            Manage your store efficiently. Track orders, update products, and grow your business.
          </p>
          <button className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#c8a960] text-[#1a0f0a] text-[13px] font-semibold rounded-lg hover:bg-[#d4b86a] transition-colors w-fit">
            Explore Products <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Orders"
          value={String(stats?.totalOrders || 0)}
          trend="+18.6%"
          trendUp
          icon={<ShoppingBag className="h-5 w-5" />}
          iconBg="bg-[#891816]/8"
          iconColor="text-[#891816]"
        />
        <StatCard
          label="Total Sales"
          value={inr(stats?.monthRevenue || 0)}
          trend="+22.4%"
          trendUp
          icon={<IndianRupee className="h-5 w-5" />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Total Customers"
          value={String(stats?.totalSubscribers || 0)}
          trend="+14.2%"
          trendUp
          icon={<Users className="h-5 w-5" />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          label="Avg. Rating"
          value="4.8/5"
          trend="+8.7%"
          trendUp
          icon={<Star className="h-5 w-5" />}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h3 className="text-[14px] font-semibold text-stone-900">Top Selling Products</h3>
            <button className="text-[12px] font-medium text-stone-500 hover:text-[#891816] transition-colors">
              View All
            </button>
          </div>
          <div className="divide-y divide-stone-50">
            {[
              { name: "Green Curry", sold: "1,245", trend: "+24.5%", img: "/brand/products/green-curry1.png" },
              { name: "Ghee Roast Masala", sold: "845", trend: "+18.2%", img: "/brand/products/ghee-roast1.png" },
              { name: "Red Curry", sold: "620", trend: "+12.6%", img: "/brand/products/red-curry1.png" },
              { name: "Chicken Sukka", sold: "567", trend: "+10.3%", img: "/brand/products/chicken-sukka-masala1.png" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50/50 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                  <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-stone-900 truncate">{p.name}</p>
                  <p className="text-[12px] text-stone-500">{p.sold} Sold</p>
                </div>
                <span className="text-[12px] font-medium text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  {p.trend}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Overview (CSS Chart) */}
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h3 className="text-[14px] font-semibold text-stone-900">Sales Overview</h3>
            <span className="text-[12px] text-stone-500 bg-stone-50 px-2.5 py-1 rounded-md">This Month</span>
          </div>
          <div className="p-5">
            {/* CSS Bar Chart */}
            <div className="flex items-end gap-2 h-40 mb-4">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-[#c8a960] to-[#d4b86a] transition-all hover:from-[#891816] hover:to-[#a82020]"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[11px] text-stone-400 px-1">
              <span>1 May</span>
              <span>8 May</span>
              <span>15 May</span>
              <span>22 May</span>
              <span>29 May</span>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-stone-100">
              <div>
                <p className="text-[11px] text-stone-500">Total Revenue</p>
                <p className="text-[14px] font-bold text-stone-900">{inr(stats?.monthRevenue || 0)}</p>
              </div>
              <div>
                <p className="text-[11px] text-stone-500">Total Orders</p>
                <p className="text-[14px] font-bold text-stone-900">{stats?.totalOrders || 0}</p>
              </div>
              <div>
                <p className="text-[11px] text-stone-500">Avg. Value</p>
                <p className="text-[14px] font-bold text-stone-900">
                  {stats?.totalOrders ? inr(Math.round((stats?.monthRevenue || 0) / stats.totalOrders)) : "₹0"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h3 className="text-[14px] font-semibold text-stone-900">Recent Orders</h3>
            <button className="text-[12px] font-medium text-stone-500 hover:text-[#891816] transition-colors">
              View All
            </button>
          </div>
          <div className="divide-y divide-stone-50">
            {orders.length === 0 ? (
              <div className="px-5 py-8 text-center text-[13px] text-stone-400">No orders yet</div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50/50 transition-colors">
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

      {/* Bottom Features */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Rich & Authentic", desc: "Handpicked spices for authentic taste", icon: "🌶️" },
          { title: "No Preservatives", desc: "100% natural ingredients, pure & safe", icon: "🌿" },
          { title: "Perfect for Every Dish", desc: "Enhances the taste of fish & seafood", icon: "🐟" },
          { title: "Trusted by Thousands", desc: "Loved by 10,000+ happy customers", icon: "❤️" },
        ].map((f, i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-100 p-4 flex items-start gap-3">
            <span className="text-xl mt-0.5">{f.icon}</span>
            <div>
              <p className="text-[13px] font-semibold text-stone-900">{f.title}</p>
              <p className="text-[12px] text-stone-500 mt-0.5 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
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
          <TrendingDown className="h-3 w-3 text-red-500" />
        )}
        <span className={`text-[12px] font-medium ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
          {trend}
        </span>
        <span className="text-[12px] text-stone-400">this month</span>
      </div>
      {/* Mini sparkline */}
      <div className="flex items-end gap-px h-6 mt-2">
        {Array.from({ length: 12 }, (_, i) => {
          const h = 30 + Math.random() * 70;
          return (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                backgroundColor: trendUp ? "oklch(0.65 0.15 155 / 0.3)" : "oklch(0.60 0.17 25 / 0.3)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
