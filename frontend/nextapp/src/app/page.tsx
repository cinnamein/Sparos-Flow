"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1";

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
  const [expiryItems, setExpiryItems] = useState<ExpiryItem[]>([]);

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
    fetchExpiryItems();
  }, [fetchExpiryItems]);

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
          { icon: "shopping_cart", label: "발주", active: false, href: "/order" },
          { icon: "checklist", label: "체크리스트", active: false, href: "/checklist" },
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
