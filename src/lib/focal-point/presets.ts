import type { CropPreset } from "./types";

export const CROP_PRESETS: readonly CropPreset[] = [
  { id: "desktop", label: "Desktop", ratio: 16 / 9 },
  { id: "tablet", label: "Tablet", ratio: 4 / 3 },
  { id: "mobile", label: "Mobile", ratio: 4 / 5 },
  { id: "square", label: "Square", ratio: 1 },
];

export const DEFAULT_PRESET_ID = "desktop";
export const COMPARE_PRESET_ID = "mobile";

export function getPreset(id: string): CropPreset {
  return CROP_PRESETS.find((preset) => preset.id === id) ?? CROP_PRESETS[0]!;
}

export function resolvePresetRatio(preset: CropPreset): number {
  return preset.ratio;
}

export function presetRatioLabel(preset: CropPreset): string {
  if (preset.id === "desktop") return "16:9";
  if (preset.id === "tablet") return "4:3";
  if (preset.id === "mobile") return "4:5";
  if (preset.id === "square") return "1:1";
  return "1:1";
}
