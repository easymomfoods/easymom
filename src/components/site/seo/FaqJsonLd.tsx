"use client";

import { useEffect, useState } from "react";
import { useUI } from "@/lib/ui-store";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqJsonLd() {
  const view = useUI((s) => s.view);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  useEffect(() => {
    if (view.name === "faq") {
      fetch("/api/faqs")
        .then((r) => r.json())
        .then((d) => {
          if (d.faqs) {
            setFaqs(
              d.faqs
                .filter((f: any) => f.active !== false)
                .map((f: any) => ({
                  question: f.question,
                  answer: f.answer,
                }))
            );
          }
        })
        .catch(() => {});
    }
  }, [view.name]);

  if (view.name !== "faq" || faqs.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
