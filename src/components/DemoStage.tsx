import {
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import type { FocalPoint } from "../lib/focal-point";
import {
  DEFAULT_FOCAL_POINT,
  DEFAULT_ZOOM_PERCENT,
  DEMO_LAYOUTS,
  DEMO_TRANSITION_MS,
  formatPercent,
  formatZoomScale,
  isZoomed,
} from "../lib/focal-point";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "./Icons";

interface DemoStageProps {
  src: string;
  fileName: string;
  point: FocalPoint;
  zoomPercent: number;
  onClose: () => void;
}

function imageCropStyle(point: FocalPoint, zoomPercent: number): CSSProperties {
  const position = `${point.x}% ${point.y}%`;
  const zoomed = isZoomed(zoomPercent);
  return {
    objectFit: "cover",
    objectPosition: position,
    transform: zoomed ? `scale(${formatZoomScale(zoomPercent)})` : undefined,
    transformOrigin: position,
    transitionProperty: "object-position, transform",
    transitionDuration: `${DEMO_TRANSITION_MS}ms`,
    transitionTimingFunction: "ease-out",
  };
}

function preventSubmit(event: FormEvent) {
  event.preventDefault();
}

const fieldClass =
  "h-11 w-full rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-faint";
const primaryButtonClass =
  "inline-flex h-11 items-center justify-center rounded-lg bg-ink px-4 text-sm font-medium text-canvas transition-colors hover:bg-zinc-200";

export function DemoStage({
  src,
  fileName,
  point,
  zoomPercent,
  onClose,
}: DemoStageProps) {
  const [index, setIndex] = useState(0);
  const [useFocal, setUseFocal] = useState(true);
  const layout = DEMO_LAYOUTS[index] ?? DEMO_LAYOUTS[0]!;
  const cropPoint = useFocal ? point : DEFAULT_FOCAL_POINT;
  const cropZoom = useFocal ? zoomPercent : DEFAULT_ZOOM_PERCENT;
  const cropStyle = imageCropStyle(cropPoint, cropZoom);
  const lastIndex = DEMO_LAYOUTS.length - 1;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable
        ) {
          return;
        }
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex((current) => (current === 0 ? lastIndex : current - 1));
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setIndex((current) => (current === lastIndex ? 0 : current + 1));
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [lastIndex, onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black">
      <header
        className="shrink-0 border-b border-line bg-raised"
        style={{ boxShadow: "inset 0 -1px 0 rgb(94 234 212 / 0.35)" }}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
          <p className="text-[11px] font-medium tracking-[0.16em] text-accent uppercase">
            Test
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-line-strong px-3 text-sm font-medium text-ink transition-colors hover:bg-overlay"
          >
            <CloseIcon className="h-4 w-4" />
            Close
          </button>
        </div>
        <div className="flex flex-col gap-2 px-4 pb-3 sm:flex-row sm:items-center sm:gap-3 sm:px-5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setIndex((current) => (current === 0 ? lastIndex : current - 1))
              }
              aria-label="Previous layout"
              className="hidden h-11 shrink-0 items-center justify-center rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-overlay hover:text-ink sm:inline-flex"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <div className="flex min-w-0 flex-1 rounded-lg border border-line bg-canvas p-0.5">
              {DEMO_LAYOUTS.map((item, itemIndex) => {
                const active = item.id === layout.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIndex(itemIndex)}
                    aria-pressed={active}
                    className={`h-9 min-w-0 flex-1 rounded-md px-2 text-sm font-medium whitespace-nowrap transition-colors sm:flex-none sm:px-3 ${
                      active
                        ? "bg-overlay text-ink"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    <span className="sm:hidden">{item.shortLabel}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() =>
                setIndex((current) =>
                  current === lastIndex ? 0 : current + 1,
                )
              }
              aria-label="Next layout"
              className="hidden h-11 shrink-0 items-center justify-center rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-overlay hover:text-ink sm:inline-flex"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <div className="flex flex-1 rounded-lg border border-line bg-canvas p-0.5 sm:flex-none">
              <button
                type="button"
                onClick={() => setUseFocal(false)}
                aria-pressed={!useFocal}
                className={`h-9 flex-1 rounded-md px-3 text-sm font-medium transition-colors sm:flex-none ${
                  !useFocal
                    ? "bg-overlay text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                Without
              </button>
              <button
                type="button"
                onClick={() => setUseFocal(true)}
                aria-pressed={useFocal}
                className={`h-9 flex-1 rounded-md px-3 text-sm font-medium transition-colors sm:flex-none ${
                  useFocal
                    ? "bg-overlay text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                With
              </button>
            </div>
            <span className="hidden font-mono text-[11px] text-faint tabular-nums lg:inline">
              {formatPercent(cropPoint.x)}% {formatPercent(cropPoint.y)}% ·{" "}
              {cropZoom}%
            </span>
          </div>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain bg-canvas [-webkit-overflow-scrolling:touch]">
        {layout.kind === "split" ? (
          <SplitLogin src={src} fileName={fileName} cropStyle={cropStyle} />
        ) : null}
        {layout.kind === "hero" ? (
          <HeroBanner src={src} fileName={fileName} cropStyle={cropStyle} />
        ) : null}
        {layout.kind === "card" ? (
          <BookingCard src={src} fileName={fileName} cropStyle={cropStyle} />
        ) : null}
      </div>
    </div>
  );
}

interface LayoutVisualProps {
  src: string;
  fileName: string;
  cropStyle: CSSProperties;
}

function SplitLogin({ src, fileName, cropStyle }: LayoutVisualProps) {
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();

  return (
    <div className="flex min-h-full flex-col lg:h-full lg:min-h-0 lg:flex-row">
      <div className="relative h-[min(42dvh,280px)] shrink-0 overflow-hidden bg-overlay lg:h-auto lg:min-h-0 lg:w-1/2 lg:flex-none">
        <img
          src={src}
          alt={`${fileName} in split login layout`}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={cropStyle}
        />
      </div>
      <div className="flex flex-1 flex-col justify-center bg-raised px-8 py-8 sm:px-12 lg:min-h-0 lg:w-1/2 lg:flex-none lg:overflow-y-auto lg:px-16">
        <div className="mx-auto w-full max-w-[20rem]">
          <p className="text-[11px] font-medium tracking-[0.16em] text-faint uppercase">
            Lumina
          </p>
          <h1 className="mt-2 text-lg font-medium tracking-tight text-ink">
            Welcome back
          </h1>
          <p className="mt-1 text-[13px] text-muted">
            Sign in to continue to your workspace.
          </p>
          <form className="mt-5 grid gap-3" onSubmit={preventSubmit}>
            <label className="grid gap-1" htmlFor={emailId}>
              <span className="text-[11px] font-medium text-muted">Email</span>
              <input
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@studio.com"
                className="h-9 w-full rounded-md border border-line bg-canvas px-2.5 text-[13px] text-ink outline-none placeholder:text-faint"
              />
            </label>
            <label className="grid gap-1" htmlFor={passwordId}>
              <span className="text-[11px] font-medium text-muted">
                Password
              </span>
              <input
                id={passwordId}
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-9 w-full rounded-md border border-line bg-canvas px-2.5 text-[13px] text-ink outline-none placeholder:text-faint"
              />
            </label>
            <div className="flex items-center justify-between gap-3">
              <label
                className="flex items-center gap-1.5 text-xs text-muted"
                htmlFor={rememberId}
              >
                <input
                  id={rememberId}
                  name="remember"
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-line accent-teal-300"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-xs text-muted underline-offset-2 hover:text-ink hover:underline"
              >
                Forgot password
              </button>
            </div>
            <button
              type="submit"
              className="inline-flex h-9 w-full items-center justify-center rounded-md bg-ink text-[13px] font-medium text-canvas transition-colors hover:bg-zinc-200"
            >
              Sign in
            </button>
          </form>
          <p className="mt-4 text-xs text-faint">
            Don’t have an account?{" "}
            <button
              type="button"
              className="text-ink underline-offset-2 hover:underline"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function HeroBanner({ src, fileName, cropStyle }: LayoutVisualProps) {
  const emailId = useId();

  return (
    <div className="relative h-full min-h-full overflow-hidden bg-overlay">
      <img
        src={src}
        alt={`${fileName} in wide hero layout`}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={cropStyle}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/35" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5 sm:px-10">
        <p className="text-sm font-medium tracking-[0.16em] text-white uppercase">
          Lumina
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden h-10 rounded-lg px-3 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex sm:items-center"
          >
            Product
          </button>
          <button
            type="button"
            className="h-10 rounded-lg border border-white/20 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            Sign in
          </button>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 px-6 pb-10 sm:px-10 sm:pb-14">
        <p className="max-w-xl text-3xl font-medium tracking-tight text-white sm:text-4xl">
          Rooms that keep the view in frame.
        </p>
        <p className="mt-2 max-w-lg text-sm text-white/70">
          Join the waitlist and we’ll send a note when new stays open.
        </p>
        <form
          className="mt-6 flex max-w-lg flex-col gap-2 sm:flex-row"
          onSubmit={preventSubmit}
        >
          <label className="sr-only" htmlFor={emailId}>
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@studio.com"
            className="h-11 min-w-0 flex-1 rounded-lg border border-white/20 bg-black/40 px-3 text-sm text-white outline-none placeholder:text-white/50"
          />
          <button
            type="submit"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-white px-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            Request access
          </button>
        </form>
      </div>
    </div>
  );
}

function BookingCard({ src, fileName, cropStyle }: LayoutVisualProps) {
  const nameId = useId();
  const dateId = useId();

  return (
    <div className="flex min-h-full items-start justify-center bg-canvas px-4 py-6 sm:items-center sm:py-8">
      <article className="w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-raised shadow-[0_24px_80px_rgb(0_0_0_/_0.35)]">
        <div className="relative aspect-[4/5] overflow-hidden bg-overlay">
          <img
            src={src}
            alt={`${fileName} in mobile card layout`}
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={cropStyle}
          />
        </div>
        <form className="grid gap-4 p-5" onSubmit={preventSubmit}>
          <div>
            <p className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
              Copenhagen · 2 nights
            </p>
            <h2 className="mt-1 text-lg font-medium text-ink">
              Studio loft with evening light
            </h2>
            <p className="mt-1 text-sm text-muted">
              One room left this weekend.
            </p>
          </div>
          <label className="grid gap-1.5" htmlFor={nameId}>
            <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
              Name
            </span>
            <input
              id={nameId}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Jordan Hale"
              className={fieldClass}
            />
          </label>
          <label className="grid gap-1.5" htmlFor={dateId}>
            <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
              Check-in
            </span>
            <input
              id={dateId}
              name="checkin"
              type="date"
              className={fieldClass}
            />
          </label>
          <button type="submit" className={primaryButtonClass}>
            Request to book
          </button>
        </form>
      </article>
    </div>
  );
}
