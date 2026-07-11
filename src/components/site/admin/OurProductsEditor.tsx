"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Eye,
  RotateCcw,
  Plus,
  Trash2,
  GripVertical,
  Sparkles,
  PackageOpen,
} from "lucide-react";
import ImageUpload from "./ImageUpload";

interface ProductCard {
  slug: string;
  name: string;
  img: string;
}

interface OurProductsData {
  eyebrow: string;
  title: string;
  items: ProductCard[];
}

const defaults: OurProductsData = {
  eyebrow: "Shop by category",
  title: "Our Products",
  items: [
    { slug: "red-curry", name: "Red Curry", img: "/brand/category/product-1.png" },
    { slug: "fish-curry-masala", name: "Fish Curry", img: "/brand/category/product-2.png" },
    { slug: "green-curry", name: "Green Curry", img: "/brand/category/product-3.png" },
    { slug: "palli-curry", name: "Palli Curry", img: "/brand/category/product-4.png" },
  ],
};

const emptyCard: ProductCard = { slug: "", name: "", img: "" };

export default function OurProductsEditor() {
  const [data, setData] = useState<OurProductsData>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/site-content/our-products")
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          try {
            const parsed = JSON.parse(d.value);
            setData({ ...defaults, ...parsed });
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/site-content/our-products", {
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

  function addItem() {
    setData({ ...data, items: [...data.items, { ...emptyCard }] });
    setEditingIdx(data.items.length);
  }

  function removeItem(idx: number) {
    const items = data.items.filter((_, i) => i !== idx);
    setData({ ...data, items });
    if (editingIdx === idx) setEditingIdx(null);
  }

  function updateItem(idx: number, field: keyof ProductCard, value: string) {
    const items = [...data.items];
    items[idx] = { ...items[idx], [field]: value };
    setData({ ...data, items });
  }

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
            Our Products Section
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Edit the &quot;Shop by category&quot; section on the homepage
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
        <div className="bg-white rounded-xl border border-stone-100 p-8">
          <div className="text-left max-w-2xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#891816]">
              {data.eyebrow}
            </p>
            <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-tight text-stone-900 sm:text-[40px]">
              {data.title}
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {data.items.map((p, i) => (
              <div
                key={i}
                className="group relative flex flex-col overflow-hidden rounded-[6px] bg-stone-100 text-left"
                style={{ boxShadow: "8px 8px 50px 20px rgba(137,24,22,0.15)" }}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[5px] bg-stone-200">
                  {p.img ? (
                    <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <PackageOpen className="h-8 w-8 text-stone-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-[17px] font-semibold text-white">{p.name || "Untitled"}</h3>
                    <p className="mt-0.5 text-[12px] text-white/70">Shop now →</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── Edit Form ── */
        <>
          {/* Section Text */}
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <h3 className="text-[14px] font-semibold text-stone-900 mb-4">Section Header</h3>
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
          </div>

          {/* Product Cards */}
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-stone-900">
                Product Cards ({data.items.length})
              </h3>
              <button
                onClick={addItem}
                className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#891816] bg-[#891816]/8 rounded-lg hover:bg-[#891816]/15 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Card
              </button>
            </div>

            <div className="space-y-3">
              {data.items.map((item, idx) => (
                <div
                  key={idx}
                  className={`border rounded-xl overflow-hidden transition-all ${
                    editingIdx === idx ? "border-[#891816]/30 ring-2 ring-[#891816]/10" : "border-stone-200"
                  }`}
                >
                  {/* Card Header */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 bg-stone-50 cursor-pointer"
                    onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
                  >
                    <GripVertical className="h-4 w-4 text-stone-300 shrink-0" />
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {item.img ? (
                        <img src={item.img} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-stone-200 flex items-center justify-center shrink-0">
                          <PackageOpen className="h-4 w-4 text-stone-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-stone-900 truncate">
                          {item.name || "Untitled Card"}
                        </p>
                        <p className="text-[12px] text-stone-500 truncate">{item.slug || "no-slug"}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeItem(idx); }}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Card Fields */}
                  {editingIdx === idx && (
                    <div className="px-4 py-4 space-y-4 border-t border-stone-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                            Name
                          </label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(idx, "name", e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                            placeholder="Red Curry"
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                            Slug (product link)
                          </label>
                          <input
                            type="text"
                            value={item.slug}
                            onChange={(e) => updateItem(idx, "slug", e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                            placeholder="red-curry"
                          />
                        </div>
                      </div>
                      <ImageUpload
                        value={item.img}
                        onChange={(url) => updateItem(idx, "img", url)}
                        folder="easymom/categories"
                        label="Card Image"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-[#891816]/5 border border-[#891816]/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-[#891816] mt-0.5 shrink-0" />
              <p className="text-[13px] text-stone-600 leading-relaxed">
                Each card links to a product page using the slug. Upload images via
                drag & drop — they&apos;ll be hosted on Cloudinary automatically.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
