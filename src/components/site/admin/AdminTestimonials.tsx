"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Star,
  Pencil,
  Trash2,
  X,
  Quote,
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  role: string;
  quote: string;
  rating: number;
  product: string;
  active: boolean;
}

const emptyForm: Omit<Testimonial, "id"> = {
  name: "",
  location: "",
  role: "",
  quote: "",
  rating: 5,
  product: "",
  active: true,
};

const inputCls =
  "w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30";
const labelCls = "block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    const r = await fetch("/api/admin/testimonials").then((r) => r.json());
    setTestimonials(r.testimonials || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    setEditId(null);
    setForm(emptyForm);
    setModal(true);
  }

  function openEdit(t: Testimonial) {
    setEditId(t.id);
    setForm({ ...t });
    setModal(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editId) {
        await fetch(`/api/admin/testimonials/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setModal(false);
      load();
    } catch (e) { console.error(e); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    load();
  }

  const filtered = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.product.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-stone-200/60 rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-white rounded-xl border border-stone-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Testimonials</h1>
          <p className="text-sm text-stone-500 mt-0.5">{testimonials.length} reviews</p>
        </div>
        <button
          onClick={openAdd}
          disabled={testimonials.length >= 6}
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-white bg-[#891816] rounded-xl hover:bg-[#6d1311] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
          Add Review
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reviews..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-stone-200 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
        />
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[13px] text-stone-400">No reviews found</div>
        )}
        {filtered.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-stone-100 p-4 hover:bg-stone-50/50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#891816]/8">
                <Quote className="h-4 w-4 text-[#891816]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold text-stone-900">{t.name}</p>
                  {!t.active && (
                    <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">INACTIVE</span>
                  )}
                </div>
                <p className="text-[12px] text-stone-500">{t.role} · {t.location}</p>
                <p className="mt-2 text-[13px] text-stone-600 leading-relaxed line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400">·</span>
                  <span className="text-[11px] font-medium text-[#891816] bg-[#891816]/8 px-1.5 py-0.5 rounded">{t.product}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(t)}
                  className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-[#891816] transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <h2 className="text-[16px] font-semibold text-stone-900">
                {editId ? "Edit Review" : "Add Review"}
              </h2>
              <button onClick={() => setModal(false)} className="p-1.5 rounded-lg hover:bg-stone-100">
                <X className="h-5 w-5 text-stone-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className={labelCls}>Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Anjali Rao" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Role</label>
                  <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls} placeholder="Software engineer, two kids" />
                </div>
                <div>
                  <label className={labelCls}>Location</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls} placeholder="Bengaluru, Karnataka" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Quote</label>
                <textarea
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  className={inputCls + " h-24 py-2 resize-none"}
                  placeholder="What the customer said..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Product</label>
                  <input type="text" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className={inputCls} placeholder="Green Curry — Chicken or Meat" />
                </div>
                <div>
                  <label className={labelCls}>Rating (1-5)</label>
                  <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) || 5 })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Active</label>
                <select value={form.active ? "yes" : "no"} onChange={(e) => setForm({ ...form, active: e.target.value === "yes" })} className={inputCls}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-stone-100">
              <button onClick={() => setModal(false)} className="px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.quote}
                className="px-5 py-2.5 text-[13px] font-medium text-white bg-[#891816] rounded-xl hover:bg-[#6d1311] transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : editId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
