"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useUI } from "@/lib/ui-store";

function RotatingBadge() {
  const text = "SMALL-BATCH · STONE-GROUND · SOUTH INDIAN · ";
  const repeated = text.repeat(3);
  return (
    <div className="absolute right-6 top-24 z-20 hidden h-28 w-28 animate-[spin_18s_linear_infinite] sm:right-10 sm:top-28 sm:block lg:right-14 lg:top-32">
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <defs>
          <path id="rb" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        <text className="fill-white/50" style={{ fontSize: "8.5px", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase" }}>
          <textPath href="#rb">{repeated}</textPath>
        </text>
      </svg>
    </div>
  );
}

export function Hero() {
  const go = useUI((s) => s.go);
  const [count, setCount] = React.useState(0);
  const [countDone, setCountDone] = React.useState(false);
  const statRef = React.useRef<HTMLDivElement>(null);
  const heroRef = React.useRef<HTMLDivElement>(null);

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

  React.useEffect(() => {
    if (!heroRef.current) return;
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
    heroRef.current.querySelectorAll("[data-reveal]").forEach((el) => o.observe(el));
    return () => o.disconnect();
  }, []);

  return (
    <section ref={heroRef} className="relative h-[calc(100vh-80px)] min-h-[540px] overflow-hidden bg-zinc-950">
      {/* ── Full-bleed image ── */}
      <div className="absolute inset-0">
        <div className="grain h-full w-full">
          <img
            src="/brand/easymom-banner.png"
            alt="EasyMom — Authentic South Indian masala spices"
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </div>
      </div>

      {/* ── Gradient overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      {/* ── Rotating badge ── */}
      <RotatingBadge />

      {/* ── Brand name ── */}
      <div
        data-reveal
        className="absolute left-6 top-24 z-10 sm:left-10 sm:top-28 lg:left-16 lg:top-32"
        style={{ transition: "opacity 0.8s ease, transform 0.8s ease", opacity: 0, transform: "translateY(16px)" }}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
          EasyMom Foods
        </span>
      </div>

      {/* ── Main content ── */}
      <div className="absolute bottom-0 left-0 z-10 w-full px-6 pb-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            {/* headline + description */}
            <div className="max-w-2xl">
              <div
                data-reveal
                style={{ transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s", opacity: 0, transform: "translateY(24px)" }}
              >
                <h1 className="text-[48px] font-semibold leading-[0.92] tracking-[-0.03em] text-white sm:text-[68px] lg:text-[88px] xl:text-[100px]">
                  South Indian
                  <br />
                  <span className="text-white/85">Masala</span>
                </h1>
              </div>
              <p
                data-reveal
                className="mt-5 max-w-md text-[15px] leading-[1.7] text-white/55 sm:text-[16px]"
                style={{ transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s", opacity: 0, transform: "translateY(20px)" }}
              >
                Stone-ground in small batches under 20kg. The way your grandmother made it, just scaled enough to reach your kitchen.
              </p>
              <div
                data-reveal
                className="mt-7 flex flex-wrap items-center gap-3"
                style={{ transition: "opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s", opacity: 0, transform: "translateY(20px)" }}
              >
                <button
                  onClick={() => go({ name: "shop" })}
                  className="group inline-flex h-13 items-center gap-2.5 rounded-sm bg-white px-7 text-[14px] font-medium text-zinc-900 transition-all duration-300 hover:bg-white/90 hover:shadow-lg hover:shadow-white/10"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => go({ name: "about" })}
                  className="inline-flex h-13 items-center gap-2 rounded-sm border border-white/20 px-7 text-[14px] font-medium text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:text-white"
                >
                  Our Story
                </button>
              </div>
            </div>

            {/* stat + scroll hint */}
            <div
              data-reveal
              className="flex flex-col items-start gap-4 lg:items-end"
              style={{ transition: "opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s", opacity: 0, transform: "translateY(20px)" }}
            >
              <div ref={statRef} className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[38px] font-bold leading-none text-white tabular-nums sm:text-[46px]">
                    {countDone ? "42,000+" : `${count.toLocaleString()}+`}
                  </div>
                  <div className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
                    Kitchens trust&nbsp;us
                  </div>
                </div>
              </div>
              <div className="hidden items-center gap-2 text-[11px] text-white/30 sm:flex">
                <div className="h-8 w-px bg-white/15" />
                Scroll to explore
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
