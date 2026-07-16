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
  isFree?: boolean;
  freeItemName?: string;
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
          let newLines = existing
            ? s.lines.map((l) =>
                l.productId === p.id ? { ...l, qty: Math.min(99, l.qty + qty) } : l
              )
            : [
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
              ];

          // Auto-add free item if product has one
          if (p.freeItemName && p.freeItemImage) {
            const freeId = `${p.id}-free`;
            const existingFree = newLines.find((l) => l.productId === freeId);
            if (!existingFree) {
              newLines = [
                ...newLines,
                {
                  productId: freeId,
                  name: `${p.freeItemName}`,
                  slug: p.slug,
                  price: 0,
                  weight: "Free",
                  img: p.freeItemImage,
                  hue: p.hue,
                  qty,
                  isFree: true,
                  freeItemName: p.freeItemName,
                },
              ];
            }
          }

          return { lines: newLines };
        }),
      remove: (productId) =>
        set((s) => ({
          lines: s.lines.filter((l) => l.productId !== productId && l.productId !== `${productId}-free`),
        })),
      setQty: (productId, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.productId !== productId && l.productId !== `${productId}-free`)
              : s.lines.map((l) => {
                  if (l.productId === productId) return { ...l, qty: Math.min(99, qty) };
                  if (l.productId === `${productId}-free`) return { ...l, qty: Math.min(99, qty) };
                  return l;
                }),
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
  return lines.reduce((n, l) => l.isFree ? n : n + l.qty, 0);
}
export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.qty * l.price, 0);
}
