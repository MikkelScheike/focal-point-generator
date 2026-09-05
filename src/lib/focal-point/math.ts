import type { FocalPoint } from "./types";

export const DEFAULT_FOCAL_POINT: FocalPoint = { x: 50, y: 50 };

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
export function formatPercent(value: number): string {
  const rounded = Math.round(clampFocal(value) * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function parsePercent(input: string): number | null {
  const trimmed = input.trim().replace(/%$/, "");
  if (trimmed === "") {
    return null;
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return null;
  }
  return clampFocal(value);
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

export function pointFromPointer(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): FocalPoint {
  const x = rect.width === 0 ? 50 : ((clientX - rect.left) / rect.width) * 100;
  const y = rect.height === 0 ? 50 : ((clientY - rect.top) / rect.height) * 100;
  return clampFocalPoint({ x, y });
}
