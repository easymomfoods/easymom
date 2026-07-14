"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Eye,
  RotateCcw,
  ImageIcon,
  Type,
  Hash,
  Sparkles,
} from "lucide-react";
import ImageUpload from "./ImageUpload";

interface HeroData {
  desktopImage: string;
  mobileImage: string;
  statNumber: string;
  statLabel: string;
  heading: string;
  subtitle: string;
}

const defaults: HeroData = {
  desktopImage: "/brand/easymom-banner.png",
  mobileImage: "/brand/easymom-hero-mobile.png",
  statNumber: "42,000+",
  statLabel: "Kitchens trust us",
  heading: "",
  subtitle: "",
};

export default function HeroContentEditor() {
  const [data, setData] = useState<HeroData>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetch("/api/site-content/hero")
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
      await fetch("/api/site-content/hero", {
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

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-stone-200/60 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-white rounded-xl border border-stone-100" />
          <div className="h-96 bg-white rounded-xl border border-stone-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Hero Section
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Edit the main homepage hero — image, text, and stats
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
          <div className="relative h-[400px] sm:h-[500px] overflow-hidden bg-zinc-950">
            <img
              src={data.desktopImage}
              alt="Hero preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

            {/* Optional heading overlay */}
            {data.heading && (
              <div className="absolute top-1/3 left-0 z-10 w-full px-5 sm:px-10 lg:px-16">
                <div className="mx-auto max-w-[1200px]">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight max-w-2xl">
                    {data.heading}
                  </h1>
                  {data.subtitle && (
                    <p className="mt-4 text-base sm:text-lg text-white/70 max-w-xl">
                      {data.subtitle}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 z-10 w-full px-5 pb-8 sm:px-10 sm:pb-12 lg:px-16">
              <div className="mx-auto max-w-[1200px]">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
                  <div className="flex flex-col items-start gap-4 lg:items-end lg:ml-auto">
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-[28px] font-bold leading-none text-white tabular-nums sm:text-[38px] lg:text-[46px]">
                          {data.statNumber}
                        </div>
                        <div className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
                          {data.statLabel}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Edit Form ── */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — Images */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-stone-100 p-5">
              <h3 className="text-[14px] font-semibold text-stone-900 mb-4 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-stone-400" />
                Images
              </h3>

              <ImageUpload
                value={data.desktopImage}
                onChange={(url) => setData({ ...data, desktopImage: url })}
                folder="easymom/hero"
                label="Desktop Image"
                className="mb-4"
              />

              <ImageUpload
                value={data.mobileImage}
                onChange={(url) => setData({ ...data, mobileImage: url })}
                folder="easymom/hero"
                label="Mobile Image"
              />
            </div>
          </div>

          {/* Right — Content */}
          <div className="space-y-5">
            {/* Stats */}
            <div className="bg-white rounded-xl border border-stone-100 p-5">
              <h3 className="text-[14px] font-semibold text-stone-900 mb-4 flex items-center gap-2">
                <Hash className="h-4 w-4 text-stone-400" />
                Stats Counter
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                    Number (e.g. 42,000+)
                  </label>
                  <input
                    type="text"
                    value={data.statNumber}
                    onChange={(e) =>
                      setData({ ...data, statNumber: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                    Label (e.g. Kitchens trust us)
                  </label>
                  <input
                    type="text"
                    value={data.statLabel}
                    onChange={(e) =>
                      setData({ ...data, statLabel: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                  />
                </div>
              </div>

              {/* Live stat preview */}
              <div className="mt-4 p-4 bg-stone-900 rounded-xl flex items-center justify-end gap-4">
                <div className="text-right">
                  <div className="text-[28px] font-bold leading-none text-white tabular-nums">
                    {data.statNumber}
                  </div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/45">
                    {data.statLabel}
                  </div>
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
                  <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                    Heading (optional overlay text)
                  </label>
                  <input
                    type="text"
                    value={data.heading}
                    onChange={(e) =>
                      setData({ ...data, heading: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                    placeholder="Authentic South Indian Masala"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                    Subtitle (optional overlay text)
                  </label>
                  <textarea
                    value={data.subtitle}
                    onChange={(e) =>
                      setData({ ...data, subtitle: e.target.value })
                    }
                    className="w-full h-20 px-3 py-2 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30 resize-none"
                    placeholder="Ready-to-use paste, no prep, cook in 5 minutes"
                  />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-[#891816]/5 border border-[#891816]/10 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-[#891816] mt-0.5 shrink-0" />
                <p className="text-[13px] text-stone-600 leading-relaxed">
                  Changes save to the database and appear on the live site
                  immediately. Drag & drop images to upload to Cloudinary, or
                  paste any image URL.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
