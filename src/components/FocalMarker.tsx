import type { FocalPoint } from "../lib/focal-point";

interface FocalMarkerProps {
  point: FocalPoint;
  size?: "sm" | "md";
  interactive?: boolean;
}

export function FocalMarker({
  point,
  size = "md",
  interactive = false,
}: FocalMarkerProps) {
  const diameter = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  const hit = size === "sm" ? "h-8 w-8" : "h-11 w-11";

  return (
    <div
      className="pointer-events-none absolute z-10"
      style={{
        left: `${point.x}%`,
        top: `${point.y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {interactive ? (
        <span
          className={`absolute top-1/2 left-1/2 ${hit} -translate-x-1/2 -translate-y-1/2`}
        />
      ) : null}
      <span
        className={`block ${diameter} rounded-full border-2 border-white bg-accent shadow-[0_0_0_1px_rgb(0_0_0_/_0.55),0_0_16px_rgb(94_234_212_/_0.45)]`}
      />
    </div>
  );
}
