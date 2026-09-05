import { useEffect, useState } from "react";
import { formatRangeValue, parseRangeValue } from "../lib/focal-point";

interface PercentFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  layout?: "stacked" | "inline";
}

export function PercentField({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  layout = "stacked",
}: PercentFieldProps) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(formatRangeValue(value, min, max));
  const display = formatRangeValue(value, min, max);
  const inline = layout === "inline";

  useEffect(() => {
    if (!focused) {
      setDraft(formatRangeValue(value, min, max));
    }
  }, [focused, value, min, max]);

  function commit(raw: string) {
    const parsed = parseRangeValue(raw, min, max);
    if (parsed === null) {
      setDraft(display);
      return;
    }
    onChange(parsed);
    setDraft(formatRangeValue(parsed, min, max));
  }

  return (
    <label
      className={inline ? "flex items-center justify-between gap-3" : "grid gap-1.5"}
      htmlFor={id}
    >
      <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
        {label}
      </span>
      <span className={`relative ${inline ? "w-20 shrink-0" : ""}`}>
        <input
          id={id}
          inputMode="decimal"
          value={focused ? draft : display}
          onFocus={() => {
            setFocused(true);
            setDraft(display);
          }}
          onBlur={() => {
            commit(draft);
            setFocused(false);
          }}
          onChange={(event) => {
            const raw = event.target.value;
            const parsed = parseRangeValue(raw, min, max);
            if (parsed === null) {
              setDraft(raw);
              return;
            }
            const typed = Number(raw.trim().replace(/%$/, ""));
            setDraft(typed > max ? formatRangeValue(parsed, min, max) : raw);
            onChange(parsed);
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
