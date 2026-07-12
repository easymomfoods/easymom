"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  LogOut,
  User,
  CreditCard,
  Globe,
  Lock,
} from "lucide-react";

type Notification = {
  orderId: string;
  name: string;
  email: string;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
};

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: LayoutList },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "recipes", label: "Recipes", icon: BookOpen },
  { id: "testimonials", label: "Testimonials", icon: Megaphone },
  { id: "faqs", label: "FAQs", icon: BookOpen },
  { divider: true, label: "Content" },
  { id: "hero", label: "Hero", icon: Image },
  { id: "our-products", label: "Our Products", icon: LayoutList },
  { id: "featured", label: "Most Loved", icon: Heart },
  { id: "recipes-section", label: "Recipes Section", icon: BookOpen },
  { id: "brand-story", label: "Brand Story", icon: BookOpenCheck },
  { id: "instagram", label: "Instagram Feed", icon: Image },
  { id: "trust-strip", label: "Trust Strip", icon: Shield },
  { id: "footer", label: "Footer", icon: ArrowUpRight },
  { id: "about", label: "Our Story", icon: BookOpenCheck },
  { id: "brand-strip", label: "Marquee", icon: Image },
  { divider: true, label: "System" },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "profile", label: "Profile & Payments", icon: CreditCard },
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
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastCheckedRef = useRef<string>(new Date().toISOString());
  const prevCountRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playBeep = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio("data:audio/wav;base64,UklGRl9vT19teleVBmb3JtYXQgd2lkdGg9IjgiIGhlaWdodD0iOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48c3R5bGU+PC9zdHlsZT48cGF0aCBmaWxsPSIjODkxODE2IiBkPSJNNCA0SDRWMGg0djR6bTAgNEgwdjRoNHY0ek04IDhINFY0aDR2NHoiLz48L3N2Zz4=");
        audioRef.current.volume = 0.5;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch {}
  }, []);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/admin/notifications?since=${encodeURIComponent(lastCheckedRef.current)}`);
        if (!res.ok) return;
        const data = await res.json();
        const newOrders: Notification[] = data.orders || [];
        if (prevCountRef.current > 0 && newOrders.length > prevCountRef.current) {
          playBeep();
        }
        prevCountRef.current = newOrders.length;
        setNotifications(newOrders);
        setUnreadCount(newOrders.length);
      } catch {}
    };

    poll();
    const interval = setInterval(poll, 10000);
    return () => clearInterval(interval);
  }, [playBeep]);

  function markAllRead() {
    lastCheckedRef.current = new Date().toISOString();
    setUnreadCount(0);
    setNotifOpen(false);
  }

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
          {navItems.map((item, i) => {
            if ("divider" in item && item.divider) {
              return (
                <div key={`div-${i}`} className="pt-4 pb-1.5 px-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{item.label}</p>
                </div>
              );
            }
            const navItem = item as { id: string; label: string; icon: any };
            const active = activePage === navItem.id;
            return (
              <button
                key={navItem.id}
                onClick={() => onNavigate(navItem.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                  active
                    ? "bg-[#891816]/8 text-[#891816]"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                <navItem.icon className={`h-[18px] w-[18px] ${active ? "text-[#891816]" : ""}`} />
                {navItem.label}
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
              {navItems.map((item, i) => {
                if ("divider" in item && item.divider) {
                  return (
                    <div key={`div-${i}`} className="pt-4 pb-1.5 px-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{item.label}</p>
                    </div>
                  );
                }
                const navItem = item as { id: string; label: string; icon: any };
                const active = activePage === navItem.id;
                return (
                  <button
                    key={navItem.id}
                    onClick={() => { onNavigate(navItem.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                      active
                        ? "bg-[#891816]/8 text-[#891816]"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    <navItem.icon className={`h-[18px] w-[18px] ${active ? "text-[#891816]" : ""}`} />
                    {navItem.label}
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
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative p-2.5 rounded-xl hover:bg-stone-100 transition-colors"
              >
                <Bell className="h-5 w-5 text-stone-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-h-[18px] min-w-[18px] flex items-center justify-center rounded-full bg-[#891816] text-white text-[10px] font-bold px-1">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-stone-200 shadow-xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
                      <h3 className="text-[14px] font-semibold text-stone-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-[12px] text-[#891816] font-medium hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-[13px] text-stone-400">
                          No new orders
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.orderId}
                            className="px-4 py-3 border-b border-stone-50 hover:bg-stone-50/50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-[13px] font-medium text-stone-900 truncate">
                                  New order from {n.name}
                                </p>
                                <p className="text-[12px] text-stone-500 mt-0.5">
                                  ₹{n.total.toLocaleString("en-IN")} · {n.paymentMethod === "cod" ? "COD" : "UPI"}
                                </p>
                              </div>
                              <span className="shrink-0 text-[11px] text-stone-400">
                                {new Date(n.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-stone-100 transition-colors"
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#891816] to-[#6d1311] flex items-center justify-center">
                  <span className="text-sm font-bold text-white">A</span>
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-[11px] text-stone-500">Welcome,</p>
                  <p className="text-[13px] font-semibold text-stone-800">Admin</p>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-stone-400 hidden sm:block transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-stone-200 shadow-lg z-50 py-1.5">
                    <button
                      onClick={() => { setProfileOpen(false); onNavigate("profile"); }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#891816] to-[#6d1311] flex items-center justify-center">
                        <span className="text-xs font-bold text-white">A</span>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Admin</p>
                        <p className="text-[11px] text-stone-400">Profile & Payments</p>
                      </div>
                    </button>
                    <div className="mx-3 my-1 border-t border-stone-100" />
                    <button
                      onClick={() => { setProfileOpen(false); onNavigate("settings"); }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-stone-400" />
                      Settings
                    </button>
                    <div className="mx-3 my-1 border-t border-stone-100" />
                    <button
                      onClick={() => { setProfileOpen(false); setConfirmLogout(true); }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 xl:p-8">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {confirmLogout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmLogout(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <LogOut className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-[16px] font-bold text-stone-900">Log out?</h3>
            </div>
            <p className="text-[13px] text-stone-600 leading-relaxed">
              Are you sure you want to log out of the admin dashboard?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 h-10 rounded-xl border border-stone-200 text-[13px] font-medium text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setConfirmLogout(false);
                  await fetch("/api/admin/logout", { method: "POST" });
                  window.location.href = "/admin/login";
                }}
                className="flex-1 h-10 rounded-xl bg-red-600 text-white text-[13px] font-semibold hover:bg-red-700 active:scale-[0.98] transition-all"
              >
                Yes, Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
