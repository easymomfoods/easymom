"use client";

import { useEffect, useState } from "react";

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

export default function AdminProducts({ onBack }: { onBack: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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
    } catch {
      // ignore
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      // ignore
    }
  }

  function inr(amount: number) {
    return "₹" + amount.toLocaleString("en-IN");
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-stone-200 rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-stone-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Products</h1>
          <p className="text-sm text-stone-500">{products.length} products</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-[#891816] text-white text-sm font-medium rounded-xl hover:bg-[#6d1311] transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left px-4 py-3 font-medium text-stone-500">Product</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Price</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.img && <img src={product.img} alt={product.name} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">{product.name}</p>
                        <p className="text-xs text-stone-500">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium">{inr(product.price)}</span>
                    <span className="text-stone-400 line-through ml-1">{inr(product.mrp)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${product.active ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="px-3 py-1 text-xs bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleActive(product.id, product.active)}
                        className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                          product.active ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {product.active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      if (res.ok) {
        onSave(data.product);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-stone-900">{product ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#891816]/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#891816]/20"
                required
                disabled={!!product}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
              <input
                type="text"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#891816]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Price (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#891816]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">MRP (₹)</label>
              <input
                type="number"
                value={form.mrp}
                onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#891816]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
            <input
              type="text"
              value={form.img}
              onChange={(e) => setForm({ ...form, img: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#891816]/20"
              placeholder="/brand/products/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Short Description</label>
            <input
              type="text"
              value={form.shortDesc}
              onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#891816]/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#891816]/20"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Spice Level</label>
              <select
                value={form.spiceLevel}
                onChange={(e) => setForm({ ...form, spiceLevel: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#891816]/20"
              >
                <option>Mild</option>
                <option>Medium</option>
                <option>Hot</option>
                <option>Fiery</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Weight</label>
              <input
                type="text"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#891816]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Origin</label>
              <input
                type="text"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#891816]/20"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-stone-200 text-stone-600 font-medium rounded-xl hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 px-4 bg-[#891816] text-white font-medium rounded-xl hover:bg-[#6d1311] transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : product ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
