"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Eye,
  RotateCcw,
  Plus,
  Trash2,
  Search,
  Sparkles,
  BookOpen,
  Clock,
  Users,
  MapPin,
} from "lucide-react";
import ImageUpload from "./ImageUpload";

interface RecipeSectionData {
  eyebrow: string;
  title: string;
  description: string;
  recipeIds: string[];
}

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
  img?: string;
}

const defaults: RecipeSectionData = {
  eyebrow: "From the kitchen",
  title: "Recipes built around the blend",
  description: "Three dishes that show what a proper masala can do — each tested, each under 30 minutes.",
  recipeIds: [],
};

export default function RecipesSectionEditor() {
  const [data, setData] = useState<RecipeSectionData>(defaults);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [allProducts, setAllProducts] = useState<Record<string, { img: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/site-content/recipes-section").then((r) => r.json()),
      fetch("/api/recipes").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ])
      .then(([contentData, recipesData, productsData]) => {
        if (contentData.value) {
          try {
            const parsed = JSON.parse(contentData.value);
            setData({ ...defaults, ...parsed });
          } catch {}
        }
        if (recipesData.recipes) {
          setAllRecipes(recipesData.recipes);
        }
        if (productsData.products) {
          const map: Record<string, { img: string }> = {};
          productsData.products.forEach((p: any) => {
            map[p.slug] = { img: p.img };
          });
          setAllProducts(map);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/site-content/recipes-section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: JSON.stringify(data) }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  }

  function handleReset() {
    setData(defaults);
  }

  function addRecipe(id: string) {
    if (!data.recipeIds.includes(id)) {
      setData({ ...data, recipeIds: [...data.recipeIds, id] });
    }
    setShowPicker(false);
    setSearch("");
  }

  function removeRecipe(id: string) {
    setData({ ...data, recipeIds: data.recipeIds.filter((r) => r !== id) });
  }

  const selectedRecipes = data.recipeIds
    .map((id) => allRecipes.find((r) => r.id === id))
    .filter(Boolean) as Recipe[];

  const availableRecipes = allRecipes.filter(
    (r) =>
      !data.recipeIds.includes(r.id) &&
      (r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.region.toLowerCase().includes(search.toLowerCase()))
  );

  function getRecipeImage(recipe: Recipe) {
    return allProducts[recipe.productSlug]?.img || "";
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-stone-200/60 rounded-lg" />
        <div className="h-96 bg-white rounded-xl border border-stone-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Recipes Section
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Edit the &quot;From the kitchen&quot; section on the homepage
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
          >
            <Eye className="h-4 w-4" />
            {preview ? "Edit" : "Preview"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white bg-[#891816] rounded-xl hover:bg-[#6d1311] transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {preview ? (
        /* ── Live Preview ── */
        <div className="bg-stone-50/60 rounded-xl border border-stone-100 p-8">
          <div className="max-w-[1200px] mx-auto">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#891816]">
                {data.eyebrow}
              </p>
              <h2 className="mt-3 text-[30px] font-semibold leading-[1.08] tracking-tight text-stone-900 sm:text-[38px]">
                {data.title}
              </h2>
              <p className="mt-3 max-w-lg text-[15px] leading-[1.7] text-stone-500">
                {data.description}
              </p>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-5 lg:grid-rows-2">
              {selectedRecipes.map((r, i) => {
                const img = getRecipeImage(r);
                const isFeatured = i === 0;
                return (
                  <div
                    key={r.id}
                    className={`group relative flex flex-col overflow-hidden rounded-sm border border-stone-200 bg-white ${
                      isFeatured ? "lg:col-span-3 lg:row-span-2" : "lg:col-span-2"
                    }`}
                  >
                    <div className={`relative overflow-hidden ${isFeatured ? "flex-1" : "aspect-[5/3]"}`}>
                      {img ? (
                        <img src={img} alt={r.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-stone-100 flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-stone-300" />
                        </div>
                      )}
                      <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-sm bg-white/90 px-2.5 py-1 text-[11px] font-medium text-stone-700 backdrop-blur-sm">
                        <MapPin className="h-3 w-3 text-[#891816]" /> {r.region}
                      </div>
                    </div>
                    <div className={`flex flex-col gap-2 ${isFeatured ? "p-6 sm:p-8" : "p-5 sm:p-6"}`}>
                      <h3 className={`${isFeatured ? "text-[24px] sm:text-[28px]" : "text-[19px]"} font-semibold leading-snug text-stone-900`}>
                        {r.title}
                      </h3>
                      <p className={`${isFeatured ? "text-[15px]" : "text-[14px]"} leading-[1.65] text-stone-500`}>
                        {r.excerpt}
                      </p>
                      <div className="mt-auto flex items-center gap-4 border-t border-stone-100 pt-4 text-[12px] text-stone-400">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> {r.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" /> Serves {r.serves}
                        </span>
                        <span className="ml-auto font-semibold text-stone-900">Read →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ── Edit Form ── */
        <>
          {/* Section Text */}
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <h3 className="text-[14px] font-semibold text-stone-900 mb-4">Section Header</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Eyebrow</label>
                  <input
                    type="text"
                    value={data.eyebrow}
                    onChange={(e) => setData({ ...data, eyebrow: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Title</label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  className="w-full h-20 px-3 py-2 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Recipe Selection */}
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-stone-900">
                Selected Recipes ({selectedRecipes.length})
              </h3>
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#891816] bg-[#891816]/8 rounded-lg hover:bg-[#891816]/15 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Recipe
              </button>
            </div>

            {/* Selected Recipes */}
            <div className="space-y-2">
              {selectedRecipes.length === 0 && (
                <p className="text-[13px] text-stone-400 py-4 text-center">
                  No recipes selected. Click &quot;Add Recipe&quot; to choose.
                </p>
              )}
              {selectedRecipes.map((r, idx) => {
                const img = getRecipeImage(r);
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors"
                  >
                    {img ? (
                      <img src={img} alt="" className="h-12 w-12 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                        <BookOpen className="h-4 w-4 text-stone-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {idx === 0 && (
                          <span className="text-[10px] font-bold text-[#891816] bg-[#891816]/10 px-1.5 py-0.5 rounded">FEATURED</span>
                        )}
                        <p className="text-[13px] font-medium text-stone-900 truncate">{r.title}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[12px] text-stone-500">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.region}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{r.time}</span>
                        <span>•</span>
                        <span>{r.difficulty}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeRecipe(r.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Recipe Picker */}
            {showPicker && (
              <div className="mt-4 border border-stone-200 rounded-xl overflow-hidden">
                <div className="p-3 border-b border-stone-100 bg-stone-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search recipes..."
                      className="w-full h-9 pl-9 pr-3 rounded-lg bg-white border border-stone-200 text-[13px] text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#891816]/10"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-stone-50">
                  {availableRecipes.length === 0 ? (
                    <p className="p-4 text-center text-[13px] text-stone-400">No recipes found</p>
                  ) : (
                    availableRecipes.map((r) => {
                      const img = getRecipeImage(r);
                      return (
                        <button
                          key={r.id}
                          onClick={() => addRecipe(r.id)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-stone-50 transition-colors text-left"
                        >
                          {img ? (
                            <img src={img} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                              <BookOpen className="h-4 w-4 text-stone-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-stone-900 truncate">{r.title}</p>
                            <p className="text-[12px] text-stone-500">{r.region} • {r.time} • {r.difficulty}</p>
                          </div>
                          <Plus className="h-4 w-4 text-stone-400 shrink-0" />
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-[#891816]/5 border border-[#891816]/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-[#891816] mt-0.5 shrink-0" />
              <p className="text-[13px] text-stone-600 leading-relaxed">
                The first recipe is displayed as the featured (large) card. Recipe
                details, steps, and images come from the Recipes section in the
                admin. Add/edit recipes from the Recipes page.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
