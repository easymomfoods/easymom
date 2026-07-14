"use client";

import { useEffect, useState } from "react";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  X,
  Sparkles,
  GripVertical,
} from "lucide-react";
import ImageUpload from "./ImageUpload";

interface Stat {
  value: string;
  label: string;
}

interface AboutData {
  eyebrow: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  image: string;
  imageAlt: string;
  stats: Stat[];
}

const defaults: AboutData = {
  eyebrow: "Our story",
  heading: "A South Indian kitchen, made effortless.",
  paragraph1:
    "EasyMom began in a Mangalore kitchen in 2019, when a working mother ground her mother's chicken masala blend into a pouch so her sister in Dubai could taste home on a Wednesday. The pouch kept getting passed around — to colleagues, neighbours, friends abroad — until it became clear this was bigger than one family.",
  paragraph2:
    "Today we work with small spice co-ops across Karnataka, Kerala and Tamil Nadu, grinding in batches under 20kg on slow stones. Every blend is a real recipe from a real kitchen — built so a 15-minute cook still tastes like a 90-minute one.",
  image: "/brand/story-grind.png",
  imageAlt: "Grinding spices in a stone mortar",
  stats: [
    { value: "42k+", label: "Households served" },
    { value: "100%", label: "No preservatives" },
    { value: "9", label: "South Indian regions" },
    { value: "4.8★", label: "Across 3,200 reviews" },
  ],
};

const inputCls =
  "w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30";
const labelCls = "block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5";
const textareaCls =
  "w-full px-3 py-2.5 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30 resize-none";

export default function AboutEditor() {
  const [data, setData] = useState<AboutData>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetch("/api/site-content/about")
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          try {
            const parsed = JSON.parse(d.value);
            setData({ ...defaults, ...parsed });
          } catch (e) { console.error(e); }
        }
      })
      .catch((e) => { console.error(e); })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/site-content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: JSON.stringify(data) }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    setSaving(false);
  }

  function handleReset() {
    if (!confirm("Reset all changes to defaults? This cannot be undone.")) return;
    setData(defaults);
  }

  function addStat() {
    setData({ ...data, stats: [...data.stats, { value: "", label: "" }] });
  }

  function removeStat(idx: number) {
    setData({ ...data, stats: data.stats.filter((_, i) => i !== idx) });
  }

  function updateStat(idx: number, field: keyof Stat, value: string) {
    const stats = [...data.stats];
    stats[idx] = { ...stats[idx], [field]: value };
    setData({ ...data, stats });
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-stone-200/60 rounded-lg" />
        <div className="h-64 bg-white rounded-xl border border-stone-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Our Story</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            About page headline, story, image, and stats
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
          >
            {preview ? "Edit" : "Preview"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" /> Reset
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
        /* ── Preview ── */
        <div className="border border-stone-200 bg-white rounded-xl overflow-hidden p-8 lg:p-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#891816]">
                {data.eyebrow}
              </p>
              <h1 className="mt-3 text-[40px] font-semibold leading-[1.06] tracking-tight sm:text-[56px]">
                {data.heading}
              </h1>
              <p className="mt-5 text-[16px] leading-relaxed text-stone-800/80">
                {data.paragraph1}
              </p>
              {data.paragraph2 && (
                <p className="mt-4 text-[16px] leading-relaxed text-stone-800/80">
                  {data.paragraph2}
                </p>
              )}
            </div>
            <div className="overflow-hidden rounded-[6px]">
              <img
                src={data.image}
                alt={data.imageAlt}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[6px] border border-stone-200 lg:grid-cols-4">
            {data.stats.map((s, i) => (
              <div key={i} className="bg-stone-50 p-6 text-center">
                <div className="text-[32px] font-semibold tracking-tight text-stone-900">
                  {s.value}
                </div>
                <div className="mt-1 text-[12px] uppercase tracking-wide text-stone-500">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Story */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-[14px] font-semibold text-stone-900">Story</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Eyebrow</label>
                <input
                  type="text"
                  value={data.eyebrow}
                  onChange={(e) => setData({ ...data, eyebrow: e.target.value })}
                  className={inputCls}
                  placeholder="Our story"
                />
              </div>
              <div>
                <label className={labelCls}>Image Alt Text</label>
                <input
                  type="text"
                  value={data.imageAlt}
                  onChange={(e) => setData({ ...data, imageAlt: e.target.value })}
                  className={inputCls}
                  placeholder="Grinding spices in a stone mortar"
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Heading</label>
              <input
                type="text"
                value={data.heading}
                onChange={(e) => setData({ ...data, heading: e.target.value })}
                className={inputCls}
                placeholder="A South Indian kitchen, made effortless."
              />
            </div>
            <div>
              <label className={labelCls}>Paragraph 1</label>
              <textarea
                value={data.paragraph1}
                onChange={(e) => setData({ ...data, paragraph1: e.target.value })}
                className={textareaCls}
                rows={4}
                placeholder="EasyMom began in a Mangalore kitchen..."
              />
            </div>
            <div>
              <label className={labelCls}>Paragraph 2</label>
              <textarea
                value={data.paragraph2}
                onChange={(e) => setData({ ...data, paragraph2: e.target.value })}
                className={textareaCls}
                rows={4}
                placeholder="Today we work with small spice co-ops..."
              />
            </div>
          </div>

          {/* Image */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-[14px] font-semibold text-stone-900">Hero Image</h3>
            <div className="flex items-start gap-4">
              <ImageUpload
                value={data.image}
                onChange={(url) => setData({ ...data, image: url })}
                folder="easymom/brand-story"
                label="Upload Image"
              />
              <div className="pt-8">
                <p className="text-[12px] text-stone-400">Recommended 800×1000px (4:5 ratio)</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-stone-900">Stats ({data.stats.length})</h3>
              <button
                onClick={addStat}
                className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#891816] bg-[#891816]/8 rounded-lg hover:bg-[#891816]/15 transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Stat
              </button>
            </div>
            <div className="space-y-3">
              {data.stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3 border border-stone-100 rounded-xl px-4 py-3">
                  <GripVertical className="h-4 w-4 text-stone-300 shrink-0" />
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(idx, "value", e.target.value)}
                      className={inputCls}
                      placeholder="42k+"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(idx, "label", e.target.value)}
                      className={inputCls}
                      placeholder="Households served"
                    />
                  </div>
                  <button
                    onClick={() => removeStat(idx)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#891816]/5 border border-[#891816]/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-[#891816] mt-0.5 shrink-0" />
              <p className="text-[13px] text-stone-600 leading-relaxed">
                Testimonials on this page are pulled from the Reviews section — edit them
                separately in the Reviews admin.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
