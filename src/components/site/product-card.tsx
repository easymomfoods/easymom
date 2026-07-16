"use client";

import { motion } from "framer-motion";
import { Heart, Plus, Star, ShoppingBag } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Product } from "@/lib/data";
import { useCart } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { showAddedToCart } from "@/components/site/cart-toast";

const LEVEL_COLOR: Record<string, string> = {
  Mild: "bg-leaf/15 text-leaf",
  Medium: "bg-turmeric/20 text-[oklch(0.45_0.12_70)]",
  Hot: "bg-primary/12 text-primary",
  Fiery: "bg-primary/20 text-primary",
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const add = useCart((s) => s.add);
  const wishlist = useCart((s) => s.wishlist);
  const toggleWishlist = useCart((s) => s.toggleWishlist);
  const go = useUI((s) => s.go);
  const wished = wishlist.includes(product.id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const allImages = [product.img, ...(product.images || []), product.freeItemImage].filter(Boolean);
  const uniqueImages = [...new Set(allImages)];
  const images = uniqueImages.length > 1 ? uniqueImages : null;
  const hasFreeItem = !!product.freeItemName && !!product.freeItemImage;
  const [hoverIdx, setHoverIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleEnter = () => {
    if (!images) return;
    setHoverIdx(0);
    intervalRef.current = setInterval(() => {
      setHoverIdx((prev) => (prev + 1) % images.length);
    }, 1200);
  };

  const handleLeave = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setHoverIdx(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[6px] border bg-card transition-shadow duration-300",
        product.active ? "border-border hover:shadow-premium" : "border-stone-200 opacity-70"
      )}
    >
      {/* visual */}
      <div
        className={cn("relative block aspect-[4/5] w-full overflow-hidden", !product.active && "pointer-events-none")}
        onClick={product.active ? () => go({ name: "product", slug: product.slug }) : undefined}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        role={product.active ? "button" : undefined}
        style={product.active ? { cursor: "pointer" } : undefined}
      >
        {images ? (
          <div className="relative h-full w-full overflow-hidden">
            {images.map((img, i) => (
              <img
                key={i}
                src={img ?? ""}
                alt={`${product.name} ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out",
                  product.active ? "group-hover:scale-105" : "grayscale",
                  i === hoverIdx ? "opacity-100" : "opacity-0"
                )}
              />
            ))}
          </div>
        ) : product.img ? (
          <img
            src={product.img}
            alt={product.name}
            loading="eager"
            className={cn(
              "h-full w-full object-cover transition-transform duration-700 ease-out",
              product.active ? "group-hover:scale-105" : " grayscale"
            )}
          />
        ) : (
          <div className="h-full w-full bg-stone-100 flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-stone-300" />
          </div>
        )}

        {/* Out of Stock overlay */}
        {!product.active && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />
            <div className="absolute inset-x-0 bottom-4 sm:bottom-14 z-20 flex justify-center pointer-events-none">
              <span className="inline-block rounded bg-stone-900/80 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-white uppercase tracking-[0.18em]">
                Currently Unavailable
              </span>
            </div>
          </>
        )}

        {/* badges */}
        {product.active && (
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.bestSeller && (
              <span className="rounded-[4px] bg-foreground/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                Bestseller
              </span>
            )}
            {product.isNew && (
              <span className="rounded-[4px] bg-turmeric px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-turmeric-foreground">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-[4px] bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                {discount}% off
              </span>
            )}
          </div>
        )}
        {/* free item blink */}
        {product.active && hasFreeItem && (
          <div className="absolute left-3 bottom-3 z-20">
            <span className="inline-block rounded bg-leaf/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
              Free — {product.freeItemName}
            </span>
          </div>
        )}
        {/* price tag */}
        {discount > 0 && product.active && (
          <div className="absolute bottom-0 right-0 rounded-tl-[6px] bg-foreground/90 px-2.5 py-1.5 backdrop-blur-sm">
            <span className="text-[14px] font-semibold text-white">{inr(product.price)}</span>
            <span className="ml-1 text-[11px] text-white/60 line-through">{inr(product.mrp)}</span>
          </div>
        )}
        {/* image dots indicator */}
        {images && product.active && (
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i === hoverIdx ? "w-4 bg-white" : "w-1 bg-white/50"
                )}
              />
            ))}
          </div>
        )}
        {/* wishlist */}
        {product.active && (
          <button
            onClick={() => {
              toggleWishlist(product.id);
              toast(wished ? "Removed from wishlist" : "Saved to wishlist", {
                description: product.name,
              });
            }}
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-card/85 text-foreground/70 backdrop-blur-sm transition hover:text-primary"
            aria-label="Toggle wishlist"
          >
            <Heart className={cn("h-4 w-4 transition", wished && "fill-primary text-primary")} />
          </button>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1.5 flex items-center gap-2">
          <span className={cn("rounded-[4px] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", LEVEL_COLOR[product.spiceLevel])}>
            {product.spiceLevel}
          </span>
          <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
            <Star className="h-3 w-3 fill-turmeric text-turmeric" />
            {product.rating}
            <span className="text-muted-foreground/60">({product.reviewCount})</span>
          </span>
        </div>

        {product.active ? (
          <button
            onClick={() => go({ name: "product", slug: product.slug })}
            className="text-left text-[15px] font-semibold leading-snug text-foreground transition hover:text-primary"
          >
            {product.name}
          </button>
        ) : (
          <p className="text-left text-[15px] font-semibold leading-snug text-stone-500">
            {product.name}
          </p>
        )}

        <div className="mt-1 flex items-center gap-1.5">
          {product.bestSeller && (
            <span className="inline-flex items-center gap-1 rounded-[3px] border border-primary/30 bg-primary/8 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              Best
            </span>
          )}
          {product.isNew && (
            <span className="inline-flex items-center gap-1 rounded-[3px] border border-turmeric/30 bg-turmeric/10 px-1.5 py-0.5 text-[10px] font-semibold text-[oklch(0.45_0.12_70)]">
              Trend
            </span>
          )}
        </div>

        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted-foreground">
          {product.shortDesc}
        </p>

        <div className="mt-3 flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[17px] font-semibold text-foreground">{inr(product.price)}</span>
            {product.mrp > product.price && (
              <span className="text-[12px] text-muted-foreground line-through">{inr(product.mrp)}</span>
            )}
          </div>
          {product.active ? (
            <button
              onClick={() => {
                add(product);
                showAddedToCart(product.name);
              }}
              className="grid h-9 w-9 place-items-center rounded-[4px] bg-foreground text-card transition hover:bg-primary hover:text-primary-foreground active:scale-95"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="h-4 w-4" strokeWidth={2.2} />
            </button>
          ) : (
            <span className="rounded-[4px] bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-500">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
