"use client";

import { useEffect, useState } from "react";
import { Save, RotateCcw, Plus, Trash2, MapPin, GripVertical } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface Store {
  id: string;
  name: string;
  area: string;
  phone: string;
  image: string;
  storeNumber: string;
}

interface LocationGroup {
  id: string;
  label: string;
  stores: Store[];
}

const defaults: LocationGroup[] = [
  {
    id: "udupi",
    label: "Udupi",
    stores: [
      { id: "u1", name: "EasyMom Pantry — Udupi Central", area: "Car Street, Udupi", phone: "+91 98765 43210", image: "", storeNumber: "01" },
      { id: "u2", name: "Spice Junction", area: "Kalsanka, Udupi", phone: "+91 98765 43211", image: "", storeNumber: "02" },
    ],
  },
  {
    id: "krishnapura",
    label: "Krishnapura",
    stores: [
      { id: "k1", name: "Krishnapura General Store", area: "Krishnapura, Udupi", phone: "+91 98765 43213", image: "", storeNumber: "03" },
    ],
  },
];

const inputCls = "w-full h-10 px-3 rounded-lg border border-stone-200 text-[13px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#891816]/10 focus:border-[#891816]/30";
const labelCls = "block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5";

function generateId() {
  return Math.random().toString(36).slice(2, 8);
}

export default function StoreLocationsEditor() {
  const [locations, setLocations] = useState<LocationGroup[]>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/site-content/store-locations")
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          try {
            const parsed = JSON.parse(d.value);
            if (Array.isArray(parsed) && parsed.length > 0) setLocations(parsed);
          } catch (e) { console.error(e); }
        }
      })
      .catch((e) => { console.error(e); })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/site-content/store-locations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: JSON.stringify(locations) }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    setSaving(false);
  }

  function addLocation() {
    setLocations([...locations, { id: generateId(), label: "New Location", stores: [] }]);
  }

  function removeLocation(locIdx: number) {
    if (!confirm("Remove this location and all its stores?")) return;
    setLocations(locations.filter((_, i) => i !== locIdx));
  }

  function updateLocationLabel(locIdx: number, label: string) {
    const next = [...locations];
    next[locIdx] = { ...next[locIdx], label };
    setLocations(next);
  }

  function addStore(locIdx: number) {
    const next = [...locations];
    const totalStores = next.reduce((sum, l) => sum + l.stores.length, 0);
    const storeNum = String(totalStores + 1).padStart(2, "0");
    next[locIdx] = {
      ...next[locIdx],
      stores: [...next[locIdx].stores, { id: generateId(), name: "", area: "", phone: "", image: "", storeNumber: storeNum }],
    };
    setLocations(next);
  }

  function removeStore(locIdx: number, storeIdx: number) {
    const next = [...locations];
    next[locIdx] = { ...next[locIdx], stores: next[locIdx].stores.filter((_, i) => i !== storeIdx) };
    setLocations(next);
  }

  function updateStore(locIdx: number, storeIdx: number, field: keyof Store, value: string) {
    const next = [...locations];
    const stores = [...next[locIdx].stores];
    stores[storeIdx] = { ...stores[storeIdx], [field]: value };
    next[locIdx] = { ...next[locIdx], stores };
    setLocations(next);
  }

  function moveStore(locIdx: number, fromIdx: number, direction: -1 | 1) {
    const next = [...locations];
    const stores = [...next[locIdx].stores];
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= stores.length) return;
    [stores[fromIdx], stores[toIdx]] = [stores[toIdx], stores[fromIdx]];
    next[locIdx] = { ...next[locIdx], stores };
    setLocations(next);
  }

  if (loading) return <div className="animate-pulse h-64 bg-white rounded-xl border border-stone-100" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Store Locations</h1>
          <p className="text-sm text-stone-500 mt-0.5">Manage the "Find EasyMom Near You" section</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { if (confirm("Reset all changes to defaults? This cannot be undone.")) setLocations(defaults); }} className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50">
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white bg-[#891816] rounded-xl hover:bg-[#6d1311] disabled:opacity-50">
            <Save className="h-4 w-4" />{saving ? "Saving..." : saved ? "Saved!" : "Save"}
          </button>
        </div>
      </div>

      {/* Locations */}
      {locations.map((loc, locIdx) => (
        <div key={loc.id} className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#891816]" />
              <input
                value={loc.label}
                onChange={(e) => updateLocationLabel(locIdx, e.target.value)}
                className="h-8 w-48 px-2 rounded-lg border border-stone-200 text-[14px] font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#891816]/10"
                placeholder="Location name"
              />
              <span className="text-[12px] text-stone-400">{loc.stores.length} stores</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => addStore(locIdx)} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#891816] bg-[#891816]/8 rounded-lg hover:bg-[#891816]/15">
                <Plus className="h-3.5 w-3.5" /> Add Store
              </button>
              <button onClick={() => removeLocation(locIdx)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {loc.stores.length === 0 && (
            <p className="text-center text-[13px] text-stone-400 py-6">No stores yet. Click "Add Store" to begin.</p>
          )}

          <div className="space-y-3">
            {loc.stores.map((store, storeIdx) => (
              <div key={store.id} className="border border-stone-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-stone-300" />
                    <span className="text-[11px] font-semibold text-stone-400">#{store.storeNumber}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveStore(locIdx, storeIdx, -1)} disabled={storeIdx === 0} className="p-1 rounded text-[11px] text-stone-400 hover:text-stone-700 disabled:opacity-30">↑</button>
                    <button onClick={() => moveStore(locIdx, storeIdx, 1)} disabled={storeIdx === loc.stores.length - 1} className="p-1 rounded text-[11px] text-stone-400 hover:text-stone-700 disabled:opacity-30">↓</button>
                    <button onClick={() => removeStore(locIdx, storeIdx)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Store Name</label>
                    <input value={store.name} onChange={(e) => updateStore(locIdx, storeIdx, "name", e.target.value)} className={inputCls} placeholder="Store name" />
                  </div>
                  <div>
                    <label className={labelCls}>Area / Location</label>
                    <input value={store.area} onChange={(e) => updateStore(locIdx, storeIdx, "area", e.target.value)} className={inputCls} placeholder="Area, City" />
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input value={store.phone} onChange={(e) => updateStore(locIdx, storeIdx, "phone", e.target.value)} className={inputCls} placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className={labelCls}>Store Number</label>
                    <input value={store.storeNumber} onChange={(e) => updateStore(locIdx, storeIdx, "storeNumber", e.target.value)} className={inputCls} placeholder="01" />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Store Image</label>
                  <ImageUpload
                    value={store.image}
                    onChange={(url) => updateStore(locIdx, storeIdx, "image", url)}
                    folder="easymom/stores"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add Location */}
      <button onClick={addLocation} className="flex items-center gap-2 px-4 py-3 text-[13px] font-medium text-[#891816] bg-[#891816]/5 border border-dashed border-[#891816]/20 rounded-xl hover:bg-[#891816]/10 w-full justify-center">
        <Plus className="h-4 w-4" /> Add Location
      </button>
    </div>
  );
}
