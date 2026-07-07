interface IconProps {
  className?: string;
  strokeWidth?: number;
}

export function PackageIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor">
      <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" strokeLinejoin="round" />
      <path d="M12 12L3 7" strokeLinejoin="round" />
      <path d="M12 12l9-5" strokeLinejoin="round" />
      <path d="M12 12v10" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LeafIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor">
      <path d="M4 20c2-4 6-8 12-12-4 6-8 10-12 12z" strokeLinejoin="round" />
      <path d="M16 4c-6 4-10 8-12 12" strokeLinecap="round" />
      <path d="M9 15c1-1.5 2.5-3 5-4.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function CircularArrowIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor">
      <path d="M12 3a9 9 0 1 1-6.36 2.64" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 3v4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MortarIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor">
      <path d="M5 14h14l-1.5 6.5a1 1 0 0 1-1 .8H7.5a1 1 0 0 1-1-.8L5 14z" strokeLinejoin="round" />
      <path d="M8 14V7a4 4 0 0 1 8 0v7" strokeLinejoin="round" />
      <path d="M10 5l2-2 2 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FlameIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor">
      <path d="M12 22c4-2 7-6 7-11 0-3-2-5.5-4-7 0 3-2 5-4 5s-3-2-3-5c-2 1.5-4 4-4 7 0 5 3 9 8 11z" strokeLinejoin="round" />
    </svg>
  );
}

export function ShieldIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor">
      <path d="M12 3l8 4v5c0 4.5-3.5 8.5-8 10-4.5-1.5-8-5.5-8-10V7l8-4z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
