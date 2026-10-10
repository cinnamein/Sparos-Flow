"use client";

import { useState, useEffect, useMemo } from "react";
import StepIndicator from "@/components/StepIndicator";
import BottomCTA from "@/components/BottomCTA";
import { getSessionData, updateStep1 } from "@/lib/session";
import type { InventoryItem } from "@/lib/types";

export default function Step1Page() {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    setItems(getSessionData().step1.items);
  }, []);

  const adjustStock = (id: string, delta: number) => {
    setItems((prev) => {
      const next = prev.map((item) =>
        item.id === id
          ? { ...item, actualStock: Math.max(0, item.actualStock + delta) }
          : item,
      );
      updateStep1(next);
      return next;
    });
  };

  const toggleConfirm = (id: string) => {
    setItems((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, confirmed: !item.confirmed } : item,
      );
      updateStep1(next);
      return next;
    });
  };

  const categories = useMemo(() => {
    const map = new Map<
      string,
      { label: string; items: InventoryItem[] }
    >();
    items.forEach((item) => {
      if (!map.has(item.category)) {
        map.set(item.category, { label: item.categoryLabel, items: [] });
      }
      map.get(item.category)!.items.push(item);
    });
    return Array.from(map.values());
  }, [items]);

  const confirmedCount = items.filter(
    (i) => i.confirmed || (i.posStock === i.actualStock && i.confirmed),
  ).length;

  return (
    <>
      <StepIndicator currentStep={1} />

      {/* Barcode Input */}
      <section className="bg-[var(--color-surface-container-lowest)] rounded-xl p-[var(--spacing-space-md)] border border-[var(--color-border-subtle)] shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">
              barcode_scanner
            </span>
            바코드 직접 입력 및 스캔
          </span>
          <span className="text-[11px] text-[var(--color-text-muted)] font-medium">
            POS 재고 연동 대조
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] text-[12px] font-jetbrains focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary-container)]"
              placeholder="바코드 8~13자리 직접 입력 또는 스캔"
              type="text"
            />
            <span className="material-symbols-outlined text-[var(--color-text-muted)] text-[18px] absolute left-2.5 top-2.5 pointer-events-none">
              search
            </span>
          </div>
          <button className="h-10 px-3.5 bg-[var(--color-primary-container)] text-white rounded-lg text-[12px] font-bold flex items-center gap-1 shrink-0 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[16px]">
              qr_code_scanner
            </span>
            <span>조회</span>
          </button>
        </div>
      </section>

      {/* Stock Verification */}
      <section className="space-y-[var(--spacing-space-sm)]">
        <div className="flex items-center justify-between px-1 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="font-hanken text-[15px] font-bold text-[var(--color-text-primary)]">
              실시간 점검 품목
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] text-[10px] font-semibold">
              {categories.length}개 카테고리
            </span>
          </div>
          <span className="text-[11px] text-[var(--color-text-muted)] font-medium font-hanken">
            실재고 확인 {confirmedCount} / {items.length} 완료
          </span>
        </div>

        <div className="space-y-2.5">
          {categories.map((cat) => {
            const allMatch = cat.items.every(
              (i) => i.posStock === i.actualStock && i.confirmed,
            );
            const matchCount = cat.items.filter(
              (i) => i.posStock === i.actualStock && i.confirmed,
            ).length;

            return (
              <details
                key={cat.label}
                className="bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-border-subtle)] shadow-sm overflow-hidden group"
                open={!allMatch}
              >
                <summary className="flex items-center justify-between p-[var(--spacing-space-md)] cursor-pointer list-none select-none hover:bg-[var(--color-surface-muted)]/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[var(--color-surface-container-high)] text-[var(--color-text-primary)] text-[11px] font-bold">
                      {cat.label}
                    </span>
                    <span className="text-[12px] font-bold text-[var(--color-text-primary)]">
                      {allMatch
                        ? "전산 재고 정상"
                        : `${cat.items.length}품목`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-semibold ${
                        allMatch
                          ? "text-[var(--color-text-muted)]"
                          : matchCount > 0
                            ? "text-[var(--color-status-active)]"
                            : "text-[var(--color-secondary)]"
                      }`}
                    >
                      {allMatch
                        ? "확인 완료"
                        : matchCount > 0
                          ? `${matchCount}건 일치`
                          : "실사 대기"}
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-[var(--color-text-muted)] transition-transform group-open:rotate-180">
                      expand_more
                    </span>
                  </div>
                </summary>

                <div className="px-[var(--spacing-space-md)] pb-[var(--spacing-space-md)] pt-1 border-t border-slate-100 space-y-2.5">
                  {allMatch ? (
                    <div className="text-center py-3 text-[var(--color-text-muted)] text-[11px]">
                      해당 카테고리의 모든 SKU가 전산 재고와 일치합니다.
                    </div>
                  ) : (
                    cat.items.map((item) => {
                      const isMatch =
                        item.posStock === item.actualStock && item.confirmed;
                      const diff = item.actualStock - item.posStock;

                      return (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-lg bg-[var(--color-surface-muted)] border border-slate-200/60"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-[13px] font-bold text-[var(--color-text-primary)]">
                                  {item.name}
                                </h4>
                                {isMatch && (
                                  <span className="px-1.5 py-0.5 rounded bg-[var(--color-status-active)]/10 text-[var(--color-status-active)] text-[10px] font-bold">
                                    일치 확인
                                  </span>
                                )}
                              </div>
                              <p className="font-jetbrains text-[11px] text-[var(--color-text-muted)] mt-0.5">
                                SKU {item.sku}
                              </p>
                            </div>
                            {isMatch ? (
                              <span className="material-symbols-outlined text-[var(--color-status-active)] text-[20px]">
                                check_circle
                              </span>
                            ) : item.expiry ? (
                              <span className="px-1.5 py-0.5 rounded bg-slate-200 text-[var(--color-text-muted)] text-[10px] font-bold">
                                {item.expiry}
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded bg-[var(--color-secondary-fixed-dim)]/40 text-[var(--color-on-secondary-fixed)] text-[10px] font-bold">
                                수량 점검중
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-slate-200/80">
                            <div className="border-r border-slate-200 pr-2">
                              <span className="text-[11px] text-[var(--color-text-muted)] block font-medium">
                                전산(POS) 재고
                              </span>
                              <span className="text-[17px] font-bold font-jetbrains text-[var(--color-text-primary)]">
                                {item.posStock}{" "}
                                <span className="text-[11px] font-normal text-[var(--color-text-muted)]">
                                  개
                                </span>
                              </span>
                            </div>
                            <div>
                              {isMatch ? (
                                <>
                                  <span className="text-[11px] text-[var(--color-text-muted)] block font-medium">
                                    확인 실재고
                                  </span>
                                  <span className="text-[17px] font-bold font-jetbrains text-[var(--color-status-active)]">
                                    {item.actualStock}{" "}
                                    <span className="text-[11px] font-normal text-[var(--color-text-muted)]">
                                      개
                                    </span>
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-[11px] text-[var(--color-text-primary)] block font-bold">
                                    실재고 확인
                                  </span>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <button
                                      className="w-6 h-6 rounded bg-[var(--color-surface-container-lowest)] border border-slate-300 flex items-center justify-center font-bold text-[var(--color-text-primary)] active:scale-95 text-xs"
                                      onClick={() =>
                                        adjustStock(item.id, -1)
                                      }
                                      type="button"
                                    >
                                      -
                                    </button>
                                    <span className="text-[17px] font-bold font-jetbrains text-[var(--color-text-primary)]">
                                      {item.actualStock}
                                    </span>
                                    <button
                                      className="w-6 h-6 rounded bg-[var(--color-surface-container-lowest)] border border-slate-300 flex items-center justify-center font-bold text-[var(--color-text-primary)] active:scale-95 text-xs"
                                      onClick={() =>
                                        adjustStock(item.id, 1)
                                      }
                                      type="button"
                                    >
                                      +
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {!isMatch && (
                            <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                <input
                                  className="w-4 h-4 rounded accent-[var(--color-primary-container)]"
                                  type="checkbox"
                                  checked={item.confirmed}
                                  onChange={() => toggleConfirm(item.id)}
                                />
                                <span className="text-[11px] text-[var(--color-text-primary)] font-medium">
                                  {item.note ||
                                    `실재고 ${item.actualStock}개로 보정 확정`}
                                </span>
                              </label>
                              <span className="text-[11px] font-jetbrains text-[var(--color-text-muted)]">
                                차이 {diff >= 0 ? `+${diff}` : diff}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <BottomCTA
        skipLabel="재고 확인 단계 건너뛰기"
        primaryLabel="재고 확인 완료하고 다음 단계로"
        nextPath="/flow/2"
        onPrimaryClick={() => updateStep1(items, true)}
      />
    </>
  );
}
