"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Megaphone,
  BookOpen,
  Star,
  Settings,
  Menu,
  X,
  Bell,
  ChevronDown,
  Search,
  Image,
  LayoutList,
  Heart,
  BookOpenCheck,
  Shield,
  ArrowUpRight,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "customers", label: "Customers", icon: Users },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "recipes", label: "Recipes", icon: BookOpen },
  { id: "testimonials", label: "Reviews", icon: Star },
  { id: "recipes-section", label: "Recipes Section", icon: BookOpen },
  { id: "instagram", label: "Instagram Feed", icon: Image },
  { id: "trust-strip", label: "Trust Strip", icon: Shield },
  { id: "footer", label: "Footer", icon: ArrowUpRight },
  { id: "brand-story", label: "Brand Story", icon: BookOpenCheck },
  { id: "featured", label: "Most Loved", icon: Heart },
  { id: "our-products", label: "Our Products", icon: LayoutList },
  { id: "hero", label: "Hero", icon: Image },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  activePage,
  onNavigate,
  children,
}: {
  activePage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f3ee] flex">
      {/* Sidebar — Desktop */}
      <aside className="hidden lg:flex lg:w-[220px] xl:w-[240px] flex-col fixed inset-y-0 left-0 bg-white border-r border-stone-200/80 z-40">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-stone-100">
          <img src="/brand/easymom-logo.png" alt="EasyMom" className="h-9" />
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                  active
                    ? "bg-[#891816]/8 text-[#891816]"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                <item.icon className={`h-[18px] w-[18px] ${active ? "text-[#891816]" : ""}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Promo Card */}
        <div className="p-3">
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#891816] to-[#5a0f0d] p-4">
            <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-white/10 blur-xl" />
            <div className="relative">
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1">Premium</p>
              <p className="text-sm font-bold text-white leading-snug">Taste.<br />Pure Authenticity.</p>
              <button className="mt-3 px-3 py-1.5 bg-white text-[#891816] text-[12px] font-semibold rounded-md hover:bg-white/90 transition-colors">
                Shop Now →
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar — Mobile Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[260px] bg-white shadow-xl">
            <div className="h-16 flex items-center justify-between px-5 border-b border-stone-100">
              <img src="/brand/easymom-logo.png" alt="EasyMom" className="h-8" />
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-stone-100">
                <X className="h-5 w-5 text-stone-500" />
              </button>
            </div>
            <nav className="py-3 px-3 space-y-0.5">
              {navItems.map((item) => {
                const active = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                      active
                        ? "bg-[#891816]/8 text-[#891816]"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    <item.icon className={`h-[18px] w-[18px] ${active ? "text-[#891816]" : ""}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-[220px] xl:ml-[240px] min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-stone-200/60 flex items-center px-4 lg:px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-stone-100"
          >
            <Menu className="h-5 w-5 text-stone-600" />
          </button>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-stone-50 border border-stone-200/60 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2.5 rounded-xl hover:bg-stone-100 transition-colors">
              <Bell className="h-5 w-5 text-stone-500" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-[#891816] rounded-full" />
            </button>
            <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-stone-100 transition-colors">
              <div className="flex flex-col items-center">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#891816] to-[#6d1311] flex items-center justify-center">
                  <span className="text-sm font-bold text-white">A</span>
                </div>
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-[11px] text-stone-500">Welcome,</p>
                <p className="text-[13px] font-semibold text-stone-800">Admin</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-stone-400 hidden sm:block" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
