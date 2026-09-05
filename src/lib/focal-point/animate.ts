import type { FocalPoint } from "./types";
import { clampFocalPoint, clampZoomPercent } from "./math";

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function wait(ms: number, signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve(false);
      return;
    }

    const id = window.setTimeout(() => resolve(true), ms);
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(id);
        resolve(false);
      },
      { once: true },
    );
  });
}

export function animateValue(
  from: number,
  to: number,
  durationMs: number,
  onFrame: (value: number) => void,
  signal: AbortSignal,
): Promise<boolean> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve(false);
      return;
    }

    const start = performance.now();
    let frame = 0;

    const finish = (completed: boolean) => {
      signal.removeEventListener("abort", onAbort);
      resolve(completed);
    };

    const onAbort = () => {
      cancelAnimationFrame(frame);
      finish(false);
    };

    signal.addEventListener("abort", onAbort, { once: true });

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / Math.max(durationMs, 1));
      const eased = easeOutCubic(t);
      onFrame(from + (to - from) * eased);
      if (t < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      onFrame(to);
      finish(true);
    };

    frame = requestAnimationFrame(tick);
  });
}

export function animateFocalPoint(
  from: FocalPoint,
  to: FocalPoint,
  durationMs: number,
  onFrame: (point: FocalPoint) => void,
  signal: AbortSignal,
): Promise<boolean> {
  const target = clampFocalPoint(to);
  return animateValue(0, 1, durationMs, (t) => {
    onFrame(
      clampFocalPoint({
        x: from.x + (target.x - from.x) * t,
        y: from.y + (target.y - from.y) * t,
      }),
    );
  }, signal).then((completed) => {
    if (completed) {
      onFrame(target);
    }
    return completed;
  });
}

export function animateZoomPercent(
  from: number,
  to: number,
  durationMs: number,
  onFrame: (zoomPercent: number) => void,
  signal: AbortSignal,
): Promise<boolean> {
  const target = clampZoomPercent(to);
  return animateValue(from, target, durationMs, (value) => {
    onFrame(clampZoomPercent(value));
  }, signal).then((completed) => {
    if (completed) {
      onFrame(target);
    }
    return completed;
  });
}
