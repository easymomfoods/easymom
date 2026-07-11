"use client";

import { useEffect, useState } from "react";

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

export default function AdminDashboard({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (res.ok) setStats(data.stats);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function inr(amount: number) {
    return "₹" + amount.toLocaleString("en-IN");
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-stone-200 rounded" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-stone-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
          <p className="text-stone-500 text-sm mt-1">Welcome back, Admin</p>
        </div>
        <button
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            window.location.reload();
          }}
          className="px-4 py-2 text-sm text-stone-600 hover:text-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Today's Orders" value={stats?.todayOrders || 0} icon="📦" />
        <StatCard label="This Week" value={stats?.weekOrders || 0} icon="📊" />
        <StatCard label="This Month" value={stats?.monthOrders || 0} icon="📈" />
        <StatCard label="Pending Orders" value={stats?.pendingOrders || 0} icon="⏳" accent />
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <p className="text-sm text-stone-500 mb-1">Month Revenue (Paid)</p>
          <p className="text-3xl font-bold text-stone-900">{inr(stats?.monthRevenue || 0)}</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <p className="text-sm text-stone-500 mb-1">Pending Payments</p>
          <p className="text-3xl font-bold text-amber-600">{inr(stats?.pendingRevenue || 0)}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate("admin-orders")}
          className="bg-white border border-stone-200 rounded-2xl p-6 text-left hover:border-[#891816] hover:shadow-md transition-all group"
        >
          <div className="text-2xl mb-2">📋</div>
          <h3 className="font-semibold text-stone-900 group-hover:text-[#891816] transition-colors">Manage Orders</h3>
          <p className="text-sm text-stone-500 mt-1">View and update order status</p>
        </button>

        <button
          onClick={() => onNavigate("admin-products")}
          className="bg-white border border-stone-200 rounded-2xl p-6 text-left hover:border-[#891816] hover:shadow-md transition-all group"
        >
          <div className="text-2xl mb-2">🏷️</div>
          <h3 className="font-semibold text-stone-900 group-hover:text-[#891816] transition-colors">Manage Products</h3>
          <p className="text-sm text-stone-500 mt-1">Add, edit, or remove products</p>
        </button>

        <button
          onClick={() => onNavigate("home")}
          className="bg-white border border-stone-200 rounded-2xl p-6 text-left hover:border-[#891816] hover:shadow-md transition-all group"
        >
          <div className="text-2xl mb-2">🌐</div>
          <h3 className="font-semibold text-stone-900 group-hover:text-[#891816] transition-colors">View Store</h3>
          <p className="text-sm text-stone-500 mt-1">See your storefront</p>
        </button>
      </div>

      {/* Summary */}
      <div className="mt-8 bg-stone-50 rounded-2xl p-6">
        <h3 className="font-semibold text-stone-900 mb-3">Store Summary</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-stone-500">Total Orders</p>
            <p className="font-bold text-stone-900 text-lg">{stats?.totalOrders || 0}</p>
          </div>
          <div>
            <p className="text-stone-500">Products</p>
            <p className="font-bold text-stone-900 text-lg">{stats?.totalProducts || 0}</p>
          </div>
          <div>
            <p className="text-stone-500">Subscribers</p>
            <p className="font-bold text-stone-900 text-lg">{stats?.totalSubscribers || 0}</p>
          </div>
          <div>
            <p className="text-stone-500">All-time Revenue</p>
            <p className="font-bold text-stone-900 text-lg">{inr(stats?.monthRevenue || 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, accent }: { label: string; value: number; icon: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 border ${accent ? "bg-amber-50 border-amber-200" : "bg-white border-stone-200"}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-xs text-stone-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-stone-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
