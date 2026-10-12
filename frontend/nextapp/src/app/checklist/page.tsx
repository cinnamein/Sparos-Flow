"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

const API =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1";

interface ChecklistItem {
  id: number;
  title: string;
  work_date: string;
  due_time: string | null;
  is_completed: boolean;
  assigned_user_name: string | null;
}

export default function ChecklistPage() {
  const { token } = useAuth();
  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
  const [localChecks, setLocalChecks] = useState<Record<number, boolean>>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchChecklists = useCallback(async () => {
    if (!token) return;
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(`${API}/checklist/?work_date=${today}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data: ChecklistItem[] = await res.json();
      setChecklists(data);
      const checks: Record<number, boolean> = {};
      data.forEach((c) => (checks[c.id] = c.is_completed));
      setLocalChecks(checks);
      setDirty(false);
    }
  }, [token]);

  useEffect(() => {
    fetchChecklists();
  }, [fetchChecklists]);

  const toggleCheck = (id: number) => {
    setLocalChecks((prev) => ({ ...prev, [id]: !prev[id] }));
    setDirty(true);
  };

  const saveChecklists = async () => {
    if (!token) return;
    setSaving(true);
    const items = Object.entries(localChecks).map(([id, is_completed]) => ({
      id: Number(id),
      is_completed,
    }));
    await fetch(`${API}/checklist/`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    setDirty(false);
    setSaving(false);
  };

  const addChecklist = async () => {
    if (!token || !newTitle.trim()) return;
    setAdding(true);
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(`${API}/checklist/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle.trim(), work_date: today }),
    });
    if (res.ok) {
      const created: ChecklistItem = await res.json();
      setChecklists((prev) => [...prev, created]);
      setLocalChecks((prev) => ({ ...prev, [created.id]: false }));
      setNewTitle("");
      setShowAddForm(false);
    }
    setAdding(false);
  };

  const deleteChecklist = async (id: number) => {
    if (!token) return;
    setDeleting(id);
    const res = await fetch(`${API}/checklist/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setChecklists((prev) => prev.filter((c) => c.id !== id));
      setLocalChecks((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
    setDeleting(null);
  };

  const sortedChecklists = [...checklists].sort((a, b) => {
    const aChecked = localChecks[a.id] ?? a.is_completed;
    const bChecked = localChecks[b.id] ?? b.is_completed;
    if (aChecked !== bChecked) return aChecked ? 1 : -1;
    return 0;
  });

  const completedCount = Object.values(localChecks).filter(Boolean).length;
  const totalCount = checklists.length;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 bg-[var(--color-surface-bg)] px-[var(--spacing-margin)] pt-4 pb-3 border-b border-[var(--color-border-subtle)] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="font-hanken text-[18px] font-bold text-[var(--color-text-primary)]">
              체크리스트
            </h1>
            <span className="font-jetbrains text-[12px] font-semibold text-[var(--color-text-muted)] bg-[var(--color-surface-muted)] px-2 py-0.5 rounded-full">
              {completedCount}/{totalCount}
            </span>
          </div>
          <button
            onClick={saveChecklists}
            disabled={!dirty || saving}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--color-text-primary)] text-white text-[12px] font-bold font-hanken active:scale-95 transition-transform disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[14px]">save</span>
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </header>

      <main className="flex-1 px-[var(--spacing-margin)] py-3 pb-24 space-y-2">
        {sortedChecklists.map((item) => {
          const checked = localChecks[item.id] ?? item.is_completed;
          return (
            <div
              key={item.id}
              className={`flex items-start gap-2.5 p-3 rounded-lg transition-colors ${
                checked
                  ? "bg-[var(--color-surface-muted)]/60 border border-[var(--color-border-subtle)]"
                  : "bg-[var(--color-surface-container-lowest)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-muted)]"
              }`}
            >
              <input
                checked={checked}
                onChange={() => toggleCheck(item.id)}
                className="mt-0.5 rounded accent-[var(--color-text-primary)] w-4 h-4 cursor-pointer"
                type="checkbox"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-hanken text-[13px] font-semibold truncate ${
                      checked
                        ? "text-[var(--color-text-muted)] line-through"
                        : "text-[var(--color-text-primary)]"
                    }`}
                  >
                    {item.title}
                  </span>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {item.due_time && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          checked
                            ? "bg-slate-200 text-[var(--color-text-muted)]"
                            : "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]"
                        }`}
                      >
                        {item.due_time.slice(0, 5)}
                      </span>
                    )}
                    <button
                      onClick={() => deleteChecklist(item.id)}
                      disabled={deleting === item.id}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-100 text-[var(--color-text-muted)] hover:text-red-500 transition-colors disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>
                {item.assigned_user_name && (
                  <p className="font-hanken text-[11px] text-[var(--color-text-muted)] mt-0.5">
                    담당: {item.assigned_user_name}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {checklists.length === 0 && (
          <div className="text-center py-10 text-[13px] text-[var(--color-text-muted)]">
            아직 업무가 없습니다.
          </div>
        )}

        {showAddForm ? (
          <div className="flex items-center gap-1.5 pt-1">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addChecklist()}
              placeholder="업무 제목 입력"
              autoFocus
              className="flex-1 px-2.5 py-2 text-[13px] font-hanken bg-[var(--color-surface-muted)] rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:ring-1 focus:ring-[var(--color-secondary-fixed-dim)] focus:border-[var(--color-secondary-fixed-dim)] outline-none"
            />
            <button
              onClick={addChecklist}
              disabled={adding || !newTitle.trim()}
              className="px-3 py-2 rounded-lg bg-[var(--color-text-primary)] text-white text-[12px] font-bold font-hanken active:scale-95 transition-transform disabled:opacity-50"
            >
              {adding ? "추가 중..." : "추가"}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewTitle("");
              }}
              className="px-2.5 py-2 rounded-lg text-[var(--color-text-muted)] text-[12px] font-hanken hover:bg-[var(--color-surface-muted)]"
            >
              취소
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-1 py-2.5 rounded-lg border border-dashed border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span className="font-hanken text-[12px] font-medium">업무 추가</span>
          </button>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-16 max-w-[420px] mx-auto bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-border-subtle)] shadow-[0_-2px_6px_rgba(0,0,0,0.03)] px-[var(--spacing-space-xs)]">
        {[
          { icon: "dashboard", label: "대시보드", href: "/" },
          { icon: "shopping_cart", label: "발주", href: "#" },
          { icon: "checklist", label: "체크리스트", href: "/checklist", active: true },
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
