"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "easymom",
  label,
  className = "",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.ok) {
        onChange(data.url);
      }
    } catch {}
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}

      {/* Preview */}
      {value && (
        <div className="relative rounded-xl overflow-hidden border border-stone-200 aspect-square w-40 bg-stone-50 mb-2 group">
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Drop zone / Upload button */}
      {!value && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`w-40 flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            dragOver
              ? "border-[#891816] bg-[#891816]/5"
              : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
          }`}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 text-[#891816] animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4 text-stone-400" />
          )}
          <span className="text-[11px] text-stone-500 leading-tight">
            {uploading ? "Uploading..." : "Click or drag"}
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
