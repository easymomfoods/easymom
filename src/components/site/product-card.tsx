"use client";

import { motion } from "framer-motion";
import { Heart, Plus, Star, Eye } from "lucide-react";
import type { Product } from "@/lib/data";
import { useCart } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SpiceVisual } from "./spice-visual";
import { toast } from "sonner";

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
  const setQuickView = useUI((s) => s.setQuickView);

  const wished = wishlist.includes(product.id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[6px] border border-border bg-card transition-shadow duration-300 hover:shadow-premium"
    >
      {/* visual */}
      <button
        onClick={() => go({ name: "product", slug: product.slug })}
        className="relative block aspect-[4/5] w-full overflow-hidden"
        aria-label={`View ${product.name}`}
      >
        <SpiceVisual
          hue={product.hue}
          name={product.name}
          weight={product.weight}
          seed={product.id}
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {/* badges */}
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
        {/* quick view */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex items-center justify-center gap-1.5 rounded-[4px] bg-card/95 px-3 py-2 text-[12px] font-medium text-foreground shadow-soft backdrop-blur-sm">
            <Eye className="h-3.5 w-3.5" /> Quick view
          </span>
        </div>
      </button>

      {/* wishlist */}
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

        <button
          onClick={() => go({ name: "product", slug: product.slug })}
          className="text-left text-[15px] font-semibold leading-snug text-foreground transition hover:text-primary"
        >
          {product.name}
        </button>
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
          <button
            onClick={() => {
              add(product);
              toast.success("Added to cart", { description: product.name });
            }}
            className="grid h-9 w-9 place-items-center rounded-[4px] bg-foreground text-card transition hover:bg-primary hover:text-primary-foreground active:scale-95"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
