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
import AvailableNearYou from "@/components/site/available-near-you";
import {
  ShopView,
  ProductView,
  RecipesView,
  AboutView,
  FaqView,
} from "@/components/site/views";
import TrackOrder from "@/components/site/TrackOrder";
import {
  HomepageSkeleton,
  ShopSkeleton,
  ProductSkeleton,
  RecipesSkeleton,
  AboutSkeleton,
  FaqSkeleton,
  TrackOrderSkeleton,
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
import AdminRecipes from "@/components/site/admin/AdminRecipes";
import AdminTestimonials from "@/components/site/admin/AdminTestimonials";
import InstagramFeedEditor from "@/components/site/admin/InstagramFeedEditor";
import TrustStripEditor from "@/components/site/admin/TrustStripEditor";
import FooterEditor from "@/components/site/admin/FooterEditor";
import AboutEditor from "@/components/site/admin/AboutEditor";
import AdminCategories from "@/components/site/admin/AdminCategories";
import AdminFaqs from "@/components/site/admin/AdminFaqs";
import AdminReviews from "@/components/site/admin/AdminReviews";
import BrandStripEditor from "@/components/site/admin/BrandStripEditor";
import AdminProfile from "@/components/site/admin/AdminProfile";
import AdminSettings from "@/components/site/admin/AdminSettings";

export default function Home() {
  const view = useUI((s) => s.view);
  const go = useUI((s) => s.go);
  const syncFromURL = useUI((s) => s.syncFromURL);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminChecking, setAdminChecking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceChecked, setMaintenanceChecked] = useState(false);

  // Mark as mounted after hydration, and sync view from URL
  useEffect(() => {
    syncFromURL();
    setMounted(true);
    fetch("/api/site-content/maintenance_mode")
      .then((r) => r.json())
      .then((d) => {
        setMaintenanceMode(d.value === "true");
        setMaintenanceChecked(true);
      })
      .catch(() => {
        setMaintenanceMode(false);
        setMaintenanceChecked(true);
      });
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
      return <AdminLogin onLogin={() => { setAdminLoggedIn(true); go({ name: "admin" }); }} />;
    }

    const adminPage = (view.name === "admin" || view.name === "admin-login") ? "dashboard" : view.name.replace("admin-", "");

    return (
      <AdminLayout
        activePage={adminPage}
        onNavigate={(page) => {
          if (page === "dashboard") go({ name: "admin" });
          else go({ name: `admin-${page}` as any });
        }}
      >
        {(view.name === "admin" || view.name === "admin-login") && <DashboardContent />}
        {view.name === "admin-orders" && <AdminOrders />}
        {view.name === "admin-products" && <AdminProducts />}
        {view.name === "admin-analytics" && <AnalyticsContent />}
        {view.name === "admin-hero" && <HeroContentEditor />}
        {view.name === "admin-our-products" && <OurProductsEditor />}
        {view.name === "admin-featured" && <FeaturedEditor />}
        {view.name === "admin-brand-story" && <BrandStoryEditor />}
        {view.name === "admin-recipes-section" && <RecipesSectionEditor />}
        {view.name === "admin-recipes" && <AdminRecipes />}
        {view.name === "admin-testimonials" && <AdminTestimonials />}
        {view.name === "admin-instagram" && <InstagramFeedEditor />}
        {view.name === "admin-trust-strip" && <TrustStripEditor />}
        {view.name === "admin-footer" && <FooterEditor />}
        {view.name === "admin-about" && <AboutEditor />}
        {view.name === "admin-categories" && <AdminCategories />}
        {view.name === "admin-faqs" && <AdminFaqs />}
        {view.name === "admin-reviews" && <AdminReviews />}
        {view.name === "admin-brand-strip" && <BrandStripEditor />}
        {view.name === "admin-profile" && <AdminProfile />}
        {view.name === "admin-settings" && <AdminSettings />}
      </AdminLayout>
    );
  }

  // Maintenance mode — show coming soon for non-admin visitors
  // Only check after client mount + API check completes
  if (mounted && maintenanceChecked && maintenanceMode && !view.name.startsWith("admin")) {
    return (
      <div className="min-h-screen bg-[#891816] flex items-center justify-center p-6" suppressHydrationWarning>
        <div className="text-center max-w-md">
          <img src="/brand/easymom-logo.png" alt="EasyMom" className="h-32 mx-auto mb-4 brightness-0 invert" />
          <h1 className="text-3xl font-bold text-white mb-3">Coming Soon</h1>
          <p className="text-white/70 text-[15px] leading-relaxed">
            We&apos;re working on something amazing. Our store will be back online shortly.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-white/50 text-[13px]">
            <div className="h-2 w-2 rounded-full bg-white/50 animate-pulse" />
            Stay tuned
          </div>
        </div>
      </div>
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
            <AvailableNearYou />
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
        {view.name === "track-order" && (
          <Suspense fallback={<TrackOrderSkeleton />}>
            <TrackOrder />
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
