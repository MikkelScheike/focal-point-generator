import { useEffect, useState } from "react";
import { formatPercent, parsePercent } from "../lib/focal-point";

interface PercentFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function PercentField({ id, label, value, onChange }: PercentFieldProps) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(formatPercent(value));

  useEffect(() => {
    if (!focused) {
      setDraft(formatPercent(value));
    }
  }, [focused, value]);

  function commit(raw: string) {
    const parsed = parsePercent(raw);
    if (parsed === null) {
      setDraft(formatPercent(value));
      return;
    }
    onChange(parsed);
    setDraft(formatPercent(parsed));
  }

  return (
    <label className="grid gap-1.5" htmlFor={id}>
      <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
        {label}
      </span>
      <span className="relative">
        <input
          id={id}
          inputMode="decimal"
          value={focused ? draft : formatPercent(value)}
          onFocus={() => {
            setFocused(true);
            setDraft(formatPercent(value));
          }}
          onBlur={() => {
            commit(draft);
            setFocused(false);
          }}
          onChange={(event) => {
            setDraft(event.target.value);
            const parsed = parsePercent(event.target.value);
            if (parsed !== null) {
              onChange(parsed);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
          className="h-11 w-full rounded-lg border border-line bg-canvas pr-8 pl-3 font-mono text-sm text-ink tabular-nums transition-colors hover:border-line-strong focus:border-accent/60 focus:outline-none"
          aria-describedby={`${id}-suffix`}
        />
        <span
          id={`${id}-suffix`}
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-sm text-faint"
        >
          %
        </span>
      </span>
    </label>
  );
}
