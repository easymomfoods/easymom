"use client";

import { useEffect, useState } from "react";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Eye,
  Sparkles,
} from "lucide-react";
import { defaultLegal } from "@/components/site/legal-defaults";

interface LegalSection {
  heading: string;
  body: string;
}

interface LegalData {
  title: string;
  updated: string;
  sections: LegalSection[];
}

const inputCls =
  "w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30";
const labelCls =
  "block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5";
const textareaCls =
  "w-full px-3 py-2.5 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30 resize-none";

export default function LegalEditor({
  docKey,
  title,
}: {
  docKey: string;
  title: string;
}) {
  const [data, setData] = useState<LegalData>(() => defaultLegal(docKey));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetch(`/api/site-content/${docKey}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          try {
            const parsed = JSON.parse(d.value);
            setData({ ...defaultLegal(docKey), ...parsed });
          } catch (e) {
            console.error(e);
          }
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setLoading(false));
  }, [docKey]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch(`/api/site-content/${docKey}`, {
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
    if (!confirm("Reset all changes to defaults? This cannot be undone.")) return;
    setData(defaultLegal(docKey));
  }

  function addSection() {
    setData({ ...data, sections: [...data.sections, { heading: "", body: "" }] });
  }

  function removeSection(idx: number) {
    setData({ ...data, sections: data.sections.filter((_, i) => i !== idx) });
  }

  function updateSection(idx: number, field: keyof LegalSection, value: string) {
    const sections = [...data.sections];
    sections[idx] = { ...sections[idx], [field]: value };
    setData({ ...data, sections });
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
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">{title}</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Editable legal page content shown on the public site
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
        <div className="bg-white rounded-xl border border-stone-100 p-8 lg:p-12">
          <h1 className="text-[34px] font-bold tracking-tight text-stone-900">{data.title}</h1>
          <p className="mt-2 text-[13px] text-stone-400">Last updated: {data.updated}</p>
          <div className="mt-8 space-y-7">
            {data.sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-[17px] font-semibold text-stone-900">{s.heading}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-stone-600 whitespace-pre-line">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Meta */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-[14px] font-semibold text-stone-900">Page Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Page Title</label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className={inputCls}
                  placeholder="Terms of Service"
                />
              </div>
              <div>
                <label className={labelCls}>Last Updated</label>
                <input
                  type="date"
                  value={data.updated}
                  onChange={(e) => setData({ ...data, updated: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-stone-900">
                Sections ({data.sections.length})
              </h3>
              <button
                onClick={addSection}
                className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#891816] bg-[#891816]/8 rounded-lg hover:bg-[#891816]/15 transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Section
              </button>
            </div>
            <div className="space-y-3">
              {data.sections.map((s, idx) => (
                <div key={idx} className="border border-stone-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={s.heading}
                      onChange={(e) => updateSection(idx, "heading", e.target.value)}
                      className={inputCls}
                      placeholder="Section heading"
                    />
                    <button
                      onClick={() => removeSection(idx)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    value={s.body}
                    onChange={(e) => updateSection(idx, "body", e.target.value)}
                    className={textareaCls}
                    rows={4}
                    placeholder="Section body text..."
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#891816]/5 border border-[#891816]/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-[#891816] mt-0.5 shrink-0" />
              <p className="text-[13px] text-stone-600 leading-relaxed">
                Changes save to the database and appear on the live page immediately.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
