"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/lib/data";

export type CartLine = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  weight: string;
  img: string;
  hue: number;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  wishlist: string[]; // product ids
  coupon: { code: string; discountPct: number } | null;
  add: (p: Product, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  toggleWishlist: (productId: string) => void;
  applyCoupon: (code: string) => boolean | Promise<boolean>;
  removeCoupon: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      wishlist: [],
      coupon: null,
      add: (p, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.productId === p.id);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.productId === p.id ? { ...l, qty: l.qty + qty } : l
              ),
            };
          }
          return {
            lines: [
              ...s.lines,
              {
                productId: p.id,
                name: p.name,
                slug: p.slug,
                price: p.price,
                weight: p.weight,
                img: p.img || "",
                hue: p.hue,
                qty,
              },
            ],
          };
        }),
      remove: (productId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId) })),
      setQty: (productId, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.productId !== productId)
              : s.lines.map((l) =>
                  l.productId === productId ? { ...l, qty } : l
                ),
        })),
      clear: () => set({ lines: [], coupon: null }),
      toggleWishlist: (productId) =>
        set((s) => ({
          wishlist: s.wishlist.includes(productId)
            ? s.wishlist.filter((id) => id !== productId)
            : [...s.wishlist, productId],
        })),
      applyCoupon: async (code) => {
        const upper = code.trim().toUpperCase();
        try {
          const res = await fetch("/api/coupons/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: upper }),
          });
          const data = await res.json();
          if (data.valid) {
            set({ coupon: { code: upper, discountPct: data.discountPct } });
            return true;
          }
        } catch (e) { console.error(e); }
        return false;
      },
      removeCoupon: () => set({ coupon: null }),
    }),
    {
      name: "easymom-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines, wishlist: s.wishlist, coupon: s.coupon }),
    }
  )
);

export function cartCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.qty, 0);
}
export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.qty * l.price, 0);
}
