"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Eye,
  RotateCcw,
  Plus,
  Trash2,
  Sparkles,
  GripVertical,
  Package,
  Leaf,
  RotateCcwIcon,
  Flame,
  Shield,
} from "lucide-react";

interface TrustItem {
  icon: string;
  title: string;
  sub: string;
}

interface TrustData {
  items: TrustItem[];
}

const defaults: TrustData = {
  items: [
    { icon: "package", title: "Free shipping", sub: "Dispatched in 24 hours" },
    { icon: "leaf", title: "No preservatives, ever", sub: "Read the label — it's a recipe" },
    { icon: "circular-arrow", title: "Easy returns", sub: "Not right? We'll make it right" },
  ],
};

const iconOptions = [
  { value: "package", label: "Package", icon: Package },
  { value: "leaf", label: "Leaf", icon: Leaf },
  { value: "circular-arrow", label: "Return", icon: RotateCcwIcon },
  { value: "flame", label: "Flame", icon: Flame },
  { value: "shield", label: "Shield", icon: Shield },
];

const inputCls =
  "w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30";
const labelCls = "block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5";

function getIconComponent(name: string) {
  return iconOptions.find((o) => o.value === name)?.icon || Package;
}

export default function TrustStripEditor() {
  const [data, setData] = useState<TrustData>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/site-content/trust-strip")
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
      await fetch("/api/site-content/trust-strip", {
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
    setData({ ...data, items: [...data.items, { icon: "package", title: "", sub: "" }] });
    setEditingIdx(data.items.length);
  }

  function removeItem(idx: number) {
    setData({ ...data, items: data.items.filter((_, i) => i !== idx) });
    if (editingIdx === idx) setEditingIdx(null);
  }

  function updateItem(idx: number, field: keyof TrustItem, value: string) {
    const items = [...data.items];
    items[idx] = { ...items[idx], [field]: value };
    setData({ ...data, items });
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-stone-200/60 rounded-lg" />
        <div className="h-24 bg-white rounded-xl border border-stone-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Trust Strip</h1>
          <p className="text-sm text-stone-500 mt-0.5">Edit the trust badges on the homepage</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setPreview(!preview)} className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
            <Eye className="h-4 w-4" /> {preview ? "Edit" : "Preview"}
          </button>
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white bg-[#891816] rounded-xl hover:bg-[#6d1311] transition-colors disabled:opacity-50">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {preview ? (
        <div className="border-y border-stone-200 bg-white rounded-xl">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 sm:grid-cols-3">
            {data.items.map((item, i) => {
              const Icon = getIconComponent(item.icon);
              return (
                <div key={i} className={`flex items-center gap-4 px-8 py-7 sm:justify-center sm:px-6 ${i < data.items.length - 1 ? "border-b sm:border-b-0 sm:border-r border-stone-200" : ""}`}>
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#891816]/[0.06]">
                    <Icon className="h-5 w-5 text-[#891816]" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-stone-900">{item.title}</div>
                    <div className="mt-0.5 text-[12.5px] text-stone-400">{item.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-stone-900">Trust Items ({data.items.length})</h3>
              <button onClick={addItem} className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#891816] bg-[#891816]/8 rounded-lg hover:bg-[#891816]/15 transition-colors">
                <Plus className="h-4 w-4" /> Add Item
              </button>
            </div>
            <div className="space-y-3">
              {data.items.map((item, idx) => {
                const Icon = getIconComponent(item.icon);
                return (
                  <div key={idx} className={`border rounded-xl overflow-hidden transition-all ${editingIdx === idx ? "border-[#891816]/30 ring-2 ring-[#891816]/10" : "border-stone-200"}`}>
                    <div className="flex items-center gap-3 px-4 py-3 bg-stone-50 cursor-pointer" onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}>
                      <GripVertical className="h-4 w-4 text-stone-300 shrink-0" />
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#891816]/[0.06]">
                        <Icon className="h-4 w-4 text-[#891816]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-stone-900 truncate">{item.title || "Untitled"}</p>
                        <p className="text-[12px] text-stone-500 truncate">{item.sub}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); removeItem(idx); }} className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {editingIdx === idx && (
                      <div className="px-4 py-4 space-y-4 border-t border-stone-100">
                        <div>
                          <label className={labelCls}>Icon</label>
                          <div className="flex gap-2">
                            {iconOptions.map((opt) => {
                              const OptIcon = opt.icon;
                              return (
                                <button
                                  key={opt.value}
                                  onClick={() => updateItem(idx, "icon", opt.value)}
                                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[12px] font-medium transition-colors ${item.icon === opt.value ? "border-[#891816] bg-[#891816]/8 text-[#891816]" : "border-stone-200 text-stone-600 hover:bg-stone-50"}`}
                                >
                                  <OptIcon className="h-4 w-4" /> {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className={labelCls}>Title</label>
                                <input type="text" value={item.title} onChange={(e) => updateItem(idx, "title", e.target.value)} className={inputCls} placeholder="Free shipping" />
                          </div>
                          <div>
                            <label className={labelCls}>Subtitle</label>
                            <input type="text" value={item.sub} onChange={(e) => updateItem(idx, "sub", e.target.value)} className={inputCls} placeholder="Dispatched in 24 hours" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#891816]/5 border border-[#891816]/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-[#891816] mt-0.5 shrink-0" />
              <p className="text-[13px] text-stone-600 leading-relaxed">
                3 items recommended for the 3-column layout. Each has an icon, title, and subtitle.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
