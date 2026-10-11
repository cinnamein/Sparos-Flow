"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: employeeId, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "로그인에 실패했습니다");
        return;
      }

      const data = await res.json();
      login(data.access_token, {
        name: data.name,
        role: data.role,
        store_name: data.store_name,
      });
    } catch {
      setError("서버에 연결할 수 없습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-10">
        {/* Logo */}
        <div className="text-center space-y-2">
          <img src="/images/logo.png" alt="FLOW 로고" className="w-48 h-48 mx-auto object-contain" />
          <p className="text-[13px] text-[var(--color-text-muted)] font-medium">매장 운영 시스템</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <div>
              <label htmlFor="employeeId" className="block text-[13px] font-semibold text-[var(--color-text-primary)] mb-1.5">
                사번
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                </span>
                <input
                  id="employeeId"
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="OWN-2024-001"
                  required
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] text-sm font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-text-primary)] focus:bg-[var(--color-surface-container-lowest)] transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-semibold text-[var(--color-text-primary)] mb-1.5">
                비밀번호
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  required
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] text-sm font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-text-primary)] focus:bg-[var(--color-surface-container-lowest)] transition-all"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[var(--color-alert-critical-bg)] border border-[var(--color-error)]/20">
              <span className="material-symbols-outlined text-[16px] text-[var(--color-error)]">error</span>
              <p className="text-[13px] text-[var(--color-error)] font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[var(--color-text-primary)] text-white text-[15px] font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                로그인 중...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">login</span>
                로그인
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
