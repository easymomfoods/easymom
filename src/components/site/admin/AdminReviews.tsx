"use client";

import { useEffect, useState } from "react";
import { Check, Trash2, Star, Eye, Clock, X } from "lucide-react";

interface Review {
  id: string;
  productId: string;
  name: string;
  email: string | null;
  rating: number;
  title: string;
  body: string;
  active: boolean;
  createdAt: string;
  product?: { name: string };
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  useEffect(() => { fetchReviews(); }, []);

  async function fetchReviews() {
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function approveReview(id: string) {
    try {
      await fetch(`/api/admin/reviews/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: true }) });
      fetchReviews();
    } catch (e) { console.error(e); }
  }

  async function rejectReview(id: string) {
    try {
      await fetch(`/api/admin/reviews/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: false }) });
      fetchReviews();
    } catch (e) { console.error(e); }
  }

  async function deleteReview(id: string) {
    if (!confirm("Delete this review?")) return;
    try { await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" }); fetchReviews(); } catch (e) { console.error(e); }
  }

  const filtered = reviews.filter((r) => filter === "all" || (filter === "pending" && !r.active) || (filter === "approved" && r.active));

  if (loading) return <div className="animate-pulse h-64 bg-white rounded-xl border border-stone-100" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Reviews</h1>
          <p className="text-sm text-stone-500 mt-0.5">Approve or reject customer reviews</p>
        </div>
        <div className="flex gap-2">
          {(["pending", "approved", "all"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3.5 py-2 text-[13px] font-medium rounded-lg transition ${filter === f ? "bg-[#891816] text-white" : "bg-white border border-stone-200/60 text-stone-600 hover:bg-stone-50"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-stone-400 py-12">No {filter} reviews</p>
        ) : (
          filtered.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border border-stone-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-[#891816]/10 text-[#891816] text-[14px] font-semibold shrink-0">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-stone-900">{review.name}</p>
                      <p className="text-[12px] text-stone-400">
                        {new Date(review.createdAt).toLocaleDateString("en-IN")} · Product #{review.productId.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />
                    ))}
                  </div>
                  <h4 className="mt-2 text-[14px] font-semibold text-stone-900">{review.title}</h4>
                  <p className="mt-1 text-[13px] text-stone-600">{review.body}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!review.active && (
                    <button onClick={() => approveReview(review.id)} className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition">
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  {review.active && (
                    <button onClick={() => rejectReview(review.id)} className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition">
                      <X className="h-3.5 w-3.5" /> Reject
                    </button>
                  )}
                  <button onClick={() => deleteReview(review.id)} className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
