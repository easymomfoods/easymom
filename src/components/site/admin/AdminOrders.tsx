"use client";

import { useEffect, useState } from "react";

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

export default function AdminOrders({ onBack }: { onBack: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
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
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, status: string) {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch {
      // ignore
    }
  }

  async function updatePaymentStatus(orderId: string, paymentStatus: string) {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, paymentStatus } : null));
        }
      }
    } catch {
      // ignore
    }
  }

  function inr(amount: number) {
    return "₹" + amount.toLocaleString("en-IN");
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

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const statusColors: Record<string, string> = {
    confirmed: "bg-blue-100 text-blue-700",
    packed: "bg-amber-100 text-amber-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-stone-200 rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-stone-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Orders</h1>
          <p className="text-sm text-stone-500">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", "confirmed", "packed", "shipped", "delivered", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-colors ${
              filter === s
                ? "bg-[#891816] text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
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

      {/* Orders List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-stone-500">No orders found</div>
        ) : (
          filtered.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white border border-stone-200 rounded-2xl p-4 hover:border-[#891816] hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-mono font-bold text-[#891816]">{order.orderId}</p>
                    <p className="text-sm text-stone-500">{order.name} · {order.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[order.status] || "bg-stone-100"}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-stone-900">{inr(order.total)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-stone-500">
                <span>{order.items.length} item(s)</span>
                <span>·</span>
                <span>{order.paymentMethod === "upi_qr" ? "UPI" : "COD"}</span>
                <span>·</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-stone-900">{selectedOrder.orderId}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-stone-600">
                ✕
              </button>
            </div>

            {/* Customer Info */}
            <div className="bg-stone-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-stone-700 mb-2">Customer</p>
              <p className="text-sm">{selectedOrder.name}</p>
              <p className="text-sm text-stone-500">{selectedOrder.phone}</p>
              <p className="text-sm text-stone-500">{selectedOrder.email}</p>
              <p className="text-sm text-stone-500 mt-1">
                {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
              </p>
              {selectedOrder.notes && (
                <p className="text-sm text-stone-500 mt-2 italic">Note: {selectedOrder.notes}</p>
              )}
            </div>

            {/* Items */}
            <div className="mb-4">
              <p className="text-sm font-medium text-stone-700 mb-2">Items</p>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
                  <div className="w-10 h-10 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.img && <img src={item.img} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-stone-500">{item.weight} × {item.qty}</p>
                  </div>
                  <p className="text-sm font-medium">{inr(item.price * item.qty)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="bg-stone-50 rounded-xl p-4 mb-4 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-stone-500">Subtotal</span><span>{inr(selectedOrder.subtotal)}</span></div>
              {selectedOrder.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{inr(selectedOrder.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-stone-500">Shipping</span><span>{selectedOrder.shipping > 0 ? inr(selectedOrder.shipping) : "Free"}</span></div>
              <div className="flex justify-between font-bold text-base pt-1 border-t border-stone-200"><span>Total</span><span>{inr(selectedOrder.total)}</span></div>
            </div>

            {/* Payment */}
            <div className="mb-4">
              <p className="text-sm font-medium text-stone-700 mb-2">Payment</p>
              <div className="flex items-center gap-3">
                <span className="text-sm">{selectedOrder.paymentMethod === "upi_qr" ? "UPI QR" : "Cash on Delivery"}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${selectedOrder.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {selectedOrder.paymentStatus}
                </span>
              </div>
              {selectedOrder.paymentStatus === "pending" && (
                <button
                  onClick={() => updatePaymentStatus(selectedOrder.id, "paid")}
                  className="mt-2 px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark as Paid
                </button>
              )}
            </div>

            {/* Status Update */}
            <div>
              <p className="text-sm font-medium text-stone-700 mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {["confirmed", "packed", "shipped", "delivered", "cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateOrderStatus(selectedOrder.id, s)}
                    disabled={selectedOrder.status === s}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      selectedOrder.status === s
                        ? "bg-[#891816] text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
