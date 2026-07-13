"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Eye,
  RotateCcw,
  Plus,
  Trash2,
  Search,
  Sparkles,
  Star,
  PackageOpen,
} from "lucide-react";
import ImageUpload from "./ImageUpload";

interface FeaturedData {
  eyebrow: string;
  title: string;
  description: string;
  productSlugs: string[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  img: string | null;
  rating: number;
  reviewCount: number;
  badge: string | null;
  bestSeller: boolean;
  spiceLevel: string;
}

const defaults: FeaturedData = {
  eyebrow: "Most loved",
  title: "The blends people reorder",
  description: "The four that earned their place in 42,000 kitchens — and keep earning it.",
  productSlugs: [],
};

export default function FeaturedEditor() {
  const [data, setData] = useState<FeaturedData>(defaults);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);
  const [search, setSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/site-content/featured").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ])
      .then(([contentData, productsData]) => {
        if (contentData.value) {
          try {
            const parsed = JSON.parse(contentData.value);
            setData({ ...defaults, ...parsed });
          } catch {}
        } else {
          // No saved content yet — preload bestSellers from DB as defaults
          if (productsData.products) {
            const bestSlugs = productsData.products
              .filter((p: any) => p.bestSeller)
              .slice(0, 4)
              .map((p: any) => p.slug);
            setData({ ...defaults, productSlugs: bestSlugs });
          }
        }
        if (productsData.products) {
          setAllProducts(productsData.products);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/site-content/featured", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: JSON.stringify(data) }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  }

  function handleReset() {
    setData(defaults);
  }

  function addProduct(slug: string) {
    if (!data.productSlugs.includes(slug)) {
      setData({ ...data, productSlugs: [...data.productSlugs, slug] });
    }
    setShowPicker(false);
    setSearch("");
  }

  function removeProduct(slug: string) {
    setData({ ...data, productSlugs: data.productSlugs.filter((s) => s !== slug) });
  }

  const featuredProducts = data.productSlugs
    .map((slug) => allProducts.find((p) => p.slug === slug))
    .filter(Boolean) as Product[];

  const availableProducts = allProducts.filter(
    (p) =>
      !data.productSlugs.includes(p.slug) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-stone-200/60 rounded-lg" />
        <div className="h-96 bg-white rounded-xl border border-stone-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Most Loved Section
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Edit the featured products section on the homepage
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
          >
            <Eye className="h-4 w-4" />
            {preview ? "Edit" : "Preview"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white bg-[#891816] rounded-xl hover:bg-[#6d1311] transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {preview ? (
        /* ── Live Preview ── */
        <div className="bg-[#faf9f7] rounded-xl border border-stone-100 p-8">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#891816]">
                  {data.eyebrow}
                </p>
                <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-tight text-stone-900 sm:text-[40px]">
                  {data.title}
                </h2>
                {data.description && (
                  <p className="mt-3 text-[15px] text-stone-500 leading-relaxed">
                    {data.description}
                  </p>
                )}
              </div>
              <span className="text-[13px] font-semibold text-stone-400 border border-stone-200 rounded-[4px] px-4 py-2.5">
                View all {allProducts.length} blends →
              </span>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
              {featuredProducts.map((p) => (
                <div key={p.slug} className="bg-white rounded-xl border border-stone-100 overflow-hidden">
                  <div className="relative aspect-square bg-stone-100">
                    {p.img ? (
                      <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <PackageOpen className="h-8 w-8 text-stone-300" />
                      </div>
                    )}
                    {p.badge && (
                      <span className="absolute top-3 left-3 bg-[#891816] text-white text-[11px] font-bold px-2 py-1 rounded">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-[13px] font-semibold text-stone-900">{p.rating}</span>
                      <span className="text-[12px] text-stone-400">({p.reviewCount})</span>
                    </div>
                    <h3 className="text-[14px] font-semibold text-stone-900">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[15px] font-bold text-stone-900">₹{p.price}</span>
                      <span className="text-[13px] text-stone-400 line-through">₹{p.mrp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── Edit Form ── */
        <>
          {/* Section Text */}
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <h3 className="text-[14px] font-semibold text-stone-900 mb-4">Section Header</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                    Eyebrow Text
                  </label>
                  <input
                    type="text"
                    value={data.eyebrow}
                    onChange={(e) => setData({ ...data, eyebrow: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  className="w-full h-20 px-3 py-2 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-stone-900">
                Featured Products ({data.productSlugs.length})
              </h3>
              <button
                onClick={() => setShowPicker(!showPicker)}
                disabled={data.productSlugs.length >= 8}
                className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#891816] bg-[#891816]/8 rounded-lg hover:bg-[#891816]/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            </div>

            {/* Selected Products */}
            <div className="space-y-2">
              {featuredProducts.length === 0 && (
                <p className="text-[13px] text-stone-400 py-4 text-center">
                  No products selected. Click &quot;Add Product&quot; to choose.
                </p>
              )}
              {featuredProducts.map((p) => (
                <div
                  key={p.slug}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors"
                >
                  {p.img ? (
                    <img src={p.img} alt="" className="h-12 w-12 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                      <PackageOpen className="h-4 w-4 text-stone-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-stone-900 truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[12px] font-semibold text-stone-700">₹{p.price}</span>
                      <span className="text-[12px] text-stone-400 line-through">₹{p.mrp}</span>
                      <span className="text-[11px] text-stone-400">•</span>
                      <span className="text-[12px] text-stone-500">{p.spiceLevel}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-[12px] font-medium text-stone-700">{p.rating}</span>
                  </div>
                  <button
                    onClick={() => removeProduct(p.slug)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Product Picker */}
            {showPicker && (
              <div className="mt-4 border border-stone-200 rounded-xl overflow-hidden">
                <div className="p-3 border-b border-stone-100 bg-stone-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products..."
                      className="w-full h-9 pl-9 pr-3 rounded-lg bg-white border border-stone-200 text-[13px] text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#891816]/10"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-stone-50">
                  {availableProducts.length === 0 ? (
                    <p className="p-4 text-center text-[13px] text-stone-400">No products found</p>
                  ) : (
                    availableProducts.map((p) => (
                      <button
                        key={p.slug}
                        onClick={() => addProduct(p.slug)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-stone-50 transition-colors text-left"
                      >
                        {p.img ? (
                          <img src={p.img} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                            <PackageOpen className="h-4 w-4 text-stone-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-stone-900 truncate">{p.name}</p>
                          <p className="text-[12px] text-stone-500">₹{p.price} • {p.spiceLevel}</p>
                        </div>
                        <Plus className="h-4 w-4 text-stone-400 shrink-0" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-[#891816]/5 border border-[#891816]/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-[#891816] mt-0.5 shrink-0" />
              <p className="text-[13px] text-stone-600 leading-relaxed">
                Pick products from your catalog to feature. These must exist in
                the Products section. Up to 4 recommended for best layout.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
