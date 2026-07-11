"use client";

import { useEffect, useState } from "react";
import {
  Package,
  BarChart3,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShoppingBag,
  Tag,
  Globe,
  LogOut,
  IndianRupee,
  Users,
  Layers,
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

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50/80">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="h-16 bg-white border-b border-stone-100" />
          <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            <div className="h-8 w-56 bg-stone-200 rounded-lg" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-white rounded-xl border border-stone-100" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="h-28 bg-white rounded-xl border border-stone-100" />
              <div className="h-28 bg-white rounded-xl border border-stone-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/80">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/brand/easymom-logo.png" alt="EasyMom" className="h-8" />
            <div className="h-5 w-px bg-stone-200" />
            <span className="text-sm font-medium text-stone-500">Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Welcome back, Admin
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Today"
            value={stats?.todayOrders || 0}
            icon={<Package className="h-5 w-5" />}
            accent="maroon"
          />
          <StatCard
            label="This Week"
            value={stats?.weekOrders || 0}
            icon={<BarChart3 className="h-5 w-5" />}
            accent="stone"
          />
          <StatCard
            label="This Month"
            value={stats?.monthOrders || 0}
            icon={<TrendingUp className="h-5 w-5" />}
            accent="stone"
          />
          <StatCard
            label="Pending"
            value={stats?.pendingOrders || 0}
            icon={<Clock className="h-5 w-5" />}
            accent="amber"
          />
        </div>

        {/* Revenue Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-stone-100 p-5 hover:border-stone-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-stone-500">This Month (Paid)</span>
              <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
                <IndianRupee className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-stone-900 tracking-tight">
              {inr(stats?.monthRevenue || 0)}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 hover:border-stone-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-stone-500">Pending Payments</span>
              <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-amber-600 tracking-tight">
              {inr(stats?.pendingRevenue || 0)}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <ActionButton
            label="Manage Orders"
            desc="View and update order status"
            icon={<Package className="h-5 w-5" />}
            onClick={() => onNavigate("admin-orders")}
          />
          <ActionButton
            label="Manage Products"
            desc="Add, edit, or remove products"
            icon={<Tag className="h-5 w-5" />}
            onClick={() => onNavigate("admin-products")}
          />
          <ActionButton
            label="View Store"
            desc="See your storefront"
            icon={<Globe className="h-5 w-5" />}
            onClick={() => onNavigate("home")}
            external
          />
        </div>

        {/* Store Summary */}
        <div className="bg-white rounded-xl border border-stone-100">
          <div className="px-5 py-4 border-b border-stone-100">
            <h3 className="text-sm font-semibold text-stone-900">Store Summary</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-stone-100">
            <SummaryItem
              label="Total Orders"
              value={String(stats?.totalOrders || 0)}
              icon={<ShoppingBag className="h-4 w-4" />}
            />
            <SummaryItem
              label="Products"
              value={String(stats?.totalProducts || 0)}
              icon={<Layers className="h-4 w-4" />}
            />
            <SummaryItem
              label="Subscribers"
              value={String(stats?.totalSubscribers || 0)}
              icon={<Users className="h-4 w-4" />}
            />
            <SummaryItem
              label="Month Revenue"
              value={inr(stats?.monthRevenue || 0)}
              icon={<IndianRupee className="h-4 w-4" />}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: "maroon" | "stone" | "amber";
}) {
  const accentStyles = {
    maroon: {
      iconBg: "bg-[#891816]/8",
      iconText: "text-[#891816]",
    },
    stone: {
      iconBg: "bg-stone-100",
      iconText: "text-stone-600",
    },
    amber: {
      iconBg: "bg-amber-50",
      iconText: "text-amber-600",
    },
  };

  const s = accentStyles[accent];

  return (
    <div className="bg-white rounded-xl border border-stone-100 p-4 hover:border-stone-200 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg ${s.iconBg} flex items-center justify-center ${s.iconText}`}>
          {icon}
        </div>
        <div>
          <p className="text-[13px] text-stone-500">{label}</p>
          <p className="text-2xl font-bold text-stone-900 tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  desc,
  icon,
  onClick,
  external,
}: {
  label: string;
  desc: string;
  icon: React.ReactNode;
  onClick: () => void;
  external?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-xl border border-stone-100 p-5 text-left hover:border-[#891816]/30 hover:shadow-[0_2px_12px_-4px_rgba(137,24,22,0.12)] transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-lg bg-stone-50 group-hover:bg-[#891816]/8 flex items-center justify-center text-stone-500 group-hover:text-[#891816] transition-colors">
          {icon}
        </div>
        <ArrowUpRight className="h-4 w-4 text-stone-300 group-hover:text-[#891816] transition-colors" />
      </div>
      <h3 className="text-[15px] font-semibold text-stone-900 group-hover:text-[#891816] transition-colors">
        {label}
      </h3>
      <p className="text-[13px] text-stone-500 mt-0.5">{desc}</p>
    </button>
  );
}

function SummaryItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-stone-400">{icon}</span>
        <span className="text-[13px] text-stone-500">{label}</span>
      </div>
      <p className="text-lg font-bold text-stone-900">{value}</p>
    </div>
  );
}
