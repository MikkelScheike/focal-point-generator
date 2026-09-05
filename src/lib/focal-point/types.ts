export interface FocalPoint {
  x: number;
  y: number;
}

export interface LoadedImage {
  src: string;
  file: File;
  width: number;
  height: number;
  name: string;
  type: string;
}

export type CodeFormatId = "css" | "tailwind" | "inline" | "react";

export interface CodeContext {
  focalPoint: FocalPoint;
  srcPlaceholder: string;
  zoomPercent: number;
}

export interface CodeFormat {
  id: CodeFormatId;
  label: string;
  language: string;
  generate: (ctx: CodeContext) => string;
}

export interface CropPreset {
  id: string;
  label: string;
  /** Width / height. Null means the user supplies a custom ratio. */
  ratio: number | null;
  defaultCustom?: { width: number; height: number };
}

export interface FocalPointSuggestion {
  x: number;
  y: number;
  confidence?: number;
  reason?: string;
}

/**
 * Future auto-detect adapters implement this interface.
 * The manual focal point remains the source of truth until the user applies a suggestion.
 */
export interface FocalPointDetector {
  id: string;
  label: string;
  detect(image: HTMLImageElement): Promise<FocalPointSuggestion | null>;
}
