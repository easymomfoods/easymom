"use client";

import { useEffect, Suspense, useState } from "react";
import { useUI } from "@/lib/ui-store";
import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import {
  OurProducts,
  Categories,
  FeaturedProducts,
  BrandStory,
  Recipes,
  Testimonials,
  InstagramFeed,
  TrustStrip,
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
import {
  HomepageSkeleton,
  ShopSkeleton,
  ProductSkeleton,
  RecipesSkeleton,
  AboutSkeleton,
  FaqSkeleton,
} from "@/components/site/page-skeletons";
import AdminLogin from "@/components/site/admin/AdminLogin";
import AdminLayout from "@/components/site/admin/AdminLayout";
import DashboardContent from "@/components/site/admin/DashboardContent";
import AdminOrders from "@/components/site/admin/AdminOrders";
import AdminProducts from "@/components/site/admin/AdminProducts";
import AnalyticsContent from "@/components/site/admin/AnalyticsContent";
import HeroContentEditor from "@/components/site/admin/HeroContentEditor";
import OurProductsEditor from "@/components/site/admin/OurProductsEditor";
import FeaturedEditor from "@/components/site/admin/FeaturedEditor";
import BrandStoryEditor from "@/components/site/admin/BrandStoryEditor";
import RecipesSectionEditor from "@/components/site/admin/RecipesSectionEditor";

export default function Home() {
  const view = useUI((s) => s.view);
  const go = useUI((s) => s.go);
  const syncFromURL = useUI((s) => s.syncFromURL);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminChecking, setAdminChecking] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mark as mounted after hydration, and sync view from URL
  useEffect(() => {
    syncFromURL();
    setMounted(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Check admin session when view is an admin route
  useEffect(() => {
    if (mounted && view.name.startsWith("admin")) {
      setAdminChecking(true);
      fetch("/api/admin/stats")
        .then((res) => {
          setAdminLoggedIn(res.ok);
        })
        .catch(() => setAdminLoggedIn(false))
        .finally(() => setAdminChecking(false));
    }
  }, [mounted, view.name]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // For admin routes, only render after client mount
  // Server always renders public layout (view defaults to "home")
  // Client initially also renders public layout (mounted=false)
  // After mount, client switches to admin layout
  if (mounted && view.name.startsWith("admin")) {
    if (adminChecking) {
      return (
        <div className="min-h-screen bg-[#f5f3ee] flex items-center justify-center" suppressHydrationWarning>
          <div className="animate-pulse text-stone-400">Loading...</div>
        </div>
      );
    }

    if (!adminLoggedIn) {
      return <AdminLogin onLogin={() => setAdminLoggedIn(true)} />;
    }

    const adminPage = view.name === "admin" ? "dashboard" : view.name.replace("admin-", "");

    return (
      <AdminLayout
        activePage={adminPage}
        onNavigate={(page) => {
          if (page === "dashboard") go({ name: "admin" });
          else go({ name: `admin-${page}` as any });
        }}
      >
        {view.name === "admin" && <DashboardContent />}
        {view.name === "admin-orders" && <AdminOrders />}
        {view.name === "admin-products" && <AdminProducts />}
        {view.name === "admin-analytics" && <AnalyticsContent />}
        {view.name === "admin-hero" && <HeroContentEditor />}
        {view.name === "admin-our-products" && <OurProductsEditor />}
        {view.name === "admin-featured" && <FeaturedEditor />}
        {view.name === "admin-brand-story" && <BrandStoryEditor />}
        {view.name === "admin-recipes-section" && <RecipesSectionEditor />}
      </AdminLayout>
    );
  }

  // Public views — suppressHydrationWarning because Zustand view state may differ server/client
  return (
    <div className="flex min-h-screen flex-col bg-background" suppressHydrationWarning>
      <Nav />

      <main className="flex-1">
        {view.name === "home" && (
          <Suspense fallback={<HomepageSkeleton />}>
            <Hero />
            <OurProducts />
            <FeaturedProducts />
            <BrandStory />
            <Recipes />
            <Testimonials />
            <InstagramFeed />
            <TrustStrip />
          </Suspense>
        )}
        {view.name === "shop" && (
          <Suspense fallback={<ShopSkeleton />}>
            <ShopView />
          </Suspense>
        )}
        {view.name === "product" && (
          <Suspense fallback={<ProductSkeleton />}>
            <ProductView />
          </Suspense>
        )}
        {view.name === "recipes" && (
          <Suspense fallback={<RecipesSkeleton />}>
            <RecipesView />
          </Suspense>
        )}
        {view.name === "about" && (
          <Suspense fallback={<AboutSkeleton />}>
            <AboutView />
          </Suspense>
        )}
        {view.name === "faq" && (
          <Suspense fallback={<FaqSkeleton />}>
            <FaqView />
          </Suspense>
        )}
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
