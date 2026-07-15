"use client";

import { useUI } from "@/lib/ui-store";

export function BreadcrumbJsonLd() {
  const view = useUI((s) => s.view);

  const items: { name: string; url: string }[] = [
    { name: "Home", url: "https://easymom.co.in" },
  ];

  switch (view.name) {
    case "shop":
      items.push({ name: "Shop", url: "https://easymom.co.in/shop" });
      break;
    case "product":
      items.push(
        { name: "Shop", url: "https://easymom.co.in/shop" },
        {
          name: (view as any).slug?.replace(/-/g, " ") || "Product",
          url: `https://easymom.co.in/product/${(view as any).slug}`,
        }
      );
      break;
    case "recipes":
      items.push({ name: "Recipes", url: "https://easymom.co.in/recipes" });
      break;
    case "about":
      items.push({ name: "Our Story", url: "https://easymom.co.in/about" });
      break;
    case "faq":
      items.push({ name: "FAQ", url: "https://easymom.co.in/faq" });
      break;
    case "track-order":
      items.push({ name: "Track Order", url: "https://easymom.co.in/track-order" });
      break;
    default:
      return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
