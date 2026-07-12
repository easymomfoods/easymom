"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, X, Building2, Phone, Mail, MapPin, CreditCard, Globe, Hash, User } from "lucide-react";
import ImageUpload from "./ImageUpload";

const BUSINESS_KEYS = [
  "business_name",
  "business_email",
  "business_phone",
  "business_address",
  "business_city",
  "business_state",
  "business_pincode",
  "gst_number",
  "pan_number",
  "business_website",
  "business_description",
  "upi_id",
  "qr_image",
  "business_logo",
];

export default function AdminProfile() {
  const [fields, setFields] = useState<Record<string, string>>({});
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [usernameSaved, setUsernameSaved] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    Promise.all([
      ...BUSINESS_KEYS.map((k) =>
        fetch(`/api/site-content/${k}`).then((r) => r.json()).then((d) => [k, d.value || ""])
      ),
      fetch("/api/admin/username").then((r) => r.json()),
    ])
      .then((results) => {
        const obj: Record<string, string> = {};
        results.slice(0, -1).forEach(([k, v]) => (obj[k] = v));
        setFields(obj);
        const userResult = results[results.length - 1] as any;
        if (userResult.username) setUsername(userResult.username);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function update(key: string, val: string) {
    setFields((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await Promise.all(
        BUSINESS_KEYS.map((k) =>
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

  async function handleUsernameSave() {
    setUsernameError("");
    setUsernameSaved(false);
    if (!username.trim() || username.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }
    setUsernameSaving(true);
    try {
      const res = await fetch("/api/admin/username", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUsernameError(data.error || "Failed to update");
      } else {
        setUsername(data.username);
        setUsernameSaved(true);
        setTimeout(() => setUsernameSaved(false), 3000);
      }
    } catch {
      setUsernameError("Something went wrong");
    }
    setUsernameSaving(false);
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
        <div className="h-8 w-48 bg-stone-200/60 rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-100 p-6 space-y-4">
            <div className="h-5 w-32 bg-stone-200/60 rounded" />
            <div className="h-11 w-full bg-stone-100 rounded-xl" />
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
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Business Profile</h1>
          <p className="text-sm text-stone-500 mt-0.5">Manage your business information, payment details & branding</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#891816] text-white text-[13px] font-semibold rounded-xl hover:bg-[#6d1311] active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save All"}
        </button>
      </div>

      {/* Account */}
      <Section title="Account" icon={User}>
        <div className="max-w-md">
          <label className={labelCls}>Admin Username</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputCls}
              placeholder="admin"
            />
            <button
              onClick={handleUsernameSave}
              disabled={usernameSaving}
              className="shrink-0 inline-flex items-center gap-2 px-4 h-11 bg-stone-900 text-white text-[13px] font-semibold rounded-xl hover:bg-stone-800 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {usernameSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {usernameSaving ? "Saving..." : usernameSaved ? "Saved!" : "Update"}
            </button>
          </div>
          {usernameError && (
            <p className="mt-2 text-[12px] text-red-500">{usernameError}</p>
          )}
          <p className="mt-2 text-[12px] text-stone-400">This is used to sign in to the admin dashboard</p>
        </div>
      </Section>

      {/* Business Information */}
      <Section title="Business Information" icon={Building2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelCls}>Business Name</label>
            <input
              type="text"
              value={fields.business_name || ""}
              onChange={(e) => update("business_name", e.target.value)}
              className={inputCls}
              placeholder="EasyMom Foods"
            />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input
              type="email"
              value={fields.business_email || ""}
              onChange={(e) => update("business_email", e.target.value)}
              className={inputCls}
              placeholder="hello@easymom.in"
            />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-stone-400 font-medium">+91</span>
              <input
                type="tel"
                value={fields.business_phone || ""}
                onChange={(e) => update("business_phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                className={`${inputCls} pl-12`}
                placeholder="9876543210"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Address</label>
            <input
              type="text"
              value={fields.business_address || ""}
              onChange={(e) => update("business_address", e.target.value)}
              className={inputCls}
              placeholder="123, Main Street"
            />
          </div>
          <div>
            <label className={labelCls}>City</label>
            <input
              type="text"
              value={fields.business_city || ""}
              onChange={(e) => update("business_city", e.target.value)}
              className={inputCls}
              placeholder="Mangalore"
            />
          </div>
          <div>
            <label className={labelCls}>State</label>
            <select
              value={fields.business_state || ""}
              onChange={(e) => update("business_state", e.target.value)}
              className={inputCls}
            >
              <option value="">Select state</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Goa">Goa</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Pincode</label>
            <input
              type="text"
              value={fields.business_pincode || ""}
              onChange={(e) => update("business_pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
              className={inputCls}
              placeholder="575001"
            />
          </div>
          <div>
            <label className={labelCls}>Website</label>
            <input
              type="url"
              value={fields.business_website || ""}
              onChange={(e) => update("business_website", e.target.value)}
              className={inputCls}
              placeholder="https://easymom.in"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Business Description</label>
            <textarea
              value={fields.business_description || ""}
              onChange={(e) => update("business_description", e.target.value)}
              className={`${inputCls} h-24 py-3 resize-none`}
              placeholder="South Indian ready-to-use masala paste brand..."
            />
          </div>
        </div>
      </Section>

      {/* Tax & Legal */}
      <Section title="Tax & Legal" icon={Hash}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>GST Number</label>
            <input
              type="text"
              value={fields.gst_number || ""}
              onChange={(e) => update("gst_number", e.target.value.toUpperCase())}
              className={inputCls}
              placeholder="29AAAAA0000A1Z5"
            />
            <p className="mt-1.5 text-[12px] text-stone-400">Optional — for invoices</p>
          </div>
          <div>
            <label className={labelCls}>PAN Number</label>
            <input
              type="text"
              value={fields.pan_number || ""}
              onChange={(e) => update("pan_number", e.target.value.toUpperCase().slice(0, 10))}
              className={inputCls}
              placeholder="ABCDE1234F"
            />
            <p className="mt-1.5 text-[12px] text-stone-400">Optional — for financial records</p>
          </div>
        </div>
      </Section>

      {/* Payment */}
      <Section title="Payment Settings" icon={CreditCard}>
        <div>
          <label className={labelCls}>UPI ID</label>
          <input
            type="text"
            value={fields.upi_id || ""}
            onChange={(e) => update("upi_id", e.target.value)}
            className={inputCls}
            placeholder="yourname@upi"
          />
          <p className="mt-1.5 text-[12px] text-stone-400">Shown to customers during UPI checkout</p>
        </div>
        <div>
          <label className={labelCls}>UPI QR Code Image</label>
          {fields.qr_image ? (
            <div className="relative inline-block">
              <div className="w-52 h-52 rounded-xl border border-stone-200 overflow-hidden bg-stone-50">
                <img src={fields.qr_image} alt="UPI QR Code" className="w-full h-full object-contain" />
              </div>
              <button
                onClick={() => update("qr_image", "")}
                className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-sm"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <ImageUpload
              value={fields.qr_image || ""}
              onChange={(url) => update("qr_image", url)}
              folder="easymom/qr"
              label="Upload QR Code"
            />
          )}
          <p className="mt-1.5 text-[12px] text-stone-400">If not uploaded, UPI option won&apos;t show at checkout</p>
        </div>
      </Section>

      {/* Branding */}
      <Section title="Branding" icon={Globe}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Business Logo</label>
            {fields.business_logo ? (
              <div className="relative inline-block">
                <div className="w-48 h-28 rounded-xl border border-stone-200 overflow-hidden bg-stone-50 flex items-center justify-center p-3">
                  <img src={fields.business_logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                </div>
                <button
                  onClick={() => update("business_logo", "")}
                  className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-sm"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <ImageUpload
                value={fields.business_logo || ""}
                onChange={(url) => update("business_logo", url)}
                folder="easymom/brand"
                label="Upload Logo"
              />
            )}
            <p className="mt-1.5 text-[12px] text-stone-400">Used in invoices, emails, etc.</p>
          </div>
        </div>
      </Section>

      {/* Preview */}
      {(fields.business_name || fields.business_email) && (
        <div className="bg-white rounded-xl border border-stone-100 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-4">Contact Info Preview</p>
          <div className="bg-stone-50 rounded-xl p-5 max-w-md space-y-2">
            {fields.business_name && (
              <p className="text-[15px] font-bold text-stone-900">{fields.business_name}</p>
            )}
            {fields.business_email && (
              <p className="text-[13px] text-stone-600">{fields.business_email}</p>
            )}
            {fields.business_phone && (
              <p className="text-[13px] text-stone-600">+91 {fields.business_phone}</p>
            )}
            {(fields.business_address || fields.business_city) && (
              <p className="text-[13px] text-stone-600">
                {[fields.business_address, fields.business_city, fields.business_state, fields.business_pincode].filter(Boolean).join(", ")}
              </p>
            )}
            {fields.gst_number && (
              <p className="text-[12px] text-stone-500 mt-2">GST: {fields.gst_number}</p>
            )}
          </div>
        </div>
      )}

      {/* Save bottom */}
      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#891816] text-white text-[13px] font-semibold rounded-xl hover:bg-[#6d1311] active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save All"}
        </button>
      </div>
    </div>
  );
}
