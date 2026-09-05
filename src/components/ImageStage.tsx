import { useCallback, useRef, type KeyboardEvent, type PointerEvent } from "react";
import type { FocalPoint, LoadedImage } from "../lib/focal-point";
import { pointFromPointer, snapFocalPoint } from "../lib/focal-point";
import { FocalMarker } from "./FocalMarker";

interface ImageStageProps {
  image: LoadedImage;
  point: FocalPoint;
  locked?: boolean;
  onChange: (point: FocalPoint) => void;
}

const NUDGE = 0.5;
const NUDGE_LARGE = 5;

export function ImageStage({ image, point, locked = false, onChange }: ImageStageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const frame = frameRef.current;
      if (!frame) {
        return;
      }
      const placed = pointFromPointer(event.clientX, event.clientY, frame.getBoundingClientRect());
      onChange(event.altKey ? placed : snapFocalPoint(placed));
    },
    [onChange],
  );

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (locked || event.button !== 0) {
      return;
    }
    event.preventDefault();
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(event);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (locked || !dragging.current) {
      return;
    }
    updateFromPointer(event);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (locked) {
      return;
    }
    const step = event.shiftKey ? NUDGE_LARGE : NUDGE;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onChange({ ...point, x: Math.max(0, point.x - step) });
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      onChange({ ...point, x: Math.min(100, point.x + step) });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      onChange({ ...point, y: Math.max(0, point.y - step) });
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      onChange({ ...point, y: Math.min(100, point.y + step) });
    }
  }

  return (
    <div
      ref={frameRef}
      className={`relative inline-block max-h-full max-w-full touch-none select-none ${
        locked ? "cursor-default" : "cursor-crosshair"
      }`}
      role="slider"
      aria-label="Focal point on image"
      aria-disabled={locked}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`X ${point.x.toFixed(1)} percent, Y ${point.y.toFixed(1)} percent`}
      tabIndex={locked ? -1 : 0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
    >
      <img
        src={image.src}
        alt="Uploaded image for choosing a focal point"
        draggable={false}
        className="block h-auto max-h-[min(58dvh,520px)] w-auto max-w-full"
      />
      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-white/35"
        style={{ left: `${point.x}%` }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 h-px bg-white/35"
        style={{ top: `${point.y}%` }}
      />
      <FocalMarker point={point} interactive />
    </div>
  );
}
