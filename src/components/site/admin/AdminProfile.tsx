"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Upload, X } from "lucide-react";
import ImageUpload from "./ImageUpload";

export default function AdminProfile() {
  const [upiId, setUpiId] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/site-content/upi_id").then((r) => r.json()),
      fetch("/api/site-content/qr_image").then((r) => r.json()),
    ]).then(([upi, qr]) => {
      if (upi.value) setUpiId(upi.value);
      if (qr.value) setQrImage(qr.value);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await Promise.all([
        fetch("/api/site-content/upi_id", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: upiId }),
        }),
        fetch("/api/site-content/qr_image", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: qrImage }),
        }),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setSaving(false);
  }

  const inputCls =
    "w-full h-11 px-4 rounded-xl border border-stone-200 bg-stone-50/50 text-[14px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#891816]/15 focus:border-[#891816]/40 focus:bg-white transition-all";
  const labelCls = "block text-[13px] font-medium text-stone-700 mb-1.5";

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-stone-200/60 rounded-lg" />
        <div className="bg-white rounded-xl border border-stone-100 p-6 space-y-4">
          <div className="h-11 w-full bg-stone-100 rounded-xl" />
          <div className="h-48 w-48 bg-stone-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Profile & Payments</h1>
          <p className="text-sm text-stone-500 mt-0.5">Manage UPI settings for checkout</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#891816] text-white text-[13px] font-semibold rounded-xl hover:bg-[#6d1311] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-stone-100 p-6 space-y-6">
        {/* UPI ID */}
        <div>
          <label className={labelCls}>UPI ID</label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className={inputCls}
            placeholder="yourname@upi"
          />
          <p className="mt-1.5 text-[12px] text-stone-400">This will be shown to customers during UPI checkout</p>
        </div>

        {/* QR Code */}
        <div>
          <label className={labelCls}>UPI QR Code Image</label>
          {qrImage ? (
            <div className="relative inline-block">
              <div className="w-52 h-52 rounded-xl border border-stone-200 overflow-hidden bg-stone-50">
                <img src={qrImage} alt="UPI QR Code" className="w-full h-full object-contain" />
              </div>
              <button
                onClick={() => setQrImage("")}
                className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-sm"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <ImageUpload
              value={qrImage}
              onChange={(url) => setQrImage(url)}
              folder="easymom/qr"
              label="Upload QR Code"
            />
          )}
          <p className="mt-1.5 text-[12px] text-stone-400">Customers will scan this to pay via UPI. If not uploaded, UPI option won&apos;t show at checkout.</p>
        </div>

        {/* Preview */}
        {upiId && (
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-3">Checkout Preview</p>
            <div className="bg-white rounded-lg border border-stone-200 p-4 max-w-xs">
              <p className="text-[13px] font-semibold text-stone-900">Pay via UPI</p>
              <p className="mt-1 text-[12px] text-stone-500">Scan the QR or use UPI ID:</p>
              <p className="mt-1 font-mono text-[14px] font-semibold text-[#891816]">{upiId}</p>
              {qrImage && (
                <div className="mt-3 w-32 h-32 mx-auto">
                  <img src={qrImage} alt="QR Preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
