import type { FocalPointDetector } from "./types";

const registry: FocalPointDetector[] = [];

/** Register a detector for a future Auto Detect feature. */
export function registerDetector(detector: FocalPointDetector): void {
  if (registry.some((item) => item.id === detector.id)) {
    return;
  }
  registry.push(detector);
}

export function listDetectors(): readonly FocalPointDetector[] {
  return registry;
}
