import type { CropPreset } from "./types";

export const CROP_PRESETS: readonly CropPreset[] = [
  { id: "desktop", label: "Desktop", ratio: 16 / 9 },
  { id: "tablet", label: "Tablet", ratio: 4 / 3 },
  { id: "mobile", label: "Mobile", ratio: 4 / 5 },
  { id: "square", label: "Square", ratio: 1 },
  { id: "portrait", label: "Portrait", ratio: 3 / 4 },
  { id: "custom", label: "Custom", ratio: null, defaultCustom: { width: 21, height: 9 } },
];

export const DEFAULT_PRESET_ID = "desktop";
export const COMPARE_PRESET_ID = "mobile";

export function getPreset(id: string): CropPreset {
  return CROP_PRESETS.find((preset) => preset.id === id) ?? CROP_PRESETS[0]!;
}

export function resolvePresetRatio(
  preset: CropPreset,
  custom: { width: number; height: number },
): number {
  if (preset.ratio !== null) {
    return preset.ratio;
  }
  const width = custom.width > 0 ? custom.width : 21;
  const height = custom.height > 0 ? custom.height : 9;
  return width / height;
}

export function presetRatioLabel(
  preset: CropPreset,
  custom: { width: number; height: number },
): string {
  if (preset.id === "desktop") return "16:9";
  if (preset.id === "tablet") return "4:3";
  if (preset.id === "mobile") return "4:5";
  if (preset.id === "square") return "1:1";
  if (preset.id === "portrait") return "3:4";
  return `${custom.width}:${custom.height}`;
}
