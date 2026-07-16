"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type HomepageData = {
  products: any[];
  categories: any[];
  recipes: any[];
  testimonials: any[];
  siteContent: Record<string, string | null>;
};

const HomepageDataContext = createContext<HomepageData | null>(null);

export function HomepageDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<HomepageData | null>(null);

  useEffect(() => {
    fetch("/api/init")
      .then((r) => r.json())
      .then((d) => {
        if (d.products) setData(d);
      })
      .catch(() => {});
  }, []);

  return (
    <HomepageDataContext.Provider value={data}>
      {children}
    </HomepageDataContext.Provider>
  );
}

export function useHomepageData() {
  return useContext(HomepageDataContext);
}
