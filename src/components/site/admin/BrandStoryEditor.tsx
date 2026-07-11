"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Eye,
  RotateCcw,
  Plus,
  Trash2,
  Sparkles,
  Type,
  Image as ImageIcon,
  Timer,
  GripVertical,
} from "lucide-react";
import ImageUpload from "./ImageUpload";

interface FeatureCard {
  title: string;
  body: string;
  icon: string;
  img: string;
}

interface BrandStoryData {
  marqueeText: string;
  heroImage: string;
  heroAlt: string;
  cookTime: string;
  cookTimeLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  bottomMarqueeText: string;
  features: FeatureCard[];
}

const defaults: BrandStoryData = {
  marqueeText: "NO PREP · NO OIL · READY IN 5 MINUTES",
  heroImage: "/brand/story-grind.png",
  heroAlt: "Hands grinding spices in a traditional stone mortar and pestle",
  cookTime: "5 min",
  cookTimeLabel: "Cook time avg",
  eyebrow: "Why EasyMom",
  title: "Restaurant-style curry, ready in 5 minutes",
  description: "The all-in-one masala paste includes onions, tomatoes, and essential spices. No chopping, no grinding, no oil. Just add your protein, water, and EasyMom — dinner in 5 minutes.",
  bottomMarqueeText: "No prep · No oil · Ready in 5 minutes · All-in-one paste · Nothing to hide",
  features: [
    { title: "No prep needed", body: "The all-in-one masala paste already includes onions, tomatoes, and essential spices. No chopping, no grinding, no measuring.", icon: "mortar", img: "/brand/box/box1.png" },
    { title: "Oil-free cooking", body: "The core cooking method requires no extra oil. Simply add your protein, water, and the paste — healthier without compromise.", icon: "leaf", img: "/brand/box/box2.png" },
    { title: "Nothing to hide", body: "No fillers, no added colours, no preservatives. Read the back of the pouch — it reads like a recipe, because it is one.", icon: "shield", img: "/brand/box/box3.png" },
    { title: "Ready in 5 minutes", body: "Cook restaurant-style curries in 5–10 minutes. Add protein, water, EasyMom paste, and simmer. Dinner is done.", icon: "flame", img: "/brand/box/box4.png" },
  ],
};

