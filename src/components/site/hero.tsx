"use client";

import React, { useEffect, useState } from "react";

interface HeroData {
  desktopImage: string;
  mobileImage: string;
  statNumber: string;
  statLabel: string;
  heading: string;
  subtitle: string;
}

const fallback: HeroData = {
  desktopImage: "/brand/easymom-banner.png",
  mobileImage: "/brand/easymom-hero-mobile.png",
  statNumber: "42,000+",
  statLabel: "Kitchens trust us",
  heading: "",
  subtitle: "",
};

export function Hero() {
  const [hero, setHero] = useState<HeroData>(fallback);
  const [count, setCount] = useState(0);
  const [countDone, setCountDone] = useState(false);
  const statRef = React.useRef<HTMLDivElement>(null);
  const heroRef = React.useRef<HTMLDivElement>(null);

  // Load hero content from API
  useEffect(() => {
    fetch("/api/site-content/hero")
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          try {
            const parsed = JSON.parse(d.value);
            setHero({ ...fallback, ...parsed });
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  // Animate stat counter
  useEffect(() => {
    if (!statRef.current) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        o.disconnect();

        // Parse target number from string like "42,000+"
        const numStr = hero.statNumber.replace(/[^0-9]/g, "");
        const target = parseInt(numStr) || 42000;
        const isThousands = hero.statNumber.includes(",");
        const duration = 1600;
        const startTime = performance.now();

        const step = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const cur = Math.round(eased * target);

          if (isThousands) {
            setCount(cur);
          } else {
            setCount(cur);
          }

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            setCountDone(true);
          }
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.5 }
    );
    o.observe(statRef.current);
    return () => o.disconnect();
  }, [hero.statNumber]);

  // Reveal animation
  useEffect(() => {
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

  // Format displayed count
  function formatCount() {
    if (countDone) return hero.statNumber;
    if (count === 0) return "0";
    if (hero.statNumber.includes(",")) {
      return count.toLocaleString("en-IN") + "+";
    }
    return String(count) + "+";
  }

  return (
    <section ref={heroRef} className="relative mt-16 h-[calc(100vh-64px)] min-h-[400px] overflow-hidden bg-zinc-950">
      {/* ── Full-bleed image ── */}
      <div className="absolute inset-0">
        <div className="grain h-full w-full">
          <picture>
            <source media="(max-width: 639px)" srcSet={hero.mobileImage} />
            <img
              src={hero.desktopImage}
              alt="EasyMom — Authentic South Indian masala spices"
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
          </picture>
        </div>
      </div>

      {/* ── Gradient overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      {/* ── Optional heading overlay ── */}
      {hero.heading && (
        <div className="absolute top-1/3 left-0 z-10 w-full px-5 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1200px]">
            <h1
              data-reveal
              className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight max-w-2xl"
              style={{ transition: "opacity 0.8s ease, transform 0.8s ease", opacity: 0, transform: "translateY(20px)" }}
            >
              {hero.heading}
            </h1>
            {hero.subtitle && (
              <p
                data-reveal
                className="mt-4 text-base sm:text-lg text-white/70 max-w-xl"
                style={{ transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s", opacity: 0, transform: "translateY(20px)" }}
              >
                {hero.subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="absolute bottom-0 left-0 z-10 w-full px-5 pb-8 sm:px-10 sm:pb-12 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            {/* stat + scroll hint */}
            <div
              data-reveal
              className="flex flex-col items-start gap-4 lg:items-end lg:ml-auto"
              style={{ transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s", opacity: 0, transform: "translateY(20px)" }}
            >
              <div ref={statRef} className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[28px] font-bold leading-none text-white tabular-nums sm:text-[38px] lg:text-[46px]">
                    {formatCount()}
                  </div>
                  <div className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
                    {hero.statLabel}
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
