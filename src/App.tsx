import { useCallback, useEffect, useRef, useState } from "react";
import {
  ACCEPT_ATTRIBUTE,
  DEFAULT_FOCAL_POINT,
  DEFAULT_ZOOM_PERCENT,
  INVALID_IMAGE_MESSAGE,
  animateFocalPoint,
  animateZoomPercent,
  fileFromUrl,
  imageFromClipboard,
  loadImageFile,
  revokeLoadedImage,
  wait,
  type CodeFormatId,
  type FocalPoint,
  type LoadedImage,
  type SampleImage,
} from "./lib/focal-point";
import { AboutPage } from "./components/AboutPage";
import { CodePanel } from "./components/CodePanel";
import { DemoStage } from "./components/DemoStage";
import { FocalPanel } from "./components/FocalPanel";
import { GuideOverlay, type GuideStep } from "./components/GuideOverlay";
import { ImageStage } from "./components/ImageStage";
import { PreviewStrip } from "./components/PreviewStrip";
import { UploadDropzone } from "./components/UploadDropzone";
import { BackIcon, CodeIcon, UploadIcon } from "./components/Icons";
import { usePathname } from "./lib/navigation";

export default function App() {
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<LoadedImage | null>(null);
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [point, setPoint] = useState<FocalPoint>(DEFAULT_FOCAL_POINT);
  const [error, setError] = useState<string | null>(null);
  const [formatId, setFormatId] = useState<CodeFormatId>("css");
  const [codeOpen, setCodeOpen] = useState(false);
  const [zoomPercent, setZoomPercent] = useState(DEFAULT_ZOOM_PERCENT);
  const [dropActive, setDropActive] = useState(false);
  const [sampleLoadingId, setSampleLoadingId] = useState<string | null>(null);
  const [activeSample, setActiveSample] = useState<SampleImage | null>(null);
  const [guideStep, setGuideStep] = useState<GuideStep | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const { pathname, navigate } = usePathname();
  const onAbout = pathname === "/about";
  const guideAbortRef = useRef<AbortController | null>(null);

  const cancelGuide = useCallback(() => {
    guideAbortRef.current?.abort();
    guideAbortRef.current = null;
    setGuideStep(null);
  }, []);

  const handleFile = useCallback(
    async (file: File): Promise<boolean> => {
      cancelGuide();
      setDemoOpen(false);
      setActiveSample(null);
      try {
        const loaded = await loadImageFile(file);
        revokeLoadedImage(imageRef.current);
        imageRef.current = loaded;
        setImage(loaded);
        setPoint(DEFAULT_FOCAL_POINT);
        setZoomPercent(DEFAULT_ZOOM_PERCENT);
        setError(null);
        return true;
      } catch (caught) {
        const message =
          caught instanceof Error ? caught.message : INVALID_IMAGE_MESSAGE;
        setError(message);
        return false;
      }
    },
    [cancelGuide],
  );

  const handleSample = useCallback(
    async (sample: SampleImage) => {
      setSampleLoadingId(sample.id);
      try {
        const file = await fileFromUrl(sample.src, sample.fileName);
        const loaded = await handleFile(file);
        if (loaded) {
          setActiveSample(sample);
        }
      } catch (caught) {
        const message =
          caught instanceof Error ? caught.message : INVALID_IMAGE_MESSAGE;
        setError(message);
      } finally {
        setSampleLoadingId(null);
      }
    },
    [handleFile],
  );

  const playGuide = useCallback(async () => {
    if (!activeSample || guideStep) {
      return;
    }

    cancelGuide();
    const controller = new AbortController();
    guideAbortRef.current = controller;
    const { signal } = controller;
    const guide = activeSample.guide;

    setPoint(DEFAULT_FOCAL_POINT);
    setZoomPercent(DEFAULT_ZOOM_PERCENT);
    setGuideStep("point");
    const pointDone = await animateFocalPoint(
      DEFAULT_FOCAL_POINT,
      { x: guide.x, y: guide.y },
      1000,
      setPoint,
      signal,
    );
    if (!pointDone) {
      return;
    }

    const paused = await wait(850, signal);
    if (!paused) {
      return;
    }

    setGuideStep("zoom");
    const zoomDone = await animateZoomPercent(
      DEFAULT_ZOOM_PERCENT,
      guide.zoomPercent,
      1000,
      setZoomPercent,
      signal,
    );
    if (!zoomDone) {
      return;
    }

    setGuideStep(null);
    if (guideAbortRef.current === controller) {
      guideAbortRef.current = null;
    }
  }, [activeSample, cancelGuide, guideStep]);

  useEffect(() => {
    return () => {
      guideAbortRef.current?.abort();
      revokeLoadedImage(imageRef.current);
    };
  }, []);

  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      if (onAbout) {
        return;
      }
      void imageFromClipboard(event).then((file) => {
        if (file) {
          event.preventDefault();
          void handleFile(file);
        }
      });
    }

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFile, onAbout]);

  function handleReset() {
    setPoint(DEFAULT_FOCAL_POINT);
  }

  function handleHome() {
    if (onAbout) {
      navigate("/");
      return;
    }
    handleBack();
  }

  useEffect(() => {
    const origin = "https://focalpointgenerator.dev";
    const homeTitle =
      "Focal Point Generator — object-position CSS for image crops";
    const homeDescription =
      "Keep the important part of your image in the right place. Place a focal point in your browser, preview responsive crops, and copy the object-position CSS. Free, client-side, nothing is uploaded.";
    const aboutTitle = "About — Focal Point Generator";
    const aboutDescription =
      "What Focal Point Generator is, why a crop can look right on one layout and fail on the next, which browsers support object-position, and who built it.";
    const title = onAbout ? aboutTitle : homeTitle;
    const description = onAbout ? aboutDescription : homeDescription;
    const url = onAbout ? `${origin}/about` : `${origin}/`;

    document.title = title;

    const descriptionTag = document.getElementById("meta-description");
    if (descriptionTag) {
      descriptionTag.setAttribute("content", description);
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", url);
    }

    const markdown = document.getElementById("markdown-alternate");
    if (markdown) {
      markdown.setAttribute(
        "href",
        onAbout ? `${origin}/about.md` : `${origin}/index.md`,
      );
    }

    document.getElementById("og-url")?.setAttribute("content", url);
    document.getElementById("og-title")?.setAttribute("content", title);
    document
      .getElementById("og-description")
      ?.setAttribute("content", description);
    document.getElementById("twitter-title")?.setAttribute("content", title);
    document
      .getElementById("twitter-description")
      ?.setAttribute("content", description);
  }, [onAbout]);

  function handleBack() {
    cancelGuide();
    setDemoOpen(false);
    revokeLoadedImage(imageRef.current);
    imageRef.current = null;
    setImage(null);
    setActiveSample(null);
    setPoint(DEFAULT_FOCAL_POINT);
    setZoomPercent(DEFAULT_ZOOM_PERCENT);
    setCodeOpen(false);
    setError(null);
  }

  return (
    <div
      className="min-h-dvh"
      onDragEnter={(event) => {
        event.preventDefault();
        if (onAbout) {
          return;
        }
        if (event.dataTransfer.types.includes("Files")) {
          setDropActive(true);
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDragLeave={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node)) {
          return;
        }
        setDropActive(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDropActive(false);
        if (onAbout) {
          return;
        }
        const file = event.dataTransfer.files[0];
        if (file) {
          void handleFile(file);
        }
      }}
    >
      <header className="mx-auto flex h-16 w-full max-w-[1280px] shrink-0 items-center justify-between gap-4 px-6">
        <a
          href="/"
          aria-label="Back to start"
          onClick={(event) => {
            event.preventDefault();
            handleHome();
          }}
          className="flex h-11 items-center gap-3 rounded-lg text-left transition-opacity hover:opacity-80"
        >
          <img src="/favicon.svg" alt="" className="h-7 w-7 rounded-md" />
          <p className="text-sm leading-tight font-medium tracking-tight text-ink">
            <span className="block">Focal Point</span>
            <span className="block text-xs">Generator</span>
          </p>
        </a>
        <div className="flex h-11 shrink-0 items-center gap-2">
          <a
            href="/about"
            aria-current={onAbout ? "page" : undefined}
            onClick={(event) => {
              event.preventDefault();
              setDemoOpen(false);
              navigate("/about");
            }}
            className={`inline-flex h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors ${
              onAbout ? "text-ink" : "text-muted hover:bg-raised hover:text-ink"
            }`}
          >
            About
          </a>
          {image && !onAbout ? (
            <>
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex h-11 min-w-11 items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-ink transition-colors hover:border-line-strong hover:bg-raised"
              >
                <BackIcon className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => replaceInputRef.current?.click()}
                className="inline-flex h-11 min-w-11 items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-ink transition-colors hover:border-line-strong hover:bg-raised"
              >
                <UploadIcon className="h-4 w-4" />
                Replace image
              </button>
            </>
          ) : null}
          {!image && !onAbout ? (
            <p className="hidden h-11 items-center text-xs text-faint sm:flex">
              Paste an image anytime
            </p>
          ) : null}
        </div>
        <input
          ref={replaceInputRef}
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void handleFile(file);
            }
            event.target.value = "";
          }}
        />
      </header>

      {onAbout ? (
        <AboutPage onHome={() => navigate("/")} />
      ) : image ? (
        <main className="mx-auto grid w-full max-w-[1280px] items-start gap-6 px-6 pt-4 pb-28 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,420px)] lg:pb-16">
          {error ? (
            <p className="text-sm text-red-300 lg:col-span-2" role="alert">
              {error}
            </p>
          ) : null}

          <section className="min-w-0 overflow-hidden rounded-xl border border-line bg-raised p-3 sm:p-4">
            <h2 className="mb-3 text-sm font-medium text-ink">Focal point</h2>
            <div className="focal-grid relative flex h-[min(58dvh,520px)] max-h-[520px] items-center justify-center overflow-hidden rounded-lg bg-canvas p-3">
              <ImageStage
                image={image}
                point={point}
                locked={guideStep !== null}
                onChange={setPoint}
              />
              {guideStep ? (
                <GuideOverlay step={guideStep} onClose={cancelGuide} />
              ) : null}
            </div>
            <p className="mt-3 text-center text-xs text-faint">
              Click or drag to place the important point; drags snap to the
              edges and center unless you hold Alt. Arrow keys nudge; Shift
              moves faster.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {activeSample ? (
                <button
                  type="button"
                  disabled={guideStep !== null}
                  onClick={() => {
                    void playGuide();
                  }}
                  className="inline-flex h-11 min-w-11 items-center justify-center rounded-lg border border-line px-4 text-sm font-medium text-ink transition-colors hover:border-line-strong hover:bg-overlay disabled:pointer-events-none disabled:text-faint disabled:opacity-45"
                >
                  Here’s what I would do
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="inline-flex h-11 min-w-11 items-center justify-center rounded-lg border border-line px-4 text-sm font-medium text-ink transition-colors hover:border-line-strong hover:bg-overlay"
              >
                Test layout
              </button>
            </div>
            <div className="mt-4 border-t border-line pt-4">
              <FocalPanel
                image={image}
                point={point}
                zoomPercent={zoomPercent}
                locked={guideStep !== null}
                onChange={setPoint}
                onZoomChange={setZoomPercent}
                onReset={handleReset}
              />
              <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-raised/95 px-4 py-3 backdrop-blur-sm lg:static lg:mt-4 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
                <button
                  type="button"
                  onClick={() => setCodeOpen(true)}
                  className="inline-flex h-11 w-full min-w-11 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-medium text-canvas transition-opacity hover:opacity-90"
                >
                  <CodeIcon className="h-4 w-4" />
                  Generate code
                </button>
              </div>
            </div>
          </section>

          <aside className="min-w-0 rounded-xl border border-line bg-raised p-4">
            <PreviewStrip
              src={image.src}
              fileName={image.name}
              point={point}
              zoomPercent={zoomPercent}
            />
          </aside>
        </main>
      ) : (
        <UploadDropzone
          onFile={(file) => {
            void handleFile(file);
          }}
          onSample={(sample) => {
            void handleSample(sample);
          }}
          error={error}
          sampleLoadingId={sampleLoadingId}
        />
      )}

      {!onAbout ? (
        <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-30 hidden px-6 py-3 text-center text-xs text-faint lg:block">
          <span className="pointer-events-auto">
            Built by{" "}
            <a
              href="https://mikkelscheike.com"
              className="text-ink underline-offset-2 transition-colors hover:underline"
            >
              Mikkel Scheike
            </a>
          </span>
        </footer>
      ) : null}

      {image && !onAbout ? (
        <CodePanel
          open={codeOpen}
          point={point}
          zoomPercent={zoomPercent}
          formatId={formatId}
          fileName={image.name}
          onFormatChange={setFormatId}
          onClose={() => setCodeOpen(false)}
        />
      ) : null}

      {image && demoOpen && !onAbout ? (
        <DemoStage
          src={image.src}
          fileName={image.name}
          point={point}
          zoomPercent={zoomPercent}
          onClose={() => setDemoOpen(false)}
        />
      ) : null}

      {dropActive ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/80 text-sm font-medium text-ink backdrop-blur-[2px]">
          Drop image to {image ? "replace" : "open"}
        </div>
      ) : null}
    </div>
  );
}
