"use client";

import { useMemo } from "react";

type Props = {
  hue: number;
  name: string;
  weight?: string;
  className?: string;
  seed?: string;
};

/**
 * SpiceVisual — a generative, deterministic editorial product visual.
 * Renders a top-down "mound of spice" with scattered whole spices on a
 * warm cream tile. Deterministic from the seed so each product is
 * consistent across renders. No external images required.
 */
export function SpiceVisual({ hue, name, weight, className, seed = name }: Props) {
  const dots = useMemo(() => generateScatter(seed, 26), [seed]);
  const spices = useMemo(() => generateWholeSpices(seed, 7), [seed]);

  // spice powder mound colours, derived from hue
  const mound = `oklch(0.52 0.16 ${hue})`;
  const moundDeep = `oklch(0.40 0.17 ${hue})`;
  const moundLight = `oklch(0.62 0.15 ${hue})`;
  const tile = `oklch(0.965 0.012 ${hue > 60 ? 75 : hue})`;

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ background: tile }}
    >
      {/* warm radial wash */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 120% at 30% 25%, oklch(1 0 0 / 0.7), transparent 55%), radial-gradient(140% 120% at 85% 90%, oklch(0.40 0.16 ${hue} / 0.10), transparent 60%)`,
        }}
      />
      {/* fine grain */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* scattered whole spices (behind mound) */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {spices.map((s, i) => (
          <g key={i} transform={`translate(${s.x}% ${s.y}%) rotate(${s.r})`}>
            {s.kind === "oval" && (
              <ellipse rx={s.sz} ry={s.sz * 0.45} fill={`oklch(${0.35 + s.l} 0.14 ${hue + s.hShift})`} opacity={0.9} />
            )}
            {s.kind === "round" && (
              <circle r={s.sz * 0.55} fill={`oklch(${0.32 + s.l} 0.10 ${hue + s.hShift})`} opacity={0.92} />
            )}
            {s.kind === "star" && (
              <Star r={s.sz * 0.8} fill={`oklch(0.42 0.13 ${30 + s.hShift})`} />
            )}
            {s.kind === "stick" && (
              <rect x={-s.sz} y={-s.sz * 0.12} width={s.sz * 2} height={s.sz * 0.24} rx={s.sz * 0.12} fill={`oklch(0.40 0.10 ${35 + s.hShift})`} opacity={0.85} />
            )}
          </g>
        ))}
      </svg>

      {/* spice powder mound */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative h-[58%] w-[58%] rounded-full"
          style={{
            background: `radial-gradient(circle at 38% 32%, ${moundLight}, ${mound} 55%, ${moundDeep} 100%)`,
            boxShadow: `0 12px 28px -10px oklch(0.40 0.16 ${hue} / 0.45), inset 0 -6px 18px oklch(0.30 0.15 ${hue} / 0.35)`,
          }}
        >
          {/* mound texture dots */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {dots.map((d, i) => (
              <circle
                key={i}
                cx={d.x}
                cy={d.y}
                r={d.r}
                fill={`oklch(${0.30 + d.l} 0.16 ${hue})`}
                opacity={0.5}
              />
            ))}
          </svg>
          {/* highlight crescent */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(40% 30% at 36% 28%, oklch(1 0 0 / 0.30), transparent 70%)`,
            }}
          />
        </div>
      </div>

      {/* corner weight chip */}
      {weight && (
        <div className="absolute left-3 top-3 rounded-[4px] bg-white/80 px-2 py-0.5 text-[11px] font-medium tracking-wide text-foreground/70 backdrop-blur-sm">
          {weight}
        </div>
      )}
    </div>
  );
}

function Star({ r, fill }: { r: number; fill: string }) {
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2;
    const rad = i % 2 === 0 ? r : r * 0.4;
    pts.push(`${Math.cos(ang) * rad},${Math.sin(ang) * rad}`);
  }
  return <polygon points={pts.join(" ")} fill={fill} opacity={0.85} />;
}

// deterministic PRNG from string
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateScatter(seed: string, n: number) {
  const rnd = hash(seed);
  return Array.from({ length: n }, () => ({
    x: 10 + rnd() * 80,
    y: 10 + rnd() * 80,
    r: 0.4 + rnd() * 1.4,
    l: rnd() * 0.2,
  }));
}

function generateWholeSpices(seed: string, n: number) {
  const rnd = hash(seed + "spice");
  const kinds = ["oval", "round", "star", "stick"] as const;
  return Array.from({ length: n }, () => ({
    x: 12 + rnd() * 76,
    y: 14 + rnd() * 72,
    r: rnd() * 360,
    sz: 2.2 + rnd() * 2.6,
    l: rnd() * 0.2,
    hShift: (rnd() - 0.5) * 30,
    kind: kinds[Math.floor(rnd() * kinds.length)],
  }));
}
