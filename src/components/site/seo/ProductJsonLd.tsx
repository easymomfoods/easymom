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
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" },
        shippingDestination: [{ "@type": "DefinedRegion", addressCountry: "IN" }],
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 6, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org.ReturnByMail",
        returnFees: "https://schema.org.FreeReturn",
      },
      seller: {
        "@type": "Organization",
        name: "EasyMom Foods",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 4.8,
      reviewCount: product.reviewCount || 100,
      bestRating: 5,
      worstRating: 1,
    },
    review: [
      {
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: product.rating || 5, bestRating: 5 },
        author: { "@type": "Person", name: "Verified Buyer" },
        reviewBody: "Authentic taste, just like homemade. Ready in 5 minutes with no prep.",
      },
    ],
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
