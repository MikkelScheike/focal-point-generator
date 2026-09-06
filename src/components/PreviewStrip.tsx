import type { FocalPoint } from "../lib/focal-point";
import {
  CROP_PRESETS,
  presetRatioLabel,
  resolvePresetRatio,
} from "../lib/focal-point";
import { CropPreview } from "./CropPreview";

interface PreviewStripProps {
  src: string;
  fileName: string;
  point: FocalPoint;
  zoomPercent: number;
}

export function PreviewStrip({
  src,
  fileName,
  point,
  zoomPercent,
}: PreviewStripProps) {
  return (
    <section className="grid gap-5">
      {CROP_PRESETS.map((preset) => {
        const ratio = resolvePresetRatio(preset);
        const ratioLabel = presetRatioLabel(preset);
        return (
          <CropPreview
            key={preset.id}
            src={src}
            alt={`${fileName} cropped to ${ratioLabel} for ${preset.label}`}
            point={point}
            ratio={ratio}
            label={preset.label}
            ratioLabel={ratioLabel}
            zoomPercent={zoomPercent}
          />
        );
      })}
    </section>
  );
}
