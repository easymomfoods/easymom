"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { MapPin, Phone, ArrowUpRight } from "lucide-react";
import { useHomepageData } from "@/lib/page-data-context";

interface Store {
  id: string;
  name: string;
  area: string;
  phone: string;
  image: string;
  storeNumber: string;
}

interface LocationGroup {
  id: string;
  label: string;
  stores: Store[];
}

const FALLBACK_locations: LocationGroup[] = [
  {
    id: "udupi",
    label: "Udupi",
    stores: [
      { id: "u1", name: "EasyMom Pantry — Udupi Central", area: "Car Street, Udupi", phone: "+91 98765 43210", image: "", storeNumber: "01" },
      { id: "u2", name: "Spice Junction", area: "Kalsanka, Udupi", phone: "+91 98765 43211", image: "", storeNumber: "02" },
      { id: "u3", name: "Fresh Mart", area: "Manipal Road, Udupi", phone: "+91 98765 43212", image: "", storeNumber: "03" },
    ],
  },
  {
    id: "krishnapura",
    label: "Krishnapura",
    stores: [
      { id: "k1", name: "Krishnapura General Store", area: "Krishnapura, Udupi", phone: "+91 98765 43213", image: "", storeNumber: "04" },
      { id: "k2", name: "EasyMom Corner", area: "Opposite Temple, Krishnapura", phone: "+91 98765 43214", image: "", storeNumber: "05" },
    ],
  },
];

function StorePlaceholder({ name, index }: { name: string; index: number }) {
  const patterns = [
    "M20 20 L40 0 L60 20 L80 0 L100 20",
    "M0 40 Q25 20 50 40 Q75 60 100 40",
    "M10 50 L30 10 L50 50 L70 10 L90 50",
    "M0 30 C20 10 40 50 60 30 C80 10 100 50 100 30",
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-stone-100">
      <svg
        viewBox="0 0 100 80"
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        preserveAspectRatio="none"
      >
        <path
          d={patterns[index % patterns.length]}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="mx-auto h-6 w-6 text-stone-300" />
          <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-stone-400">
            {name}
          </p>
        </div>
      </div>
    </div>
  );
}

