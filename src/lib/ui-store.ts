"use client";

import { create } from "zustand";
import type { Product, Category, SpiceLevel } from "@/lib/data";

export type View =
  | { name: "home" }
  | { name: "shop"; categoryId?: string }
  | { name: "product"; slug: string }
  | { name: "recipes" }
  | { name: "about" }
  | { name: "faq" }
  | { name: "admin" }
  | { name: "admin-login" }
  | { name: "admin-orders" }
  | { name: "admin-products" }
  | { name: "admin-analytics" }
  | { name: "admin-hero" }
  | { name: "admin-our-products" }
  | { name: "admin-featured" }
  | { name: "admin-brand-story" }
  | { name: "admin-recipes-section" }
  | { name: "admin-recipes" }
  | { name: "admin-testimonials" }
  | { name: "admin-instagram" }
  | { name: "admin-trust-strip" }
  | { name: "admin-footer" }
  | { name: "admin-about" }
  | { name: "admin-categories" }
  | { name: "admin-faqs" }
  | { name: "admin-reviews" }
  | { name: "admin-brand-strip" }
  | { name: "admin-profile" }
  | { name: "admin-settings" }
  | { name: "admin-coupons" }
  | { name: "admin-store-locations" }
  | { name: "terms" }
  | { name: "privacy" }
  | { name: "admin-terms" }
  | { name: "admin-privacy" }
  | { name: "admin-product-labels" }
  | { name: "track-order"; orderId?: string };

function viewToPath(v: View): string {
  switch (v.name) {
    case "home":
      return "/";
    case "shop":
      return v.categoryId ? `/shop/${v.categoryId}` : "/shop";
    case "product":
      return `/product/${v.slug}`;
    case "recipes":
      return "/recipes";
    case "about":
      return "/about";
    case "faq":
      return "/faq";
    case "admin":
      return "/admin";
    case "admin-login":
      return "/admin/login";
    case "admin-orders":
      return "/admin/orders";
    case "admin-products":
      return "/admin/products";
    case "admin-analytics":
      return "/admin/analytics";
    case "admin-hero":
      return "/admin/hero";
    case "admin-our-products":
      return "/admin/our-products";
    case "admin-featured":
      return "/admin/featured";
    case "admin-brand-story":
      return "/admin/brand-story";
    case "admin-recipes-section":
      return "/admin/recipes-section";
    case "admin-recipes":
      return "/admin/recipes";
    case "admin-testimonials":
      return "/admin/testimonials";
    case "admin-instagram":
      return "/admin/instagram";
    case "admin-trust-strip":
      return "/admin/trust-strip";
    case "admin-footer":
      return "/admin/footer";
    case "admin-about":
      return "/admin/about";
    case "admin-categories":
      return "/admin/categories";
    case "admin-faqs":
      return "/admin/faqs";
    case "admin-reviews":
      return "/admin/reviews";
    case "admin-brand-strip":
      return "/admin/brand-strip";
    case "admin-profile":
      return "/admin/profile";
    case "admin-settings":
      return "/admin/settings";
    case "admin-coupons":
      return "/admin/coupons";
    case "admin-store-locations":
      return "/admin/store-locations";
    case "terms":
      return "/terms";
    case "privacy":
      return "/privacy";
    case "admin-terms":
      return "/admin/terms";
    case "admin-privacy":
      return "/admin/privacy";
    case "admin-product-labels":
      return "/admin/product-labels";
    case "track-order":
      return v.orderId ? `/track-order/${v.orderId}` : "/track-order";
    default:
      return "/";
  }
}

