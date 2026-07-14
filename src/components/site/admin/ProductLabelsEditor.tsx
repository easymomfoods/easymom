"use client";

import { useEffect, useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { DEFAULT_PRODUCT_LABELS, type ProductLabels } from "@/components/site/product-labels";

const FIELDS: { key: keyof ProductLabels; label: string; placeholder: string }[] = [
  { key: "insideBlend", label: "Inside the blend heading", placeholder: "Inside the blend" },
  { key: "cookTime", label: "Cook time label", placeholder: "Cook time" },
  { key: "serves", label: "Serves label", placeholder: "Serves" },
  { key: "shelfLife", label: "Shelf life label", placeholder: "Shelf life" },
  { key: "weight", label: "Weight label", placeholder: "Weight" },
  { key: "taxSuffix", label: "Tax suffix", placeholder: "· incl. all taxes" },
];

const inputCls =
  "w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30";
const labelCls =
  "block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5";

export default function ProductLabelsEditor() {
  const [data, setData] = useState<ProductLabels>(DEFAULT_PRODUCT_LABELS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/site-content/product_labels")
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          try {
            const parsed = JSON.parse(d.value);
            setData({ ...DEFAULT_PRODUCT_LABELS, ...parsed });
          } catch (e) {
            console.error(e);
          }
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/site-content/product_labels", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: JSON.stringify(data) }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  }

  function handleReset() {
    if (!confirm("Reset all labels to defaults? This cannot be undone.")) return;
    setData(DEFAULT_PRODUCT_LABELS);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Product Labels</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Editable headings &amp; labels shown on product pages
          </p>
        </div>
        <div className="flex items-center gap-3">
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

      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className={labelCls}>{f.label}</label>
            <input
              type="text"
              value={data[f.key]}
              onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
              className={inputCls}
              placeholder={f.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
