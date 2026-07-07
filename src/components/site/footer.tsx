"use client";

import {
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { useUI } from "@/lib/ui-store";

const SHOP_LINKS = [
  { label: "Green Curry", view: { name: "shop" as const, categoryId: "green-curry" } },
  { label: "Ghee Roast Masala", view: { name: "shop" as const, categoryId: "ghee-roast" } },
  { label: "Fish Curry Masala", view: { name: "shop" as const, categoryId: "fish-curry" } },
  { label: "Red Curry", view: { name: "shop" as const, categoryId: "red-curry" } },
  { label: "Chicken Sukka", view: { name: "shop" as const, categoryId: "chicken-sukka" } },
];

const COMPANY_LINKS = [
  { label: "Our story", view: { name: "about" as const } },
  { label: "Recipes", view: { name: "recipes" as const } },
  { label: "FAQ", view: { name: "faq" as const } },
  { label: "Contact us", view: { name: "faq" as const } },
];

const POLICY_LINKS = [
  { label: "Shipping policy", view: { name: "faq" as const } },
  { label: "Returns & refunds", view: { name: "faq" as const } },
  { label: "Privacy policy", view: { name: "faq" as const } },
  { label: "Terms of service", view: { name: "faq" as const } },
];

const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export function Footer() {
  const go = useUI((s) => s.go);

  return (
    <footer className="border-t border-zinc-100 bg-white">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-16">

        {/* ── Top section ── */}
        <div className="grid grid-cols-1 gap-8 py-10 sm:gap-12 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">

          {/* Brand column */}
          <div className="lg:col-span-5">
            <button onClick={() => go({ name: "home" })} className="inline-block">
              <img
                src="/brand/easymom-logo.png"
                alt="EasyMom"
                className="h-20 sm:h-24 lg:h-28 w-auto"
              />
            </button>
            <p className="mt-5 max-w-sm text-[14px] leading-[1.7] text-zinc-500">
              Authentic South Indian masalas, ground fresh in small batches.
              Homemade flavour, built for the modern stove.
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-2.5 text-[13px] text-zinc-500">
              <a href="mailto:hello@easymom.in" className="flex items-center gap-2.5 transition hover:text-zinc-900">
                <Mail className="h-4 w-4 text-primary" /> hello@easymom.in
              </a>
              <a href="tel:+918012345678" className="flex items-center gap-2.5 transition hover:text-zinc-900">
                <Phone className="h-4 w-4 text-primary" /> +91 80 1234 5678
              </a>
              <p className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-primary" /> Mangalore, Karnataka 575001
              </p>
            </div>

            {/* Socials */}
            <div className="mt-6 flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  onClick={(e) => e.preventDefault()}
                  className="grid h-11 w-11 place-items-center rounded-full border border-zinc-200 text-zinc-400 transition-all duration-200 hover:border-primary/40 hover:text-primary hover:shadow-sm"
                  aria-label={s.label}
                >
                  <s.icon className="h-[16px] w-[16px]" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8">

            {/* Shop */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-900">
                Shop
              </h4>
              <ul className="mt-4 space-y-2.5">
                {SHOP_LINKS.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => go(l.view)}
                      className="group flex items-center gap-1 text-[13.5px] text-zinc-500 transition hover:text-zinc-900"
                    >
                      {l.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-900">
                Company
              </h4>
              <ul className="mt-4 space-y-2.5">
                {COMPANY_LINKS.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => go(l.view)}
                      className="group flex items-center gap-1 text-[13.5px] text-zinc-500 transition hover:text-zinc-900"
                    >
                      {l.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-900">
                Legal
              </h4>
              <ul className="mt-4 space-y-2.5">
                {POLICY_LINKS.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => go(l.view)}
                      className="group flex items-center gap-1 text-[13.5px] text-zinc-500 transition hover:text-zinc-900"
                    >
                      {l.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-zinc-100 py-5">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-[12px] text-zinc-400" suppressHydrationWarning>
              © {new Date().getFullYear()} EasyMom Foods Pvt. Ltd. · Made in Mangalore.
            </p>
            <div className="flex items-center gap-4 text-[12px] text-zinc-400">
              <span>FSSAI Lic. 10024051000678</span>
              <span className="h-3 w-px bg-zinc-200" />
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Secure checkout
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