function StoreCard({ store, large }: { store: Store; large?: boolean }) {
  const [imgLoaded, setImgLoaded] = React.useState(false);

  return (
    <div
      className={`group relative flex shrink-0 flex-col ${
        large ? "w-[300px] md:w-[340px]" : "w-[220px] md:w-[260px]"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-stone-100 ${
          large ? "aspect-[4/3]" : "aspect-square"
        }`}
      >
        {store.image ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
            )}
            <img
              src={store.image}
              alt={store.name}
              className={`h-full w-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
            />
          </>
        ) : (
          <StorePlaceholder name={store.name} index={parseInt(store.storeNumber) || 0} />
        )}
        <div className="absolute left-4 top-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
            {store.storeNumber}
          </span>
        </div>
      </div>
      <div className="mt-4 space-y-1.5 px-1">
        <h4 className="text-[15px] font-semibold leading-tight text-stone-900">
          {store.name}
        </h4>
        <p className="flex items-center gap-1.5 text-[12px] text-stone-500">
          <MapPin className="h-3 w-3 shrink-0" />
          {store.area}
        </p>
        <p className="flex items-center gap-1.5 text-[12px] text-stone-500">
          <Phone className="h-3 w-3 shrink-0" />
          {store.phone}
        </p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.area + ", India")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 pt-1 text-[12px] font-medium text-[#891816] hover:underline"
        >
          Get Directions <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

function IntroSlide() {
  return (
    <div className="flex h-full w-[85vw] max-w-[600px] shrink-0 flex-col justify-center pr-12 md:pr-20">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#891816]">
        Available Near You
      </p>
      <h2 className="mt-4 text-[48px] font-semibold leading-[1.0] tracking-[-0.03em] text-stone-900 sm:text-[64px] md:text-[80px]">
        FIND
        <br />
        EASYMOM
        <br />
        NEAR YOU
      </h2>
      <p className="mt-6 max-w-[380px] text-[15px] leading-relaxed text-stone-500">
        Your favourite EasyMom products are now available at selected stores near you.
      </p>
      <div className="mt-10 flex items-center gap-3">
        <div className="h-px w-8 bg-stone-300" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
          Scroll to explore →
        </span>
      </div>
    </div>
  );
}

function EndSlide() {
  return (
    <div className="flex h-full w-[60vw] max-w-[400px] shrink-0 flex-col justify-center pl-12 md:pl-20">
      <div className="h-px w-12 bg-stone-200" />
      <p className="mt-6 text-[13px] leading-relaxed text-stone-400">
        Can't find a store near you? We supply to local stores — let us know and we'll try to set one up near you.
      </p>
      <a
        href="mailto:easymomfoods@gmail.com"
        className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#891816] hover:underline"
      >
        Get in touch <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

export default function AvailableNearYou() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeLocation, setActiveLocation] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);
  const containerWidthRef = useRef(0);
  const scrollWidthRef = useRef(0);
  const [locations, setLocations] = useState<LocationGroup[]>(FALLBACK_locations);
  const initData = useHomepageData();

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 768px)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsMobile(mqMobile.matches);
    setPrefersReducedMotion(mqReduced.matches);

    const onMobileChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    const onReducedChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mqMobile.addEventListener("change", onMobileChange);
    mqReduced.addEventListener("change", onReducedChange);
    return () => {
      mqMobile.removeEventListener("change", onMobileChange);
      mqReduced.removeEventListener("change", onReducedChange);
    };
  }, []);

  useEffect(() => {
    if (initData?.siteContent?.["store-locations"]) {
      try {
        const parsed = JSON.parse(initData.siteContent["store-locations"]);
        if (Array.isArray(parsed) && parsed.length > 0) setLocations(parsed);
      } catch (e) { console.error(e); }
      return;
    }
    fetch("/api/site-content/store-locations")
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          try {
            const parsed = JSON.parse(d.value);
            if (Array.isArray(parsed) && parsed.length > 0) setLocations(parsed);
          } catch (e) { console.error(e); }
        }
      })
      .catch((e) => { console.error(e); });
  }, [initData]);

  useEffect(() => {
    if (!scrollContainerRef.current || !sectionRef.current) return;
    const measure = () => {
      if (scrollContainerRef.current && sectionRef.current) {
        const cw = sectionRef.current.offsetWidth;
        const sw = scrollContainerRef.current.scrollWidth;
        setContainerWidth(cw);
        setScrollWidth(sw);
        containerWidthRef.current = cw;
        scrollWidthRef.current = sw;
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isMobile, locations]);

  useEffect(() => {
    if (!scrollContainerRef.current || !sectionRef.current) return;
    const timer = setTimeout(() => {
      if (scrollContainerRef.current && sectionRef.current) {
        const cw = sectionRef.current.offsetWidth;
        const sw = scrollContainerRef.current.scrollWidth;
        setContainerWidth(cw);
        setScrollWidth(sw);
        containerWidthRef.current = cw;
        scrollWidthRef.current = sw;
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [locations]);

  useEffect(() => {
    const handler = () => {
      if (scrollContainerRef.current && sectionRef.current) {
        const cw = sectionRef.current.offsetWidth;
        const sw = scrollContainerRef.current.scrollWidth;
        setContainerWidth(cw);
        setScrollWidth(sw);
        containerWidthRef.current = cw;
        scrollWidthRef.current = sw;
      }
    };
    window.addEventListener("load", handler);
    return () => window.removeEventListener("load", handler);
  }, []);

  const horizontalDistance = Math.max(scrollWidth - containerWidth, 0);

  const sectionHeight = horizontalDistance > 0
    ? horizontalDistance + (typeof window !== "undefined" ? window.innerHeight : 800) + 200
    : 800;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -horizontalDistance]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (prefersReducedMotion) return;

    const totalStores = locations.reduce((sum, loc) => sum + loc.stores.length, 0);
    const introPortion = containerWidth / (scrollWidth || 1);
    const endPortion = 200 / (scrollWidth || 1);
    const contentStart = introPortion;
    const contentEnd = 1 - endPortion;
    const contentProgress = Math.max(0, Math.min(1, (latest - contentStart) / (contentEnd - contentStart)));

    let cumulative = 0;
    for (let i = 0; i < locations.length; i++) {
      cumulative += locations[i].stores.length / totalStores;
      if (contentProgress <= cumulative) {
        setActiveLocation(i);
        break;
      }
    }
  });

  const scrollToLocation = useCallback(
    (index: number) => {
      if (!sectionRef.current) return;

      const totalStores = locations.reduce((sum, loc) => sum + loc.stores.length, 0);
      let storesBefore = 0;
      for (let i = 0; i < index; i++) {
        storesBefore += locations[i].stores.length;
      }
      const targetProgress = storesBefore / totalStores;

      const introPortion = containerWidth / (scrollWidth || 1);
      const endPortion = 200 / (scrollWidth || 1);
      const contentStart = introPortion;
      const contentEnd = 1 - endPortion;
      const scrollTarget = contentStart + targetProgress * (contentEnd - contentStart);

      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const targetScrollY = sectionTop + scrollTarget * (sectionHeight - viewportHeight);

      window.scrollTo({ top: targetScrollY, behavior: "smooth" });
    },
    [containerWidth, scrollWidth]
  );

  return (
    <section ref={sectionRef} className="relative bg-white" style={{ height: `${sectionHeight}px` }}>
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden pt-16">
        {/* Location nav */}
        <div className="flex items-center gap-1.5 bg-white/80 px-5 py-3 backdrop-blur-md sm:px-8 md:px-12">
          {locations.map((loc, i) => (
            <button
              key={loc.id}
              onClick={() => scrollToLocation(i)}
              className={`rounded-[3px] px-3.5 py-2 text-[12px] font-medium transition ${
                activeLocation === i
                  ? "bg-[#891816] text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {loc.label}
            </button>
          ))}
        </div>

        {/* Horizontal scroll track */}
        <motion.div
          ref={scrollContainerRef}
          style={{ x }}
          className="flex flex-1 items-center gap-12 pl-5 sm:pl-8 md:pl-12"
        >
          <IntroSlide />

          {locations.map((loc, locIdx) => (
            <React.Fragment key={loc.id}>
              {/* Location divider */}
              <div className="flex h-full shrink-0 flex-col items-center justify-center px-4">
                <div className="h-16 w-px bg-stone-200" />
                <span className="my-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 [writing-mode:vertical-lr]">
                  {loc.label}
                </span>
                <div className="h-16 w-px bg-stone-200" />
              </div>

              {/* Store cards — editorial asymmetric layout */}
              {loc.stores.map((store, storeIdx) => {
                const isLarge = storeIdx % 3 === 0;
                const isOffset = storeIdx % 2 === 1;
                return (
                  <div
                    key={store.id}
                    className={`shrink-0 self-center ${isOffset ? "mt-10" : "mb-10"}`}
                  >
                    <StoreCard store={store} large={isLarge} />
                  </div>
                );
              })}
            </React.Fragment>
          ))}

          <EndSlide />
        </motion.div>
      </div>
    </section>
  );
}
