"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  X,
  Package,
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  StickyNote,
} from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  weight: string;
  img: string;
  qty: number;
}

interface Order {
  id: string;
  orderId: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string | null;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode: string | null;
  paymentMethod: string;
  paymentRef: string | null;
  paymentStatus: string;
  status: string;
  items: OrderItem[];
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; dot: string; icon: React.ReactNode }> = {
  confirmed: { label: "Confirmed", color: "bg-blue-50 text-blue-700", dot: "bg-blue-500", icon: <Clock className="h-3.5 w-3.5" /> },
  packed: { label: "Packed", color: "bg-amber-50 text-amber-700", dot: "bg-amber-500", icon: <Package className="h-3.5 w-3.5" /> },
  shipped: { label: "Shipped", color: "bg-purple-50 text-purple-700", dot: "bg-purple-500", icon: <Truck className="h-3.5 w-3.5" /> },
  delivered: { label: "Delivered", color: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-700", dot: "bg-red-500", icon: <XCircle className="h-3.5 w-3.5" /> },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (res.ok) setOrders(data.orders);
    } catch (e) { console.error(e); } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, status: string) {
    if (!confirm(`Change order status to "${status}"?`)) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch (e) { console.error(e); }
  }

  async function updatePaymentStatus(orderId: string, paymentStatus: string) {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o)));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, paymentStatus } : null));
        }
      }
    } catch (e) { console.error(e); }
  }

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

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    const matchFilter = filter === "all" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "confirmed" || o.status === "packed").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-stone-200/60 rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-stone-100" />
          ))}
        </div>
        <div className="h-96 bg-white rounded-xl border border-stone-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Orders</h1>
        <p className="text-sm text-stone-500 mt-0.5">Track and manage customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={String(orders.length)} icon={<ShoppingCart className="h-5 w-5" />} iconBg="bg-[#891816]/8" iconColor="text-[#891816]" />
        <StatCard label="Pending" value={String(pendingOrders)} icon={<Clock className="h-5 w-5" />} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard label="Delivered" value={String(deliveredOrders)} icon={<CheckCircle2 className="h-5 w-5" />} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard label="Revenue (Paid)" value={inr(totalRevenue)} icon={<CreditCard className="h-5 w-5" />} iconBg="bg-purple-50" iconColor="text-purple-600" />
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, name, or phone..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-stone-200/60 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["all", "confirmed", "packed", "shipped", "delivered", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-2 text-[13px] font-medium rounded-lg whitespace-nowrap transition-colors ${
                filter === s
                  ? "bg-[#891816] text-white"
                  : "bg-white border border-stone-200/60 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== "all" && (
                <span className="ml-1 opacity-70">
                  ({orders.filter((o) => o.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-stone-500 uppercase tracking-wider">Order</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-stone-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-stone-500 uppercase tracking-wider">Items</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-stone-500 uppercase tracking-wider">Payment</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-stone-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-stone-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-stone-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[13px] text-stone-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const st = statusConfig[order.status] || statusConfig.confirmed;
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-stone-50/50 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3.5">
                        <span className="text-[14px] font-mono font-semibold text-[#891816]">{order.orderId}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center shrink-0">
                            <span className="text-[11px] font-bold text-stone-600">{order.name.charAt(0)}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium text-stone-900 truncate">{order.name}</p>
                            <p className="text-[12px] text-stone-400">{order.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[13px] text-stone-600">{order.items.length} item(s)</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-stone-500">{order.paymentMethod === "upi_qr" ? "UPI" : "COD"}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full ${
                            order.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            <span className={`h-1 w-1 rounded-full ${order.paymentStatus === "paid" ? "bg-emerald-500" : "bg-amber-500"}`} />
                            {order.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded-full ${st.color}`}>
                          {st.icon}
                          {st.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[14px] font-semibold text-stone-900">{inr(order.total)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] text-stone-500">{timeAgo(order.createdAt)}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/30">
            <p className="text-[12px] text-stone-500">
              Showing {filtered.length} of {orders.length} orders
            </p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-stone-900 font-mono">{selectedOrder.orderId}</h2>
                  {(() => {
                    const st = statusConfig[selectedOrder.status] || statusConfig.confirmed;
                    return (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-medium rounded-full ${st.color}`}>
                        {st.icon}
                        {st.label}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-[13px] text-stone-500 mt-0.5">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Customer Info */}
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-3">Customer Details</p>
                <div className="space-y-2">
                  <InfoRow icon={<User className="h-4 w-4" />} label={selectedOrder.name} />
                  <InfoRow icon={<Phone className="h-4 w-4" />} label={selectedOrder.phone} />
                  <InfoRow icon={<Mail className="h-4 w-4" />} label={selectedOrder.email} />
                  <InfoRow icon={<MapPin className="h-4 w-4" />} label={`${selectedOrder.address}, ${selectedOrder.city}, ${selectedOrder.state} - ${selectedOrder.pincode}`} />
                  {selectedOrder.notes && (
                    <InfoRow icon={<StickyNote className="h-4 w-4" />} label={selectedOrder.notes} muted />
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-3">Order Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 bg-stone-50 rounded-lg">
                      <div className="h-11 w-11 rounded-lg bg-white border border-stone-200/50 overflow-hidden shrink-0">
                        {item.img ? (
                          <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-stone-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-stone-900 truncate">{item.name}</p>
                        <p className="text-[12px] text-stone-500">{item.weight} × {item.qty}</p>
                      </div>
                      <p className="text-[13px] font-semibold text-stone-900">{inr(item.price * item.qty)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-stone-50 rounded-xl p-4 space-y-2 text-[13px]">
                <div className="flex justify-between"><span className="text-stone-500">Subtotal</span><span className="text-stone-700">{inr(selectedOrder.subtotal)}</span></div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{inr(selectedOrder.discount)}</span></div>
                )}
                <div className="flex justify-between"><span className="text-stone-500">Shipping</span><span className="text-stone-700">{selectedOrder.shipping > 0 ? inr(selectedOrder.shipping) : "Free"}</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-stone-200">
                  <span className="text-stone-900">Total</span>
                  <span className="text-stone-900">{inr(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Payment */}
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-stone-400" />
                  <span className="text-[13px] text-stone-700">{selectedOrder.paymentMethod === "upi_qr" ? "UPI QR" : "Cash on Delivery"}</span>
                </div>
                {selectedOrder.paymentStatus === "pending" ? (
                  <button
                    onClick={() => updatePaymentStatus(selectedOrder.id, "paid")}
                    className="px-3 py-1.5 text-[12px] font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Mark as Paid
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-medium rounded-full bg-emerald-50 text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Paid
                  </span>
                )}
              </div>

              {/* Status Update */}
              <div>
                <p className="text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(["confirmed", "packed", "shipped", "delivered", "cancelled"] as const).map((s) => {
                    const cfg = statusConfig[s];
                    const isActive = selectedOrder.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => updateOrderStatus(selectedOrder.id, s)}
                        disabled={isActive}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded-lg transition-all ${
                          isActive
                            ? "bg-[#891816] text-white shadow-sm"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-100 p-4 hover:border-stone-200 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-[13px] text-stone-500">{label}</p>
          <p className="text-xl font-bold text-stone-900 tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, muted }: { icon: React.ReactNode; label: string; muted?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-stone-400 mt-0.5 shrink-0">{icon}</span>
      <span className={`text-[13px] leading-relaxed ${muted ? "text-stone-500 italic" : "text-stone-700"}`}>{label}</span>
    </div>
  );
}