function pathToView(pathname: string): View {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return { name: "home" };
  if (parts[0] === "shop") {
    if (parts[1]) return { name: "shop", categoryId: parts[1] };
    return { name: "shop" };
  }
  if (parts[0] === "product" && parts[1]) return { name: "product", slug: parts[1] };
  if (parts[0] === "recipes") return { name: "recipes" };
  if (parts[0] === "about") return { name: "about" };
  if (parts[0] === "faq") return { name: "faq" };
  if (parts[0] === "admin") {
    if (parts[1] === "login") return { name: "admin-login" };
    if (parts[1] === "orders") return { name: "admin-orders" };
    if (parts[1] === "products") return { name: "admin-products" };
    if (parts[1] === "analytics") return { name: "admin-analytics" };
    if (parts[1] === "hero") return { name: "admin-hero" };
    if (parts[1] === "our-products") return { name: "admin-our-products" };
    if (parts[1] === "featured") return { name: "admin-featured" };
    if (parts[1] === "brand-story") return { name: "admin-brand-story" };
    if (parts[1] === "recipes-section") return { name: "admin-recipes-section" };
    if (parts[1] === "recipes") return { name: "admin-recipes" };
    if (parts[1] === "testimonials") return { name: "admin-testimonials" };
    if (parts[1] === "instagram") return { name: "admin-instagram" };
    if (parts[1] === "trust-strip") return { name: "admin-trust-strip" };
    if (parts[1] === "footer") return { name: "admin-footer" };
    if (parts[1] === "about") return { name: "admin-about" };
    if (parts[1] === "categories") return { name: "admin-categories" };
    if (parts[1] === "faqs") return { name: "admin-faqs" };
    if (parts[1] === "reviews") return { name: "admin-reviews" };
    if (parts[1] === "brand-strip") return { name: "admin-brand-strip" };
    if (parts[1] === "profile") return { name: "admin-profile" };
    if (parts[1] === "settings") return { name: "admin-settings" };
    if (parts[1] === "coupons") return { name: "admin-coupons" };
    if (parts[1] === "store-locations") return { name: "admin-store-locations" };
    if (parts[1] === "terms") return { name: "admin-terms" };
    if (parts[1] === "privacy") return { name: "admin-privacy" };
    if (parts[1] === "product-labels") return { name: "admin-product-labels" };
    return { name: "admin" };
  }
  if (parts[0] === "track-order") {
    if (parts[1]) return { name: "track-order", orderId: parts[1] };
    return { name: "track-order" };
  }
  return { name: "home" };
}

type UIState = {
  view: View;
  cartOpen: boolean;
  searchOpen: boolean;
  mobileNavOpen: boolean;
  quickView: Product | null;
  checkoutOpen: boolean;
  orderConfirmed: boolean;
  activeLevels: SpiceLevel[];
  maxPrice: number;
  sortBy: "featured" | "price-asc" | "price-desc" | "rating";
  wishlistOpen: boolean;
  cartToast: { name: string; qty: number } | null;
  go: (v: View) => void;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleMobileNav: () => void;
  setMobileNav: (v: boolean) => void;
  setQuickView: (p: Product | null) => void;
  setCheckout: (v: boolean) => void;
  setOrderConfirmed: (v: boolean) => void;
  toggleLevel: (l: SpiceLevel) => void;
  clearLevels: () => void;
  setMaxPrice: (n: number) => void;
  setSortBy: (s: UIState["sortBy"]) => void;
  setWishlistOpen: (v: boolean) => void;
  showCartToast: (name: string, qty?: number) => void;
  hideCartToast: () => void;
  syncFromURL: () => void;
};

export const useUI = create<UIState>((set, get) => ({
  view: { name: "home" } as View,
  cartOpen: false,
  searchOpen: false,
  mobileNavOpen: false,
  quickView: null,
  checkoutOpen: false,
  orderConfirmed: false,
  activeLevels: [],
  maxPrice: 200,
  sortBy: "featured",
  wishlistOpen: false,
  cartToast: null,
  go: (v) => {
    const path = viewToPath(v);
    const currentView = get().view;
    const currentPath = window.location.pathname;
    if (path !== currentPath) {
      window.history.pushState(v, "", path);
    }
    set({ view: v, mobileNavOpen: false, searchOpen: false });
    // Only force-scroll to top when crossing the admin/public boundary.
    // Within the admin dashboard, keep the current scroll position so
    // switching sections doesn't yank the page back to the top.
    const fromAdmin = currentView.name.startsWith("admin");
    const toAdmin = v.name.startsWith("admin");
    if (!(fromAdmin && toAdmin)) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    }
    return true;
  },
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen })),
  setMobileNav: (v) => set({ mobileNavOpen: v }),
  setQuickView: (p) => set({ quickView: p }),
  setCheckout: (v) => set({ checkoutOpen: v }),
  setOrderConfirmed: (v) => set({ orderConfirmed: v }),
  toggleLevel: (l) =>
    set((s) => ({
      activeLevels: s.activeLevels.includes(l)
        ? s.activeLevels.filter((x) => x !== l)
        : [...s.activeLevels, l],
    })),
  clearLevels: () => set({ activeLevels: [] }),
  setMaxPrice: (n) => set({ maxPrice: n }),
  setSortBy: (s) => set({ sortBy: s }),
  setWishlistOpen: (v) => set({ wishlistOpen: v }),
  showCartToast: (name, qty = 1) => set({ cartToast: { name, qty } }),
  hideCartToast: () => set({ cartToast: null }),
  syncFromURL: () => {
    const view = pathToView(window.location.pathname);
    set({ view });
  },
}));

if (typeof window !== "undefined") {
  window.addEventListener("popstate", (e) => {
    const view = e.state && e.state.name ? (e.state as View) : pathToView(window.location.pathname);
    useUI.setState({ view, mobileNavOpen: false, searchOpen: false });
    window.scrollTo({ top: 0, behavior: "instant" });
  });

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo({ top: 0, behavior: "instant" });
}
