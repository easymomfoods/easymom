"use client";

import { useEffect } from "react";
import { useUI } from "@/lib/ui-store";
import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import {
  BrandStrip,
  Categories,
  FeaturedProducts,
  BrandStory,
  Recipes,
  Testimonials,
  Newsletter,
} from "@/components/site/home-sections";
import { Footer } from "@/components/site/footer";
import { CartDrawer, SearchOverlay, WishlistDrawer } from "@/components/site/overlays";
import { QuickView } from "@/components/site/quick-view";
import { Checkout } from "@/components/site/checkout";
import {
  ShopView,
  ProductView,
  RecipesView,
  AboutView,
  FaqView,
} from "@/components/site/views";

export default function Home() {
  const view = useUI((s) => s.view);

  // close overlays on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const s = useUI.getState();
        s.closeCart();
        s.closeSearch();
        s.setMobileNav(false);
        s.setQuickView(null);
        s.setWishlistOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        useUI.getState().openSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Nav />

      <main className="flex-1">
        {view.name === "home" && (
          <>
            <Hero />
            <BrandStrip />
            <Categories />
            <FeaturedProducts />
            <BrandStory />
            <Recipes />
            <Testimonials />
            <Newsletter />
          </>
        )}
        {view.name === "shop" && <ShopView />}
        {view.name === "product" && <ProductView />}
        {view.name === "recipes" && <RecipesView />}
        {view.name === "about" && <AboutView />}
        {view.name === "faq" && <FaqView />}
      </main>

      <Footer />

      {/* overlays */}
      <CartDrawer />
      <SearchOverlay />
      <WishlistDrawer />
      <QuickView />
      <Checkout />
    </div>
  );
}
