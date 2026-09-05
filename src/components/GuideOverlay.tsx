import { useEffect } from "react";

export type GuideStep = "point" | "zoom";

interface GuideOverlayProps {
  step: GuideStep;
  onClose: () => void;
}

const COPY: Record<GuideStep, string> = {
  point: "Set the focal point to the area of importance.",
  zoom: "Zoom for the image to fit.",
};

export function GuideOverlay({ step, onClose }: GuideOverlayProps) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center p-3">
      <p
        className="mb-1 w-full max-w-[36ch] rounded-lg border border-line bg-raised/95 px-3 py-2.5 text-center text-sm leading-snug text-ink shadow-[0_12px_40px_rgb(0_0_0_/_0.45)]"
        aria-live="polite"
      >
        {COPY[step]}
      </p>
    </div>
  );
}
