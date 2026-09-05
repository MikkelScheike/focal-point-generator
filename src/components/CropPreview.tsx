import type { FocalPoint } from "../lib/focal-point";
import { formatZoomScale, isZoomed } from "../lib/focal-point";

interface CropPreviewProps {
  src: string;
  alt: string;
  point: FocalPoint;
  ratio: number;
  label: string;
  ratioLabel: string;
  zoomPercent: number;
}

export function CropPreview({
  src,
  alt,
  point,
  ratio,
  label,
  ratioLabel,
  zoomPercent,
}: CropPreviewProps) {
  const position = `${point.x}% ${point.y}%`;
  const zoomed = isZoomed(zoomPercent);

  return (
    <figure className="mx-auto w-3/4 min-w-0">
      <figcaption className="mb-2 flex items-baseline justify-between gap-2">
        <span className="truncate text-sm font-medium text-ink">{label}</span>
        <span className="shrink-0 font-mono text-[11px] text-faint tabular-nums">{ratioLabel}</span>
      </figcaption>
      <div
        className="relative w-full overflow-hidden rounded-lg bg-canvas"
        style={{ aspectRatio: String(ratio) }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectFit: "cover",
            objectPosition: position,
            transform: zoomed ? `scale(${formatZoomScale(zoomPercent)})` : undefined,
            transformOrigin: position,
          }}
        />
      </div>
    </figure>
  );
}
