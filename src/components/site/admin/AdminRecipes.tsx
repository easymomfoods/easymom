"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  BookOpen,
  Pencil,
  Trash2,
  X,
  Clock,
  Users,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  region: string;
  time: string;
  serves: string;
  difficulty: string;
  productSlug: string;
  excerpt: string;
  steps: string[];
  hue: number;
  active: boolean;
}

interface Product {
  slug: string;
  name: string;
  img: string | null;
}

const emptyForm: Omit<Recipe, "id"> = {
  title: "",
  region: "",
  time: "5 min",
  serves: "4",
  difficulty: "Easy",
  productSlug: "",
  excerpt: "",
  steps: [],
  hue: 0,
  active: true,
};

const inputCls =
  "w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30";
const labelCls = "block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5";

export default function AdminRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [newStep, setNewStep] = useState("");
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function load() {
    const [r, p] = await Promise.all([
      fetch("/api/admin/recipes").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ]);
    setRecipes(r.recipes || []);
    setProducts(p.products || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    setEditId(null);
    setForm(emptyForm);
    setNewStep("");
    setModal(true);
  }

  function openEdit(r: Recipe) {
    setEditId(r.id);
    setForm({ ...r });
    setNewStep("");
    setModal(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editId) {
        await fetch(`/api/admin/recipes/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/admin/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setModal(false);
      load();
    } catch {}
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this recipe?")) return;
    await fetch(`/api/admin/recipes/${id}`, { method: "DELETE" });
    load();
  }

  function addStep() {
    if (newStep.trim()) {
      setForm({ ...form, steps: [...form.steps, newStep.trim()] });
      setNewStep("");
    }
  }

  function removeStep(idx: number) {
    setForm({ ...form, steps: form.steps.filter((_, i) => i !== idx) });
  }

  function moveStep(idx: number, dir: -1 | 1) {
    const steps = [...form.steps];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= steps.length) return;
    [steps[idx], steps[newIdx]] = [steps[newIdx], steps[idx]];
    setForm({ ...form, steps });
  }

  const filtered = recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.region.toLowerCase().includes(search.toLowerCase())
  );

  const getProductImg = (slug: string) => products.find((p) => p.slug === slug)?.img || "";

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
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Recipes</h1>
          <p className="text-sm text-stone-500 mt-0.5">{recipes.length} recipes in database</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-white bg-[#891816] rounded-xl hover:bg-[#6d1311] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Recipe
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-stone-200 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
        />
      </div>

      {/* Recipe List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[13px] text-stone-400">No recipes found</div>
        )}
        {filtered.map((r) => {
          const img = getProductImg(r.productSlug);
          const expanded = expandedId === r.id;
          return (
            <div key={r.id} className="bg-white rounded-xl border border-stone-100 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50/50 transition-colors">
                {img ? (
                  <img src={img} alt="" className="h-14 w-14 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="h-14 w-14 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-stone-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-semibold text-stone-900 truncate">{r.title}</p>
                    {!r.active && (
                      <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">INACTIVE</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[12px] text-stone-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.region}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{r.time}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />Serves {r.serves}</span>
                    <span>·</span>
                    <span>{r.difficulty}</span>
                    <span>·</span>
                    <span>{r.steps.length} steps</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setExpandedId(expanded ? null : r.id)}
                    className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 transition-colors"
                  >
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => openEdit(r)}
                    className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-[#891816] transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Steps */}
              {expanded && (
                <div className="px-4 pb-4 border-t border-stone-100 pt-3">
                  <p className="text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-2">Recipe Steps</p>
                  <ol className="space-y-2">
                    {r.steps.map((s, idx) => (
                      <li key={idx} className="flex gap-2 text-[13px] text-stone-600">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#891816] text-[10px] font-bold text-white mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                  {r.excerpt && (
                    <p className="mt-3 text-[12px] text-stone-400 italic">{r.excerpt}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <h2 className="text-[16px] font-semibold text-stone-900">
                {editId ? "Edit Recipe" : "Add Recipe"}
              </h2>
              <button onClick={() => setModal(false)} className="p-1.5 rounded-lg hover:bg-stone-100">
                <X className="h-5 w-5 text-stone-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelCls}>Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Green Curry Chicken" />
                </div>
                <div>
                  <label className={labelCls}>Region</label>
                  <input type="text" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className={inputCls} placeholder="Mangalore, Karnataka" />
                </div>
                <div>
                  <label className={labelCls}>Product Slug</label>
                  <select value={form.productSlug} onChange={(e) => setForm({ ...form, productSlug: e.target.value })} className={inputCls}>
                    <option value="">Select product...</option>
                    {products.map((p) => (
                      <option key={p.slug} value={p.slug}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Time</label>
                  <input type="text" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className={inputCls} placeholder="5 min" />
                </div>
                <div>
                  <label className={labelCls}>Serves</label>
                  <input type="text" value={form.serves} onChange={(e) => setForm({ ...form, serves: e.target.value })} className={inputCls} placeholder="4" />
                </div>
                <div>
                  <label className={labelCls}>Difficulty</label>
                  <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className={inputCls}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Active</label>
                  <select value={form.active ? "yes" : "no"} onChange={(e) => setForm({ ...form, active: e.target.value === "yes" })} className={inputCls}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className={inputCls + " h-20 py-2 resize-none"}
                  placeholder="Short description of the recipe..."
                />
              </div>

              {/* Steps */}
              <div>
                <label className={labelCls}>Steps ({form.steps.length})</label>
                <div className="space-y-2 mb-2">
                  {form.steps.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 bg-stone-50 rounded-lg">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#891816] text-[10px] font-bold text-white mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="flex-1 text-[13px] text-stone-700">{s}</p>
                      <button onClick={() => moveStep(idx, -1)} className="p-1 rounded hover:bg-stone-200 text-stone-400"><ChevronUp className="h-3 w-3" /></button>
                      <button onClick={() => moveStep(idx, 1)} className="p-1 rounded hover:bg-stone-200 text-stone-400"><ChevronDown className="h-3 w-3" /></button>
                      <button onClick={() => removeStep(idx)} className="p-1 rounded hover:bg-red-100 text-stone-400 hover:text-red-500"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addStep(); } }}
                    className="flex-1 h-9 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10"
                    placeholder="Add a step..."
                  />
                  <button onClick={addStep} className="px-3 h-9 rounded-lg bg-stone-100 text-[13px] font-medium text-stone-700 hover:bg-stone-200 transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-stone-100">
              <button onClick={() => setModal(false)} className="px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title}
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
