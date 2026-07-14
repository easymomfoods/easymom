"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Save, X, GripVertical } from "lucide-react";

interface Faq {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  active: boolean;
}

const inputCls = "w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30";
const labelCls = "block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5";
const textareaCls = "w-full px-3 py-2.5 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30 resize-none";

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ question: "", answer: "", sortOrder: 0, active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchFaqs(); }, []);

  async function fetchFaqs() {
    try {
      const res = await fetch("/api/admin/faqs");
      const data = await res.json();
      if (data.faqs) setFaqs(data.faqs);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/faqs/${editing.id}` : "/api/admin/faqs";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { fetchFaqs(); setEditing(null); setShowAdd(false); setForm({ question: "", answer: "", sortOrder: 0, active: true }); }
    } catch (e) { console.error(e); } setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    try { await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" }); fetchFaqs(); } catch (e) { console.error(e); }
  }

  async function toggleActive(faq: Faq) {
    try {
      await fetch(`/api/admin/faqs/${faq.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...faq, active: !faq.active }) });
      fetchFaqs();
    } catch (e) { console.error(e); }
  }

  if (loading) return <div className="animate-pulse h-64 bg-white rounded-xl border border-stone-100" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">FAQs</h1>
          <p className="text-sm text-stone-500 mt-0.5">Manage frequently asked questions</p>
        </div>
        <button onClick={() => { setShowAdd(true); setEditing(null); setForm({ question: "", answer: "", sortOrder: 0, active: true }); }} className="flex items-center gap-2 px-4 py-2.5 bg-[#891816] text-white text-[13px] font-semibold rounded-xl hover:bg-[#6d1311] transition">
          <Plus className="h-4 w-4" /> Add FAQ
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-xl border border-stone-100 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-stone-900">{faq.question}</p>
                <p className="mt-1 text-[13px] text-stone-500 line-clamp-2">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggleActive(faq)} className={`px-2.5 py-1 text-[11px] font-medium rounded-full ${faq.active ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>{faq.active ? "Active" : "Inactive"}</button>
                <button onClick={() => { setEditing(faq); setForm({ question: faq.question, answer: faq.answer, sortOrder: faq.sortOrder, active: faq.active }); setShowAdd(true); }} className="p-2 rounded-lg text-stone-400 hover:text-[#891816] hover:bg-[#891816]/5"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(faq.id)} className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {faqs.length === 0 && <p className="text-center text-stone-400 py-12">No FAQs yet</p>}
      </div>

      {(showAdd || editing) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowAdd(false); setEditing(null); }}>
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{editing ? "Edit FAQ" : "Add FAQ"}</h2>
              <button onClick={() => { setShowAdd(false); setEditing(null); }} className="p-2 rounded-lg hover:bg-stone-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className={labelCls}>Question</label><input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className={inputCls} placeholder="How long does delivery take?" /></div>
              <div><label className={labelCls}>Answer</label><textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className={textareaCls} rows={4} placeholder="Orders are dispatched within 24 hours..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Sort Order</label><input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className={inputCls} /></div>
                <div className="flex items-end pb-1"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded" /><span className="text-[13px] font-medium text-stone-700">Active</span></label></div>
              </div>
            </div>
            <div className="flex gap-3 pt-2 border-t border-stone-100">
              <button onClick={() => { setShowAdd(false); setEditing(null); }} className="flex-1 h-10 border border-stone-200 rounded-xl text-[13px] font-medium hover:bg-stone-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.question || !form.answer} className="flex-1 h-10 bg-[#891816] text-white rounded-xl text-[13px] font-semibold hover:bg-[#6d1311] disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
