"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-[var(--spacing-margin)] h-14 w-full bg-[var(--color-surface-container-lowest)]/95 backdrop-blur-md border-b border-[var(--color-border-subtle)] shadow-sm">
      <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--color-text-primary)] shrink-0 border border-[var(--color-border-subtle)] shadow-sm">
          <span className="material-symbols-outlined text-[20px]">storefront</span>
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-nowrap">
            <span className="text-[15px] font-bold text-[var(--color-text-primary)] leading-none tracking-tight truncate">
              CU 강남중앙
            </span>
            <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] text-[11px] font-semibold tracking-tight border border-[var(--color-border-subtle)] leading-none">
              #1042
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 leading-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-active)] animate-pulse shrink-0" />
            <span className="text-[11px] font-medium text-[var(--color-text-muted)] truncate leading-none">
              POS 실시간 연동 · 1분 전
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          aria-label="알림"
          className="relative w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] transition-colors active:scale-95"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[var(--color-primary-container)] text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white leading-none">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
