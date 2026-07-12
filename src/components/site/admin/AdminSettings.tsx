"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Lock, Globe, Eye, EyeOff, Shield, AlertTriangle } from "lucide-react";

const SETTINGS_KEYS = [
  "site_name",
  "site_tagline",
  "site_currency",
  "site_currency_symbol",
  "maintenance_mode",
  "social_instagram",
  "social_facebook",
  "social_twitter",
  "social_youtube",
  "whatsapp_number",
];

export default function AdminSettings() {
  const [fields, setFields] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Password
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");
  const [confirmMaintenance, setConfirmMaintenance] = useState(false);

  useEffect(() => {
    Promise.all(
      SETTINGS_KEYS.map((k) =>
        fetch(`/api/site-content/${k}`).then((r) => r.json()).then((d) => [k, d.value || ""])
      )
    )
      .then((entries) => {
        const obj: Record<string, string> = {};
        entries.forEach(([k, v]) => (obj[k] = v));
        if (!obj.site_currency) obj.site_currency = "INR";
        if (!obj.site_currency_symbol) obj.site_currency_symbol = "₹";
        setFields(obj);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function update(key: string, val: string) {
    setFields((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSaveSettings() {
    setSaving(true);
    setSaved(false);
    try {
      await Promise.all(
        SETTINGS_KEYS.map((k) =>
          fetch(`/api/site-content/${k}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: fields[k] || "" }),
          })
        )
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setSaving(false);
  }

  async function handleChangePassword() {
    setPwError("");
    setPwSaved(false);

    if (!currentPw || !newPw || !confirmPw) {
      setPwError("All password fields are required");
      return;
    }
    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("New passwords don't match");
      return;
    }

    setPwSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data.error || "Failed to change password");
      } else {
        setPwSaved(true);
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
        setTimeout(() => setPwSaved(false), 3000);
      }
    } catch {
      setPwError("Something went wrong");
    }
    setPwSaving(false);
  }

  const inputCls =
    "w-full h-11 px-4 rounded-xl border border-stone-200 bg-stone-50/50 text-[14px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#891816]/15 focus:border-[#891816]/40 focus:bg-white transition-all";
  const labelCls = "block text-[13px] font-medium text-stone-700 mb-1.5";
  const sectionCls = "bg-white rounded-xl border border-stone-100 p-6 space-y-5";

  function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
    return (
      <div className={sectionCls}>
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
          <div className="h-8 w-8 rounded-lg bg-[#891816]/8 flex items-center justify-center">
            <Icon className="h-4 w-4 text-[#891816]" />
          </div>
          <h2 className="text-[15px] font-semibold text-stone-900">{title}</h2>
        </div>
        {children}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-40 bg-stone-200/60 rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-100 p-6 space-y-4">
            <div className="h-5 w-32 bg-stone-200/60 rounded" />
            <div className="h-11 w-full bg-stone-100 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Settings</h1>
          <p className="text-sm text-stone-500 mt-0.5">Site configuration, security & social links</p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#891816] text-white text-[13px] font-semibold rounded-xl hover:bg-[#6d1311] active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save All"}
        </button>
      </div>

      {/* Site Settings */}
      <Section title="Site Settings" icon={Globe}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Site Name</label>
            <input
              type="text"
              value={fields.site_name || ""}
              onChange={(e) => update("site_name", e.target.value)}
              className={inputCls}
              placeholder="EasyMom Foods"
            />
          </div>
          <div>
            <label className={labelCls}>Tagline</label>
            <input
              type="text"
              value={fields.site_tagline || ""}
              onChange={(e) => update("site_tagline", e.target.value)}
              className={inputCls}
              placeholder="South India's Favourite Masala Paste"
            />
          </div>
          <div>
            <label className={labelCls}>Currency Code</label>
            <input
              type="text"
              value={fields.site_currency || ""}
              onChange={(e) => update("site_currency", e.target.value.toUpperCase())}
              className={inputCls}
              placeholder="INR"
            />
          </div>
          <div>
            <label className={labelCls}>Currency Symbol</label>
            <input
              type="text"
              value={fields.site_currency_symbol || ""}
              onChange={(e) => update("site_currency_symbol", e.target.value)}
              className={inputCls}
              placeholder="₹"
            />
          </div>
        </div>
      </Section>

      {/* Maintenance Mode */}
      <Section title="Maintenance Mode" icon={AlertTriangle}>
        <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
          <div>
            <p className="text-[14px] font-medium text-stone-900">Enable Maintenance Mode</p>
            <p className="text-[12px] text-stone-500 mt-0.5">When enabled, visitors see a &quot;Coming Soon&quot; page instead of the site</p>
          </div>
          <button
            onClick={() => {
              if (fields.maintenance_mode === "true") {
                // Turning OFF — no confirmation needed
                update("maintenance_mode", "false");
                fetch("/api/site-content/maintenance_mode", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ value: "false" }),
                }).catch(() => {});
              } else {
                // Turning ON — show confirmation
                setConfirmMaintenance(true);
              }
            }}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              fields.maintenance_mode === "true" ? "bg-[#891816]" : "bg-stone-300"
            }`}
          >
            <div
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                fields.maintenance_mode === "true" ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
        {fields.maintenance_mode === "true" && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[12px] text-amber-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Maintenance mode is ON — the site is not visible to customers
          </div>
        )}
      </Section>

      {/* Security */}
      <Section title="Change Password" icon={Shield}>
        <div className="max-w-md space-y-4">
          <div>
            <label className={labelCls}>Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className={`${inputCls} pr-11`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className={labelCls}>New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className={`${inputCls} pr-11`}
                placeholder="Min 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className={labelCls}>Confirm New Password</label>
            <input
              type={showNew ? "text" : "password"}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className={inputCls}
              placeholder="Re-enter new password"
            />
          </div>
          {pwError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-[12px] text-red-600">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {pwError}
            </div>
          )}
          {pwSaved && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-[12px] text-green-600">
              Password changed successfully!
            </div>
          )}
          <button
            onClick={handleChangePassword}
            disabled={pwSaving}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white text-[13px] font-semibold rounded-xl hover:bg-stone-800 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {pwSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {pwSaving ? "Changing..." : "Change Password"}
          </button>
        </div>
      </Section>

      {/* Social Links */}
      <Section title="Social Media & Contact" icon={Globe}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Instagram URL</label>
            <input
              type="url"
              value={fields.social_instagram || ""}
              onChange={(e) => update("social_instagram", e.target.value)}
              className={inputCls}
              placeholder="https://instagram.com/easymomfoods"
            />
          </div>
          <div>
            <label className={labelCls}>Facebook URL</label>
            <input
              type="url"
              value={fields.social_facebook || ""}
              onChange={(e) => update("social_facebook", e.target.value)}
              className={inputCls}
              placeholder="https://facebook.com/easymomfoods"
            />
          </div>
          <div>
            <label className={labelCls}>Twitter / X URL</label>
            <input
              type="url"
              value={fields.social_twitter || ""}
              onChange={(e) => update("social_twitter", e.target.value)}
              className={inputCls}
              placeholder="https://x.com/easymomfoods"
            />
          </div>
          <div>
            <label className={labelCls}>YouTube URL</label>
            <input
              type="url"
              value={fields.social_youtube || ""}
              onChange={(e) => update("social_youtube", e.target.value)}
              className={inputCls}
              placeholder="https://youtube.com/@easymomfoods"
            />
          </div>
          <div>
            <label className={labelCls}>WhatsApp Number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-stone-400 font-medium">+91</span>
              <input
                type="tel"
                value={fields.whatsapp_number || ""}
                onChange={(e) => update("whatsapp_number", e.target.value.replace(/\D/g, "").slice(0, 10))}
                className={`${inputCls} pl-12`}
                placeholder="9876543210"
              />
            </div>
            <p className="mt-1.5 text-[12px] text-stone-400">For WhatsApp order notifications</p>
          </div>
        </div>
      </Section>

      {/* Save bottom */}
      <div className="flex justify-end pb-4">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#891816] text-white text-[13px] font-semibold rounded-xl hover:bg-[#6d1311] active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save All"}
        </button>
      </div>

      {/* Maintenance Mode Confirmation Modal */}
      {confirmMaintenance && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmMaintenance(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#891816]/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-[#891816]" />
              </div>
              <h3 className="text-[16px] font-bold text-stone-900">Turn on Maintenance Mode?</h3>
            </div>
            <p className="text-[13px] text-stone-600 leading-relaxed">
              Your site will be <strong>hidden from all visitors</strong> and replaced with a &quot;Coming Soon&quot; page. Only you (as admin) can access the dashboard.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmMaintenance(false)}
                className="flex-1 h-10 rounded-xl border border-stone-200 text-[13px] font-medium text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setConfirmMaintenance(false);
                  update("maintenance_mode", "true");
                  try {
                    await fetch("/api/site-content/maintenance_mode", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ value: "true" }),
                    });
                  } catch {}
                }}
                className="flex-1 h-10 rounded-xl bg-[#891816] text-white text-[13px] font-semibold hover:bg-[#6d1311] active:scale-[0.98] transition-all"
              >
                Yes, Turn On
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
