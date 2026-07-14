"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useUI } from "@/lib/ui-store";
import { defaultLegal } from "@/components/site/legal-defaults";

interface LegalSection {
  heading: string;
  body: string;
}

interface LegalDoc {
  title: string;
  updated: string;
  sections: LegalSection[];
}

export function LegalView({
  docKey,
  label,
}: {
  docKey: string;
  label: string;
}) {
  const go = useUI((s) => s.go);
  const [doc, setDoc] = useState<LegalDoc>(() => defaultLegal(docKey));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/site-content/${docKey}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          try {
            const parsed = JSON.parse(d.value);
            setDoc({ ...defaultLegal(docKey), ...parsed });
          } catch (e) {
            console.error(e);
          }
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setLoading(false));
  }, [docKey]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-stone-200/60" />
        <div className="mt-8 space-y-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-stone-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
      <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <button onClick={() => go({ name: "home" })} className="hover:text-foreground">
          Home
        </button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{label}</span>
      </nav>
      <h1 className="text-[34px] font-bold tracking-tight text-stone-900 sm:text-[42px]">
        {doc.title}
      </h1>
      <p className="mt-2 text-[13px] text-stone-400">Last updated: {doc.updated}</p>
      <div className="mt-8 space-y-7">
        {doc.sections.map((s, i) => (
          <div key={i}>
            <h2 className="text-[17px] font-semibold text-stone-900">{s.heading}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-stone-600 whitespace-pre-line">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
