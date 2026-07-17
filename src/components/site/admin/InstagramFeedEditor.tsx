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
  ImageIcon,
} from "lucide-react";
import ImageUpload from "./ImageUpload";

interface IGCard {
  id: string;
  img: string;
  label: string;
  url: string;
}

interface IGData {
  eyebrow: string;
  title: string;
  followText: string;
  socialLinks: string[];
  cards: IGCard[];
}

const defaults: IGData = {
  eyebrow: "@easymomfoods",
  title: "Instagram Feeds",
  followText: "Follow EasyMom",
  socialLinks: ["Instagram", "YouTube"],
  cards: [
    { id: "ig1", img: "/brand/products/red-curry1.png", label: "Red Curry", url: "https://www.instagram.com/easymomfoods/" },
    { id: "ig2", img: "/brand/products/green-curry1.png", label: "Green Curry", url: "https://www.instagram.com/easymomfoods/" },
    { id: "ig3", img: "/brand/products/pepper-chilli-masala1.png", label: "Pepper Chilli Masala", url: "https://www.instagram.com/easymomfoods/" },
    { id: "ig4", img: "/brand/instagram_image4.png", label: "EasyMom", url: "https://www.instagram.com/easymomfoods/" },
    { id: "ig5", img: "/brand/products/ghee-roast1.png", label: "Ghee Roast", url: "https://www.instagram.com/easymomfoods/" },
    { id: "ig6", img: "/brand/products/fish-curry1.png", label: "Fish Curry", url: "https://www.instagram.com/easymomfoods/" },
    { id: "ig7", img: "/brand/products/palli-curry1.png", label: "Palli Curry", url: "https://www.instagram.com/easymomfoods/" },
  ],
};

export default function InstagramFeedEditor() {
  const [data, setData] = useState<IGData>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [newSocial, setNewSocial] = useState("");

  useEffect(() => {
    fetch("/api/site-content/instagram-feed")
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          try {
            const parsed = JSON.parse(d.value);
            if (parsed.socialLinks) parsed.socialLinks = parsed.socialLinks.filter((s: string) => !["TikTok", "Twitter"].includes(s));
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
      await fetch("/api/site-content/instagram-feed", {
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

  function addCard() {
    if (data.cards.length >= 7) return;
    const newId = `ig${Date.now()}`;
    setData({ ...data, cards: [...data.cards, { id: newId, img: "", label: "", url: "https://www.instagram.com/easymomfoods/" }] });
    setEditingIdx(data.cards.length);
  }

  function removeCard(idx: number) {
    setData({ ...data, cards: data.cards.filter((_, i) => i !== idx) });
    if (editingIdx === idx) setEditingIdx(null);
  }

  function updateCard(idx: number, field: keyof IGCard, value: string) {
    const cards = [...data.cards];
    cards[idx] = { ...cards[idx], [field]: value };
    setData({ ...data, cards });
  }

  function addSocial() {
    if (newSocial.trim() && !data.socialLinks.includes(newSocial.trim())) {
      setData({ ...data, socialLinks: [...data.socialLinks, newSocial.trim()] });
      setNewSocial("");
    }
  }

  function removeSocial(name: string) {
    setData({ ...data, socialLinks: data.socialLinks.filter((s) => s !== name) });
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
            Instagram Feed Section
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Edit the Instagram fan cards on the homepage
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
        /* ── Preview ── */
        <div className="bg-stone-50/60 rounded-xl border border-stone-100 p-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#891816]">{data.eyebrow}</p>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.08] tracking-tight text-stone-900 sm:text-[38px]">{data.title}</h2>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            {data.cards.map((card) => (
              <div key={card.id} className="w-[100px] rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-[9/16] bg-stone-200 relative">
                  {card.img ? (
                    <img src={card.img} alt={card.label} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center"><ImageIcon className="h-6 w-6 text-stone-300" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-[11px] font-medium text-white">{card.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-stone-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">{data.followText}</p>
            <div className="h-px w-8 bg-stone-300" />
          </div>
          <div className="mt-3 flex items-center justify-center gap-6 text-[13px] text-stone-600">
            {data.socialLinks.map((s, i) => (
              <span key={s}>{i > 0 && <span className="mr-6 text-stone-300">·</span>}{s}</span>
            ))}
          </div>
        </div>
      ) : (
        /* ── Edit Form ── */
        <>
          {/* Section Header */}
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <h3 className="text-[14px] font-semibold text-stone-900 mb-4">Section Header</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Eyebrow</label>
                <input type="text" value={data.eyebrow} onChange={(e) => setData({ ...data, eyebrow: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Title</label>
                <input type="text" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30" />
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-stone-900">Feed Cards ({data.cards.length})</h3>
              <button onClick={addCard} disabled={data.cards.length >= 7} className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#891816] bg-[#891816]/8 rounded-lg hover:bg-[#891816]/15 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <Plus className="h-4 w-4" /> Add Card {data.cards.length >= 7 && "(max 7)"}
              </button>
            </div>
            <div className="space-y-3">
              {data.cards.map((card, idx) => (
                <div key={card.id} className={`border rounded-xl overflow-hidden transition-all ${editingIdx === idx ? "border-[#891816]/30 ring-2 ring-[#891816]/10" : "border-stone-200"}`}>
                  <div className="flex items-center gap-3 px-4 py-3 bg-stone-50 cursor-pointer" onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}>
                    <GripVertical className="h-4 w-4 text-stone-300 shrink-0" />
                    {card.img ? (
                      <img src={card.img} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-stone-200 flex items-center justify-center shrink-0"><ImageIcon className="h-4 w-4 text-stone-400" /></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-stone-900 truncate">{card.label || "Untitled"}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); removeCard(idx); }} className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {editingIdx === idx && (
                    <div className="px-4 py-4 space-y-4 border-t border-stone-100">
                      <div>
                        <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Label</label>
                        <input type="text" value={card.label} onChange={(e) => updateCard(idx, "label", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30" placeholder="Red Curry" />
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Instagram Post URL</label>
                        <input type="url" value={card.url} onChange={(e) => updateCard(idx, "url", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30" placeholder="https://www.instagram.com/p/..." />
                      </div>
                      <ImageUpload value={card.img} onChange={(url) => updateCard(idx, "img", url)} folder="easymom/instagram" label="Card Image" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <h3 className="text-[14px] font-semibold text-stone-900 mb-4">Social Links</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {data.socialLinks.map((s) => (
                <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-lg text-[13px] text-stone-700">
                  {s}
                  <button onClick={() => removeSocial(s)} className="p-0.5 rounded hover:bg-stone-200"><Trash2 className="h-3 w-3 text-stone-400" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newSocial} onChange={(e) => setNewSocial(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSocial(); } }} className="flex-1 h-9 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10" placeholder="Add social link..." />
              <button onClick={addSocial} className="px-3 h-9 rounded-lg bg-stone-100 text-[13px] font-medium text-stone-700 hover:bg-stone-200 transition-colors">Add</button>
            </div>
            <div className="mt-3">
              <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Follow Text</label>
              <input type="text" value={data.followText} onChange={(e) => setData({ ...data, followText: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30" />
            </div>
          </div>

          {/* Info */}
          <div className="bg-[#891816]/5 border border-[#891816]/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-[#891816] mt-0.5 shrink-0" />
              <p className="text-[13px] text-stone-600 leading-relaxed">
                Maximum 7 cards for the fan layout. Each card can have its own Instagram post URL — defaults to your profile if left empty.
                Social links appear at the bottom of the section.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
