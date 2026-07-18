"use client";

import { useEffect } from "react";
import { useUI } from "@/lib/ui-store";

const SEO_DATA: Record<string, { title: string; description: string; image: string }> = {
  home: {
    title: "EasyMom Foods — Authentic South Indian Masalas, Made Effortless",
    description:
      "Premium authentic South Indian masalas and ready-to-cook blends from Mangalore and Kerala. Homemade taste, fast cooking, no preservatives. Trusted by 25,000+ families. Founded by Mahammad Sinan.",
    image: "/brand/easymom-logo.png",
  },
  shop: {
    title: "Shop South Indian Masalas & Spice Blends — EasyMom Foods",
    description:
      "Browse our collection of authentic South Indian masalas, curry pastes, and spice blends. No preservatives, stone-ground in small batches. Free delivery on orders above ₹500.",
    image: "/brand/easymom-logo.png",
  },
  product: {
    title: "Buy South Indian Masala Online — EasyMom Foods",
    description:
      "Premium South Indian masala blend, stone-ground in small batches. No preservatives, no artificial colours. Ready in 5 minutes. Trusted by 25,000+ families.",
    image: "/brand/easymom-logo.png",
  },
  recipes: {
    title: "South Indian Recipes Using EasyMom Masalas",
    description:
      "Explore authentic Mangalorean and Kerala recipes you can make in 15 minutes with EasyMom masala blends. Step-by-step guides with photos.",
    image: "/brand/easymom-logo.png",
  },
  about: {
    title: "Our Story — EasyMom Foods | Founded by Mahammad Sinan",
    description:
      "EasyMom began in a Mangalore kitchen in 2025, founded by Mahammad Sinan. We work with small spice co-ops across South India to bring you stone-ground masalas with no preservatives.",
    image: "/brand/story-grind.png",
  },
  faq: {
    title: "Frequently Asked Questions — EasyMom Foods",
    description:
      "Answers to common questions about EasyMom masalas: shipping, storage, ingredients, preservatives, returns, and more.",
    image: "/brand/easymom-logo.png",
  },
  "track-order": {
    title: "Track Your Order — EasyMom Foods",
    description: "Track your EasyMom Foods order status in real time.",
    image: "/brand/easymom-logo.png",
  },
};

function getMeta(viewName: string, slug?: string) {
  if (viewName === "product" && slug) {
    return {
      title: `Buy ${slug.replace(/-/g, " ")} Online — EasyMom Foods`,
      description: `Premium ${slug.replace(/-/g, " ")} masala blend, stone-ground in small batches. No preservatives. Ready in 5 minutes. Order online from EasyMom Foods.`,
      image: "/brand/easymom-logo.png",
    };
  }
  return SEO_DATA[viewName] || SEO_DATA.home;
}

export function SeoHead() {
  const view = useUI((s) => s.view);

  useEffect(() => {
    const meta = getMeta(view.name, (view as any).slug);
    document.title = meta.title;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setProperty = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", prop);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", meta.description);
    setProperty("og:title", meta.title);
    setProperty("og:description", meta.description);
    setProperty("og:image", `https://easymom.co.in${meta.image}`);
    setProperty("og:url", window.location.href);
    setMeta("twitter:title", meta.title);
    setMeta("twitter:description", meta.description);
    setMeta("twitter:image", `https://easymom.co.in${meta.image}`);

    // Set canonical URL
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);
  }, [view.name, (view as any).slug]);

  return null;
}
