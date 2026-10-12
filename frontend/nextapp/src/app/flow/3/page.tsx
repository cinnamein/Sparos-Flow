"use client";

import { useState, useEffect } from "react";
import StepIndicator from "@/components/StepIndicator";
import BottomCTA from "@/components/BottomCTA";
import { getSessionData, updateStep3 } from "@/lib/session";
import { useAuth } from "@/lib/auth";
import type { ChecklistTask } from "@/lib/types";

export default function Step3Page() {
  const { user } = useAuth();
  const isOwner = user?.role === "owner";
  const [tasks, setTasks] = useState<ChecklistTask[]>([]);
  const [shift, setShift] = useState("09:00 ~ 15:00 (오전)");
  const [worker, setWorker] = useState("김알바");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("오전조 (김알바)");

  useEffect(() => {
    const data = getSessionData();
    setTasks(data.step3.tasks);
    setShift(data.step3.shift);
    setWorker(data.step3.worker);
  }, []);

  const toggleTask = (id: string) => {
    setTasks((prev) => {
      const next = prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      );
      updateStep3(next, shift, worker);
      return next;
    });
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const task: ChecklistTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      assignee: isOwner ? newTaskAssignee : user?.name || "",
      completed: false,
      borderColor: "",
    };
    setTasks((prev) => {
      const next = [...prev, task];
      updateStep3(next, shift, worker);
      return next;
    });
    setNewTaskTitle("");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      updateStep3(next, shift, worker);
      return next;
    });
  };

  const handleShiftChange = (value: string) => {
    setShift(value);
    updateStep3(tasks, value, worker);
  };

  const handleWorkerChange = (value: string) => {
    setWorker(value);
    updateStep3(tasks, shift, value);
  };

  return (
    <>
      <StepIndicator currentStep={3} />

      {/* Directive Banner — 점장 전용 */}
      {isOwner && (
        <section className="bg-[var(--color-primary-container)] text-[var(--color-on-primary)] rounded-xl p-[var(--spacing-space-md)] shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-hanken text-[15px] font-bold text-white tracking-tight">
                  오늘 매장 업무 체크리스트 수정
                </p>
                <p className="text-[11px] text-[var(--color-inverse-primary)] mt-0.5 leading-snug">
                  근무조별 필수 업무를 확인하고 수정 및 직접 할당하세요.
                </p>
              </div>
              <span className="material-symbols-outlined text-[var(--color-secondary-container)] text-2xl">
                edit_note
              </span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[var(--color-inverse-surface)]/80">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--color-inverse-primary)] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-[var(--color-secondary-container)]">
                    schedule
                  </span>
                  근무자 배정 설정
                </span>
                <button
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[var(--color-secondary-container)] text-[var(--color-on-primary-fixed)] hover:opacity-95 active:scale-95 transition-all flex items-center gap-0.5 shadow-sm"
                  type="button"
                >
                  설정 저장{" "}
                  <span className="material-symbols-outlined text-[13px]">
                    check
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex flex-col gap-0.5">
                  <label className="text-[10px] text-[var(--color-inverse-primary)]/80">
                    근무 시간대
                  </label>
                  <select
                    className="w-full text-[11px] font-jetbrains bg-[var(--color-surface-container-high)]/20 text-white rounded border border-[var(--color-inverse-primary)]/30 px-2 py-1 focus:outline-none focus:border-[var(--color-secondary-container)] focus:ring-1 focus:ring-[var(--color-secondary-container)]"
                    value={shift}
                    onChange={(e) => handleShiftChange(e.target.value)}
                  >
                    <option className="text-[var(--color-text-primary)] bg-white">
                      09:00 ~ 15:00 (오전)
                    </option>
                    <option className="text-[var(--color-text-primary)] bg-white">
                      15:00 ~ 22:00 (오후)
                    </option>
                    <option className="text-[var(--color-text-primary)] bg-white">
                      22:00 ~ 익일 09:00 (야간)
                    </option>
                  </select>
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-[10px] text-[var(--color-inverse-primary)]/80">
                    담당 근무자
                  </label>
                  <select
                    className="w-full text-[11px] font-jetbrains bg-[var(--color-surface-container-high)]/20 text-white rounded border border-[var(--color-inverse-primary)]/30 px-2 py-1 focus:outline-none focus:border-[var(--color-secondary-container)] focus:ring-1 focus:ring-[var(--color-secondary-container)]"
                    value={worker}
                    onChange={(e) => handleWorkerChange(e.target.value)}
                  >
                    <option className="text-[var(--color-text-primary)] bg-white">
                      김알바
                    </option>
                    <option className="text-[var(--color-text-primary)] bg-white">
                      박근무
                    </option>
                    <option className="text-[var(--color-text-primary)] bg-white">
                      이점장
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Checklist */}
      <div className="flex flex-col gap-[var(--spacing-space-lg)]">
        <div className="flex items-center justify-between">
          <h2 className="font-hanken text-[15px] font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[var(--color-secondary)] font-bold text-lg">
              checklist
            </span>
            현장 실행 목록 (총 {tasks.length}건)
          </h2>
          <span className="font-hanken text-[11px] text-[var(--color-text-muted)]">
            우선순위 정렬됨
          </span>
        </div>

        {tasks.map((task) => (
          <article
            key={task.id}
            className={`bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-border-subtle)] p-[var(--spacing-space-md)] shadow-sm hover:shadow-md transition-shadow ${task.borderColor ? `border-l-4 ${task.borderColor}` : ""}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <input
                  className="w-4 h-4 rounded accent-[var(--color-text-primary)] border-slate-300"
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                {task.time && (
                  <span className="font-jetbrains text-[12px] font-bold text-[var(--color-text-primary)] flex items-center gap-1 bg-[var(--color-surface-muted)] px-2 py-0.5 rounded border border-[var(--color-border-subtle)]">
                    <span className="material-symbols-outlined text-[13px] text-[var(--color-secondary)]">
                      schedule
                    </span>
                    {task.time}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {isOwner && (
                  <button
                    aria-label="업무 상세 수정"
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--color-surface-muted)] text-[var(--color-outline)] active:scale-95 transition-transform"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      edit
                    </span>
                  </button>
                )}
                <button
                  aria-label="업무 삭제"
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-[var(--color-outline)] hover:text-red-500 active:scale-95 transition-all"
                  type="button"
                  onClick={() => deleteTask(task.id)}
                >
                  <span className="material-symbols-outlined text-[17px]">
                    close
                  </span>
                </button>
              </div>
            </div>

            <p
              className={`font-hanken text-[13px] font-semibold mt-1.5 ${task.completed ? "text-[var(--color-text-muted)] line-through" : "text-[var(--color-text-primary)]"}`}
            >
              {task.title}
            </p>

            {isOwner && (
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between bg-[var(--color-surface-muted)]/60 p-2 rounded-lg">
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-on-surface-variant)]">
                  <span className="material-symbols-outlined text-[15px] text-[var(--color-text-muted)]">
                    person
                  </span>
                  <span>담당자:</span>
                  <span className="font-bold text-[var(--color-text-primary)]">
                    {task.assignee}
                  </span>
                </div>
                <button
                  className="px-3 py-1.5 rounded-lg text-[12px] font-bold border border-slate-300 bg-white hover:bg-slate-50 text-[var(--color-text-primary)] shadow-sm active:scale-95 transition-transform"
                  type="button"
                >
                  할당 변경
                </button>
              </div>
            )}
          </article>
        ))}

        {/* Add Custom Task */}
        <section className="bg-[var(--color-surface-muted)] rounded-xl border border-dashed border-[var(--color-outline-variant)] p-[var(--spacing-space-md)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-hanken text-[15px] font-bold text-[var(--color-text-primary)] flex items-center gap-1">
              <span className="material-symbols-outlined text-[var(--color-secondary)] text-sm">
                add_task
              </span>
              새 업무 추가
            </span>
            {isOwner && (
              <span className="font-hanken text-[11px] text-[var(--color-text-muted)]">
                점장 특별 지시사항
              </span>
            )}
          </div>
          <div className="space-y-2">
            <input
              className="w-full text-[13px] bg-white rounded-lg border border-slate-300 px-3 py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-outline)] focus:outline-none focus:border-[var(--color-text-primary)] focus:ring-1 focus:ring-[var(--color-text-primary)]"
              placeholder="예: 삼각김밥 매대 POP 교체 건"
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <div className="flex items-center gap-2">
              {isOwner && (
                <select
                  aria-label="담당자 지정"
                  className="flex-1 h-10 text-[13px] bg-white rounded-lg border border-slate-300 px-3 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-text-primary)]"
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                >
                  <option>오전조 (김알바)</option>
                  <option>오후조 (박근무)</option>
                  <option>전체 공통</option>
                </select>
              )}
              <button
                className={`h-10 px-4 bg-[var(--color-text-primary)] text-white text-[13px] font-bold rounded-lg active:scale-95 transition-transform inline-flex items-center justify-center gap-1 shadow-sm hover:opacity-95 ${!isOwner ? "flex-1" : ""}`}
                type="button"
                onClick={addTask}
              >
                <span className="material-symbols-outlined text-[15px] leading-none">
                  add
                </span>
                등록
              </button>
            </div>
          </div>
        </section>

        {/* Sync Status */}
        <section className="bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-border-subtle)] p-3 text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <span className="material-symbols-outlined text-[var(--color-secondary)]">
              info
            </span>
            <span>체크리스트 수정 내역은 실시간 앱 동기화됩니다.</span>
          </div>
          <span className="font-jetbrains text-[var(--color-status-active)] font-bold">
            동기화 완료
          </span>
        </section>
      </div>

      <BottomCTA
        skipLabel="체크리스트 단계 건너뛰기"
        primaryLabel="체크리스트 저장하고 다음 단계로"
        nextPath="/flow/4"
        onPrimaryClick={() => updateStep3(tasks, shift, worker, true)}
      />
    </>
  );
}
