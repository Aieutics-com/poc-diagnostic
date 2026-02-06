"use client";

interface ToggleProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
}

export default function Toggle({ value, onChange }: ToggleProps) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`
          px-6 py-2.5 rounded-full text-sm font-bold font-[family-name:var(--font-heading)]
          transition-all duration-200 cursor-pointer
          ${
            value === true
              ? "bg-[var(--color-orange)] text-white shadow-[0_0_0_3px_rgba(255,255,255,1),0_0_0_4px_var(--color-orange)]"
              : "bg-[var(--color-white)] border border-[var(--color-grey-light)] text-[var(--color-grey)] shadow-sm hover:border-[var(--color-orange)] hover:text-[var(--color-orange)]"
          }
        `}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`
          px-6 py-2.5 rounded-full text-sm font-bold font-[family-name:var(--font-heading)]
          transition-all duration-200 cursor-pointer
          ${
            value === false
              ? "bg-[var(--color-foreground)] text-white shadow-[0_0_0_3px_rgba(255,255,255,1),0_0_0_4px_var(--color-foreground)]"
              : "bg-[var(--color-white)] border border-[var(--color-grey-light)] text-[var(--color-grey)] shadow-sm hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)]"
          }
        `}
      >
        No
      </button>
    </div>
  );
}
