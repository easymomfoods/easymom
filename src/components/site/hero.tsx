"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useUI } from "@/lib/ui-store";

export function Hero() {
  const go = useUI((s) => s.go);
  const [count, setCount] = React.useState(0);
  const [countDone, setCountDone] = React.useState(false);
  const statRef = React.useRef<HTMLDivElement>(null);

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
          if (cur >= 42) {
            clearInterval(id);
            setCountDone(true);
          }
        }, 35);
      },
      { threshold: 0.5 }
    );
    o.observe(statRef.current);
    return () => o.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-4">
      {/* ── Background Marquee ── */}
      <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden opacity-[0.03]">
        <div className="flex shrink-0 animate-marquee items-center gap-8 whitespace-nowrap">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="text-[80px] font-bold uppercase tracking-tight text-zinc-900 select-none sm:text-[120px] lg:text-[160px]">
              SMALL-BATCH&nbsp;&nbsp;·&nbsp;&nbsp;STONE-GROUND&nbsp;&nbsp;·&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* ── Image ── */}
          <div className="relative overflow-hidden rounded-sm lg:col-span-7">
            <div className="grain">
              <img
                src="/brand/easymom-banner.png"
                alt="EasyMom — Authentic South Indian masala spices"
                className="w-full object-cover"
                fetchPriority="high"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/40" />

            {/* stat badge */}
            <div
              ref={statRef}
              className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8"
            >
              <div className="relative flex items-center gap-3">
                <div className="absolute -inset-2.5 rounded-full border-[1.5px] border-white/25" />
                <div className="grid h-16 w-16 place-items-center rounded-full bg-white/15 backdrop-blur-sm sm:h-[72px] sm:w-[72px]">
                  <span className="text-[20px] font-bold text-white tabular-nums sm:text-[22px]">
                    {countDone ? "42K+" : `${count}K+`}
                  </span>
                </div>
                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/70">
                  Kitchens<br />trust&nbsp;us
                </span>
              </div>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="flex flex-col gap-6 py-4 lg:col-span-5 lg:pl-4">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">
                EasyMom Foods
              </p>
              <h1 className="mt-3 text-[34px] font-semibold leading-[1.06] tracking-[-0.025em] text-zinc-900 sm:text-[42px] lg:text-[48px]">
                South Indian
                <br />
                Masala
              </h1>
              <p className="mt-4 max-w-sm text-[15px] leading-[1.7] text-zinc-500">
                Stone-ground in small batches under 20kg. The way your grandmother made it, just scaled enough to reach your kitchen.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => go({ name: "shop" })}
                className="group inline-flex h-12 items-center gap-2 rounded-sm bg-zinc-900 px-6 text-[14px] font-medium text-white transition-colors hover:bg-zinc-800"
              >
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => go({ name: "about" })}
                className="inline-flex h-12 items-center gap-2 rounded-sm border border-zinc-200 px-6 text-[14px] font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900"
              >
                Our Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
