import type { FocalPoint } from "./types";

export const DEFAULT_FOCAL_POINT: FocalPoint = { x: 50, y: 50 };
export const DEFAULT_ZOOM_PERCENT = 100;
export const MIN_ZOOM_PERCENT = 100;
export const MAX_ZOOM_PERCENT = 200;

export function clampZoomPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_ZOOM_PERCENT;
  }
  return Math.round(clamp(value, MIN_ZOOM_PERCENT, MAX_ZOOM_PERCENT));
}

export function zoomScale(zoomPercent: number): number {
  return clampZoomPercent(zoomPercent) / 100;
}

export function isZoomed(zoomPercent: number): boolean {
  return clampZoomPercent(zoomPercent) > DEFAULT_ZOOM_PERCENT;
}

/** CSS scale() argument, e.g. 1.35 */
export function formatZoomScale(zoomPercent: number): string {
  const scale = zoomScale(zoomPercent);
  const rounded = Math.round(scale * 100) / 100;
  if (Number.isInteger(rounded)) {
    return String(rounded);
  }
  return rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clampFocal(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_FOCAL_POINT.x;
  }
  return clamp(value, 0, 100);
}

export function clampFocalPoint(point: FocalPoint): FocalPoint {
  return {
    x: clampFocal(point.x),
    y: clampFocal(point.y),
  };
}

/** Display with at most one decimal place. */
export function formatRangeValue(value: number, min: number, max: number): string {
  if (!Number.isFinite(value)) {
    return String(min);
  }
  const rounded = Math.round(clamp(value, min, max) * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function parseRangeValue(input: string, min: number, max: number): number | null {
  const trimmed = input.trim().replace(/%$/, "");
  if (trimmed === "") {
    return null;
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return null;
  }
  return clamp(value, min, max);
}

export function formatPercent(value: number): string {
  return formatRangeValue(clampFocal(value), 0, 100);
}

export function parsePercent(input: string): number | null {
  return parseRangeValue(input, 0, 100);
}

export function toObjectPosition(point: FocalPoint): string {
  return `${formatPercent(point.x)}% ${formatPercent(point.y)}%`;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

export function simplifyRatio(width: number, height: number): { width: number; height: number } {
  const divisor = gcd(width, height);
  return {
    width: Math.round(width) / divisor,
    height: Math.round(height) / divisor,
  };
}

export function formatAspectRatio(width: number, height: number): string {
  const ratio = simplifyRatio(width, height);
  return `${ratio.width}:${ratio.height}`;
}

/** Pointer placement snaps to the edges and the center; typed and nudged values never do. */
export const SNAP_TARGETS: readonly number[] = [0, 50, 100];
export const SNAP_THRESHOLD_PERCENT = 1.5;

function snapValue(value: number, threshold: number): number {
  const target = SNAP_TARGETS.find((candidate) => Math.abs(value - candidate) <= threshold);
  return target ?? value;
}

export function snapFocalPoint(
  point: FocalPoint,
  threshold = SNAP_THRESHOLD_PERCENT,
): FocalPoint {
  return {
    x: snapValue(point.x, threshold),
    y: snapValue(point.y, threshold),
  };
}

export function pointFromPointer(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): FocalPoint {
  const x = rect.width === 0 ? 50 : ((clientX - rect.left) / rect.width) * 100;
  const y = rect.height === 0 ? 50 : ((clientY - rect.top) / rect.height) * 100;
  return clampFocalPoint({ x, y });
}
