import { useEffect, useId, useRef, useState } from "react";
import type { CodeFormatId, FocalPoint } from "../lib/focal-point";
import { CODE_FORMATS, generateCode } from "../lib/focal-point";
import { CheckIcon, CloseIcon, CopyIcon } from "./Icons";

interface CodePanelProps {
  open: boolean;
  point: FocalPoint;
  zoomPercent: number;
  formatId: CodeFormatId;
  fileName: string;
  onFormatChange: (id: CodeFormatId) => void;
  onClose: () => void;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  }
}

export function CodePanel({
  open,
  point,
  zoomPercent,
  formatId,
  fileName,
  onFormatChange,
  onClose,
}: CodePanelProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);
  const srcPlaceholder = fileName.trim() === "" ? "image.jpg" : fileName;
  const code = generateCode(formatId, point, srcPlaceholder, zoomPercent);
  const format =
    CODE_FORMATS.find((item) => item.id === formatId) ?? CODE_FORMATS[0]!;
  const copyLabel =
    format.id === "css"
      ? "Copy CSS"
      : format.id === "ai"
        ? "Copy prompt"
        : `Copy ${format.label}`;

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previous = document.activeElement;
    closeRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
      if (previous instanceof HTMLElement) {
        previous.focus();
      }
    };
  }, [open, onClose]);

  useEffect(() => {
    setCopied(false);
  }, [formatId, point, zoomPercent, fileName, open]);

  if (!open) {
    return null;
  }

  async function handleCopy() {
    const ok = await copyText(code);
    if (!ok) {
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-canvas/80 backdrop-blur-[2px]"
        aria-label="Close generated code"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 grid w-full max-w-[680px] max-h-[min(96dvh,828px)] grid-rows-[auto_auto_minmax(0,1fr)] overflow-hidden rounded-2xl border border-line bg-raised shadow-[0_24px_80px_rgb(0_0_0_/_0.45)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 id={titleId} className="text-sm font-medium text-ink">
              Generated code
            </h2>
            <p className="mt-1 text-sm text-muted">
              {format.id === "ai" ? (
                <>
                  Paste this into an AI coding assistant so it can apply the
                  focal point on{" "}
                  <span className="font-mono text-[12px] text-ink">
                    {srcPlaceholder}.
                  </span>
                </>
              ) : (
                <>
                  Positioning for{" "}
                  <span className="font-mono text-[12px] text-ink">
                    {srcPlaceholder}
                  </span>
                  {zoomPercent > 100
                    ? ` at ${zoomPercent}% zoom. The image pixels are not modified.`
                    : ". The image pixels are not modified."}
                </>
              )}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-overlay hover:text-ink"
            aria-label="Close"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div
          className="mx-5 mt-4 grid grid-cols-2 gap-1 rounded-lg border border-line bg-canvas p-1 sm:grid-cols-3 lg:grid-cols-5"
          role="tablist"
          aria-label="Code format"
        >
          {CODE_FORMATS.map((item) => {
            const selected = item.id === formatId;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onFormatChange(item.id)}
                className={`h-10 min-w-0 rounded-md px-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  selected
                    ? "bg-ink text-canvas"
                    : "text-muted hover:bg-overlay hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="min-h-0 overflow-y-auto px-5 py-4">
          <div className="rounded-xl border border-line bg-canvas">
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
              <span className="font-mono text-[11px] tracking-[0.12em] text-faint uppercase">
                {format.language}
              </span>
              <button
                type="button"
                onClick={() => {
                  void handleCopy();
                }}
                className="inline-flex h-11 min-w-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-ink transition-colors hover:bg-overlay"
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4 text-accent" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
                {copied ? "Copied" : copyLabel}
              </button>
            </div>
            <pre className="p-4 pb-6 font-mono text-[13px] leading-relaxed break-words whitespace-pre-wrap text-ink">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
