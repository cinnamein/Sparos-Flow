"use client";

import { useState, useEffect } from "react";
import StepIndicator from "@/components/StepIndicator";
import BottomCTA from "@/components/BottomCTA";
import { getSessionData, updateStep4 } from "@/lib/session";
import type { DisposalItem } from "@/lib/types";

export default function Step4Page() {
  const [disposals, setDisposals] = useState<DisposalItem[]>([]);

  useEffect(() => {
    setDisposals(getSessionData().step4.disposals);
  }, []);

  const adjustDisposeQty = (id: string, delta: number) => {
    setDisposals((prev) => {
      const next = prev.map((d) => {
        if (d.id !== id) return d;
        const qty = Math.max(0, Math.min(d.stock, d.disposeQty + delta));
        return { ...d, disposeQty: qty };
      });
      updateStep4(next);
      return next;
    });
  };

  const urgentCount = disposals.filter((d) => d.status === "urgent").length;
  const partialCount = disposals.filter((d) => d.status === "partial").length;

  return (
    <>
      <StepIndicator currentStep={4} />

      {/* Urgent Banner */}
      <section className="bg-[var(--color-primary-container)] text-[var(--color-surface-container-lowest)] p-[var(--spacing-space-md)] rounded-xl relative overflow-hidden shadow-sm">
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-secondary-container)] text-[var(--color-text-primary)]">
                <span className="material-symbols-outlined text-[14px] fill">
                  warning
                </span>
              </span>
              <span className="text-[10px] text-[var(--color-secondary-fixed-dim)] uppercase tracking-wider font-bold">
                소비기한 만료 점검
              </span>
            </div>
            <h2 className="font-hanken text-[17px] font-bold text-[var(--color-surface-container-lowest)] tracking-tight leading-snug">
              오늘 만료 임박 상품을
              <br />
              최종 처리합니다.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-[var(--spacing-space-md)] pt-[var(--spacing-space-sm)] border-t border-slate-700/60 relative z-10">
          <div className="bg-[var(--color-surface-container-lowest)]/10 backdrop-blur-sm p-2 rounded-lg border border-white/10 flex items-center justify-between">
            <div>
              <span className="block text-[11px] text-[var(--color-surface-variant)] font-medium">
                14:00 폐기 대상
              </span>
              <span className="font-jetbrains text-[20px] font-bold text-[var(--color-secondary-fixed-dim)]">
                {String(urgentCount + partialCount).padStart(2, "0")}
                <span className="text-[11px] ml-0.5 font-normal text-[var(--color-surface-container-lowest)]">
                  건
                </span>
              </span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[var(--color-error)]/30 text-[var(--color-error-container)] text-[10px] font-bold font-jetbrains border border-[var(--color-error)]/40">
              급박
            </span>
          </div>
          <div className="bg-[var(--color-surface-container-lowest)]/10 backdrop-blur-sm p-2 rounded-lg border border-white/10 flex items-center justify-between">
            <div>
              <span className="block text-[11px] text-[var(--color-surface-variant)] font-medium">
                20:00 야간 대상
              </span>
              <span className="font-jetbrains text-[20px] font-bold text-[var(--color-surface-container-lowest)]">
                03
                <span className="text-[11px] ml-0.5 font-normal text-[var(--color-surface-container-lowest)]">
                  건
                </span>
              </span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-slate-700/50 text-[var(--color-surface-variant)] text-[10px] font-bold font-jetbrains">
              대기
            </span>
          </div>
        </div>
      </section>

      {/* Inspection Items */}
      <section className="space-y-[var(--spacing-space-md)]">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="font-hanken text-[15px] font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[var(--color-text-primary)] text-[18px]">
              schedule
            </span>
            점검 대상 상품 ({disposals.length})
          </h3>
        </div>

        {disposals.map((item) => {
          if (item.status === "urgent") {
            return (
              <article
                key={item.id}
                className="bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-border-subtle)] shadow-sm overflow-hidden border-l-4 border-l-[var(--color-error)]"
              >
                <div className="p-[var(--spacing-space-md)]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-[var(--color-error-container)] text-[var(--color-alert-critical)] text-[10px] font-bold uppercase">
                          {item.expiryLabel}
                        </span>
                        <span className="font-jetbrains text-[11px] text-[var(--color-alert-critical)] font-bold">
                          {item.timeRemaining}
                        </span>
                      </div>
                      <h4 className="font-hanken text-[15px] font-bold text-[var(--color-text-primary)]">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[var(--color-text-muted)]">
                        바코드: {item.barcode} · 현재고: {item.stock}개
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-[var(--color-surface-muted)] flex items-center justify-center shrink-0 border border-slate-200">
                      <span className="material-symbols-outlined text-[var(--color-text-muted)] text-[24px]">
                        {item.icon}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-[var(--spacing-space-md)] pt-[var(--spacing-space-sm)] border-t border-slate-100">
                    <button
                      className="w-full h-12 px-2 rounded-xl bg-[var(--color-alert-critical)] text-[var(--color-on-error)] text-[14px] flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-sm hover:brightness-110"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete_forever
                      </span>
                      <span className="font-bold">즉시 폐기 등록</span>
                    </button>
                    <button
                      className="w-full h-12 px-2 rounded-xl bg-[var(--color-secondary-container)] text-[var(--color-text-primary)] text-[14px] flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-sm hover:brightness-95"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        percent
                      </span>
                      <span className="font-bold">마감할인 20%</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          }

          if (item.status === "partial") {
            return (
              <article
                key={item.id}
                className="bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-border-subtle)] shadow-sm overflow-hidden border-l-4 border-l-[var(--color-secondary-container)]"
              >
                <div className="p-[var(--spacing-space-md)]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-[var(--color-alert-warning-bg)] text-[var(--color-secondary)] text-[10px] font-bold uppercase border border-[var(--color-secondary-container)]/40">
                          {item.expiryLabel}
                        </span>
                        <span className="font-jetbrains text-[11px] text-[var(--color-text-primary)] font-bold">
                          {item.timeRemaining}
                        </span>
                      </div>
                      <h4 className="font-hanken text-[15px] font-bold text-[var(--color-text-primary)]">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[var(--color-text-muted)]">
                        바코드: {item.barcode}
                        {item.location && ` · 매대 진열 위치: ${item.location}`}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-[var(--color-surface-muted)] flex items-center justify-center shrink-0 border border-slate-200">
                      <span className="material-symbols-outlined text-[var(--color-text-muted)] text-[24px]">
                        {item.icon}
                      </span>
                    </div>
                  </div>

                  <div className="mt-[var(--spacing-space-md)] pt-[var(--spacing-space-sm)] border-t border-slate-100 space-y-2">
                    <div className="bg-[var(--color-surface-muted)] p-2 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-[var(--color-text-muted)] font-medium">
                          폐기 수량 조절
                        </span>
                        <span className="text-[11px] text-[var(--color-status-active)] font-bold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">
                            check
                          </span>
                          잔여 정상 재고 {item.stock - item.disposeQty}개 유지
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="w-7 h-7 rounded bg-[var(--color-surface-container-lowest)] border border-slate-300 text-[var(--color-text-primary)] font-bold flex items-center justify-center active:scale-95 transition-transform hover:bg-slate-50"
                          onClick={() => adjustDisposeQty(item.id, -1)}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            remove
                          </span>
                        </button>
                        <span className="font-jetbrains text-[16px] font-bold text-[var(--color-text-primary)] px-1 min-w-[28px] text-center">
                          {item.disposeQty}{" "}
                          <span className="text-[var(--color-text-muted)] font-bold ml-0.5">
                            / {item.stock}
                          </span>
                        </span>
                        <button
                          type="button"
                          className="w-7 h-7 rounded bg-[var(--color-surface-container-lowest)] border border-slate-300 text-[var(--color-text-primary)] font-bold flex items-center justify-center active:scale-95 transition-transform hover:bg-slate-50"
                          onClick={() => adjustDisposeQty(item.id, 1)}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            add
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="w-full h-12 px-2 rounded-xl bg-[var(--color-alert-critical)] text-[var(--color-on-error)] text-[14px] flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-sm hover:brightness-110"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete_forever
                        </span>
                        <span className="font-bold">
                          선택 {item.disposeQty}개 폐기
                        </span>
                      </button>
                      <button
                        className="w-full h-12 px-2 rounded-xl bg-[var(--color-secondary-container)] text-[var(--color-text-primary)] text-[14px] flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-sm hover:brightness-95"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          percent
                        </span>
                        <span className="font-bold">마감할인 20%</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          }

          return (
            <article
              key={item.id}
              className="bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-border-subtle)] shadow-sm p-[var(--spacing-space-md)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[var(--spacing-space-sm)]">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-muted)] flex items-center justify-center shrink-0 border border-slate-200">
                    <span className="material-symbols-outlined text-[var(--color-status-active)] text-[20px]">
                      check_circle
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-[var(--color-surface-container)] text-[var(--color-text-muted)] text-[10px] font-bold">
                        {item.expiryLabel}
                      </span>
                      <span className="text-[11px] text-[var(--color-status-active)] font-bold">
                        {item.timeRemaining}
                      </span>
                    </div>
                    <h4 className="font-hanken text-[15px] font-bold text-[var(--color-text-primary)]">
                      {item.name}
                    </h4>
                  </div>
                </div>
                <span className="font-jetbrains text-[12px] text-[var(--color-text-muted)]">
                  재고 {item.stock}개
                </span>
              </div>
            </article>
          );
        })}
      </section>

      {/* Completion Banner */}
      <section className="bg-[var(--color-surface-container-low)] rounded-xl border border-slate-200 p-[var(--spacing-space-md)] flex items-start gap-[var(--spacing-space-sm)]">
        <span className="material-symbols-outlined text-[var(--color-status-active)] text-[22px] shrink-0 fill">
          task_alt
        </span>
        <div className="space-y-0.5">
          <p className="font-hanken text-[15px] font-bold text-[var(--color-text-primary)] leading-tight">
            오늘의 4대 필수 루틴 준비 완료!
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            예상 소요 시간: 3분 · 실시간 매장 관리 통계에 즉시 반영됩니다.
          </p>
        </div>
      </section>

      <BottomCTA
        skipLabel="폐기 처리 단계 건너뛰기"
        primaryLabel="모든 루틴 완료하고 대시보드로 이동"
        nextPath="/"
        onPrimaryClick={() => updateStep4(disposals, true)}
      />
    </>
  );
}
