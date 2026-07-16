"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Users,
  MapPin,
  ChevronRight,
  PackageOpen,
} from "lucide-react";
import { PackageIcon, LeafIcon, CircularArrowIcon, MortarIcon, FlameIcon, ShieldIcon } from "./icons";
import { categories, products, recipes, testimonials, brandValues, type Product } from "@/lib/data";
import { useUI } from "@/lib/ui-store";
import { ProductCard } from "./product-card";
import { inr } from "@/lib/format";

const ICONS: Record<string, typeof LeafIcon> = {
  mortar: MortarIcon,
  leaf: LeafIcon,
  shield: ShieldIcon,
  flame: FlameIcon,
};

const DEFAULT_CATEGORIES = categories;

export function Categories() {
  const go = useUI((s) => s.go);
  const [dbCategories, setDbCategories] = React.useState(DEFAULT_CATEGORIES);

  React.useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        if (d.categories && d.categories.length > 0) setDbCategories(d.categories);
      })
      .catch((e) => { console.error(e); });
  }, []);

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <SectionHeader
        align="left"
        eyebrow="The collection"
        title="Six kitchens, one pantry"
      />
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dbCategories.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => go({ name: "shop", categoryId: c.id })}
            className="group relative flex flex-col overflow-hidden rounded-[6px] border border-border bg-card p-6 text-left transition-shadow duration-300 hover:shadow-premium"
          >
            <div className="mb-5 flex items-center justify-between">
              <div
                className="grid h-12 w-12 place-items-center rounded-[6px]"
                style={{ background: `oklch(0.95 0.03 ${c.hue})` }}
              >
                <div
                  className="h-6 w-6 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, oklch(0.65 0.15 ${c.hue}), oklch(0.45 0.17 ${c.hue}))`,
                  }}
                />
              </div>
              <span className="text-[12px] font-medium text-muted-foreground">{c.count} blends</span>
            </div>
            <h3 className="text-[19px] font-semibold tracking-tight text-foreground">{c.name}</h3>
            <p className="mt-1 text-[13px] font-medium text-primary">{c.tagline}</p>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">{c.description}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-foreground">
              Browse {c.name.toLowerCase()}
              <ChevronRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </span>
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
              style={{ background: `oklch(0.7 0.15 ${c.hue})` }}
            />
          </motion.button>
        ))}
      </div>
    </section>
  );
}

const FALLBACK_FEATURED = {
  eyebrow: "Most loved",
  title: "The blends people reorder",
  description: "The four that earned their place in 25,000 kitchens — and keep earning it.",
  productSlugs: [] as string[],
};

