"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { getSessionData, updateStep2 } from "@/lib/session";
import type { OrderItem } from "@/lib/types";

export default function OrderPage() {
  const { token } = useAuth();
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
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 bg-[var(--color-surface-bg)] px-[var(--spacing-margin)] pt-4 pb-3 border-b border-[var(--color-border-subtle)] shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="font-hanken text-[18px] font-bold text-[var(--color-text-primary)]">
            발주
          </h1>
          <div className="flex items-center gap-1.5 bg-[var(--color-surface-muted)] px-2.5 py-1 rounded-full border border-[var(--color-border-subtle)]">
            <span className="font-hanken text-[11px] font-semibold text-[var(--color-text-primary)]">
              {selectedCount}품목
            </span>
            <span className="text-[var(--color-outline-variant)] text-[10px]">|</span>
            <span className="font-jetbrains text-[11px] font-bold text-[var(--color-secondary)]">
              {totalQty}개
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-[var(--spacing-margin)] py-3 pb-24 space-y-3">
        {/* AI Summary */}
        <section className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-border-subtle)] rounded-xl p-[var(--spacing-space-md)] shadow-sm">
          <div className="flex items-start justify-between pb-3 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-container)] text-[var(--color-secondary-container)] flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">auto_awesome</span>
              </div>
              <div>
                <h2 className="font-hanken text-[15px] font-bold text-[var(--color-text-primary)]">
                  AI 스마트 발주 제안
                </h2>
                <p className="font-hanken text-[11px] text-[var(--color-text-muted)]">
                  재고 데이터 기반 실시간 반영
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-[var(--color-secondary-container)]/20 text-[var(--color-on-secondary-container)] border border-[var(--color-secondary-container)]/40 px-2 py-0.5 rounded-full">
              신뢰도 98.4%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-[var(--color-surface-muted)] rounded-lg p-2 border border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-1 text-[var(--color-text-muted)] text-[11px] mb-0.5">
                <span className="material-symbols-outlined text-[14px] text-[var(--color-surface-tint)]">water_drop</span>
                <span>수요 변수 반영</span>
              </div>
              <div className="font-hanken text-[13px] font-semibold text-[var(--color-text-primary)]">
                내일 비 예보 (+30%)
              </div>
            </div>
            <div className="bg-[var(--color-surface-muted)] rounded-lg p-2 border border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-1 text-[var(--color-text-muted)] text-[11px] mb-0.5">
                <span className="material-symbols-outlined text-[14px] text-[var(--color-secondary)]">inventory</span>
                <span>추천 합계</span>
              </div>
              <div className="font-hanken text-[13px] font-semibold text-[var(--color-text-primary)]">
                총 <span className="font-jetbrains text-[var(--color-secondary)]">{orders.length}</span>품목{" "}
                <span className="font-jetbrains text-[var(--color-secondary)]">{totalQty}</span>개
              </div>
            </div>
          </div>
        </section>

        {/* Order Items */}
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
                    <span className="text-[var(--color-outline-variant)] text-[10px]">|</span>
                    <span className="font-hanken text-[11px] text-[var(--color-text-muted)]">
                      안전재고: {order.safetyStock}개
                    </span>
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold mt-1 bg-[var(--color-surface-muted)] px-2 py-0.5 rounded ${order.reasonColor}`}
                  >
                    <span className="material-symbols-outlined text-[13px]">{order.reasonIcon}</span>
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
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span className="w-8 text-center font-jetbrains text-[14px] font-bold text-[var(--color-text-primary)]">
                  {order.orderQty}
                </span>
                <button
                  className="w-7 h-7 flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container-high)] rounded active:scale-90 transition-transform"
                  onClick={() => adjustQty(order.id, 1)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-10 text-[13px] text-[var(--color-text-muted)]">
            발주 추천 품목이 없습니다.
          </div>
        )}

        {/* Info */}
        <div className="p-3 bg-[var(--color-surface-container-low)] rounded-xl flex items-start gap-2.5 border border-[var(--color-surface-container)]">
          <span className="material-symbols-outlined text-[var(--color-surface-tint)] text-[18px] shrink-0 mt-0.5">info</span>
          <div className="text-[var(--color-on-surface-variant)] text-[11px]">
            <p className="font-semibold text-[var(--color-text-primary)]">
              발주 전송 시 물류 센터로 자동 접수됩니다.
            </p>
            <p className="mt-0.5">수량 조정 후 하단 발주 확정 버튼을 눌러주세요.</p>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={() => updateStep2(orders, true)}
          disabled={selectedCount === 0}
          className="w-full h-12 rounded-xl bg-[var(--color-text-primary)] text-white font-hanken text-[14px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
          발주 확정 ({selectedCount}품목, {totalQty}개)
        </button>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-16 max-w-[420px] mx-auto bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-border-subtle)] shadow-[0_-2px_6px_rgba(0,0,0,0.03)] px-[var(--spacing-space-xs)]">
        {[
          { icon: "dashboard", label: "대시보드", href: "/" },
          { icon: "shopping_cart", label: "발주", href: "/order", active: true },
          { icon: "checklist", label: "체크리스트", href: "/checklist" },
          { icon: "inventory_2", label: "재고", href: "/stock" },
          { icon: "menu", label: "더보기", href: "#" },
        ].map((item) => (
          <Link
            key={item.label}
            className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 active:scale-95 transition-transform ${
              item.active
                ? "text-[var(--color-text-primary)]"
                : "text-[var(--color-on-surface-variant)]"
            }`}
            href={item.href}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={
                item.active
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              {item.icon}
            </span>
            <span
              className={`text-[11px] ${
                item.active
                  ? "font-bold text-[var(--color-text-primary)]"
                  : "font-medium text-[var(--color-text-muted)]"
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
