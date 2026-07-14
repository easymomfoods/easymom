"use client";

import { useEffect, useState } from "react";
import { Save, RotateCcw, Plus, Trash2, Tag, Percent } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discountPct: number;
  active: boolean;
  usageLimit: number | null;
  description: string;
}

const defaults: Coupon[] = [];

const inputCls = "w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30";
const labelCls = "block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5";

function generateId() {
  return Math.random().toString(36).slice(2, 8);
}

export default function CouponEditor() {
  const [coupons, setCoupons] = useState<Coupon[]>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/site-content/coupons")
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          try {
            const parsed = JSON.parse(d.value);
            if (Array.isArray(parsed)) setCoupons(parsed);
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
      await fetch("/api/site-content/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: JSON.stringify(coupons) }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  }

  function addCoupon() {
    setCoupons([
      ...coupons,
      { id: generateId(), code: "", discountPct: 10, active: true, usageLimit: null, description: "" },
    ]);
  }

  function removeCoupon(idx: number) {
    setCoupons(coupons.filter((_, i) => i !== idx));
  }

  function updateCoupon(idx: number, field: keyof Coupon, value: any) {
    const next = [...coupons];
    next[idx] = { ...next[idx], [field]: value };
    setCoupons(next);
  }

  if (loading) return <div className="animate-pulse h-64 bg-white rounded-xl border border-stone-100" />;

  const activeCount = coupons.filter((c) => c.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Coupons</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Manage discount codes · {activeCount} active
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white bg-[#891816] rounded-xl hover:bg-[#6d1311] disabled:opacity-50">
            <Save className="h-4 w-4" />{saving ? "Saving..." : saved ? "Saved!" : "Save"}
          </button>
        </div>
      </div>

      {coupons.length === 0 && (
        <div className="bg-white rounded-xl border border-stone-100 p-12 text-center">
          <Tag className="mx-auto h-8 w-8 text-stone-300" />
          <p className="mt-3 text-[14px] font-semibold text-stone-900">No coupons yet</p>
          <p className="mt-1 text-[13px] text-stone-500">Add a coupon code to offer discounts to customers.</p>
          <button onClick={addCoupon} className="mt-4 flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-[#891816] bg-[#891816]/8 rounded-lg hover:bg-[#891816]/15 mx-auto">
            <Plus className="h-4 w-4" /> Add Coupon
          </button>
        </div>
      )}

      {coupons.map((coupon, idx) => (
        <div key={coupon.id} className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tag className="h-4 w-4 text-[#891816]" />
              <span className="text-[14px] font-semibold text-stone-900">
                {coupon.code || "Untitled Coupon"}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${coupon.active ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                {coupon.active ? "Active" : "Inactive"}
              </span>
            </div>
            <button onClick={() => removeCoupon(idx)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className={labelCls}>Code</label>
              <input
                value={coupon.code}
                onChange={(e) => updateCoupon(idx, "code", e.target.value.toUpperCase())}
                className={inputCls}
                placeholder="EASY10"
              />
            </div>
            <div>
              <label className={labelCls}>Discount %</label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={coupon.discountPct}
                  onChange={(e) => updateCoupon(idx, "discountPct", Number(e.target.value))}
                  className={inputCls}
                />
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Usage Limit</label>
              <input
                type="number"
                min={0}
                value={coupon.usageLimit ?? ""}
                onChange={(e) => updateCoupon(idx, "usageLimit", e.target.value ? Number(e.target.value) : null)}
                className={inputCls}
                placeholder="Unlimited"
              />
            </div>
            <div>
              <label className={labelCls}>Active</label>
              <button
                onClick={() => updateCoupon(idx, "active", !coupon.active)}
                className={`h-10 w-full rounded-lg border text-[13px] font-medium transition ${
                  coupon.active
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "border-stone-200 bg-stone-50 text-stone-500 hover:bg-stone-100"
                }`}
              >
                {coupon.active ? "Active" : "Inactive"}
              </button>
            </div>
          </div>

          <div>
            <label className={labelCls}>Description (internal note)</label>
            <input
              value={coupon.description}
              onChange={(e) => updateCoupon(idx, "description", e.target.value)}
              className={inputCls}
              placeholder="e.g. Welcome discount for new customers"
            />
          </div>
        </div>
      ))}

      {coupons.length > 0 && (
        <button onClick={addCoupon} className="flex items-center gap-2 px-4 py-3 text-[13px] font-medium text-[#891816] bg-[#891816]/5 border border-dashed border-[#891816]/20 rounded-xl hover:bg-[#891816]/10 w-full justify-center">
          <Plus className="h-4 w-4" /> Add Coupon
        </button>
      )}
    </div>
  );
}
