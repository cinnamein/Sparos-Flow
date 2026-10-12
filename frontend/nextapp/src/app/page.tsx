"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1";

interface ChecklistItem {
  id: number;
  title: string;
  work_date: string;
  due_time: string | null;
  is_completed: boolean;
  assigned_user_name: string | null;
}

interface ExpiryItem {
  id: number;
  product_name: string;
  expiry_date: string;
  expiry_time: string;
  quantity: number;
}

function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="font-jetbrains text-[12px] leading-[16px] font-semibold text-[var(--color-text-primary)]">{time}</span>;
}

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
  const [localChecks, setLocalChecks] = useState<Record<number, boolean>>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [expiryItems, setExpiryItems] = useState<ExpiryItem[]>([]);

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

  const fetchExpiryItems = useCallback(async () => {
    if (!token) return;
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(`${API}/expiry/?expiry_date=${today}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setExpiryItems(await res.json());
    }
  }, [token]);

  useEffect(() => {
    fetchChecklists();
    fetchExpiryItems();
  }, [fetchChecklists, fetchExpiryItems]);

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
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--color-surface-container-lowest)]/95 backdrop-blur-md px-[var(--spacing-margin)] h-14 flex items-center justify-between border-b border-[var(--color-border-subtle)] shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[var(--color-surface-muted)] px-2 py-0.5 rounded-full border border-[var(--color-border-subtle)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-active)] animate-pulse" />
            <span className="font-hanken text-[11px] leading-[14px] font-semibold text-[var(--color-text-primary)]">{user?.store_name ?? ""}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[var(--color-surface-container-low)] px-2 py-0.5 rounded">
            <span className="material-symbols-outlined text-[13px] text-[var(--color-secondary)]">schedule</span>
            <LiveClock />
          </div>
          <button aria-label="알림" className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-surface-muted)] text-[var(--color-on-surface)] active:scale-95 transition-transform" type="button">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-alert-critical)] ring-2 ring-white" />
          </button>
          <button aria-label="로그아웃" onClick={logout} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-surface-muted)] text-[var(--color-on-surface)] active:scale-95 transition-transform" type="button">
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-[var(--spacing-margin)] py-3 space-y-[var(--spacing-space-lg)] pb-24">
        {/* Welcome */}
        <div className="flex items-center justify-between py-1 px-0.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-text-primary)] text-[var(--color-secondary-fixed-dim)] flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[22px]">badge</span>
            </div>
            <div>
              <h1 className="font-hanken text-[15px] leading-[20px] font-bold text-[var(--color-text-primary)]">좋은 하루입니다, {user?.name ?? ""}님!</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--color-secondary-fixed-dim)]/20 text-[var(--color-on-secondary-fixed-variant)] border border-[var(--color-secondary-fixed-dim)]/40 font-hanken">근무중</span>
                <span className="font-hanken text-[11px] leading-[14px] font-medium text-[var(--color-text-muted)]">오전 시프트 (08:00 ~ 14:00)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barcode Scan */}
        <section className="bg-[var(--color-surface-container-lowest)] rounded-xl p-[var(--spacing-space-md)] border border-[var(--color-border-subtle)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-3.5 bg-[var(--color-secondary-fixed-dim)] rounded-xs" />
              <span className="font-hanken text-[14px] leading-[18px] font-bold text-[var(--color-text-primary)]">현장 즉시 바코드 스캔</span>
            </div>
            <span className="font-hanken text-[11px] leading-[14px] font-medium text-[var(--color-text-muted)] flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px] text-[var(--color-status-active)]">sensors</span>
              리더기 연동됨
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                <span className="material-symbols-outlined text-[18px]">barcode_scanner</span>
              </div>
              <input
                className="w-full pl-8 pr-3 py-2 text-xs font-jetbrains bg-[var(--color-surface-muted)] rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:ring-1 focus:ring-[var(--color-secondary-fixed-dim)] focus:border-[var(--color-secondary-fixed-dim)] outline-none transition-all"
                inputMode="numeric"
                placeholder="상품 바코드 8~13자리 스캔 또는 직접 입력"
                type="text"
              />
            </div>
            <button className="bg-[var(--color-text-primary)] hover:bg-[var(--color-inverse-surface)] text-white px-3.5 py-2 rounded-lg font-hanken text-xs font-bold flex items-center gap-1 shrink-0 active:scale-95 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-[var(--color-secondary-fixed-dim)]">qr_code_scanner</span>
              <span>스캔</span>
            </button>
          </div>
        </section>

        {/* Task Completion */}
        <section className="bg-[var(--color-surface-container-lowest)] rounded-xl p-[var(--spacing-space-md)] border border-[var(--color-border-subtle)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-[var(--spacing-space-lg)]">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="font-hanken text-[15px] leading-[20px] font-bold text-[var(--color-text-primary)]">업무 완수율</span>
                <span className="font-jetbrains text-[18px] leading-[22px] font-bold text-[var(--color-text-primary)]">{percent}%</span>
              </div>
            </div>
            <div className="w-full bg-[var(--color-surface-muted)] h-2.5 rounded-full overflow-hidden p-0.5 border border-[var(--color-border-subtle)]">
              <div className="bg-gradient-to-r from-[var(--color-text-primary)] via-[var(--color-text-primary)] to-[var(--color-secondary-fixed-dim)] h-full rounded-full transition-all duration-500 relative" style={{ width: `${percent}%` }}>
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[var(--color-border-subtle)]">
              {[
                { label: "완료 건수", value: `${completedCount}건`, color: "text-[var(--color-text-primary)]" },
                { label: "잔여 과업", value: `${totalCount - completedCount}건`, color: "text-[var(--color-secondary)]" },
                { label: "전체 업무", value: `${totalCount}건`, color: "text-[var(--color-text-muted)]" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[var(--color-surface-muted)] rounded-lg p-2 text-center">
                  <span className="font-hanken text-[11px] text-[var(--color-text-muted)] block">{stat.label}</span>
                  <span className={`font-jetbrains text-sm font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--color-border-subtle)]" />

          {/* Checklist */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[var(--color-text-primary)]">checklist</span>
                <h2 className="font-hanken text-[14px] leading-[18px] font-bold text-[var(--color-text-primary)]">당일 업무 체크리스트</h2>
              </div>
              <button
                onClick={saveChecklists}
                disabled={!dirty || saving}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--color-text-primary)] text-white text-[11px] font-bold font-hanken active:scale-95 transition-transform disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-[14px]">save</span>
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
            <div className="space-y-1.5">
              {sortedChecklists.map((item) => {
                const checked = localChecks[item.id] ?? item.is_completed;
                return (
                  <div
                    key={item.id}
                    className={`flex items-start gap-2.5 p-2 rounded-lg transition-colors ${
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
                        <span className={`font-hanken text-xs font-semibold truncate ${checked ? "text-[var(--color-text-muted)] line-through" : "text-[var(--color-text-primary)]"}`}>
                          {item.title}
                        </span>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {item.due_time && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${checked ? "bg-slate-200 text-[var(--color-text-muted)]" : "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]"}`}>
                              {item.due_time.slice(0, 5)}
                            </span>
                          )}
                          <button
                            onClick={() => deleteChecklist(item.id)}
                            disabled={deleting === item.id}
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-100 text-[var(--color-text-muted)] hover:text-red-500 transition-colors disabled:opacity-40"
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </div>
                      </div>
                      {item.assigned_user_name && (
                        <p className="font-hanken text-[11px] text-[var(--color-text-muted)] mt-0.5">담당: {item.assigned_user_name}</p>
                      )}
                    </div>
                  </div>
                );
              })}
              {checklists.length === 0 && (
                <p className="text-center text-[var(--color-text-muted)] text-xs py-4">아직 업무가 없습니다.</p>
              )}
            </div>

            {showAddForm ? (
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addChecklist()}
                  placeholder="업무 제목 입력"
                  autoFocus
                  className="flex-1 px-2.5 py-1.5 text-xs font-hanken bg-[var(--color-surface-muted)] rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:ring-1 focus:ring-[var(--color-secondary-fixed-dim)] focus:border-[var(--color-secondary-fixed-dim)] outline-none"
                />
                <button
                  onClick={addChecklist}
                  disabled={adding || !newTitle.trim()}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--color-text-primary)] text-white text-[11px] font-bold font-hanken active:scale-95 transition-transform disabled:opacity-50"
                >
                  {adding ? "추가 중..." : "추가"}
                </button>
                <button
                  onClick={() => { setShowAddForm(false); setNewTitle(""); }}
                  className="px-2 py-1.5 rounded-lg text-[var(--color-text-muted)] text-[11px] font-hanken hover:bg-[var(--color-surface-muted)]"
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center justify-center gap-1 py-2 rounded-lg border border-dashed border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span className="font-hanken text-xs font-medium">업무 추가</span>
              </button>
            )}
          </div>
        </section>

        {/* Expiry Status */}
        <section className="bg-[var(--color-surface-container-lowest)] rounded-xl p-[var(--spacing-space-md)] border border-[var(--color-border-subtle)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-2.5">
          <div className="flex items-center gap-1.5 pb-1 border-b border-[var(--color-border-subtle)]">
            <span className="material-symbols-outlined text-[18px] text-[var(--color-alert-critical)]">schedule</span>
            <h2 className="font-hanken text-[14px] leading-[18px] font-bold text-[var(--color-text-primary)]">소비기한 현황</h2>
          </div>
          <div className="space-y-2">
            {expiryItems.map((item) => {
              const now = new Date();
              const expiry = new Date(`${item.expiry_date}T${item.expiry_time}`);
              const diffMs = expiry.getTime() - now.getTime();
              const diffH = Math.floor(diffMs / 3600000);
              const diffM = Math.floor((diffMs % 3600000) / 60000);
              const isUrgent = diffH < 2;
              const isWarning = diffH >= 2 && diffH < 6;
              const remaining = diffMs <= 0
                ? "만료됨"
                : diffH >= 12
                  ? `오늘 ${item.expiry_time.slice(0, 5)} 만료`
                  : `잔여 ${diffH}시간 ${diffM}분`;
              const dot = isUrgent ? "bg-[var(--color-alert-critical)]" : isWarning ? "bg-[var(--color-secondary-fixed-dim)]" : "bg-[var(--color-status-active)]";
              const color = isUrgent ? "text-[var(--color-alert-critical)]" : isWarning ? "text-[var(--color-secondary)]" : "text-[var(--color-text-muted)]";
              return (
                <div key={item.id} className="p-2.5 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
                      <span className="font-hanken text-xs font-bold text-[var(--color-text-primary)] truncate">{item.product_name}</span>
                    </div>
                    <span className={`font-jetbrains text-xs ${color} font-bold shrink-0`}>{remaining}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--color-border-subtle)]/80">
                    <div className="flex items-center gap-2 font-hanken text-[11px] text-[var(--color-text-muted)]">
                      <span>만료: <b className="font-jetbrains text-[var(--color-text-primary)]">{item.expiry_time.slice(0, 5)}</b></span>
                      <span className="text-[var(--color-outline-variant)]">|</span>
                      <span>수량: <b className="font-jetbrains text-[var(--color-text-primary)]">{item.quantity}개</b></span>
                    </div>
                  </div>
                </div>
              );
            })}
            {expiryItems.length === 0 && (
              <p className="text-center text-[var(--color-text-muted)] text-xs py-4">오늘 만료 예정 상품이 없습니다.</p>
            )}
          </div>
        </section>

        {/* Start Routine CTA */}
        <Link
          href="/flow/1"
          className="w-full h-14 px-5 rounded-xl flex items-center justify-between bg-[#02152f] text-white font-bold hover:bg-opacity-95 active:scale-[0.98] transition-all shadow-lg group"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[var(--color-secondary-container)]">play_circle</span>
            <span className="font-hanken text-[15px] tracking-tight font-bold">업무 루틴 시작하기</span>
          </div>
          <div className="flex items-center gap-1 text-[var(--color-secondary-container)] group-hover:translate-x-1 transition-transform">
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </div>
        </Link>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-16 max-w-[420px] mx-auto bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-border-subtle)] shadow-[0_-2px_6px_rgba(0,0,0,0.03)] px-[var(--spacing-space-xs)]">
        {[
          { icon: "dashboard", label: "대시보드", active: true, fill: true, href: "/" },
          { icon: "shopping_cart", label: "발주", active: false, href: "#" },
          { icon: "checklist", label: "체크리스트", active: false, href: "/flow/3" },
          { icon: "inventory_2", label: "재고", active: false, href: "/stock" },
          { icon: "menu", label: "더보기", active: false, href: "#" },
        ].map((item) => (
          <Link
            key={item.label}
            className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 active:scale-95 transition-transform ${
              item.active ? "text-[var(--color-text-primary)]" : "text-[var(--color-on-surface-variant)]"
            }`}
            href={item.href}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={item.fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className={`text-[11px] ${item.active ? "font-bold text-[var(--color-text-primary)]" : "font-medium text-[var(--color-text-muted)]"}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </>
  );
}
