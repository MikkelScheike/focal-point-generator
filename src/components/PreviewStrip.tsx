import { useRef } from "react";
import type { FocalPoint } from "../lib/focal-point";
import {
  CROP_PRESETS,
  DEFAULT_ZOOM_PERCENT,
  MAX_ZOOM_PERCENT,
  MIN_ZOOM_PERCENT,
  clampZoomPercent,
  getPreset,
  presetRatioLabel,
  resolvePresetRatio,
} from "../lib/focal-point";
import { CropPreview } from "./CropPreview";
import { PercentField } from "./PercentField";

interface PreviewStripProps {
  src: string;
  fileName: string;
  point: FocalPoint;
  zoomPercent: number;
  activePresetId: string;
  customRatio: { width: number; height: number };
  onZoomChange: (zoomPercent: number) => void;
  onSelectPreset: (id: string) => void;
  onCustomRatioChange: (next: { width: number; height: number }) => void;
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
  zoomPercent,
  activePresetId,
  customRatio,
  onZoomChange,
  onSelectPreset,
  onCustomRatioChange,
}: PreviewStripProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLElement>());

  function scrollToPreset(id: string) {
    onSelectPreset(id);
    const root = listRef.current;
    const node = itemRefs.current.get(id);
    if (!root || !node) {
      return;
    }
    const top = node.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop;
    root.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <section className="flex min-h-0 flex-col gap-4 lg:h-[calc(100dvh-6.5rem)]">
      <div>
        <h2 className="text-sm font-medium text-ink">Preview</h2>
        <p className="mt-1 text-sm text-muted">
          Same focal point and zoom in every frame.
          <span className="hidden lg:inline"> Presets jump to that crop.</span>
        </p>
      </div>

      <div className="hidden flex-wrap gap-1.5 lg:flex" role="tablist" aria-label="Crop presets">
        {CROP_PRESETS.map((preset) => {
          const isSelected = preset.id === activePresetId;
          return (
            <button
              key={preset.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`preset-${preset.id}`}
              onClick={() => scrollToPreset(preset.id)}
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

      <div className="grid gap-2">
        <PercentField
          id="crop-zoom"
          label="Zoom"
          layout="inline"
          value={zoomPercent}
          min={MIN_ZOOM_PERCENT}
          max={MAX_ZOOM_PERCENT}
          onChange={(next) => onZoomChange(clampZoomPercent(next))}
        />
        <input
          type="range"
          min={MIN_ZOOM_PERCENT}
          max={MAX_ZOOM_PERCENT}
          step={1}
          value={zoomPercent}
          onChange={(event) => onZoomChange(clampZoomPercent(Number(event.target.value)))}
          aria-label="Zoom slider"
          aria-valuetext={`${zoomPercent} percent`}
        />
        <span className="text-xs text-faint">
          {zoomPercent === DEFAULT_ZOOM_PERCENT
            ? `100% is cover. Up to ${MAX_ZOOM_PERCENT}% punches in and clips more of the image.`
            : "Generated code includes overflow clipping, scale, and transform-origin at the focal point."}
        </span>
      </div>

      <div
        ref={listRef}
        className="min-h-0 flex-1 space-y-6 overflow-y-auto pr-1 [scrollbar-gutter:stable]"
      >
        {CROP_PRESETS.map((preset) => {
          const ratio = resolvePresetRatio(preset, customRatio);
          const ratioLabel = presetRatioLabel(preset, customRatio);
          const selected = getPreset(preset.id);
          return (
            <div
              key={preset.id}
              id={`preset-${preset.id}`}
              data-preset-id={preset.id}
              ref={(node) => {
                if (node) {
                  itemRefs.current.set(preset.id, node);
                } else {
                  itemRefs.current.delete(preset.id);
                }
              }}
              className="scroll-mt-2"
            >
              {preset.id === "custom" ? (
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <p className="text-sm font-medium text-ink">Custom</p>
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
                src={src}
                alt={`${fileName} cropped to ${ratioLabel} for ${selected.label}`}
                point={point}
                ratio={ratio}
                label={selected.label}
                ratioLabel={ratioLabel}
                zoomPercent={zoomPercent}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
