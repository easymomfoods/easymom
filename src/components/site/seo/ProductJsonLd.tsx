"use client";

import { useEffect, useState } from "react";
import { useUI } from "@/lib/ui-store";

interface ProductJsonLdProps {
  product?: {
    name: string;
    slug: string;
    description: string;
    price: number;
    mrp: number;
    images: string[];
    rating?: number;
    reviewCount?: number;
    ingredients?: string[];
    category?: string;
  };
}

export function ProductJsonLd({ product: propProduct }: ProductJsonLdProps) {
  const view = useUI((s) => s.view);
  const [product, setProduct] = useState(propProduct || null);

  useEffect(() => {
    if (view.name === "product" && (view as any).slug && !propProduct) {
      fetch(`/api/products/${(view as any).slug}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.product) setProduct(d.product);
        })
        .catch(() => {});
    }
  }, [view.name, (view as any).slug, propProduct]);

  if (!product || view.name !== "product") return null;

  const images = (product.images || []).map((img) =>
    img.startsWith("http") ? img : `https://easymom.co.in${img}`
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: images,
    description: product.description,
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: "EasyMom Foods",
    },
    manufacturer: {
      "@type": "Organization",
      name: "EasyMom Foods",
      founder: {
        "@type": "Person",
        name: "Mahammad Sinan",
      },
    },
    offers: {
      "@type": "Offer",
      url: `https://easymom.co.in/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      lowPrice: product.price,
      highPrice: product.mrp,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "EasyMom Foods",
      },
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount || 100,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    category: product.category || "South Indian Masalas",
    additionalProperty: product.ingredients?.length
      ? product.ingredients.map((ing) => ({
          "@type": "PropertyValue",
          name: "Ingredient",
          value: ing,
        }))
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
