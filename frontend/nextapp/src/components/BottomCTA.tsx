"use client";

import Link from "next/link";

interface BottomCTAProps {
  skipLabel: string;
  primaryLabel: string;
  nextPath: string;
  onPrimaryClick?: () => void;
  summary?: React.ReactNode;
}

export default function BottomCTA({
  skipLabel,
  primaryLabel,
  nextPath,
  onPrimaryClick,
  summary,
}: BottomCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-[420px] bg-[var(--color-surface-container-lowest)]/95 backdrop-blur-md border-t border-[var(--color-border-subtle)] p-[var(--spacing-margin)] shadow-2xl pointer-events-auto flex flex-col gap-2">
        {summary && (
          <div className="flex items-center justify-between px-1">
            {summary}
          </div>
        )}
        <Link
          href={nextPath}
          className="w-full h-14 px-5 rounded-xl flex items-center justify-center gap-1.5 bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] font-hanken text-[13px] leading-[18px] font-semibold hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-text-primary)] active:scale-[0.98] transition-all"
        >
          <span>{skipLabel}</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
        <Link
          href={nextPath}
          onClick={onPrimaryClick}
          className="w-full h-14 px-5 rounded-xl flex items-center justify-between bg-[#02152f] text-white font-bold hover:bg-opacity-95 active:scale-[0.98] transition-all shadow-lg group"
        >
          <span className="font-hanken text-[15px] tracking-tight font-bold">
            {primaryLabel}
          </span>
          <div className="flex items-center gap-1 text-[var(--color-secondary-container)] group-hover:translate-x-1 transition-transform">
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
