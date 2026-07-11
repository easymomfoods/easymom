"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Package,
  TrendingUp,
  Star,
  MoreHorizontal,
  Pencil,
  Trash2,
  Power,
  PowerOff,
  X,
  Filter,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  mrp: number;
  weight: string;
  rating: number;
  reviewCount: number;
  badge: string | null;
  bestSeller: boolean;
  isNew: boolean;
  img: string | null;
  images: string[];
  shortDesc: string;
  description: string;
  ingredients: string[];
  origin: string;
  shelfLife: string;
  spiceLevel: string;
  cookingTime: string;
  servings: string;
  tags: string[];
  hue: number;
  active: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (res.ok) setProducts(data.products);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(id: string, active: boolean) {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, active: !active } : p))
        );
      }
    } catch {}
  }

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {}
  }

  function inr(amount: number) {
    return "₹" + amount.toLocaleString("en-IN");
  }

  const activeCount = products.filter((p) => p.active).length;
  const inactiveCount = products.filter((p) => !p.active).length;
  const avgPrice = products.length
    ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
    : 0;

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" || (filter === "active" && p.active) || (filter === "inactive" && !p.active);
    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-stone-200/60 rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-stone-100" />
          ))}
        </div>
        <div className="h-96 bg-white rounded-xl border border-stone-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Products</h1>
          <p className="text-sm text-stone-500 mt-0.5">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#891816] text-white text-[13px] font-semibold rounded-xl hover:bg-[#6d1311] active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={String(products.length)} icon={<Package className="h-5 w-5" />} iconBg="bg-[#891816]/8" iconColor="text-[#891816]" />
        <StatCard label="Active" value={String(activeCount)} icon={<Power className="h-5 w-5" />} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard label="Inactive" value={String(inactiveCount)} icon={<PowerOff className="h-5 w-5" />} iconBg="bg-stone-100" iconColor="text-stone-500" />
        <StatCard label="Avg. Price" value={inr(avgPrice)} icon={<TrendingUp className="h-5 w-5" />} iconBg="bg-amber-50" iconColor="text-amber-600" />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-stone-200/60 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                filter === f
                  ? "bg-[#891816] text-white"
                  : "bg-white border border-stone-200/60 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-stone-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-stone-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-stone-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-stone-500 uppercase tracking-wider">Rating</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-stone-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-[12px] font-semibold text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[13px] text-stone-400">
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200/50">
                          {product.img ? (
                            <img src={product.img} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Package className="h-5 w-5 text-stone-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-medium text-stone-900 truncate">{product.name}</p>
                          <p className="text-[12px] text-stone-400 font-mono">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] text-stone-600 capitalize">{product.categoryId.replace(/-/g, " ")}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[14px] font-semibold text-stone-900">{inr(product.price)}</span>
                        <span className="text-[12px] text-stone-400 line-through">{inr(product.mrp)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-[13px] font-medium text-stone-700">{product.rating}</span>
                        <span className="text-[12px] text-stone-400">({product.reviewCount})</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded-full ${
                        product.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-stone-100 text-stone-500"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${product.active ? "bg-emerald-500" : "bg-stone-400"}`} />
                        {product.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-2 rounded-lg text-stone-400 hover:text-[#891816] hover:bg-[#891816]/5 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleActive(product.id, product.active)}
                          className={`p-2 rounded-lg transition-colors ${
                            product.active
                              ? "text-stone-400 hover:text-amber-600 hover:bg-amber-50"
                              : "text-stone-400 hover:text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={product.active ? "Deactivate" : "Activate"}
                        >
                          {product.active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/30">
            <p className="text-[12px] text-stone-500">
              Showing {filtered.length} of {products.length} products
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={(updated) => {
            setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setEditingProduct(null);
          }}
        />
      )}

      {/* Add Modal */}
      {showAddForm && (
        <ProductEditModal
          product={null}
          onClose={() => setShowAddForm(false)}
          onSave={(newProduct) => {
            setProducts((prev) => [newProduct, ...prev]);
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-100 p-4 hover:border-stone-200 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-[13px] text-stone-500">{label}</p>
          <p className="text-xl font-bold text-stone-900 tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ProductEditModal({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    categoryId: product?.categoryId || "",
    price: product?.price || 129,
    mrp: product?.mrp || 199,
    weight: product?.weight || "100 g",
    img: product?.img || "",
    shortDesc: product?.shortDesc || "",
    description: product?.description || "",
    origin: product?.origin || "Mangalore, Karnataka",
    shelfLife: product?.shelfLife || "6 months",
    spiceLevel: product?.spiceLevel || "Medium",
    cookingTime: product?.cookingTime || "5 min",
    servings: product?.servings || "Serves 4",
    hue: product?.hue || 0,
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
      const method = product ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) onSave(data.product);
    } catch {} finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full h-11 px-4 rounded-xl border border-stone-200 bg-stone-50/50 text-[14px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#891816]/15 focus:border-[#891816]/40 focus:bg-white transition-all";
  const labelCls = "block text-[13px] font-medium text-stone-700 mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-stone-900">{product ? "Edit Product" : "Add Product"}</h2>
            <p className="text-[13px] text-stone-500 mt-0.5">
              {product ? "Update product details" : "Add a new product to your catalog"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Preview */}
          {form.img && (
            <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl border border-stone-100">
              <div className="h-16 w-16 rounded-lg overflow-hidden bg-white border border-stone-200/50 shrink-0">
                <img src={form.img} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-medium text-stone-900 truncate">{form.name || "Product Name"}</p>
                <p className="text-[12px] text-stone-500">{form.weight} · {form.spiceLevel}</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-[14px] font-semibold text-[#891816]">{"₹" + form.price}</span>
                  <span className="text-[12px] text-stone-400 line-through">{"₹" + form.mrp}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Product Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="e.g. Green Curry — Chicken or Meat" required />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls} placeholder="green-curry" required disabled={!!product} />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <input type="text" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputCls} placeholder="green-curry" />
            </div>
            <div>
              <label className={labelCls}>Price (₹)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>MRP (₹)</label>
              <input type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Weight</label>
              <input type="text" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className={inputCls} placeholder="100 g" />
            </div>
            <div>
              <label className={labelCls}>Spice Level</label>
              <select value={form.spiceLevel} onChange={(e) => setForm({ ...form, spiceLevel: e.target.value })} className={inputCls}>
                <option>Mild</option>
                <option>Medium</option>
                <option>Hot</option>
                <option>Fiery</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Image URL</label>
              <input type="text" value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} className={inputCls} placeholder="/brand/products/green-curry1.png" />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Short Description</label>
              <input type="text" value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} className={inputCls} placeholder="Coastal green curry with fresh herbs..." />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} rows={3} placeholder="Full product description..." />
            </div>
            <div>
              <label className={labelCls}>Origin</label>
              <input type="text" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} className={inputCls} placeholder="Mangalore, Karnataka" />
            </div>
            <div>
              <label className={labelCls}>Shelf Life</label>
              <input type="text" value={form.shelfLife} onChange={(e) => setForm({ ...form, shelfLife: e.target.value })} className={inputCls} placeholder="6 months" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-stone-100">
            <button type="button" onClick={onClose} className="flex-1 h-11 px-4 border border-stone-200 text-stone-600 text-[14px] font-medium rounded-xl hover:bg-stone-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 h-11 px-4 bg-[#891816] text-white text-[14px] font-semibold rounded-xl hover:bg-[#6d1311] active:scale-[0.98] transition-all disabled:opacity-50">
              {saving ? "Saving..." : product ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
