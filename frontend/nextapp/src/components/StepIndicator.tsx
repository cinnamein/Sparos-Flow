"use client";

const STEPS = ["재고확인", "발주", "체크", "폐기"];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <section className="bg-[var(--color-surface-container-lowest)] rounded-xl p-[var(--spacing-space-md)] border border-[var(--color-border-subtle)] shadow-sm">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="font-hanken text-[15px] leading-[20px] font-bold text-[var(--color-text-primary)]">
          업무 루틴 {currentStep}단계
        </h2>
      </div>
      <div className="grid grid-cols-4 gap-1.5 mb-2.5">
        {STEPS.map((_, idx) => {
          const step = idx + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;
          return (
            <div
              key={step}
              className={`h-1.5 rounded-full ${
                isActive
                  ? "bg-[var(--color-secondary-container)] shadow-[0_0_8px_rgba(254,187,0,0.6)]"
                  : isCompleted
                    ? "bg-[var(--color-text-primary)]"
                    : "bg-[var(--color-outline-variant)]/40"
              }`}
            />
          );
        })}
      </div>
      <div className="grid grid-cols-4 gap-1 text-center">
        {STEPS.map((label, idx) => {
          const step = idx + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;
          return (
            <span
              key={step}
              className={`font-hanken text-[11px] leading-[14px] ${
                isActive
                  ? "font-bold text-[var(--color-text-primary)]"
                  : isCompleted
                    ? "font-semibold text-[var(--color-text-muted)]"
                    : "font-medium text-[var(--color-text-muted)] opacity-40"
              }`}
            >
              {step}. {label}
            </span>
          );
        })}
      </div>
    </section>
  );
}
