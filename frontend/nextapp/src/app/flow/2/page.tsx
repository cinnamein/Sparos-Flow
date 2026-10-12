"use client";

import { useState, useEffect } from "react";
import StepIndicator from "@/components/StepIndicator";
import BottomCTA from "@/components/BottomCTA";
import { getSessionData, updateStep2 } from "@/lib/session";
import type { OrderItem } from "@/lib/types";

export default function Step2Page() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [allSelected, setAllSelected] = useState(true);

  useEffect(() => {
    const data = getSessionData();
    setOrders(data.step2.orders);
    setAllSelected(data.step2.orders.every((o) => o.selected));
  }, []);

  const adjustQty = (id: string, delta: number) => {
    setOrders((prev) => {
      const next = prev.map((o) =>
        o.id === id ? { ...o, orderQty: Math.max(0, o.orderQty + delta) } : o,
      );
      updateStep2(next);
      return next;
    });
  };

  const toggleItem = (id: string) => {
    setOrders((prev) => {
      const next = prev.map((o) =>
        o.id === id ? { ...o, selected: !o.selected } : o,
      );
      setAllSelected(next.every((o) => o.selected));
      updateStep2(next);
      return next;
    });
  };

  const toggleAll = () => {
    const next = !allSelected;
    setAllSelected(next);
    setOrders((prev) => {
      const updated = prev.map((o) => ({ ...o, selected: next }));
      updateStep2(updated);
      return updated;
    });
  };

  const selectedCount = orders.filter((o) => o.selected).length;
  const totalQty = orders
    .filter((o) => o.selected)
    .reduce((sum, o) => sum + o.orderQty, 0);

  return (
    <>
      <StepIndicator currentStep={2} />

      {/* AI Recommendation Summary */}
      <section className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-border-subtle)] rounded-xl p-[var(--spacing-space-md)] shadow-sm">
        <div className="flex items-start justify-between pb-3 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-container)] text-[var(--color-secondary-container)] flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">
                auto_awesome
              </span>
            </div>
            <div>
              <h1 className="font-hanken text-[15px] font-bold text-[var(--color-text-primary)]">
                AI 추천 스마트 발주 제안
              </h1>
              <p className="font-hanken text-[11px] text-[var(--color-text-muted)]">
                Step 1 재고확인 데이터 기반 실시간 반영
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-[var(--color-secondary-container)]/20 text-[var(--color-on-secondary-container)] border border-[var(--color-secondary-container)]/40 px-2 py-0.5 rounded-full">
            신뢰도 98.4%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3 mb-2">
          <div className="bg-[var(--color-surface-muted)] rounded-lg p-2 border border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-1 text-[var(--color-text-muted)] text-[11px] mb-0.5">
              <span className="material-symbols-outlined text-[14px] text-[var(--color-surface-tint)]">
                water_drop
              </span>
              <span>수요 변수 반영</span>
            </div>
            <div className="font-hanken text-[13px] font-semibold text-[var(--color-text-primary)]">
              내일 비 예보 (+30%)
            </div>
          </div>
          <div className="bg-[var(--color-surface-muted)] rounded-lg p-2 border border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-1 text-[var(--color-text-muted)] text-[11px] mb-0.5">
              <span className="material-symbols-outlined text-[14px] text-[var(--color-secondary)]">
                inventory
              </span>
              <span>추천 합계</span>
            </div>
            <div className="font-hanken text-[13px] font-semibold text-[var(--color-text-primary)]">
              총{" "}
              <span className="font-jetbrains text-[var(--color-secondary)]">
                {orders.length}
              </span>
              품목{" "}
              <span className="font-jetbrains text-[var(--color-secondary)]">
                {totalQty}
              </span>
              개
            </div>
          </div>
        </div>

        <p className="text-[11px] text-[var(--color-on-surface-variant)] flex items-center gap-1 pt-1">
          <span className="material-symbols-outlined text-[14px] text-[var(--color-status-active)]">
            verified_user
          </span>
          <span>
            결품 방지 및 폐기율 최소화 알고리즘이 적용된 맞춤 수량입니다.
          </span>
        </p>
      </section>

      {/* Order Items */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="font-hanken text-[15px] font-bold text-[var(--color-text-primary)]">
              발주 추천 품목
            </h2>
            <span className="text-[10px] font-bold bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] px-2 py-0.5 rounded-full border border-[var(--color-border-subtle)]">
              {orders.length}건
            </span>
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              className="w-4 h-4 rounded accent-[var(--color-text-primary)]"
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
            />
            <span className="font-hanken text-[11px] text-[var(--color-text-primary)] font-semibold">
              전체 선택
            </span>
          </label>
        </div>

        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-border-subtle)] rounded-xl p-[var(--spacing-space-md)] shadow-sm transition-all hover:border-[var(--color-outline-variant)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <input
                  className="mt-1 w-4 h-4 rounded accent-[var(--color-text-primary)]"
                  type="checkbox"
                  checked={order.selected}
                  onChange={() => toggleItem(order.id)}
                />
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-hanken text-[13px] font-semibold text-[var(--color-text-primary)]">
                      {order.name}
                    </span>
                    {order.badge && (
                      <span className="text-[10px] font-bold bg-[var(--color-alert-warning-bg)] text-[var(--color-secondary)] border border-[var(--color-secondary)]/30 px-1.5 py-0.5 rounded">
                        {order.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-hanken text-[11px] text-[var(--color-text-muted)]">
                      현재고: {order.currentStock}개
                    </span>
                    <span className="text-[var(--color-outline-variant)] text-[10px]">
                      |
                    </span>
                    <span className="font-hanken text-[11px] text-[var(--color-text-muted)]">
                      안전재고: {order.safetyStock}개
                    </span>
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold mt-1 bg-[var(--color-surface-muted)] px-2 py-0.5 rounded ${order.reasonColor}`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {order.reasonIcon}
                    </span>
                    <span>{order.reason}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] rounded-lg p-0.5">
                <button
                  className="w-7 h-7 flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container-high)] rounded active:scale-90 transition-transform"
                  onClick={() => adjustQty(order.id, -1)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    remove
                  </span>
                </button>
                <span className="w-8 text-center font-jetbrains text-[14px] font-bold text-[var(--color-text-primary)]">
                  {order.orderQty}
                </span>
                <button
                  className="w-7 h-7 flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container-high)] rounded active:scale-90 transition-transform"
                  onClick={() => adjustQty(order.id, 1)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    add
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Info Note */}
      <div className="p-3 bg-[var(--color-surface-container-low)] rounded-xl flex items-start gap-2.5 border border-[var(--color-surface-container)]">
        <span className="material-symbols-outlined text-[var(--color-surface-tint)] text-[18px] shrink-0 mt-0.5">
          info
        </span>
        <div className="text-[var(--color-on-surface-variant)] text-[11px]">
          <p className="font-semibold text-[var(--color-text-primary)]">
            발주 전송 시 물류 센터로 자동 접수됩니다.
          </p>
          <p className="mt-0.5">
            다음 3단계는 교대 시간 대비 필수 위생 및 온도 체크리스트입니다.
          </p>
        </div>
      </div>

      <BottomCTA
        skipLabel="발주 단계 건너뛰기"
        primaryLabel="발주 확정하고 다음 단계로"
        nextPath="/flow/3"
        onPrimaryClick={() => updateStep2(orders, true)}
        summary={
          <>
            <div className="flex items-center gap-1.5">
              <span className="font-hanken text-[11px] text-[var(--color-text-muted)]">
                선택 품목:
              </span>
              <span className="font-hanken text-[13px] font-bold text-[var(--color-text-primary)]">
                {selectedCount}개 품목 ({totalQty}개)
              </span>
            </div>
          </>
        }
      />
    </>
  );
}
