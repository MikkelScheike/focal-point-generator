import type { FocalPoint, LoadedImage } from "../lib/focal-point";
import { DEFAULT_FOCAL_POINT, formatAspectRatio, formatPercent } from "../lib/focal-point";
import { PercentField } from "./PercentField";
import { ResetIcon } from "./Icons";

interface FocalPanelProps {
  image: LoadedImage;
  point: FocalPoint;
  onChange: (point: FocalPoint) => void;
  onReset: () => void;
}

export function FocalPanel({ image, point, onChange, onReset }: FocalPanelProps) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3">
        <PercentField
          id="focal-x"
          label="X"
          value={point.x}
          onChange={(x) => onChange({ ...point, x })}
        />
        <PercentField
          id="focal-y"
          label="Y"
          value={point.y}
          onChange={(y) => onChange({ ...point, y })}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="min-w-0 truncate font-mono text-xs text-muted tabular-nums" title={image.name}>
          {formatPercent(point.x)}% {formatPercent(point.y)}% · {image.width} × {image.height} ·{" "}
          {formatAspectRatio(image.width, image.height)} · {image.name}
        </p>
        <button
          type="button"
          onClick={onReset}
          disabled={point.x === DEFAULT_FOCAL_POINT.x && point.y === DEFAULT_FOCAL_POINT.y}
          className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-ink transition-colors hover:border-line-strong hover:bg-overlay disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ResetIcon className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
