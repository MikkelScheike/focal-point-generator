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
  maxHeight?: number;
}

export function CropPreview({
  src,
  alt,
  point,
  ratio,
  label,
  ratioLabel,
  zoomPercent,
  maxHeight = 240,
}: CropPreviewProps) {
  const position = `${point.x}% ${point.y}%`;
  const zoomed = isZoomed(zoomPercent);

  return (
    <figure className="min-w-0">
      <div
        className="relative mx-auto overflow-hidden rounded-lg bg-canvas"
        style={{
          aspectRatio: String(ratio),
          width: `min(100%, calc(${maxHeight}px * ${ratio}))`,
        }}
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
      <figcaption className="mt-2 flex items-baseline justify-between gap-3">
        <span className="truncate text-sm font-medium text-ink">{label}</span>
        <span className="shrink-0 font-mono text-[11px] text-faint tabular-nums">{ratioLabel}</span>
      </figcaption>
    </figure>
  );
}
