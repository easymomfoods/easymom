"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Save, X, GripVertical, Palette } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  tagline: string;
  description: string;
  count: number;
  accent: string;
  hue: number;
  sortOrder: number;
}

const inputCls = "w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30";
const labelCls = "block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", tagline: "", description: "", accent: "zinc", hue: 0, sortOrder: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) {
        fetchCategories(); setEditing(null); setShowAdd(false); setForm({ name: "", tagline: "", description: "", accent: "zinc", hue: 0, sortOrder: 0 });
        toast.success(editing ? "Category updated" : "Category created");
      } else {
        toast.error("Failed to save category");
      }
    } catch (e) { console.error(e); toast.error("Failed to save category"); } setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) { fetchCategories(); toast.success("Category deleted"); }
      else toast.error("Failed to delete category");
    } catch (e) { console.error(e); toast.error("Failed to delete category"); }
  }

  if (loading) return <div className="animate-pulse h-64 bg-white rounded-xl border border-stone-100" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Categories</h1>
          <p className="text-sm text-stone-500 mt-0.5">Manage product categories</p>
        </div>
        <button onClick={() => { setShowAdd(true); setEditing(null); setForm({ name: "", tagline: "", description: "", accent: "zinc", hue: 0, sortOrder: 0 }); }} className="flex items-center gap-2 px-4 py-2.5 bg-[#891816] text-white text-[13px] font-semibold rounded-xl hover:bg-[#6d1311] transition">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-stone-100 bg-stone-50/50">
            <th className="text-left px-5 py-3 text-[12px] font-semibold text-stone-500 uppercase">Category</th>
            <th className="text-left px-5 py-3 text-[12px] font-semibold text-stone-500 uppercase">Tagline</th>
            <th className="text-left px-5 py-3 text-[12px] font-semibold text-stone-500 uppercase">Products</th>
            <th className="text-right px-5 py-3 text-[12px] font-semibold text-stone-500 uppercase">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-stone-50">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-stone-50/50">
                <td className="px-5 py-3.5"><p className="font-medium text-stone-900">{c.name}</p><p className="text-[12px] text-stone-400 font-mono">{c.id}</p></td>
                <td className="px-5 py-3.5 text-[13px] text-stone-600">{c.tagline}</td>
                <td className="px-5 py-3.5 text-[13px] text-stone-600">{c.count}</td>
                <td className="px-5 py-3.5 text-right">
                  <button onClick={() => { setEditing(c); setForm({ name: c.name, tagline: c.tagline, description: c.description, accent: c.accent, hue: c.hue, sortOrder: c.sortOrder }); setShowAdd(true); }} className="p-2 rounded-lg text-stone-400 hover:text-[#891816] hover:bg-[#891816]/5"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showAdd || editing) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowAdd(false); setEditing(null); }}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{editing ? "Edit Category" : "Add Category"}</h2>
              <button onClick={() => { setShowAdd(false); setEditing(null); }} className="p-2 rounded-lg hover:bg-stone-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className={labelCls}>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
              <div className="col-span-2"><label className={labelCls}>Tagline</label><input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inputCls} /></div>
              <div className="col-span-2"><label className={labelCls}>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} rows={2} /></div>
              <div><label className={labelCls}>Sort Order</label><input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className={inputCls} /></div>
              <div><label className={labelCls}>Hue</label><input type="number" value={form.hue} onChange={(e) => setForm({ ...form, hue: Number(e.target.value) })} className={inputCls} /></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShowAdd(false); setEditing(null); }} className="flex-1 h-10 border border-stone-200 rounded-xl text-[13px] font-medium hover:bg-stone-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name} className="flex-1 h-10 bg-[#891816] text-white rounded-xl text-[13px] font-semibold hover:bg-[#6d1311] disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
