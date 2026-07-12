"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Search, Clock, Truck, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { useUI } from "@/lib/ui-store";
import { inr } from "@/lib/format";

type OrderData = {
  orderId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  itemsJson: string;
  createdAt: string;
  updatedAt: string;
};

const STATUS_STEPS = [
  { key: "confirmed", label: "Order Confirmed", icon: CheckCircle },
  { key: "packed", label: "Packed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const STATUS_ORDER: Record<string, number> = {
  confirmed: 0,
  packed: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

export default function TrackOrder() {
  const { go, view } = useUI();
  const initialOrderId = view.name === "track-order" ? view.orderId || "" : "";
  const [orderId, setOrderId] = useState(initialOrderId);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialOrderId) {
      setOrderId(initialOrderId);
      fetchOrder(initialOrderId);
    }
  }, [initialOrderId]);

  async function fetchOrder(id: string) {
    if (!id.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || "Order not found");
      }
    } catch {
      setError("Failed to fetch order");
    }
    setLoading(false);
  }

  const currentStep = order ? STATUS_ORDER[order.status] ?? 0 : 0;
  const items = order ? JSON.parse(order.itemsJson || "[]") : [];

  return (
    <div className="mx-auto max-w-[640px] px-4 pb-20 pt-24 sm:px-6 lg:pt-28">
      <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <button onClick={() => go({ name: "home" })} className="hover:text-foreground">Home</button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Track Order</span>
      </nav>

      <h1 className="text-[28px] font-semibold tracking-tight text-foreground">Track Your Order</h1>
      <p className="mt-1 text-[14px] text-muted-foreground">Enter your order ID to check the status.</p>

      {/* Search */}
      <form
        onSubmit={(e) => { e.preventDefault(); fetchOrder(orderId); }}
        className="mt-6 flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID (e.g. EM-XXXXX)"
            className="h-11 w-full rounded-[4px] border border-border bg-card pl-10 pr-4 text-[14px] text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !orderId.trim()}
          className="h-11 rounded-[4px] bg-primary px-6 text-[14px] font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Track"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-[4px] border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">
          {error}
        </div>
      )}

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          {/* Status timeline */}
          {order.status === "cancelled" ? (
            <div className="flex items-center gap-3 rounded-[6px] border border-red-200 bg-red-50 p-4">
              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
              <div>
                <p className="text-[14px] font-semibold text-red-700">Order Cancelled</p>
                <p className="text-[12px] text-red-500">This order has been cancelled.</p>
              </div>
            </div>
          ) : (
            <div className="rounded-[6px] border border-border bg-card p-5">
              <p className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Order Status</p>
              <div className="flex items-start justify-between">
                {STATUS_STEPS.map((step, i) => {
                  const active = i <= currentStep;
                  const current = i === currentStep;
                  return (
                    <div key={step.key} className="flex flex-1 flex-col items-center text-center">
                      <div className={`relative flex items-center ${i < STATUS_STEPS.length - 1 ? "w-full" : ""}`}>
                        <div className={`mx-auto h-9 w-9 rounded-full flex items-center justify-center transition-all ${
                          active ? "bg-primary text-primary-foreground" : "bg-stone-100 text-stone-400"
                        } ${current ? "ring-2 ring-primary/30 ring-offset-2" : ""}`}>
                          <step.icon className="h-4 w-4" />
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`absolute left-[calc(50%+18px)] top-1/2 h-0.5 flex-1 -translate-y-1/2 ${
                            i < currentStep ? "bg-primary" : "bg-stone-200"
                          }`} />
                        )}
                      </div>
                      <p className={`mt-2 text-[11px] font-medium ${active ? "text-foreground" : "text-stone-400"}`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order details */}
          <div className="mt-4 rounded-[6px] border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-semibold text-foreground">Order {order.orderId}</p>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                order.paymentStatus === "paid" ? "bg-leaf/15 text-leaf" : "bg-amber-100 text-amber-700"
              }`}>
                {order.paymentStatus === "paid" ? "Paid" : "Pending"}
              </span>
            </div>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>

            {/* Items */}
            <div className="mt-4 divide-y divide-border border-t border-border">
              {items.map((item: { name: string; qty: number; price: number; weight: string }, i: number) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">{item.weight} × {item.qty}</p>
                  </div>
                  <span className="text-[13px] font-medium text-foreground">{inr(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-3 border-t border-border pt-3 space-y-1 text-[13px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{inr(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="text-leaf">− {inr(order.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-leaf">Free</span></div>
              <div className="flex justify-between pt-1 border-t border-border"><span className="font-semibold">Total</span><span className="font-semibold">{inr(order.total)}</span></div>
            </div>

            {/* Delivery */}
            <div className="mt-4 border-t border-border pt-4 text-[13px]">
              <p className="font-medium text-foreground">Delivery Address</p>
              <p className="mt-1 text-muted-foreground">{order.name}<br />{order.address}<br />{order.city}, {order.state} - {order.pincode}</p>
              <p className="mt-1 text-muted-foreground">{order.phone}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