export function FeaturedProducts() {
  const go = useUI((s) => s.go);
  const [eyebrow, setEyebrow] = React.useState(FALLBACK_FEATURED.eyebrow);
  const [title, setTitle] = React.useState(FALLBACK_FEATURED.title);
  const [description, setDescription] = React.useState(FALLBACK_FEATURED.description);
  const [productSlugs, setProductSlugs] = React.useState<string[]>(FALLBACK_FEATURED.productSlugs);
  const [dbProducts, setDbProducts] = React.useState<any[]>([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    Promise.all([
      fetch("/api/site-content/featured").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ])
      .then(([contentData, productsData]) => {
        if (contentData.value) {
          try {
            const parsed = JSON.parse(contentData.value);
            if (parsed.eyebrow) setEyebrow(parsed.eyebrow);
            if (parsed.title) setTitle(parsed.title);
            if (parsed.description) setDescription(parsed.description);
            if (parsed.productSlugs) setProductSlugs(parsed.productSlugs);
          } catch (e) { console.error(e); }
        }
        if (productsData.products) {
          setDbProducts(productsData.products);
        }
        setLoaded(true);
      })
      .catch((e) => { console.error(e); setLoaded(true); });
  }, []);

  const featured = productSlugs.length > 0
    ? productSlugs
        .map((slug) => dbProducts.find((p: any) => p.slug === slug))
        .filter(Boolean)
        .slice(0, 4)
    : dbProducts.length > 0
      ? dbProducts.filter((p: any) => p.bestSeller).slice(0, 4)
      : [];

  return (
    <section className="bg-secondary/30">
      <div className="mx-auto max-w-[1280px] px-4 pt-10 pb-20 sm:px-6 lg:px-8 lg:pt-14 lg:pb-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            align="left"
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
          <button
            onClick={() => go({ name: "shop" })}
            className="group inline-flex items-center gap-1.5 rounded-[4px] border border-border bg-card px-4 py-2.5 text-[13px] font-semibold text-foreground transition hover:border-foreground/30"
          >
            View all {dbProducts.length > 0 ? dbProducts.length : 7} blends
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {!loaded
            ? Array.from({ length: 4 }).map((_, i) => (
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
                    </div>
                  </div>
                </div>
              ))
            : featured.map((p: any, i: number) => (
                <ProductCard key={p.id || p.slug} product={p} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}

const FALLBACK_BRAND_STORY = {
  marqueeText: "NO PREP · NO OIL · READY IN 5 MINUTES",
  heroImage: "/brand/story-grind.png",
  heroAlt: "Hands grinding spices in a traditional stone mortar and pestle",
  cookTime: "5 min",
  cookTimeLabel: "Cook time avg",
  eyebrow: "Why EasyMom",
  title: "Restaurant-style curry, ready in 5 minutes",
  description: "The all-in-one masala paste includes onions, tomatoes, and essential spices. No chopping, no grinding, no oil. Just add your protein, water, and EasyMom — dinner in 5 minutes.",
  bottomMarqueeText: "No prep · No oil · Ready in 5 minutes · All-in-one paste · Nothing to hide",
  features: brandValues,
};

const DEFAULT_MARQUEE_TEXT = FALLBACK_BRAND_STORY.marqueeText;

export function BrandStory() {
  const [count, setCount] = React.useState(0);
  const [countDone, setCountDone] = React.useState(false);
  const statRef = React.useRef<HTMLDivElement>(null);
  const revealRef = React.useRef<HTMLDivElement>(null);

  const [marqueeText, setMarqueeText] = React.useState(FALLBACK_BRAND_STORY.marqueeText);
  const [heroImage, setHeroImage] = React.useState(FALLBACK_BRAND_STORY.heroImage);
  const [heroAlt, setHeroAlt] = React.useState(FALLBACK_BRAND_STORY.heroAlt);
  const [cookTime, setCookTime] = React.useState(FALLBACK_BRAND_STORY.cookTime);
  const [cookTimeLabel, setCookTimeLabel] = React.useState(FALLBACK_BRAND_STORY.cookTimeLabel);
  const [eyebrow, setEyebrow] = React.useState(FALLBACK_BRAND_STORY.eyebrow);
  const [title, setTitle] = React.useState(FALLBACK_BRAND_STORY.title);
  const [description, setDescription] = React.useState(FALLBACK_BRAND_STORY.description);
  const [bottomMarqueeText, setBottomMarqueeText] = React.useState(FALLBACK_BRAND_STORY.bottomMarqueeText);
  const [features, setFeatures] = React.useState(FALLBACK_BRAND_STORY.features);

  React.useEffect(() => {
    fetch("/api/site-content/brand-story")
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          try {
            const parsed = JSON.parse(d.value);
            if (parsed.marqueeText) setMarqueeText(parsed.marqueeText);
            if (parsed.heroImage) setHeroImage(parsed.heroImage);
            if (parsed.heroAlt) setHeroAlt(parsed.heroAlt);
            if (parsed.cookTime) setCookTime(parsed.cookTime);
            if (parsed.cookTimeLabel) setCookTimeLabel(parsed.cookTimeLabel);
            if (parsed.eyebrow) setEyebrow(parsed.eyebrow);
            if (parsed.title) setTitle(parsed.title);
            if (parsed.description) setDescription(parsed.description);
            if (parsed.bottomMarqueeText) setBottomMarqueeText(parsed.bottomMarqueeText);
            if (parsed.features) setFeatures(parsed.features);
          } catch (e) { console.error(e); }
        }
      })
      .catch((e) => { console.error(e); });
  }, []);

  React.useEffect(() => {
    if (!revealRef.current) return;
    const els = revealRef.current.querySelectorAll("[data-reveal]");
    const o = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-revealed", "");
            o.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => o.observe(el));
    return () => o.disconnect();
  }, []);

  React.useEffect(() => {
    if (!statRef.current) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        o.disconnect();
        let cur = 0;
        const id = setInterval(() => {
          cur++;
          setCount(cur);
          if (cur >= 5) {
            clearInterval(id);
            setCountDone(true);
          }
        }, 200);
      },
      { threshold: 0.5 }
    );
    o.observe(statRef.current);
    return () => o.disconnect();
  }, []);

  return (
    <section ref={revealRef} className="relative overflow-hidden bg-white">
      {/* ── Marquee ── */}
      <div className="relative border-b border-zinc-100 py-5 sm:py-7">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-6 pr-6 sm:gap-10 sm:pr-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="whitespace-nowrap text-[42px] font-bold leading-none tracking-[-0.03em] text-zinc-[0.06] select-none sm:text-[64px] lg:text-[80px]"
              >
                {(marqueeText || DEFAULT_MARQUEE_TEXT).toUpperCase()}&nbsp;&nbsp;·&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="grid grid-cols-1 items-start gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-16">
          {/* image */}
          <div
            data-reveal
            className="relative overflow-hidden rounded-sm lg:col-span-7"
            style={{ transition: "opacity 0.7s ease, transform 0.7s ease", opacity: 0, transform: "translateY(24px)" }}
          >
            <div className="grain">
              <img
                src={heroImage}
                alt={heroAlt}
                className="aspect-[16/9] w-full object-cover sm:aspect-[4/3]"
              />
            </div>
          </div>

          {/* text */}
          <div className="flex flex-col gap-5 sm:gap-8 lg:col-span-5 lg:pt-4">
            {/* stat */}
            <div
              ref={statRef}
              data-reveal
              className="flex items-center gap-3 sm:gap-4"
              style={{ transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s", opacity: 0, transform: "translateY(20px)" }}
            >
              <div className="relative shrink-0">
                <div className="absolute -inset-2 rounded-full border-[1.5px] border-primary/20 sm:-inset-3" />
                <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/[0.07] sm:h-20 sm:w-20">
                  <span className="text-[18px] font-bold tracking-tight text-primary tabular-nums sm:text-[28px]">
                    {countDone ? cookTime : `${count} min`}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 sm:text-[11px]">
                {cookTimeLabel}
              </span>
            </div>

            <div
              data-reveal
              style={{ transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s", opacity: 0, transform: "translateY(20px)" }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-[12px]">
                {eyebrow}
              </p>
              <h2 className="mt-2 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-zinc-900 sm:mt-3 sm:text-[30px] lg:text-[42px]">
                {title}
              </h2>
            </div>

            <p
              data-reveal
              className="text-[13px] leading-[1.7] text-zinc-500 sm:text-[15px]"
              style={{ transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s", opacity: 0, transform: "translateY(20px)" }}
            >
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <div className="mx-auto max-w-[1200px] px-5 pb-14 sm:px-10 sm:pb-24 lg:px-16 lg:pb-28">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {features.map((v, i) => {
            const Icon = ICONS[v.icon] ?? LeafIcon;
            const hasImg = "img" in v && v.img;
            const span = i < 2 ? "lg:col-span-2" : "lg:col-span-1";
            const tall = i === 1;
            const rotations = ["-0.4deg", "0.3deg", "-0.2deg"];
            return (
              <div
                key={v.title}
                data-reveal
                className={`group relative overflow-hidden rounded-sm border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200/60 ${span} ${tall ? "lg:row-span-2" : ""} ${!hasImg ? "p-4 sm:p-7" : "min-h-[160px] sm:min-h-[250px] lg:min-h-[320px]"}`}
                style={{
                  transition: `opacity 0.6s ease ${0.05 * i}s, transform 0.6s ease ${0.05 * i}s`,
                  opacity: 0,
                  transform: `translateY(20px) rotate(${rotations[i % 3]})`,
                  ...(typeof window !== "undefined" && revealRef.current?.querySelector("[data-revealed]")
                    ? {}
                    : {}),
                }}
              >
                {hasImg ? (
                  <>
                    <div className="absolute inset-0 animate-shimmer" />
                    <img
                      src={v.img}
                      alt={v.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onLoad={(e) => {
                        (e.currentTarget.previousElementSibling as HTMLElement).style.opacity = "0";
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <div className="mb-3 grid h-8 w-8 place-items-center rounded-sm bg-primary/[0.07] sm:mb-5 sm:h-10 sm:w-10">
                        <Icon className="h-3.5 w-3.5 text-primary sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
                      </div>
                      <h4 className="text-[13px] font-semibold leading-snug text-zinc-900 sm:text-[16px]">{v.title}</h4>
                      <p className="mt-1.5 text-[11px] leading-[1.6] text-zinc-500 sm:mt-2.5 sm:text-[14px]">{v.body}</p>
                    </div>
                    <div className="mt-4 h-px w-6 bg-zinc-200 transition-all duration-300 group-hover:w-14 group-hover:bg-primary/30 sm:mt-6 sm:w-8" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Marquee ── */}
      <div className="border-t border-zinc-100 py-4 sm:py-5">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-6 pr-6 sm:gap-10 sm:pr-10" style={{ animationDirection: "reverse", animationDuration: "28s" }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="whitespace-nowrap text-[13px] font-medium uppercase tracking-[0.2em] text-zinc-300 select-none"
              >
                {bottomMarqueeText}&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const FALLBACK_RECIPES_SECTION = {
  eyebrow: "From the kitchen",
  title: "Recipes built around the blend",
  description: "Three dishes that show what a proper masala can do — each tested, each under 30 minutes.",
  recipeIds: [] as string[],
};

export function Recipes() {
  const go = useUI((s) => s.go);
  const ref = React.useRef<HTMLDivElement>(null);

  const [eyebrow, setEyebrow] = React.useState(FALLBACK_RECIPES_SECTION.eyebrow);
  const [title, setTitle] = React.useState(FALLBACK_RECIPES_SECTION.title);
  const [description, setDescription] = React.useState(FALLBACK_RECIPES_SECTION.description);
  const [recipeIds, setRecipeIds] = React.useState<string[]>(FALLBACK_RECIPES_SECTION.recipeIds);
  const [dbRecipes, setDbRecipes] = React.useState<any[]>([]);
  const [dbProducts, setDbProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    Promise.all([
      fetch("/api/site-content/recipes-section").then((r) => r.json()),
      fetch("/api/recipes").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ])
      .then(([contentData, recipesData, productsData]) => {
        if (contentData.value) {
          try {
            const parsed = JSON.parse(contentData.value);
            if (parsed.eyebrow) setEyebrow(parsed.eyebrow);
            if (parsed.title) setTitle(parsed.title);
            if (parsed.description) setDescription(parsed.description);
            if (parsed.recipeIds) setRecipeIds(parsed.recipeIds);
          } catch (e) { console.error(e); }
        }
        if (recipesData.recipes) setDbRecipes(recipesData.recipes);
        if (productsData.products) setDbProducts(productsData.products);
      })
      .catch((e) => { console.error(e); });
  }, []);

  React.useEffect(() => {
    if (!ref.current) return;
    const o = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-revealed", "");
            o.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    ref.current.querySelectorAll("[data-reveal]").forEach((el) => o.observe(el));
    return () => o.disconnect();
  }, []);

  // Use selected recipeIds if available, otherwise fallback to all DB recipes, then hardcoded
  const activeRecipes = recipeIds.length > 0
    ? recipeIds.map((id) => dbRecipes.find((r: any) => r.id === id)).filter(Boolean)
    : dbRecipes.length > 0
      ? dbRecipes
      : recipes;

  const [featured, ...rest] = activeRecipes;

  function getProductImg(productSlug: string) {
    const p = dbProducts.find((x: any) => x.slug === productSlug);
    return p?.img || "";
  }

  return (
    <section ref={ref} className="bg-zinc-50/60">
      <div className="mx-auto max-w-[1200px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-28">
        {/* header */}
        <div
          data-reveal
          style={{ transition: "opacity 0.6s ease, transform 0.6s ease", opacity: 0, transform: "translateY(20px)" }}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.08] tracking-[-0.02em] text-zinc-900 sm:text-[38px] lg:text-[42px]">
            {title}
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-[1.7] text-zinc-500">
            {description}
          </p>
        </div>

        {/* grid */}
        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-5 lg:grid-rows-2">
          {/* featured — spans 2 rows on desktop */}
          <button
            data-reveal
            onClick={() => go({ name: "recipes" })}
            className="group relative flex flex-col overflow-hidden rounded-sm border border-zinc-200 bg-white text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200/60 lg:col-span-3 lg:row-span-2"
            style={{ transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s", opacity: 0, transform: "translateY(28px)" }}
          >
            <div className="relative flex-1 overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                <img
                  src={getProductImg(featured.productSlug) || products.find((p) => p.slug === featured.productSlug)?.img || ""}
                  alt={featured.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-sm bg-white/90 px-2.5 py-1 text-[11px] font-medium text-zinc-700 backdrop-blur-sm">
                <MapPin className="h-3 w-3 text-primary" /> {featured.region}
              </div>
              <div className="absolute right-5 top-5 text-[80px] font-bold leading-none text-white/10 select-none sm:text-[100px] lg:text-[120px]">
                01
              </div>
            </div>
            <div className="flex flex-col gap-3 p-6 sm:p-8">
              <h3 className="text-[24px] font-semibold leading-snug text-zinc-900 sm:text-[28px]">
                {featured.title}
              </h3>
              <p className="text-[15px] leading-[1.7] text-zinc-500">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-5 border-t border-zinc-100 pt-4 text-[13px] text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {featured.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> Serves {featured.serves}
                </span>
                <span className="ml-auto inline-flex items-center gap-1 font-semibold text-zinc-900">
                  Read
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          </button>

          {/* smaller cards — stacked on right */}
          {rest.map((r, i) => (
            <button
              key={r.id}
              data-reveal
              onClick={() => go({ name: "recipes" })}
              className="group relative flex flex-col overflow-hidden rounded-sm border border-zinc-200 bg-white text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200/60 lg:col-span-2"
              style={{ transition: `opacity 0.7s ease ${0.15 + i * 0.1}s, transform 0.7s ease ${0.15 + i * 0.1}s`, opacity: 0, transform: "translateY(28px)" }}
            >
              <div className="relative aspect-[5/3] overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                  <img
                    src={getProductImg(r.productSlug) || products.find((p) => p.slug === r.productSlug)?.img || ""}
                    alt={r.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-sm bg-white/90 px-2.5 py-1 text-[11px] font-medium text-zinc-700 backdrop-blur-sm">
                  <MapPin className="h-3 w-3 text-primary" /> {r.region}
                </div>
                <div className="absolute right-4 top-3 text-[48px] font-bold leading-none text-white/10 select-none sm:text-[56px]">
                  0{i + 2}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
                <h3 className="text-[19px] font-semibold leading-snug text-zinc-900">
                  {r.title}
                </h3>
                <p className="text-[14px] leading-[1.65] text-zinc-500">
                  {r.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-4 border-t border-zinc-100 pt-4 text-[12px] text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {r.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> Serves {r.serves}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 font-semibold text-zinc-900">
                    Read
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

const FALLBACK_TESTIMONIALS_SECTION = {
  eyebrow: "Trusted in 25,000 kitchens",
  title: "What families actually say",
  description: "From Bengaluru to Dubai to London — the reviews that keep us grinding.",
};

export function Testimonials() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [eyebrow, setEyebrow] = React.useState(FALLBACK_TESTIMONIALS_SECTION.eyebrow);
  const [title, setTitle] = React.useState(FALLBACK_TESTIMONIALS_SECTION.title);
  const [description, setDescription] = React.useState(FALLBACK_TESTIMONIALS_SECTION.description);
  const [dbTestimonials, setDbTestimonials] = React.useState<any[]>([]);

  React.useEffect(() => {
    Promise.all([
      fetch("/api/site-content/testimonials-section").then((r) => r.json()),
      fetch("/api/testimonials").then((r) => r.json()),
    ])
      .then(([contentData, testimonialsData]) => {
        if (contentData.value) {
          try {
            const parsed = JSON.parse(contentData.value);
            if (parsed.eyebrow) setEyebrow(parsed.eyebrow);
            if (parsed.title) setTitle(parsed.title);
            if (parsed.description) setDescription(parsed.description);
          } catch (e) { console.error(e); }
        }
        if (testimonialsData.testimonials) {
          setDbTestimonials(testimonialsData.testimonials);
        }
      })
      .catch((e) => { console.error(e); });
  }, []);

  React.useEffect(() => {
    if (!ref.current) return;
    const o = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-revealed", "");
            o.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    ref.current.querySelectorAll("[data-reveal]").forEach((el) => o.observe(el));
    return () => o.disconnect();
  }, []);

  const activeTestimonials = dbTestimonials.length > 0 ? dbTestimonials.slice(0, 6) : testimonials;

  return (
    <section ref={ref} className="bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-28">
        {/* header */}
        <div
          data-reveal
          style={{ transition: "opacity 0.6s ease, transform 0.6s ease", opacity: 0, transform: "translateY(20px)" }}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.08] tracking-[-0.02em] text-zinc-900 sm:text-[38px] lg:text-[42px]">
            {title}
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-[1.7] text-zinc-500">
            {description}
          </p>
        </div>

        {/* masonry wall */}
        <div
          data-reveal
          className="mt-14 [column-fill:_balance] columns-1 gap-5 sm:columns-2 lg:columns-3"
          style={{ transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s", opacity: 0, transform: "translateY(24px)" }}
        >
          {activeTestimonials.map((t: any, i: number) => {
            const isFeatured = i === 0;
            const hue = [0, 27, 145, 80, 45, 145][i % 6];
            const bgTint = `oklch(0.975 0.012 ${hue})`;

            return (
              <figure
                key={t.id}
                className={`mb-5 inline-block w-full break-inside-avoid flex flex-col rounded-sm border border-zinc-200 ${
                  isFeatured ? "p-7 sm:p-8" : "p-5 sm:p-6"
                }`}
                style={{ background: bgTint }}
              >
                {isFeatured && (
                  <div className="mb-4 text-[60px] font-bold leading-none text-primary/15 select-none">
                    &ldquo;
                  </div>
                )}

                <blockquote
                  className={`flex-1 leading-[1.7] text-zinc-700 ${
                    isFeatured
                      ? "text-[19px] sm:text-[21px]"
                      : "text-[15px]"
                  }`}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <figcaption className={`border-t border-zinc-200/60 ${isFeatured ? "mt-6 pt-5" : "mt-4 pt-4"}`}>
                  <div className="text-[14px] font-semibold text-zinc-900">{t.name}</div>
                  <div className="mt-0.5 text-[12px] text-zinc-400">
                    {t.role} · {t.location}
                  </div>
                  <div className={`inline-block rounded-sm bg-white/70 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary ${
                    isFeatured ? "mt-3" : "mt-2"
                  }`}>
                    {t.product}
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const DEFAULT_IG_CARDS = [
  { id: "ig1", img: "/brand/products/red-curry1.png", label: "Red Curry", url: "https://www.instagram.com/easymomfoods/" },
  { id: "ig2", img: "/brand/products/green-curry1.png", label: "Green Curry", url: "https://www.instagram.com/easymomfoods/" },
  { id: "ig3", img: "/brand/products/pepper-chilli-masala1.png", label: "Pepper Chilli Masala", url: "https://www.instagram.com/easymomfoods/" },
  { id: "ig4", img: "/brand/instagram_image4.png", label: "EasyMom", url: "https://www.instagram.com/easymomfoods/" },
  { id: "ig5", img: "/brand/products/ghee-roast1.png", label: "Ghee Roast", url: "https://www.instagram.com/easymomfoods/" },
  { id: "ig6", img: "/brand/products/fish-curry1.png", label: "Fish Curry", url: "https://www.instagram.com/easymomfoods/" },
  { id: "ig7", img: "/brand/products/palli-curry1.png", label: "Palli Curry", url: "https://www.instagram.com/easymomfoods/" },
];

const CARD_W = 200;
const CARD_W_MOBILE = 140;
const FAN_SPREAD = 100;
const FAN_SPREAD_MOBILE = 60;
function buildFanArrays(count: number) {
  const center = Math.floor(count / 2);
  const maxAngle = 5;
  const rotations: number[] = [];
  const verticalDrop: number[] = [];
  const zIndex: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : (i - center) / center;
    rotations.push(Math.round(t * maxAngle * 100) / 100);
    const dist = Math.abs(i - center);
    verticalDrop.push(Math.round(dist * dist * (30 / (center * center || 1))));
    const zCenter = Math.ceil(count / 2);
    zIndex.push(zCenter - dist);
  }
  return { rotations, verticalDrop, zIndex, center };
}

function getDefaultShadow(i: number, center: number) {
  return i === center
    ? "0 25px 60px -10px rgba(0,0,0,0.18), 0 40px 100px -20px rgba(0,0,0,0.22)"
    : "0 15px 40px -8px rgba(0,0,0,0.12), 0 25px 70px -15px rgba(0,0,0,0.15)";
}

function getHoverValues(i: number, hovered: number, fanSpread: number, center: number, rotations: number[], verticalDrop: number[], zIndex: number[]) {
  const fanX = (i - center) * fanSpread;
  const fanY = verticalDrop[i] ?? 0;
  const fanR = rotations[i] ?? 0;
  const fanZ = zIndex[i] ?? 0;
  if (i === hovered) {
    return { x: fanX, y: fanY, r: 0, s: 1.05, z: 100, o: 1, shadow: "0 30px 70px -10px rgba(0,0,0,0.22), 0 50px 110px -25px rgba(0,0,0,0.28)" };
  }
  const away = i < hovered ? -1 : 1;
  const dist = Math.max(Math.abs(i - hovered), 1);
  const shift = dist === 1 ? 26 : dist === 2 ? 16 : 8;
  return {
    x: fanX + away * shift,
    y: fanY + 4,
    r: fanR,
    s: 0.97,
    z: fanZ,
    o: 0.45,
    shadow: "0 8px 24px -6px rgba(0,0,0,0.1), 0 14px 40px -10px rgba(0,0,0,0.12)",
  };
}

export function InstagramFeed() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [revealedPairs, setRevealedPairs] = React.useState(0);
  const [animDone, setAnimDone] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  const [eyebrow, setEyebrow] = React.useState("@easymomfoods");
  const [title, setTitle] = React.useState("Instagram Feeds");
  const [followText, setFollowText] = React.useState("Follow EasyMom");
  const [socialLinks, setSocialLinks] = React.useState(["Instagram", "YouTube", "TikTok", "Twitter"]);
  const [igCards, setIgCards] = React.useState(DEFAULT_IG_CARDS);

  React.useEffect(() => {
    fetch("/api/site-content/instagram-feed")
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          try {
            const parsed = JSON.parse(d.value);
            if (parsed.eyebrow) setEyebrow(parsed.eyebrow);
            if (parsed.title) setTitle(parsed.title);
            if (parsed.followText) setFollowText(parsed.followText);
            if (parsed.socialLinks) setSocialLinks(parsed.socialLinks);
            if (parsed.cards && parsed.cards.length > 0) setIgCards(parsed.cards);
          } catch (e) { console.error(e); }
        }
      })
      .catch((e) => { console.error(e); });
  }, []);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  React.useEffect(() => {
    if (!isInView) return;
    const t = setTimeout(() => setRevealedPairs(3), 100);
    const t2 = setTimeout(() => setAnimDone(true), 1200);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [isInView]);

  const { rotations, verticalDrop, zIndex, center } = React.useMemo(
    () => buildFanArrays(igCards.length),
    [igCards.length]
  );

  function getCardState(i: number) {
    const fanSpread = isMobile ? FAN_SPREAD_MOBILE : FAN_SPREAD;
    const fanX = (i - center) * fanSpread;
    const fanY = verticalDrop[i] ?? 0;
    const fanR = rotations[i] ?? 0;
    const fanZ = zIndex[i] ?? 0;
    const dist = Math.abs(i - center);

    if (i === center) {
      if (!isInView) return { x: 0, y: 0, r: 0, s: 1, z: igCards.length, o: 1, shadow: getDefaultShadow(i, center) };
      if (hovered !== null && animDone) return getHoverValues(i, hovered, fanSpread, center, rotations, verticalDrop, zIndex);
      return { x: fanX, y: fanY, r: fanR, s: 1.04, z: fanZ, o: 1, shadow: getDefaultShadow(i, center) };
    }

    if (!isInView || dist > revealedPairs) {
      return { x: 0, y: 0, r: 0, s: 0.96, z: 0, o: 0, shadow: "none" };
    }

    if (hovered !== null && animDone) return getHoverValues(i, hovered, fanSpread, center, rotations, verticalDrop, zIndex);
    return { x: fanX, y: fanY, r: fanR, s: 1, z: fanZ, o: 1, shadow: getDefaultShadow(i, center) };
  }

  return (
    <section ref={sectionRef} className="overflow-hidden bg-zinc-50/60 py-24 sm:py-32 lg:py-44">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-16">
        <div
          className="mb-16 sm:mb-24"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.08] tracking-[-0.02em] text-zinc-900 sm:text-[38px] lg:text-[42px]">
            {title}
          </h2>
        </div>

        <div
          className="relative mx-auto flex items-end justify-center"
          style={{ height: isMobile ? "280px" : "420px", maxWidth: isMobile ? "400px" : "780px" }}
        >
          {igCards.map((card, i) => {
            const s = getCardState(i);
            const dist = Math.abs(i - center);
            const pairDelay = dist * 0.07;

            return (
              <motion.div
                key={card.id}
                className="absolute"
                style={{
                  width: isMobile ? CARD_W_MOBILE : CARD_W,
                  bottom: 0,
                  left: "50%",
                  marginLeft: -(isMobile ? CARD_W_MOBILE : CARD_W) / 2,
                  cursor: animDone ? "pointer" : "default",
                }}
                animate={{
                  x: s.x,
                  y: s.y,
                  rotate: s.r,
                  scale: s.s,
                  zIndex: s.z,
                  opacity: s.o,
                }}
                transition={{
                  ease: [0.25, 1, 0.5, 1],
                  duration: 0.7,
                  delay: pairDelay,
                }}
                onHoverStart={() => !isMobile && animDone && setHovered(i)}
                onHoverEnd={() => !isMobile && setHovered(null)}
                onTap={() => isMobile && animDone && setHovered(hovered === i ? null : i)}
              >
                {isMobile ? (
                <div
                  className="overflow-hidden rounded-[30px]"
                  style={{
                    boxShadow: s.shadow,
                    transition: "box-shadow 0.55s cubic-bezier(0.33,1,0.68,1)",
                  }}
                >
                  <div className="relative aspect-[9/16] overflow-hidden bg-zinc-100">
                    <img
                      src={card.img}
                      alt={card.label}
                      className="h-full w-full object-cover"
                      style={{
                        transform: hovered === i && animDone ? "scale(1.04)" : "scale(1)",
                        transition: "transform 0.6s cubic-bezier(0.33,1,0.68,1)",
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                      style={{
                        opacity: hovered === i && animDone ? 1 : 0,
                        transition: "opacity 0.4s ease",
                      }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 p-5"
                      style={{
                        opacity: hovered === i && animDone ? 1 : 0,
                        transform: hovered === i && animDone ? "translateY(0)" : "translateY(4px)",
                        transition: "opacity 0.35s ease 0.06s, transform 0.35s ease 0.06s",
                      }}
                    >
                      <p className="text-[14px] font-medium text-white">{card.label}</p>
                      <a href={card.url || "https://www.instagram.com/easymomfoods/"} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="mt-1 inline-block text-[11px] text-white/55 underline underline-offset-2">View on Instagram</a>
                    </div>
                  </div>
                </div>
                ) : (
                <a href={card.url || "https://www.instagram.com/easymomfoods/"} target="_blank" rel="noopener noreferrer">
                <div
                  className="overflow-hidden rounded-[30px]"
                  style={{
                    boxShadow: s.shadow,
                    transition: "box-shadow 0.55s cubic-bezier(0.33,1,0.68,1)",
                  }}
                >
                  <div className="relative aspect-[9/16] overflow-hidden bg-zinc-100">
                    <img
                      src={card.img}
                      alt={card.label}
                      className="h-full w-full object-cover"
                      style={{
                        transform: hovered === i && animDone ? "scale(1.04)" : "scale(1)",
                        transition: "transform 0.6s cubic-bezier(0.33,1,0.68,1)",
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                      style={{
                        opacity: hovered === i && animDone ? 1 : 0,
                        transition: "opacity 0.4s ease",
                      }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 p-5"
                      style={{
                        opacity: hovered === i && animDone ? 1 : 0,
                        transform: hovered === i && animDone ? "translateY(0)" : "translateY(4px)",
                        transition: "opacity 0.35s ease 0.06s, transform 0.35s ease 0.06s",
                      }}
                    >
                      <p className="text-[14px] font-medium text-white">{card.label}</p>
                      <p className="mt-1 text-[11px] text-white/55">View on Instagram</p>
                    </div>
                  </div>
                </div>
                </a>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* social links */}
        <div
          className="mt-12 flex flex-col items-center gap-5 sm:mt-16"
          style={{
            opacity: isInView ? 1 : 0,
            transition: "opacity 0.7s ease 1s",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-zinc-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
              {followText}
            </p>
            <div className="h-px w-12 bg-zinc-300" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {socialLinks.map((name, i) => (
              <React.Fragment key={name}>
                {i > 0 && <span className="hidden text-zinc-200 sm:block">·</span>}
                <a
                  href="#"
                  className="group relative text-[14px] font-medium text-zinc-700 transition-colors hover:text-zinc-900"
                >
                  {name}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-zinc-900 transition-all duration-300 group-hover:w-full" />
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const DEFAULT_TRUST_ITEMS = [
  { icon: "package", title: "Free shipping", sub: "Dispatched in 24 hours" },
  { icon: "leaf", title: "No preservatives, ever", sub: "Read the label — it's a recipe" },
  { icon: "circular-arrow", title: "Easy returns", sub: "Not right? We'll make it right" },
];

const TRUST_ICONS: Record<string, typeof LeafIcon> = {
  package: PackageIcon,
  leaf: LeafIcon,
  "circular-arrow": CircularArrowIcon,
  mortar: MortarIcon,
  flame: FlameIcon,
  shield: ShieldIcon,
};

export function TrustStrip() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [trustItems, setTrustItems] = React.useState(DEFAULT_TRUST_ITEMS);

  React.useEffect(() => {
    fetch("/api/site-content/trust-strip")
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          try {
            const parsed = JSON.parse(d.value);
            if (parsed.items && parsed.items.length > 0) setTrustItems(parsed.items);
          } catch (e) { console.error(e); }
        }
      })
      .catch((e) => { console.error(e); });
  }, []);

  React.useEffect(() => {
    if (!ref.current) return;
    const o = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-revealed", "");
            o.unobserve(e.target);
          }
        }),
      { threshold: 0.15 }
    );
    ref.current.querySelectorAll("[data-reveal]").forEach((el) => o.observe(el));
    return () => o.disconnect();
  }, []);

  const items = trustItems.map((item) => ({
    ...item,
    icon: TRUST_ICONS[item.icon] || PackageIcon,
  }));

  return (
    <section ref={ref} className="border-y border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 sm:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={item.title}
            data-reveal
            className={`flex items-center gap-4 px-8 py-7 sm:justify-center sm:px-6 ${
              i < 2 ? "border-b sm:border-b-0 sm:border-r border-zinc-200" : ""
            }`}
            style={{ transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`, opacity: 0, transform: "translateY(12px)" }}
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/[0.06]">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-zinc-900">{item.title}</div>
              <div className="mt-0.5 text-[12.5px] text-zinc-400">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const FALLBACK_PRODUCTS = [
  { slug: "red-curry", name: "Red Curry", img: "/brand/category/product-1.png" },
  { slug: "fish-curry-masala", name: "Fish Curry", img: "/brand/category/product-2.png" },
  { slug: "green-curry", name: "Green Curry", img: "/brand/category/product-3.png" },
  { slug: "palli-curry", name: "Palli Curry", img: "/brand/category/product-4.png" },
  { slug: "biryani-masala", name: "Biryani Masala", img: "/brand/category/product-5.png" },
  { slug: "pepper-chilli-masala", name: "Pepper Chilli Masala", img: "/brand/category/product-6.png" },
];

export function OurProducts() {
  const go = useUI((s) => s.go);
  const [eyebrow, setEyebrow] = React.useState("Shop by category");
  const [title, setTitle] = React.useState("Our Products");
  const [items, setItems] = React.useState(FALLBACK_PRODUCTS);

  React.useEffect(() => {
    fetch("/api/site-content/our-products")
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          try {
            const parsed = JSON.parse(d.value);
            if (parsed.eyebrow) setEyebrow(parsed.eyebrow);
            if (parsed.title) setTitle(parsed.title);
            if (parsed.items && parsed.items.length > 0) setItems(parsed.items);
          } catch (e) { console.error(e); }
        }
      })
      .catch((e) => { console.error(e); });
  }, []);
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          align="left"
          eyebrow={eyebrow}
          title={title}
        />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-6 lg:gap-4">
          {items.map((p, i) => {
            const shadows = [
              "8px 8px 50px 20px rgba(137,24,22,0.35)",
              "-6px 10px 25px 6px rgba(137,24,22,0.15)",
              "0 8px 40px 14px rgba(137,24,22,0.25)",
              "-10px -4px 60px 25px rgba(137,24,22,0.40)",
              "6px -6px 30px 10px rgba(137,24,22,0.20)",
              "-8px 8px 40px 15px rgba(137,24,22,0.30)",
            ];
            return (
              <motion.button
                key={p.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => go({ name: "product", slug: p.slug })}
                className="group relative flex flex-col overflow-hidden rounded-[6px] bg-card text-left"
                style={{ boxShadow: shadows[i] }}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[5px]">
                  {p.img ? (
                    <img
                      src={p.img}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-stone-200">
                      <PackageOpen className="h-8 w-8 text-stone-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-[17px] font-semibold text-white">{p.name}</h3>
                    <p className="mt-0.5 text-[12px] text-white/70">
                      Shop now <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.05 }}
        className="mt-3 text-balance text-[30px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[40px] lg:text-[44px]"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className={align === "center" ? "mx-auto mt-4 max-w-xl text-pretty text-[16px] leading-relaxed text-muted-foreground" : "mt-4 max-w-xl text-pretty text-[16px] leading-relaxed text-muted-foreground"}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
