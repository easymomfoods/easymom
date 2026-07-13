"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";
import { useUI } from "@/lib/ui-store";

/**
 * Self-contained "Added to cart" notification.
 * Driven by the UI store (cartToast state) — no external toast lib.
 * Renders bottom-right with a branded check badge + View Cart action.
 */
export function CartToast() {
  const cartToast = useUI((s) => s.cartToast);
  const hideCartToast = useUI((s) => s.hideCartToast);
  const openCart = useUI((s) => s.openCart);

  useEffect(() => {
    if (!cartToast) return;
    const t = setTimeout(() => hideCartToast(), 3500);
    return () => clearTimeout(t);
  }, [cartToast, hideCartToast]);

  if (!cartToast) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex justify-end">
      <div className="pointer-events-auto relative flex w-[320px] animate-cart-in items-center gap-3 overflow-hidden rounded-2xl border border-stone-200/70 bg-white p-3.5 pr-4 shadow-[0_12px_40px_-12px_rgba(24,16,12,0.35)]">
        {/* Accent bar */}
        <span className="absolute left-0 top-0 h-full w-1 bg-[#891816]" />

        {/* Check badge */}
        <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#891816]">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#891816]/30" />
          <Check className="h-5 w-5 text-white" strokeWidth={3} />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold leading-tight text-stone-900">
            Added to cart
          </p>
          <p className="mt-0.5 truncate text-[12px] leading-snug text-stone-500">
            {cartToast.qty > 1 ? `${cartToast.qty} × ` : ""}
            {cartToast.name}
          </p>
        </div>

        {/* View cart */}
        <button
          onClick={() => {
            openCart();
            hideCartToast();
          }}
          className="shrink-0 rounded-lg bg-stone-50 px-3 py-1.5 text-[12px] font-semibold text-[#891816] transition hover:bg-[#891816]/10"
        >
          View Cart
        </button>
      </div>
    </div>
  );
}

export function showAddedToCart(name: string, qty = 1) {
  useUI.getState().showCartToast(name, qty);
}
