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
import { useEffect, useState } from "react";
import { useHomepageData } from "@/lib/page-data-context";

const SHOP_LINKS = [
  { label: "Green Curry", view: { name: "shop" as const, categoryId: "green-curry" } },
  { label: "Ghee Roast Masala", view: { name: "shop" as const, categoryId: "ghee-roast" } },
  { label: "Fish Curry Masala", view: { name: "shop" as const, categoryId: "fish-curry" } },
  { label: "Fish Fry Masala", view: { name: "shop" as const, categoryId: "fish-fry" } },
  { label: "Red Curry", view: { name: "shop" as const, categoryId: "red-curry" } },
  { label: "Pepper Chilli Masala", view: { name: "shop" as const, categoryId: "pepper-chilli" } },
  { label: "Palli Curry", view: { name: "shop" as const, categoryId: "palli-curry" } },
  { label: "Biryani Masala", view: { name: "shop" as const, categoryId: "biryani-masala" } },
];

const COMPANY_LINKS = [
  { label: "Our story", view: { name: "about" as const } },
  { label: "Recipes", view: { name: "recipes" as const } },
  { label: "FAQ", view: { name: "faq" as const } },
  { label: "Track order", view: { name: "track-order" as const } },
  { label: "Contact us", view: { name: "faq" as const } },
];

const POLICY_LINKS = [
  { label: "Shipping policy", view: { name: "faq" as const } },
  { label: "Returns & refunds", view: { name: "faq" as const } },
  { label: "Privacy policy", view: { name: "privacy" as const } },
  { label: "Terms of service", view: { name: "terms" as const } },
];

const SOCIAL_ICONS: Record<string, typeof Instagram> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Instagram,
  whatsapp: Phone,
};

const DEFAULTS = {
  tagline: "Authentic South Indian masalas, ground fresh in small batches. Homemade flavour, built for the modern stove.",
  email: "easymomfoods@gmail.com",
  phone: "+91 99012 61232",
  address: "Mangalore, Karnataka 575001",
  socials: [
    { platform: "instagram", label: "Instagram", href: "https://www.instagram.com/easymomfoods/" },
    { platform: "youtube", label: "YouTube", href: "#" },
    { platform: "twitter", label: "Twitter", href: "#" },
  ],
  whatsapp: "",
  fssai: "21225066000075",
};

export function Footer() {
  const go = useUI((s) => s.go);
  const [footer, setFooter] = useState(DEFAULTS);
  const initData = useHomepageData();

  useEffect(() => {
    if (initData?.siteContent) {
      const sc = initData.siteContent;
      const parsed: Record<string, any> = {};
      if (sc.footer) { try { Object.assign(parsed, JSON.parse(sc.footer)); } catch {} }
      const socials: any[] = [];
      if (sc.social_instagram) socials.push({ platform: "instagram", label: "Instagram", href: sc.social_instagram });
      if (sc.social_youtube) socials.push({ platform: "youtube", label: "YouTube", href: sc.social_youtube });
      if (sc.social_twitter) socials.push({ platform: "twitter", label: "Twitter", href: sc.social_twitter });
      if (sc.social_facebook) socials.push({ platform: "facebook", label: "Facebook", href: sc.social_facebook });
      if (socials.length > 0) parsed.socials = socials;
      if (sc.whatsapp_number) parsed.whatsapp = `https://wa.me/91${sc.whatsapp_number}`;
      setFooter({ ...DEFAULTS, ...parsed });
      return;
    }
    Promise.all([
      fetch("/api/site-content/footer").then((r) => r.json()),
      fetch("/api/site-content/social_instagram").then((r) => r.json()),
      fetch("/api/site-content/social_facebook").then((r) => r.json()),
      fetch("/api/site-content/social_twitter").then((r) => r.json()),
      fetch("/api/site-content/social_youtube").then((r) => r.json()),
      fetch("/api/site-content/whatsapp_number").then((r) => r.json()),
    ])
      .then(([footer, ig, fb, tw, yt, wa]) => {
        const parsed = footer.value ? (() => { try { return JSON.parse(footer.value); } catch { return {}; } })() : {};
        const socials = [
          ig.value ? { platform: "instagram", label: "Instagram", href: ig.value } : null,
          yt.value ? { platform: "youtube", label: "YouTube", href: yt.value } : null,
          tw.value ? { platform: "twitter", label: "Twitter", href: tw.value } : null,
          fb.value ? { platform: "facebook", label: "Facebook", href: fb.value } : null,
        ].filter(Boolean);
        if (socials.length > 0) parsed.socials = socials;
        if (wa.value) parsed.whatsapp = `https://wa.me/91${wa.value}`;
        setFooter({ ...DEFAULTS, ...parsed });
      })
      .catch(() => {});
  }, [initData]);

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
              {footer.tagline}
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-2.5 text-[13px] text-zinc-500">
              <a href={`mailto:${footer.email}`} className="flex items-center gap-2.5 transition hover:text-zinc-900">
                <Mail className="h-4 w-4 text-primary" /> {footer.email}
              </a>
              <a href={`tel:${footer.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 transition hover:text-zinc-900">
                <Phone className="h-4 w-4 text-primary" /> {footer.phone}
              </a>
              <p className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-primary" /> {footer.address}
              </p>
            </div>

            {/* Socials */}
            <div className="mt-6 flex gap-2">
              {footer.socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.platform] || Instagram;
                return (
                  <a
                    key={s.platform}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-11 w-11 place-items-center rounded-full border border-zinc-200 text-zinc-400 transition-all duration-200 hover:border-primary/40 hover:text-primary hover:shadow-sm"
                    aria-label={s.label}
                  >
                    <Icon className="h-[16px] w-[16px]" strokeWidth={1.75} />
                  </a>
                );
              })}
              {footer.whatsapp && (
                <a
                  href={footer.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-11 w-11 place-items-center rounded-full border border-zinc-200 text-zinc-400 transition-all duration-200 hover:border-green-500/40 hover:text-green-600 hover:shadow-sm"
                  aria-label="WhatsApp"
                >
                  <Phone className="h-[16px] w-[16px]" strokeWidth={1.75} />
                </a>
              )}
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
              <span>FSSAI Lic. {footer.fssai}</span>
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
