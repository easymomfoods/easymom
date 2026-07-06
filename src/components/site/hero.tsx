"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, Clock } from "lucide-react";
import { useUI } from "@/lib/ui-store";
import { brandStats } from "@/lib/data";

export function Hero() {
  const go = useUI((s) => s.go);
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-foreground">
      {/* background image with slow zoom */}
      <div className="absolute inset-0">
        <img
          src="/brand/hero-spices.png"
          alt="Authentic South Indian masala spices — red chilli and turmeric on warm linen"
          className="h-full w-full animate-slow-zoom object-cover"
          fetchPriority="high"
        />
        {/* gradient veils for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-foreground/30" />
      </div>

      {/* content */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-[1280px] flex-col justify-center px-4 pb-28 pt-28 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
          }}
          className="max-w-2xl"
        >
          <motion.div
            variants={fade}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-turmeric" />
            <span className="text-[12px] font-medium tracking-wide text-white/90">
              Small-batch · Stone-ground · From Mangalore & Kerala
            </span>
          </motion.div>

          <motion.h1
            variants={fade}
            className="text-balance text-[40px] font-semibold leading-[1.04] tracking-[-0.025em] text-white sm:text-[56px] lg:text-[72px]"
          >
            The taste of a
            <br />
            <span className="bg-gradient-to-r from-[oklch(0.85_0.10_75)] via-[oklch(0.80_0.11_70)] to-[oklch(0.82_0.10_82)] bg-clip-text text-transparent">
              South Indian kitchen,
            </span>
            <br />
            made effortless.
          </motion.h1>

          <motion.p
            variants={fade}
            className="mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-white/90 sm:text-[18px]"
          >
            Authentic masalas from Mangalore, Kerala and Chettinad — ground fresh,
            blended in small batches, built for the modern stove. Homemade flavour
            in the time it takes to set the table.
          </motion.p>

          <motion.div variants={fade} className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={() => go({ name: "shop" })}
              className="group inline-flex items-center gap-2 rounded-[4px] bg-white px-6 py-3.5 text-sm font-semibold text-foreground shadow-premium transition hover:bg-white/90"
            >
              Shop the collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => go({ name: "recipes" })}
              className="inline-flex items-center gap-2 rounded-[4px] border border-white/25 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
            >
              Explore recipes
            </button>
          </motion.div>

          <motion.div
            variants={fade}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-white/85"
          >
            <div className="flex items-center gap-2">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-turmeric text-turmeric" />
                ))}
              </div>
              <span className="text-[13px]">
                <strong className="font-semibold text-white">4.8</strong> · 3,200+ reviews
              </span>
            </div>
            <div className="hidden h-4 w-px bg-white/20 sm:block" />
            <div className="flex items-center gap-2 text-[13px]">
              <Clock className="h-4 w-4 text-turmeric" />
              From pouch to plate in 15 minutes
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
        className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-foreground/40 backdrop-blur-md"
      >
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
          {brandStats.map((s) => (
            <div key={s.label} className="px-4 py-4 text-center sm:px-6 sm:py-5">
              <div className="text-[22px] font-semibold tracking-tight text-white sm:text-[26px]">
                {s.value}
              </div>
              <div className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-white/60 sm:text-[12px]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};
