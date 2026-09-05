import type { FocalPoint } from "../lib/focal-point";
import {
  CROP_PRESETS,
  getPreset,
  presetRatioLabel,
  resolvePresetRatio,
} from "../lib/focal-point";
import { CropPreview } from "./CropPreview";
import { CodeIcon } from "./Icons";

interface PreviewStripProps {
  src: string;
  fileName: string;
  point: FocalPoint;
  activePresetId: string;
  customRatio: { width: number; height: number };
  onSelectPreset: (id: string) => void;
  onCustomRatioChange: (next: { width: number; height: number }) => void;
  onGenerate: () => void;
}

function safeCustomNumber(value: string, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

export function PreviewStrip({
  src,
  fileName,
  point,
  activePresetId,
  customRatio,
  onSelectPreset,
  onCustomRatioChange,
  onGenerate,
}: PreviewStripProps) {
  const selected = getPreset(activePresetId);
  const ratio = resolvePresetRatio(selected, customRatio);
  const ratioLabel = presetRatioLabel(selected, customRatio);

  return (
    <section className="flex h-full min-h-0 flex-col gap-4">
      <div>
        <h2 className="text-sm font-medium text-ink">Preview</h2>
        <p className="mt-1 text-sm text-muted">
          {selected.label} · {ratioLabel}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Crop presets">
        {CROP_PRESETS.map((preset) => {
          const isSelected = preset.id === activePresetId;
          return (
            <button
              key={preset.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectPreset(preset.id)}
              className={`h-11 min-w-11 rounded-lg px-3 text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-ink text-canvas"
                  : "border border-line text-muted hover:border-line-strong hover:text-ink"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {activePresetId === "custom" ? (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs tracking-[0.12em] text-faint uppercase">Custom</p>
          <label className="flex items-center gap-2 text-sm text-muted">
            W
            <input
              inputMode="decimal"
              value={customRatio.width}
              onChange={(event) =>
                onCustomRatioChange({
                  ...customRatio,
                  width: safeCustomNumber(event.target.value, customRatio.width),
                })
              }
              className="h-11 w-16 rounded-lg border border-line bg-raised px-2 text-center font-mono text-sm text-ink"
              aria-label="Custom ratio width"
            />
          </label>
          <span className="text-faint">:</span>
          <label className="flex items-center gap-2 text-sm text-muted">
            H
            <input
              inputMode="decimal"
              value={customRatio.height}
              onChange={(event) =>
                onCustomRatioChange({
                  ...customRatio,
                  height: safeCustomNumber(event.target.value, customRatio.height),
                })
              }
              className="h-11 w-16 rounded-lg border border-line bg-raised px-2 text-center font-mono text-sm text-ink"
              aria-label="Custom ratio height"
            />
          </label>
        </div>
      ) : null}

      <CropPreview
        key={`${activePresetId}-${ratioLabel}`}
        src={src}
        alt={`${fileName} cropped to ${ratioLabel} for ${selected.label}`}
        point={point}
        ratio={ratio}
        label={fileName}
        ratioLabel={ratioLabel}
      />

      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={onGenerate}
          className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-medium text-canvas transition-opacity hover:opacity-90"
        >
          <CodeIcon className="h-4 w-4" />
          Generate code
        </button>
      </div>
    </section>
  );
}
