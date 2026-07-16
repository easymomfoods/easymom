"use client";

import { useEffect, useState } from "react";

export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    let fadeTimer: ReturnType<typeof setTimeout>;

    const hide = () => {
      setVisible(false);
      fadeTimer = setTimeout(() => setRemoved(true), 300);
    };

    if (document.readyState === "complete") {
      setTimeout(hide, 200);
    } else {
      const onLoad = () => setTimeout(hide, 200);
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }

    const start = setTimeout(hide, 600);
    return () => {
      clearTimeout(start);
      clearTimeout(fadeTimer);
    };
  }, []);

  if (removed) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-[#faf8f3] transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <img
        src="/brand/easymom-logo.png"
        alt="EasyMom"
        className="h-40 w-auto animate-pulse"
        fetchPriority="high"
      />
    </div>
  );
}
