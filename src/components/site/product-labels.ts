"use client";

import { useEffect, useState } from "react";

export const DEFAULT_PRODUCT_LABELS = {
  insideBlend: "Inside the blend",
  cookTime: "Cook time",
  serves: "Serves",
  shelfLife: "Shelf life",
  weight: "Weight",
  taxSuffix: "· incl. all taxes",
};

export type ProductLabels = typeof DEFAULT_PRODUCT_LABELS;

export function useProductLabels(): ProductLabels {
  const [labels, setLabels] = useState<ProductLabels>(DEFAULT_PRODUCT_LABELS);

  useEffect(() => {
    fetch("/api/site-content/product_labels")
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          try {
            const parsed = JSON.parse(d.value);
            setLabels({ ...DEFAULT_PRODUCT_LABELS, ...parsed });
          } catch (e) {
            console.error(e);
          }
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return labels;
}
