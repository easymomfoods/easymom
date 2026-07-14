"use client";

import { useEffect, useState } from "react";
import { Save, RotateCcw, Plus, Trash2, Sparkles, Eye, Pencil } from "lucide-react";

const defaults = [
  "Stone-ground in small batches",
  "No preservatives, ever",
  "Sourced from origin",
  "Roasted, never raw",
  "Built for the 15-minute cook",
  "From Mangalore & Kerala",
  "42,000+ households",
];

const inputCls = "w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30";

export default function BrandStripEditor() {
  const [items, setItems] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetch("/api/site-content/brand-strip")
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          try {
            const parsed = JSON.parse(d.value);
            if (parsed.items && parsed.items.length > 0) setItems(parsed.items);
          } catch (e) { console.error(e); }
        }
      })
      .catch((e) => { console.error(e); })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true); setSaved(false);
    try {
      await fetch("/api/site-content/brand-strip", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ value: JSON.stringify({ items }) }) });
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); } setSaving(false);
  }

  if (loading) return <div className="animate-pulse h-64 bg-white rounded-xl border border-stone-100" />;

  if (preview) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Brand Marquee</h1>
            <p className="text-sm text-stone-500 mt-0.5">Preview — how the marquee looks on the homepage</p>
          </div>
          <button onClick={() => setPreview(false)} className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50"><Pencil className="h-4 w-4" /> Edit</button>
        </div>
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          <div className="border-b border-zinc-100 py-5 sm:py-7">
            <div className="flex overflow-hidden">
              <div className="flex shrink-0 animate-marquee items-center gap-6 pr-6 sm:gap-10 sm:pr-10">
                {Array.from({ length: 20 }).map((_, i) => (
                  <span key={i} className="whitespace-nowrap text-[42px] font-bold leading-none tracking-[-0.03em] text-zinc-[0.06] select-none sm:text-[64px] lg:text-[80px]">
                    {(items[0] || "NO PREP · NO OIL · READY IN 5 MINUTES").toUpperCase()}&nbsp;&nbsp;·&nbsp;&nbsp;
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Brand Marquee</h1>
          <p className="text-sm text-stone-500 mt-0.5">Scrolling text strip below the hero</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setPreview(true)} className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50"><Eye className="h-4 w-4" /> Preview</button>
          <button onClick={() => setItems(defaults)} className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50"><RotateCcw className="h-4 w-4" /> Reset</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white bg-[#891816] rounded-xl hover:bg-[#6d1311] disabled:opacity-50"><Save className="h-4 w-4" />{saving ? "Saving..." : saved ? "Saved!" : "Save"}</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-stone-900">Marquee Items ({items.length})</h3>
          <button onClick={() => setItems([...items, ""])} className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#891816] bg-[#891816]/8 rounded-lg hover:bg-[#891816]/15"><Plus className="h-4 w-4" /> Add</button>
        </div>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input value={item} onChange={(e) => { const n = [...items]; n[idx] = e.target.value; setItems(n); }} className={inputCls} placeholder="Marquee text..." />
              <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 shrink-0"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#891816]/5 border border-[#891816]/10 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-4 w-4 text-[#891816] mt-0.5 shrink-0" />
          <p className="text-[13px] text-stone-600 leading-relaxed">These items scroll in a continuous marquee below the hero section.</p>
        </div>
      </div>
    </div>
  );
}
