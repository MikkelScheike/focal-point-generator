import type { FocalPoint, LoadedImage } from "../lib/focal-point";
import {
  DEFAULT_FOCAL_POINT,
  DEFAULT_ZOOM_PERCENT,
  MAX_ZOOM_PERCENT,
  MIN_ZOOM_PERCENT,
  clampZoomPercent,
  formatAspectRatio,
  formatPercent,
} from "../lib/focal-point";
import { PercentField } from "./PercentField";
import { ResetIcon } from "./Icons";

interface FocalPanelProps {
  image: LoadedImage;
  point: FocalPoint;
  zoomPercent: number;
  locked?: boolean;
  onChange: (point: FocalPoint) => void;
  onZoomChange: (zoomPercent: number) => void;
  onReset: () => void;
}

export function FocalPanel({
  image,
  point,
  zoomPercent,
  locked = false,
  onChange,
  onZoomChange,
  onReset,
}: FocalPanelProps) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 items-end gap-3 sm:grid-cols-[1fr_1fr_minmax(8rem,1.7fr)]">
        <PercentField
          id="focal-x"
          label="X"
          value={point.x}
          disabled={locked}
          onChange={(x) => onChange({ ...point, x })}
        />
        <PercentField
          id="focal-y"
          label="Y"
          value={point.y}
          disabled={locked}
          onChange={(y) => onChange({ ...point, y })}
        />
        <label
          className="col-span-2 grid gap-1.5 sm:col-span-1"
          htmlFor="crop-zoom"
        >
          <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
            Zoom
          </span>
          <span className="flex h-11 items-center gap-3 rounded-lg border border-line bg-canvas px-3">
            <input
              id="crop-zoom"
              type="range"
              min={MIN_ZOOM_PERCENT}
              max={MAX_ZOOM_PERCENT}
              step={1}
              value={zoomPercent}
              disabled={locked}
              onChange={(event) =>
                onZoomChange(clampZoomPercent(Number(event.target.value)))
              }
              aria-valuetext={`${zoomPercent} percent`}
              className="min-w-0 flex-1"
            />
            <span className="w-12 shrink-0 text-right font-mono text-sm text-ink tabular-nums">
              {zoomPercent}
              <span className="text-faint">%</span>
            </span>
          </span>
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className="min-w-0 truncate font-mono text-xs text-muted tabular-nums"
          title={image.name}
        >
          {formatPercent(point.x)}% {formatPercent(point.y)}% · {image.width} ×{" "}
          {image.height} · {formatAspectRatio(image.width, image.height)} ·{" "}
          {image.name}
          {zoomPercent !== DEFAULT_ZOOM_PERCENT
            ? ` · ${zoomPercent}% zoom`
            : ""}
        </p>
        <button
          type="button"
          onClick={onReset}
          disabled={
            locked ||
            (point.x === DEFAULT_FOCAL_POINT.x &&
              point.y === DEFAULT_FOCAL_POINT.y)
          }
          className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-ink transition-colors hover:border-line-strong hover:bg-overlay disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ResetIcon className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
