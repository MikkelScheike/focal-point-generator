import type { FocalPoint } from "../lib/focal-point";

interface CropPreviewProps {
  src: string;
  alt: string;
  point: FocalPoint;
  ratio: number;
  label: string;
  ratioLabel: string;
  maxHeight?: number;
}

export function CropPreview({
  src,
  alt,
  point,
  ratio,
  label,
  ratioLabel,
  maxHeight = 320,
}: CropPreviewProps) {
  return (
    <figure className="min-w-0">
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="mx-auto block rounded-lg object-cover"
        style={{
          aspectRatio: String(ratio),
          width: `min(100%, calc(${maxHeight}px * ${ratio}))`,
          objectFit: "cover",
          objectPosition: `${point.x}% ${point.y}%`,
        }}
      />
      <figcaption className="mt-2 flex items-baseline justify-between gap-3">
        <span className="truncate text-sm font-medium text-ink">{label}</span>
        <span className="shrink-0 font-mono text-[11px] text-faint tabular-nums">{ratioLabel}</span>
      </figcaption>
    </figure>
  );
}
