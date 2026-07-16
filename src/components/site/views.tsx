"use client";

import { useMemo, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  X,
  Star,
  Plus,
  Minus,
  Heart,
  ShoppingBag,
  Clock,
  Users,
  MapPin,
  ShieldCheck,
  Check,
  ChevronRight,
  Flame,
  Truck,
  RotateCcw,
  Quote,
} from "lucide-react";
import { useUI } from "@/lib/ui-store";
import { useCart } from "@/lib/store";
import {
  products,
  categories,
  recipes,
  testimonials,
  getProductBySlug,
  getCategoryById,
  brandStats,
  type SpiceLevel,
  type Product,
} from "@/lib/data";
import { ProductCard } from "./product-card";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { showAddedToCart } from "@/components/site/cart-toast";
import { useProductLabels } from "@/components/site/product-labels";

type ProductData = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  mrp: number;
  weight: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  bestSeller?: boolean;
  isNew?: boolean;
  img?: string;
  images?: string[];
  shortDesc: string;
  description: string;
  ingredients: string[];
  origin: string;
  shelfLife: string;
  spiceLevel: SpiceLevel;
  cookingTime: string;
  servings: string;
  tags: string[];
  hue: number;
  active?: boolean;
  createdAt?: string;
};

const LEVELS: SpiceLevel[] = ["Medium", "Hot"];

const DEFAULT_PRODUCTS = products;
const DEFAULT_CATEGORIES = categories;