export default function BrandStoryEditor() {
  const [data, setData] = useState<BrandStoryData>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);
  const [editingFeature, setEditingFeature] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/site-content/brand-story")
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
      await fetch("/api/site-content/brand-story", {
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

  function updateFeature(idx: number, field: keyof FeatureCard, value: string) {
    const features = [...data.features];
    features[idx] = { ...features[idx], [field]: value };
    setData({ ...data, features });
  }

  function addFeature() {
    setData({
      ...data,
      features: [...data.features, { title: "", body: "", icon: "leaf", img: "" }],
    });
    setEditingFeature(data.features.length);
  }

  function removeFeature(idx: number) {
    setData({ ...data, features: data.features.filter((_, i) => i !== idx) });
    if (editingFeature === idx) setEditingFeature(null);
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
            Brand Story Section
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Edit the &quot;Why EasyMom&quot; section on the homepage
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
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          {/* Top Marquee */}
          <div className="border-b border-stone-100 py-5">
            <div className="flex overflow-hidden">
              <div className="flex shrink-0 animate-marquee items-center gap-6 pr-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} className="whitespace-nowrap text-[28px] font-bold tracking-tight text-stone-100 select-none">
                    {data.marqueeText}&nbsp;&nbsp;·&nbsp;&nbsp;
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-[1200px] mx-auto px-5 py-10 sm:px-10 sm:py-16">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7 rounded-sm overflow-hidden bg-stone-100">
                {data.heroImage ? (
                  <img src={data.heroImage} alt={data.heroAlt} className="aspect-[16/9] w-full object-cover" />
                ) : (
                  <div className="aspect-[16/9] w-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-stone-300" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-5 lg:col-span-5 lg:pt-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-[#891816]/[0.07]">
                    <span className="text-[18px] font-bold tracking-tight text-[#891816]">{data.cookTime}</span>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">{data.cookTimeLabel}</span>
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#891816]">{data.eyebrow}</p>
                  <h2 className="mt-2 text-[22px] font-semibold leading-[1.15] tracking-tight text-stone-900 sm:text-[30px] lg:text-[36px]">{data.title}</h2>
                </div>
                <p className="text-[13px] leading-[1.7] text-stone-500 sm:text-[15px]">{data.description}</p>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="max-w-[1200px] mx-auto px-5 pb-10 sm:px-10 sm:pb-16">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {data.features.map((f, i) => (
                <div key={i} className={`relative overflow-hidden rounded-sm border border-stone-200 bg-white min-h-[160px] sm:min-h-[200px] ${i < 2 ? "" : ""}`}>
                  {f.img ? (
                    <>
                      <img src={f.img} alt={f.title} className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4">
                        <h4 className="text-[14px] font-semibold text-white">{f.title}</h4>
                      </div>
                    </>
                  ) : (
                    <div className="p-5">
                      <h4 className="text-[14px] font-semibold text-stone-900">{f.title}</h4>
                      <p className="mt-1.5 text-[12px] text-stone-500 leading-relaxed">{f.body}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Marquee */}
          <div className="border-t border-stone-100 py-4">
            <div className="flex overflow-hidden">
              <div className="flex shrink-0 animate-marquee items-center gap-6 pr-6" style={{ animationDirection: "reverse" }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} className="whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.2em] text-stone-200 select-none">
                    {data.bottomMarqueeText}&nbsp;&nbsp;
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Edit Form ── */
        <>
          {/* Marquee Text */}
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <h3 className="text-[14px] font-semibold text-stone-900 mb-4 flex items-center gap-2">
              <Type className="h-4 w-4 text-stone-400" />
              Scrolling Text
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Top Marquee</label>
                <input
                  type="text"
                  value={data.marqueeText}
                  onChange={(e) => setData({ ...data, marqueeText: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Bottom Marquee</label>
                <input
                  type="text"
                  value={data.bottomMarqueeText}
                  onChange={(e) => setData({ ...data, bottomMarqueeText: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                />
              </div>
            </div>
          </div>

          {/* Hero Image + Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-stone-100 p-5">
              <h3 className="text-[14px] font-semibold text-stone-900 mb-4 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-stone-400" />
                Hero Image
              </h3>
              <ImageUpload
                value={data.heroImage}
                onChange={(url) => setData({ ...data, heroImage: url })}
                folder="easymom/brand-story"
                label="Story Image"
              />
              <div className="mt-3">
                <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Alt Text</label>
                <input
                  type="text"
                  value={data.heroAlt}
                  onChange={(e) => setData({ ...data, heroAlt: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-100 p-5">
              <h3 className="text-[14px] font-semibold text-stone-900 mb-4 flex items-center gap-2">
                <Timer className="h-4 w-4 text-stone-400" />
                Cook Time Stat
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Time Value</label>
                  <input
                    type="text"
                    value={data.cookTime}
                    onChange={(e) => setData({ ...data, cookTime: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                    placeholder="5 min"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Label</label>
                  <input
                    type="text"
                    value={data.cookTimeLabel}
                    onChange={(e) => setData({ ...data, cookTimeLabel: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                    placeholder="Cook time avg"
                  />
                </div>
              </div>
              {/* Live preview */}
              <div className="mt-4 p-4 bg-stone-50 rounded-xl flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-[#891816]/[0.07]">
                  <span className="text-[18px] font-bold tracking-tight text-[#891816]">{data.cookTime}</span>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">{data.cookTimeLabel}</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <h3 className="text-[14px] font-semibold text-stone-900 mb-4 flex items-center gap-2">
              <Type className="h-4 w-4 text-stone-400" />
              Text Content
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Eyebrow</label>
                <input
                  type="text"
                  value={data.eyebrow}
                  onChange={(e) => setData({ ...data, eyebrow: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Title</label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  className="w-full h-24 px-3 py-2 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-stone-900">
                Feature Cards ({data.features.length})
              </h3>
              <button
                onClick={addFeature}
                className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#891816] bg-[#891816]/8 rounded-lg hover:bg-[#891816]/15 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Card
              </button>
            </div>

            <div className="space-y-3">
              {data.features.map((f, idx) => (
                <div
                  key={idx}
                  className={`border rounded-xl overflow-hidden transition-all ${
                    editingFeature === idx ? "border-[#891816]/30 ring-2 ring-[#891816]/10" : "border-stone-200"
                  }`}
                >
                  <div
                    className="flex items-center gap-3 px-4 py-3 bg-stone-50 cursor-pointer"
                    onClick={() => setEditingFeature(editingFeature === idx ? null : idx)}
                  >
                    <GripVertical className="h-4 w-4 text-stone-300 shrink-0" />
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {f.img ? (
                        <img src={f.img} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-stone-200 flex items-center justify-center shrink-0">
                          <ImageIcon className="h-4 w-4 text-stone-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-stone-900 truncate">{f.title || "Untitled"}</p>
                        <p className="text-[12px] text-stone-500 truncate">{f.body || "No description"}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFeature(idx); }}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {editingFeature === idx && (
                    <div className="px-4 py-4 space-y-4 border-t border-stone-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Title</label>
                          <input
                            type="text"
                            value={f.title}
                            onChange={(e) => updateFeature(idx, "title", e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Icon</label>
                          <select
                            value={f.icon}
                            onChange={(e) => updateFeature(idx, "icon", e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                          >
                            <option value="mortar">Mortar</option>
                            <option value="leaf">Leaf</option>
                            <option value="shield">Shield</option>
                            <option value="flame">Flame</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea
                          value={f.body}
                          onChange={(e) => updateFeature(idx, "body", e.target.value)}
                          className="w-full h-20 px-3 py-2 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30 resize-none"
                        />
                      </div>
                      <ImageUpload
                        value={f.img}
                        onChange={(url) => updateFeature(idx, "img", url)}
                        folder="easymom/brand-story"
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
                The scrolling marquee text repeats automatically. Feature cards
                support images (uploaded to Cloudinary) or icon+text layout.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
