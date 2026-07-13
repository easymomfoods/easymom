"use client";

import { Check } from "lucide-react";
import { toast } from "sonner";
import { useUI } from "@/lib/ui-store";

/**
 * Custom "Added to cart" notification.
 * Replaces the default sonner success toast with a fully branded design.
 */
export function showAddedToCart(name: string, qty = 1) {
  const { openCart } = useUI.getState();

  toast.custom(
    (t) => (
      <div
        style={{
          animation: t.visible
            ? "cartToastIn 0.35s cubic-bezier(0.16,1,0.3,1)"
            : "cartToastOut 0.25s ease forwards",
        }}
        className="pointer-events-auto flex w-[320px] items-center gap-3 overflow-hidden rounded-2xl border border-stone-200/70 bg-white p-3.5 pr-4 shadow-[0_12px_40px_-12px_rgba(24,16,12,0.35)]"
      >
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
            {qty > 1 ? `${qty} × ` : ""}
            {name}
          </p>
        </div>

        {/* View cart */}
        <button
          onClick={() => {
            openCart();
            toast.dismiss(t.id);
          }}
          className="shrink-0 rounded-lg bg-stone-50 px-3 py-1.5 text-[12px] font-semibold text-[#891816] transition hover:bg-[#891816]/10"
        >
          View Cart
        </button>
      </div>
    ),
    { duration: 3500 }
  );
}