export function ShopView() {
  const { view, go, activeLevels, toggleLevel, clearLevels, maxPrice, setMaxPrice, sortBy, setSortBy } = useUI();
  const categoryId = view.name === "shop" ? view.categoryId : undefined;
  const [showFilters, setShowFilters] = useState(false);
  const [shopProducts, setShopProducts] = useState<ProductData[]>([]);
  const [shopCategories, setShopCategories] = useState(DEFAULT_CATEGORIES);
  const [shopLoaded, setShopLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        if (d.products && d.products.length > 0) {
          setShopProducts(d.products);
          // compute categories from products
          const catMap = new Map<string, { id: string; name: string; count: number }>();
          for (const p of d.products) {
            const existing = catMap.get(p.categoryId);
            if (existing) {
              existing.count++;
            } else {
              catMap.set(p.categoryId, { id: p.categoryId, name: p.categoryId.replace(/-/g, " "), count: 1 });
            }
          }
          const computed = Array.from(catMap.values()).map((c) => ({
            ...c,
            name: c.name.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
            tagline: "",
            description: "",
            accent: "zinc",
            hue: 0,
          }));
          setShopCategories(computed);
        }
        setShopLoaded(true);
      })
      .catch((e) => { console.error(e); setShopLoaded(true); });
  }, []);

  const category = categoryId ? shopCategories.find((c) => c.id === categoryId) : undefined;

  const filtered = useMemo(() => {
    let list = shopProducts.slice();
    if (categoryId) list = list.filter((p) => p.categoryId === categoryId);
    if (activeLevels.length) list = list.filter((p) => activeLevels.includes(p.spiceLevel));
    list = list.filter((p) => p.price <= maxPrice);
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => {
          if (a.active !== b.active) return a.active ? -1 : 1;
          return a.price - b.price;
        });
        break;
      case "price-desc":
        list.sort((a, b) => {
          if (a.active !== b.active) return a.active ? -1 : 1;
          return b.price - a.price;
        });
        break;
      case "rating":
        list.sort((a, b) => {
          if (a.active !== b.active) return a.active ? -1 : 1;
          return b.rating - a.rating;
        });
        break;
      default:
        list.sort((a, b) => {
          if (a.active !== b.active) return a.active ? -1 : 1;
          const bs = Number(b.bestSeller) - Number(a.bestSeller);
          if (bs !== 0) return bs;
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
        });
    }
    return list;
  }, [shopProducts, categoryId, activeLevels, maxPrice, sortBy]);

  const Filters = (
    <div className="space-y-6">
      <div>
        <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-foreground">Categories</p>
        <div className="space-y-1">
          <button
            onClick={() => go({ name: "shop" })}
            className={cn(
              "flex w-full items-center justify-between rounded-[4px] px-3 py-2 text-[13.5px] transition",
              !categoryId ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:bg-secondary/60"
            )}
          >
            All blends <span className="text-[11px]">{shopProducts.length}</span>
          </button>
          {shopCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => go({ name: "shop", categoryId: c.id })}
              className={cn(
                "flex w-full items-center justify-between rounded-[4px] px-3 py-2 text-[13.5px] transition",
                categoryId === c.id ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:bg-secondary/60"
              )}
            >
              {c.name} <span className="text-[11px]">{c.count}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-foreground">Spice level</p>
        <div className="flex flex-wrap gap-1.5">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => toggleLevel(l)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12px] font-medium transition",
                activeLevels.includes(l)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground/70 hover:border-foreground/30"
              )}
            >
              {l}
            </button>
          ))}
          {activeLevels.length > 0 && (
            <button onClick={clearLevels} className="text-[12px] text-muted-foreground underline-offset-2 hover:underline">
              Clear
            </button>
          )}
        </div>
      </div>
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-foreground">Max price</p>
          <span className="text-[12px] font-medium text-foreground">{inr(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={100}
          max={200}
          step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
      {/* breadcrumb + header */}
      <div className="mb-6">
        <nav className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <button onClick={() => go({ name: "home" })} className="hover:text-foreground">Home</button>
          <ChevronRight className="h-3 w-3" />
          <button onClick={() => go({ name: "shop" })} className="hover:text-foreground">Shop</button>
          {category && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{category.name}</span>
            </>
          )}
        </nav>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[34px] font-semibold leading-tight tracking-tight text-foreground sm:text-[44px]">
              {category ? category.name : "The full collection"}
            </h1>
            <p className="mt-2 max-w-xl text-[15px] text-muted-foreground">
              {category ? category.description : "Every blend, every region. Ground fresh, dispatched in 24 hours."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 rounded-[4px] border border-border bg-card px-3.5 py-2.5 text-[13px] font-medium text-foreground lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-10 rounded-[4px] border border-border bg-card px-3 text-[13px] font-medium text-foreground focus:border-primary focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to high</option>
              <option value="price-desc">Price: High to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        {/* desktop filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">{Filters}</div>
        </aside>

        {/* grid */}
        <div>
          <p className="mb-4 text-[13px] text-muted-foreground">
            {!shopLoaded ? "\u00A0" : `${filtered.length} ${filtered.length === 1 ? "blend" : "blends"}`}
          </p>
          {!shopLoaded || filtered.length === 0 ? (
            !shopLoaded ? (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-[6px] border border-border">
                    <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="relative h-3 w-3/4 overflow-hidden rounded-full bg-stone-100">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                      </div>
                      <div className="relative h-3 w-1/2 overflow-hidden rounded-full bg-stone-100">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <div className="relative h-4 w-16 overflow-hidden rounded-full bg-stone-100">
                          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                        </div>
                        <div className="relative h-4 w-12 overflow-hidden rounded-full bg-stone-100">
                          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[6px] border border-dashed border-border py-20 text-center">
                <p className="text-[15px] font-medium text-foreground">No blends match these filters</p>
                <button
                  onClick={() => {
                    clearLevels();
                    setMaxPrice(200);
                    go({ name: "shop" });
                  }}
                  className="mt-3 text-[13px] font-semibold text-primary underline-offset-2 hover:underline"
                >
                  Reset filters
                </button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5">
              {filtered.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* mobile filter sheet */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] lg:hidden"
          >
            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[10px] bg-card p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-[16px] font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="grid h-9 w-9 place-items-center rounded-[4px] hover:bg-foreground/5">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {Filters}
              <button
                onClick={() => setShowFilters(false)}
                className="mt-6 w-full rounded-[4px] bg-foreground py-3.5 text-[14px] font-semibold text-card"
              >
                Show {filtered.length} blends
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductView() {
  const { view, go, setQuickView } = useUI();
  const { add, wishlist, toggleWishlist } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(-1);
  const [dbProduct, setDbProduct] = useState<ProductData | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [allProducts, setAllProducts] = useState(DEFAULT_PRODUCTS);
  const [allCategories, setAllCategories] = useState(DEFAULT_CATEGORIES);
  const [reviews, setReviews] = useState<{ id: string; name: string; rating: number; title: string; body: string; createdAt: string }[]>([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", email: "", rating: 5, title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const slug = view.name === "product" ? view.slug : "";

  // Try database first, fallback to hardcoded
  const hardcoded = getProductBySlug(slug);
  const p = dbProduct || hardcoded;
  const labels = useProductLabels();

  useEffect(() => {
    if (!slug) return;
    setLoadingProduct(true);
    setDbProduct(null);
    setSelectedImg(-1);
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.product) {
          setDbProduct(d.product);
        }
      })
      .catch((e) => { console.error(e); })
      .finally(() => setLoadingProduct(false));
  }, [slug]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        if (d.products && d.products.length > 0) {
          setAllProducts(d.products);
          const catMap = new Map<string, { id: string; name: string; count: number }>();
          for (const pr of d.products) {
            const existing = catMap.get(pr.categoryId);
            if (existing) existing.count++;
            else catMap.set(pr.categoryId, { id: pr.categoryId, name: pr.categoryId.replace(/-/g, " "), count: 1 });
          }
          setAllCategories(Array.from(catMap.values()).map((c) => ({
            ...c,
            name: c.name.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
            tagline: "", description: "", accent: "zinc", hue: 0,
          })));
        }
      })
      .catch((e) => { console.error(e); });
  }, []);

  const fetchReviews = useCallback(async (productId: string, page: number, append = false) => {
    setLoadingReviews(true);
    try {
      const res = await fetch(`/api/reviews?productId=${productId}&page=${page}`);
      const data = await res.json();
      if (data.reviews) {
        setReviews((prev) => (append ? [...prev, ...data.reviews] : data.reviews));
        setHasMoreReviews(data.hasMore);
      }
    } catch (e) { console.error(e); }
    setLoadingReviews(false);
  }, []);

  useEffect(() => {
    if (p?.id) {
      setReviews([]);
      setReviewPage(1);
      fetchReviews(p.id, 1);
    }
  }, [p?.id, fetchReviews]);

  useEffect(() => {
    if (p) {
      document.title = `${p.name} · EasyMom Foods`;
    } else {
      document.title = "EasyMom Foods — Authentic South Indian Masalas";
    }
  }, [p]);

  function loadMoreReviews() {
    if (!p?.id) return;
    const next = reviewPage + 1;
    setReviewPage(next);
    fetchReviews(p.id, next, true);
  }

  async function submitReview() {
    if (!p?.id) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: p.id, ...reviewForm }),
      });
      if (res.ok) {
        setSubmitted(true);
        setShowReviewForm(false);
        setReviewForm({ name: "", email: "", rating: 5, title: "", body: "" });
        fetchReviews(p.id, 1);
        fetch(`/api/products/${slug}`)
          .then((r) => r.json())
          .then((d) => { if (d.product) setDbProduct(d.product); });
      }
    } catch (e) { console.error(e); }
    setSubmitting(false);
  }

  if (!p) {
    if (loadingProduct) {
      return (
        <div className="mx-auto max-w-[1280px] px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
          <div className="mb-6 flex gap-2">
            <div className="h-3 w-12 rounded-full bg-stone-100" />
            <div className="h-3 w-8 rounded-full bg-stone-100" />
            <div className="h-3 w-16 rounded-full bg-stone-100" />
          </div>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="flex flex-col-reverse gap-4 lg:flex-row lg:gap-5">
              <div className="flex gap-3 lg:flex-col lg:w-[100px] shrink-0">
                {[1, 2].map((i) => (
                  <div key={i} className="relative shrink-0 w-[72px] h-[72px] lg:w-[100px] lg:h-[100px] overflow-hidden rounded-lg border-2 border-border bg-stone-100">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  </div>
                ))}
              </div>
              <div className="relative flex-1 aspect-square overflow-hidden rounded-[6px] border border-border bg-stone-100">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
            </div>
            <div className="space-y-5">
              <div className="h-4 w-20 rounded-full bg-stone-100" />
              <div className="h-8 w-3/4 rounded-full bg-stone-100" />
              <div className="h-4 w-1/2 rounded-full bg-stone-100" />
              <div className="flex gap-3 pt-2">
                <div className="h-10 w-28 rounded-full bg-stone-100" />
                <div className="h-10 w-24 rounded-full bg-stone-100" />
              </div>
              <div className="space-y-2 pt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-3 w-full rounded-full bg-stone-100" />
                ))}
              </div>
              <div className="h-12 w-full rounded-xl bg-stone-100 pt-4" />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <p className="text-[18px] font-semibold">Blend not found</p>
        <button onClick={() => go({ name: "shop" })} className="mt-4 text-primary underline">Back to shop</button>
      </div>
    );
  }

  const category = allCategories.find((c) => c.id === p.categoryId);
  const related = allProducts.filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 4);
  const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
      <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <button onClick={() => go({ name: "home" })} className="hover:text-foreground">Home</button>
        <ChevronRight className="h-3 w-3" />
        <button onClick={() => go({ name: "shop" })} className="hover:text-foreground">Shop</button>
        <ChevronRight className="h-3 w-3" />
        <button onClick={() => go({ name: "shop", categoryId: p.categoryId })} className="hover:text-foreground">
          {category?.name}
        </button>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-foreground">{p.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        {/* visual — left: main image, right: thumbnail strip */}
        <div className="flex flex-col-reverse gap-4 lg:flex-row lg:gap-5">
          {/* Right: thumbnail strip */}
          <div className="flex gap-3 lg:flex-col lg:w-[100px] shrink-0 overflow-x-auto lg:overflow-y-auto">
            {/* Main product image as Image 1 */}
            {p.img && (
              <button
                onClick={() => setSelectedImg(-1)}
                className={`relative shrink-0 w-[72px] h-[72px] lg:w-[100px] lg:h-[100px] overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImg === -1 ? "border-primary shadow-md" : "border-border hover:border-stone-300"
                }`}
              >
                <img src={p.img} alt={`${p.name} main`} className="h-full w-full object-cover" />
                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-white text-center py-0.5 font-medium">
                  Image 1
                </span>
              </button>
            )}
            {/* Gallery images */}
            {p.images && p.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImg(i)}
                className={`relative shrink-0 w-[72px] h-[72px] lg:w-[100px] lg:h-[100px] overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImg === i ? "border-primary shadow-md" : "border-border hover:border-stone-300"
                }`}
              >
                <img src={img} alt={`${p.name} ${i + 2}`} className="h-full w-full object-cover" />
                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-white text-center py-0.5 font-medium">
                  Image {i + 2}
                </span>
              </button>
            ))}
            {/* Free item image */}
            {p.freeItemImage && (
              <button
                onClick={() => setSelectedImg(-2)}
                className={`relative shrink-0 w-[72px] h-[72px] lg:w-[100px] lg:h-[100px] overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImg === -2 ? "border-leaf shadow-md" : "border-leaf/40 hover:border-leaf/60"
                }`}
              >
                <img src={p.freeItemImage} alt={`Free: ${p.freeItemName}`} className="h-full w-full object-cover" />
                <span className="absolute bottom-0 left-0 right-0 bg-leaf/80 text-[9px] text-white text-center py-0.5 font-medium">
                  Free
                </span>
              </button>
            )}
          </div>
          {/* Left: main display */}
          <div className="flex-1 min-w-0">
            <div className="relative overflow-hidden rounded-[6px] border border-border aspect-square bg-stone-50">
              <img
                src={selectedImg === -2 ? (p.freeItemImage || "") : selectedImg === -1 ? (p.img || "") : (p.images && p.images[selectedImg]) || p.img || ""}
                alt={p.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* details */}
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-primary">{category?.name}</p>
          <h1 className="mt-1.5 text-[32px] font-semibold leading-tight tracking-tight text-foreground sm:text-[40px]">
            {p.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px]">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-turmeric text-turmeric" />
              {p.reviewCount > 0 ? (
                <>
                  <strong className="font-semibold">{p.rating}</strong>
                  <span className="text-muted-foreground">({p.reviewCount} review{p.reviewCount !== 1 ? "s" : ""})</span>
                </>
              ) : (
                <span className="text-muted-foreground">No reviews yet</span>
              )}
            </span>
            <span className="h-3 w-px bg-border" />
            <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {p.origin}</span>
            <span className="h-3 w-px bg-border" />
            <span className="flex items-center gap-1 text-muted-foreground"><Flame className="h-3.5 w-3.5 text-primary" /> {p.spiceLevel}</span>
          </div>

          <p className="mt-5 text-[16px] leading-relaxed text-foreground/80">{p.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={Clock} label={labels.cookTime} value={p.cookingTime} />
            <Stat icon={Users} label={labels.serves} value={p.servings} />
            <Stat icon={ShieldCheck} label={labels.shelfLife} value={p.shelfLife} />
            <Stat icon={RotateCcw} label={labels.weight} value={p.weight} />
          </div>

          <div className="mt-6">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
              {labels.insideBlend}
             </p>
            <div className="flex flex-wrap gap-1.5">
              {p.ingredients.map((ing) => (
                <span key={ing} className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-[12.5px] text-foreground/80">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Free item badge */}
          {p.freeItemName && (
            <div className="mt-5 rounded-[6px] border border-leaf/30 bg-leaf/5 p-4 flex items-center gap-3">
              {p.freeItemImage && <img src={p.freeItemImage} alt={p.freeItemName} className="h-14 w-14 rounded-lg object-cover shrink-0" />}
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wide text-leaf">Free Gift</p>
                <p className="text-[14px] font-semibold text-foreground">{p.freeItemName}</p>
                <p className="text-[12px] text-muted-foreground">Included with this purchase</p>
              </div>
            </div>
          )}

          {/* price + add */}
          <div className="mt-7 rounded-[6px] border border-border bg-card p-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-[32px] font-semibold tracking-tight text-foreground">{inr(p.price)}</span>
                  {p.mrp > p.price && (
                    <>
                      <span className="text-[16px] text-muted-foreground line-through">{inr(p.mrp)}</span>
                      <span className="rounded-[4px] bg-primary/10 px-2 py-0.5 text-[12px] font-semibold text-primary">
                        {discount}% off
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-0.5 text-[12px] text-muted-foreground">{p.weight} {labels.taxSuffix}</p>
              </div>
              <button
                onClick={() => {
                  toggleWishlist(p.id);
                  toast(wishlist.includes(p.id) ? "Removed from wishlist" : "Saved to wishlist");
                }}
                className="grid h-12 w-12 place-items-center rounded-[4px] border border-border transition hover:border-primary/40"
                aria-label="Wishlist"
              >
                <Heart className={cn("h-5 w-5", wishlist.includes(p.id) && "fill-primary text-primary")} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center rounded-[4px] border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center text-foreground/70 transition hover:text-foreground" aria-label="Decrease">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-[16px] font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="grid h-12 w-12 place-items-center text-foreground/70 transition hover:text-foreground" aria-label="Increase">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => {
                  add(p as Product, qty);
                  showAddedToCart(p.name, qty);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-[4px] bg-primary px-5 py-3.5 text-[14px] font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <ShoppingBag className="h-4 w-4" /> Add to cart · {inr(p.price * qty)}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-muted-foreground">
              <span className="flex items-center justify-center gap-1"><Truck className="h-3.5 w-3.5 text-leaf" /> Free shipping</span>
              <span className="flex items-center justify-center gap-1"><Check className="h-3.5 w-3.5 text-leaf" /> Dispatched 24h</span>
              <span className="flex items-center justify-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-leaf" /> Secure pay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[24px] font-semibold tracking-tight">Customer Reviews</h2>
            <p className="mt-1 text-[14px] text-muted-foreground">
              {p.reviewCount > 0 ? `${p.reviewCount} review${p.reviewCount !== 1 ? "s" : ""} · ${p.rating} average` : "No reviews yet"}
            </p>
          </div>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="rounded-[4px] border border-border bg-card px-4 py-2.5 text-[13px] font-semibold text-foreground transition hover:bg-secondary"
          >
            Write a review
          </button>
        </div>

        {/* Review Form */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="rounded-[6px] border border-border bg-card p-6 space-y-4">
                <h3 className="text-[16px] font-semibold">Share your experience</h3>
                {/* Star Rating */}
                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="transition hover:scale-110"
                      >
                        <Star
                          className={`h-7 w-7 ${
                            star <= reviewForm.rating
                              ? "fill-turmeric text-turmeric"
                              : "text-border"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-foreground mb-1.5">Name *</label>
                    <input
                      type="text"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      className="w-full h-10 px-3 rounded-[4px] border border-border bg-background text-[14px] focus:outline-none focus:border-primary"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-foreground mb-1.5">Email (optional)</label>
                    <input
                      type="email"
                      value={reviewForm.email}
                      onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                      className="w-full h-10 px-3 rounded-[4px] border border-border bg-background text-[14px] focus:outline-none focus:border-primary"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-1.5">Review title *</label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="w-full h-10 px-3 rounded-[4px] border border-border bg-background text-[14px] focus:outline-none focus:border-primary"
                    placeholder="Sum it up in a sentence"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-1.5">Your review *</label>
                  <textarea
                    value={reviewForm.body}
                    onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-[4px] border border-border bg-background text-[14px] focus:outline-none focus:border-primary resize-none"
                    rows={4}
                    placeholder="What did you like or dislike? How did you use it?"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2.5 border border-border text-[13px] font-medium rounded-[4px] hover:bg-secondary transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submitReview}
                    disabled={submitting || !reviewForm.name || !reviewForm.title || !reviewForm.body}
                    className="px-5 py-2.5 bg-primary text-primary-foreground text-[13px] font-semibold rounded-[4px] hover:bg-primary/90 transition disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {submitted && (
          <div className="mb-6 rounded-[6px] bg-leaf/10 border border-leaf/20 p-4 text-[14px] text-leaf">
            Thanks! Your review has been submitted and will appear after approval.
          </div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-[6px] border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary text-[14px] font-semibold">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-foreground">{review.name}</p>
                      <p className="text-[12px] text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${s <= review.rating ? "fill-turmeric text-turmeric" : "text-border"}`}
                      />
                    ))}
                  </div>
                </div>
                <h4 className="mt-3 text-[14px] font-semibold text-foreground">{review.title}</h4>
                <p className="mt-1.5 text-[14px] leading-relaxed text-foreground/80">{review.body}</p>
          </div>
        ))}
      </div>
      ) : (
        !showReviewForm && (
          <div className="rounded-[6px] border border-dashed border-border py-12 text-center">
            <p className="text-[15px] text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
          </div>
        )
      )}

        {hasMoreReviews && (
          <div className="mt-6 text-center">
            <button
              onClick={loadMoreReviews}
              disabled={loadingReviews}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-[13px] font-semibold rounded-[4px] hover:bg-secondary transition disabled:opacity-50"
            >
              {loadingReviews && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loadingReviews ? "Loading..." : "Load more reviews"}
            </button>
          </div>
        )}
      </div>

      {/* related */}
      {related.length > 0 && (
        <div className="mt-20">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-[24px] font-semibold tracking-tight">You may also like</h2>
            <button onClick={() => go({ name: "shop", categoryId: p.categoryId })} className="text-[13px] font-semibold text-primary hover:underline">
              View all in {category?.name}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {related.map((r, i) => (
              <ProductCard key={r.id} product={r} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="rounded-[6px] border border-border bg-secondary/30 p-3">
      <Icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
      <div className="mt-1.5 text-[13px] font-semibold text-foreground">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}

export function RecipesView() {
  const go = useUI((s) => s.go);
  const [dbRecipes, setDbRecipes] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/recipes").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ])
      .then(([recipesData, productsData]) => {
        const r = recipesData.recipes || [];
        setDbRecipes(r);
        setDbProducts(productsData.products || []);
        if (r.length > 0) setOpen(r[0].id);
      })
      .catch((e) => { console.error(e); })
      .finally(() => setLoading(false));
  }, []);

  const activeRecipes = dbRecipes.length > 0 ? dbRecipes : recipes;

  function getProductImg(productSlug: string) {
    const p = dbProducts.find((x: any) => x.slug === productSlug);
    return p?.img || products.find((x) => x.slug === productSlug)?.img || "";
  }
  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
      <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <button onClick={() => go({ name: "home" })} className="hover:text-foreground">Home</button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Recipes</span>
      </nav>
      <div className="max-w-2xl">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">From the EasyMom kitchen</p>
        <h1 className="mt-3 text-[40px] font-semibold leading-[1.08] tracking-tight sm:text-[52px]">
          Recipes that earn the blend.
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
          Each recipe is built around one of our masalas and tested until it works on a Tuesday night.
          Real timings, real temperatures, no 40-ingredient lists.
        </p>
      </div>

      <div className="mt-12 space-y-6">
        {activeRecipes.map((r: any, i: number) => {
          const isOpen = open === r.id;
          return (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="overflow-hidden rounded-[6px] border border-border bg-card"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr]">
                <div className="relative aspect-[5/3] lg:aspect-auto">
                  <img src={getProductImg(r.productSlug)} alt={r.title} className="h-full w-full object-cover" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-[4px] bg-card/90 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
                    <MapPin className="h-3 w-3 text-primary" /> {r.region}
                  </div>
                </div>
                <div className="p-6 lg:p-8">
                  <div className="flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {r.time}</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Serves {r.serves}</span>
                    <span className="rounded-[4px] bg-secondary px-2 py-0.5 font-medium">{r.difficulty}</span>
                  </div>
                  <h2 className="mt-3 text-[24px] font-semibold leading-tight tracking-tight">{r.title}</h2>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{r.excerpt}</p>

                  <button
                    onClick={() => setOpen(isOpen ? null : r.id)}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-[4px] bg-foreground px-4 py-2.5 text-[13px] font-semibold text-card transition hover:bg-primary hover:text-primary-foreground"
                  >
                    {isOpen ? "Hide recipe" : "Show the recipe"}
                    <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <ol className="mt-5 space-y-3 border-t border-border pt-5">
                          {r.steps.map((s: string, idx: number) => (
                            <li key={idx} className="flex gap-3 text-[14px] leading-relaxed text-foreground/85">
                              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[12px] font-semibold text-primary-foreground">
                                {idx + 1}
                              </span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ol>
                        <button
                          onClick={() => go({ name: "product", slug: r.productSlug })}
                          className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline"
                        >
                          Get the masala for this recipe <ChevronRight className="h-4 w-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

const DEFAULT_ABOUT = {
  eyebrow: "Our story",
  heading: "A South Indian kitchen, made effortless.",
  paragraph1:
    "EasyMom began in a Mangalore kitchen in 2025, when a working mother ground her mother's chicken masala blend into a pouch so her sister in Dubai could taste home on a Wednesday. The pouch kept getting passed around — to colleagues, neighbours, friends abroad — until it became clear this was bigger than one family.",
  paragraph2:
    "Today we work with small spice co-ops across Karnataka, Kerala and Tamil Nadu, grinding in batches under 20kg on slow stones. Every blend is a real recipe from a real kitchen — built so a 15-minute cook still tastes like a 90-minute one.",
  founder: "Mahammad Sinan",
  image: "/brand/story-grind.png",
  imageAlt: "Grinding spices in a stone mortar",
  stats: [
    { value: "42k+", label: "Households served" },
    { value: "100%", label: "No preservatives" },
    { value: "9", label: "South Indian regions" },
    { value: "4.8★", label: "Across 3,200 reviews" },
  ],
};

export function AboutView() {
  const go = useUI((s) => s.go);
  const [about, setAbout] = useState(DEFAULT_ABOUT);
  const [aboutTestimonials, setAboutTestimonials] = useState(testimonials);

  useEffect(() => {
    fetch("/api/site-content/about")
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          try {
            const parsed = JSON.parse(d.value);
            setAbout({ ...DEFAULT_ABOUT, ...parsed });
          } catch (e) { console.error(e); }
        }
      })
      .catch((e) => { console.error(e); });
  }, []);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((d) => {
        if (d.testimonials && d.testimonials.length > 0) setAboutTestimonials(d.testimonials);
      })
      .catch((e) => { console.error(e); });
  }, []);

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
      <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <button onClick={() => go({ name: "home" })} className="hover:text-foreground">Home</button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Our story</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">{about.eyebrow}</p>
          <h1 className="mt-3 text-[40px] font-semibold leading-[1.06] tracking-tight sm:text-[56px]">
            {about.heading}
          </h1>
          <p className="mt-5 text-[16px] leading-relaxed text-foreground/80">
            {about.paragraph1}
          </p>
          {about.paragraph2 && (
            <p className="mt-4 text-[16px] leading-relaxed text-foreground/80">
              {about.paragraph2}
            </p>
          )}
          {about.founder && (
            <p className="mt-6 text-[14px] font-semibold text-foreground">
              — {about.founder}, Founder
            </p>
          )}
        </div>
        <div className="overflow-hidden rounded-[6px] shadow-premium">
          <img src={about.image} alt={about.imageAlt} className="aspect-[4/5] w-full object-cover" />
        </div>
      </div>

      {/* stats */}
      <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[6px] border border-border lg:grid-cols-4">
        {about.stats.map((s, i) => (
          <div key={i} className="bg-card p-6 text-center">
            <div className="text-[32px] font-semibold tracking-tight text-foreground">{s.value}</div>
            <div className="mt-1 text-[12px] uppercase tracking-wide text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* testimonials */}
      <div className="mt-20">
        <h2 className="text-center text-[28px] font-semibold tracking-tight">Trusted in 42,000 kitchens</h2>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {aboutTestimonials.map((t) => (
            <figure key={t.id} className="flex flex-col rounded-[6px] border border-border bg-card p-6">
              <Quote className="h-6 w-6 text-primary/30" />
              <blockquote className="mt-3 flex-1 text-[14.5px] leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
              <figcaption className="mt-4 border-t border-border pt-4">
                <div className="text-[14px] font-semibold">{t.name}</div>
                <div className="text-[12px] text-muted-foreground">{t.role} · {t.location}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FaqView() {
  const go = useUI((s) => s.go);
  const [open, setOpen] = useState<number | null>(0);
  const [dbFaqs, setDbFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/faqs")
      .then((r) => r.json())
      .then((d) => {
        if (d.faqs && d.faqs.length > 0) {
          setDbFaqs(d.faqs.map((f: any) => ({ question: f.question, answer: f.answer })));
        }
      })
      .catch((e) => { console.error(e); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
      <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <button onClick={() => go({ name: "home" })} className="hover:text-foreground">Home</button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">FAQ</span>
      </nav>
      <div className="text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">Help centre</p>
        <h1 className="mt-3 text-[36px] font-semibold tracking-tight sm:text-[44px]">Frequently asked</h1>
        <p className="mx-auto mt-4 max-w-lg text-[15px] text-muted-foreground">
          Everything about shipping, ingredients, storage and returns. Can't find your answer? Write to easymomfoods@gmail.com.
        </p>
      </div>
      <div className="mt-10 space-y-3">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-[6px] border border-border bg-card" />
            ))}
          </div>
        ) : dbFaqs.length === 0 ? (
          <p className="py-12 text-center text-[14px] text-muted-foreground">
            No FAQs published yet. Add them from the admin panel.
          </p>
        ) : (
          dbFaqs.map((f, i) => (
          <div key={i} className="overflow-hidden rounded-[6px] border border-border bg-card">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            >
              <span className="text-[15px] font-semibold text-foreground">{f.question}</span>
              <ChevronRight className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open === i && "rotate-90")} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-[14px] leading-relaxed text-muted-foreground">{f.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )))}
      </div>
    </div>
  );
}
