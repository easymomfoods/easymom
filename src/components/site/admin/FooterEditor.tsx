"use client";

import { useEffect, useState } from "react";
import {
  Save,
  RotateCcw,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Sparkles,
} from "lucide-react";

interface FooterData {
  tagline: string;
  email: string;
  phone: string;
  address: string;
  socials: { platform: string; label: string; href: string }[];
  fssai: string;
}

const defaults: FooterData = {
  tagline:
    "Authentic South Indian masalas, ground fresh in small batches. Homemade flavour, built for the modern stove.",
  email: "easymomfoods@gmail.com",
  phone: "+91 99012 61232",
  address: "Mangalore, Karnataka 575001",
  socials: [
    { platform: "instagram", label: "Instagram", href: "https://www.instagram.com/easymomfoods/" },
    { platform: "youtube", label: "YouTube", href: "#" },
    { platform: "twitter", label: "Twitter", href: "#" },
  ],
  fssai: "10024051000678",
};

const inputCls =
  "w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30";
const labelCls = "block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5";
const textareaCls =
  "w-full px-3 py-2.5 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30 resize-none";

const SOCIAL_ICONS: Record<string, typeof Instagram> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
};

export default function FooterEditor() {
  const [data, setData] = useState<FooterData>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetch("/api/site-content/footer")
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
      await fetch("/api/site-content/footer", {
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

  function updateSocial(idx: number, field: string, value: string) {
    const socials = [...data.socials];
    socials[idx] = { ...socials[idx], [field]: value };
    setData({ ...data, socials });
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-stone-200/60 rounded-lg" />
        <div className="h-48 bg-white rounded-xl border border-stone-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Footer</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Brand tagline, contact details, and social links
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
        /* ── Live preview ── */
        <div className="border border-stone-200 bg-white rounded-xl overflow-hidden">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-16">
            <div className="grid grid-cols-1 gap-8 py-10 sm:gap-12 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
              <div className="lg:col-span-5">
                <img
                  src="/brand/easymom-logo.png"
                  alt="EasyMom"
                  className="h-20 sm:h-24 lg:h-28 w-auto"
                />
                <p className="mt-5 max-w-sm text-[14px] leading-[1.7] text-zinc-500">
                  {data.tagline}
                </p>
                <div className="mt-6 space-y-2.5 text-[13px] text-zinc-500">
                  <a href={`mailto:${data.email}`} className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-[#891816]" /> {data.email}
                  </a>
                  <a href={`tel:${data.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-[#891816]" /> {data.phone}
                  </a>
                  <p className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-[#891816]" /> {data.address}
                  </p>
                </div>
                <div className="mt-6 flex gap-2">
                  {data.socials.map((s) => {
                    const Icon = SOCIAL_ICONS[s.platform] || Instagram;
                    return (
                      <a key={s.platform} href={s.href} className="grid h-11 w-11 place-items-center rounded-full border border-zinc-200 text-zinc-400 hover:border-[#891816]/40 hover:text-[#891816]">
                        <Icon className="h-[16px] w-[16px]" strokeWidth={1.75} />
                      </a>
                    );
                  })}
                </div>
              </div>
              <div className="lg:col-span-7 grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 text-[13px] text-zinc-500">
                <p>Shop, Company, and Legal links are hardcoded.</p>
              </div>
            </div>
            <div className="border-t border-zinc-100 py-5">
              <p className="text-[12px] text-zinc-400">
                © {new Date().getFullYear()} EasyMom Foods Pvt. Ltd. · Made in Mangalore.
                <span className="ml-2">FSSAI Lic. {data.fssai}</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Contact */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-[14px] font-semibold text-stone-900">Contact & Tagline</h3>
            <div>
              <label className={labelCls}>Brand Tagline</label>
              <textarea
                value={data.tagline}
                onChange={(e) => setData({ ...data, tagline: e.target.value })}
                className={textareaCls}
                rows={2}
                placeholder="Authentic South Indian masalas..."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className={inputCls}
                  placeholder="hello@easymom.in"
                />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input
                  type="text"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  className={inputCls}
                  placeholder="+91 80 1234 5678"
                />
              </div>
              <div>
                <label className={labelCls}>FSSAI License</label>
                <input
                  type="text"
                  value={data.fssai}
                  onChange={(e) => setData({ ...data, fssai: e.target.value })}
                  className={inputCls}
                  placeholder="10024051000678"
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Address</label>
              <input
                type="text"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                className={inputCls}
                placeholder="Mangalore, Karnataka 575001"
              />
            </div>
          </div>

          {/* Socials */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-stone-900">Social Links</h3>
            </div>
            <div className="space-y-3">
              {data.socials.map((s, idx) => {
                const Icon = SOCIAL_ICONS[s.platform] || Instagram;
                return (
                  <div key={s.platform} className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-3 items-center border border-stone-100 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-[#891816] shrink-0" />
                      <span className="text-[13px] font-medium text-stone-700">{s.label}</span>
                    </div>
                    <input
                      type="url"
                      value={s.href}
                      onChange={(e) => updateSocial(idx, "href", e.target.value)}
                      className={inputCls}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#891816]/5 border border-[#891816]/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-[#891816] mt-0.5 shrink-0" />
              <p className="text-[13px] text-stone-600 leading-relaxed">
                Shop, Company, and Legal link columns stay hardcoded. Only the brand tagline,
                contact details, and social links are editable here.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
