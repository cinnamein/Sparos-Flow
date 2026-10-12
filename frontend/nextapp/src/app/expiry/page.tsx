"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth";

const API =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1";

interface ExpiryItem {
  id: number;
  product_name: string;
  category: string;
  expiry_date: string;
  expiry_time: string;
  quantity: number;
}

export default function ExpiryPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<ExpiryItem[]>([]);
  const [activeTag, setActiveTag] = useState("전체");
  const [editMode, setEditMode] = useState(false);
  const [editQty, setEditQty] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/expiry/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data: ExpiryItem[]) => setItems(data));
  }, [token]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category)));
    return ["전체", ...cats];
  }, [items]);

  const filtered = useMemo(
    () =>
      activeTag === "전체"
        ? items
        : items.filter((i) => i.category === activeTag),
    [items, activeTag],
  );

  const startEdit = () => {
    setEditMode(true);
    const map: Record<number, number> = {};
    items.forEach((i) => (map[i.id] = i.quantity));
    setEditQty(map);
  };

  const saveEdit = async () => {
    const changed = items.filter((i) => editQty[i.id] !== i.quantity);
    await Promise.all(
      changed.map((i) =>
        fetch(`${API}/expiry/${i.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: editQty[i.id] }),
        }),
      ),
    );
    setItems((prev) =>
      prev.map((i) => ({ ...i, quantity: editQty[i.id] ?? i.quantity })),
    );
    setEditMode(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 bg-[var(--color-surface-bg)] px-[var(--spacing-margin)] pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-hanken text-[18px] font-bold text-[var(--color-text-primary)]">
            소비기한 현황
          </h1>
          {editMode ? (
            <button
              className="px-3 py-1.5 rounded-lg text-[12px] font-bold bg-[var(--color-text-primary)] text-white active:scale-95 transition-transform"
              type="button"
              onClick={saveEdit}
            >
              저장
            </button>
          ) : (
            <button
              className="px-3 py-1.5 rounded-lg text-[12px] font-bold border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] active:scale-95 transition-transform"
              type="button"
              onClick={startEdit}
            >
              재고 수정
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors ${
                activeTag === cat
                  ? "bg-[var(--color-text-primary)] text-white"
                  : "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]"
              }`}
              type="button"
              onClick={() => setActiveTag(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-[var(--spacing-margin)] py-2 pb-20 space-y-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 border-b border-[var(--color-border-subtle)]"
          >
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">
                {item.product_name}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                {item.expiry_date} {item.expiry_time.slice(0, 5)} 만료
              </p>
            </div>

            {editMode ? (
              <div className="flex items-center gap-1.5">
                <button
                  className="w-6 h-6 rounded bg-[var(--color-surface-muted)] border border-slate-300 flex items-center justify-center active:scale-95 text-xs font-bold"
                  type="button"
                  onClick={() =>
                    setEditQty((prev) => ({
                      ...prev,
                      [item.id]: Math.max(0, (prev[item.id] ?? item.quantity) - 1),
                    }))
                  }
                >
                  -
                </button>
                <span className="font-jetbrains text-[14px] font-bold text-[var(--color-text-primary)] w-6 text-center">
                  {editQty[item.id] ?? item.quantity}
                </span>
                <button
                  className="w-6 h-6 rounded bg-[var(--color-surface-muted)] border border-slate-300 flex items-center justify-center active:scale-95 text-xs font-bold"
                  type="button"
                  onClick={() =>
                    setEditQty((prev) => ({
                      ...prev,
                      [item.id]: (prev[item.id] ?? item.quantity) + 1,
                    }))
                  }
                >
                  +
                </button>
              </div>
            ) : (
              <span className="font-jetbrains text-[14px] font-bold text-[var(--color-text-primary)]">
                {item.quantity}
                <span className="text-[11px] font-normal text-[var(--color-text-muted)] ml-0.5">
                  개
                </span>
              </span>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-[13px] text-[var(--color-text-muted)]">
            해당 카테고리에 소비기한 항목이 없습니다.
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-16 max-w-[420px] mx-auto bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-border-subtle)] shadow-[0_-2px_6px_rgba(0,0,0,0.03)] px-[var(--spacing-space-xs)]">
        {[
          { icon: "dashboard", label: "대시보드", href: "/" },
          { icon: "shopping_cart", label: "발주", href: "#" },
          { icon: "inventory_2", label: "재고", href: "#" },
          { icon: "schedule", label: "소비기한", href: "/expiry", active: true },
          { icon: "menu", label: "더보기", href: "#" },
        ].map((item) => (
          <a
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
          </a>
        ))}
      </nav>
    </div>
  );
}
