export function Arrow({ direction = "up-right", className = "" }) {
  return (
    <svg className={`arrow-icon arrow-${direction} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 18 18 6M6 6h12v12" />
    </svg>
  );
}

export function BrandMark({ className = "" }) {
  return (
    <svg className={`brand-icon ${className}`} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="15" fill="currentColor" />
      <path d="M11 20 22 45 32 20M38 45V20h7a7 7 0 0 1 0 14h-7" fill="none" stroke="var(--brand-cutout, var(--paper))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="52" cy="12" r="4" fill="var(--signal)" />
    </svg>
  );
}
