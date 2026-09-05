import { useCallback, useEffect, useRef, useState } from "react";
import {
  ACCEPT_ATTRIBUTE,
  DEFAULT_FOCAL_POINT,
  DEFAULT_PRESET_ID,
  DEFAULT_ZOOM_PERCENT,
  INVALID_IMAGE_MESSAGE,
  imageFromClipboard,
  loadImageFile,
  revokeLoadedImage,
  type CodeFormatId,
  type FocalPoint,
  type LoadedImage,
} from "./lib/focal-point";
import { CodePanel } from "./components/CodePanel";
import { FocalPanel } from "./components/FocalPanel";
import { ImageStage } from "./components/ImageStage";
import { PreviewStrip } from "./components/PreviewStrip";
import { UploadDropzone } from "./components/UploadDropzone";
import { CodeIcon, UploadIcon } from "./components/Icons";

export default function App() {
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<LoadedImage | null>(null);
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [point, setPoint] = useState<FocalPoint>(DEFAULT_FOCAL_POINT);
  const [error, setError] = useState<string | null>(null);
  const [formatId, setFormatId] = useState<CodeFormatId>("css");
  const [codeOpen, setCodeOpen] = useState(false);
  const [activePresetId, setActivePresetId] = useState(DEFAULT_PRESET_ID);
  const [customRatio, setCustomRatio] = useState({ width: 21, height: 9 });
  const [zoomPercent, setZoomPercent] = useState(DEFAULT_ZOOM_PERCENT);
  const [dropActive, setDropActive] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    try {
      const loaded = await loadImageFile(file);
      revokeLoadedImage(imageRef.current);
      imageRef.current = loaded;
      setImage(loaded);
      setPoint(DEFAULT_FOCAL_POINT);
      setZoomPercent(DEFAULT_ZOOM_PERCENT);
      setError(null);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : INVALID_IMAGE_MESSAGE;
      setError(message);
    }
  }, []);

  useEffect(() => {
    return () => {
      revokeLoadedImage(imageRef.current);
    };
  }, []);

  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      void imageFromClipboard(event).then((file) => {
        if (file) {
          event.preventDefault();
          void handleFile(file);
        }
      });
    }

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFile]);

  function handleReset() {
    setPoint(DEFAULT_FOCAL_POINT);
  }

  return (
    <div
      className="min-h-dvh"
      onDragEnter={(event) => {
        event.preventDefault();
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
        const file = event.dataTransfer.files[0];
        if (file) {
          void handleFile(file);
        }
      }}
    >
      <header className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-6 pt-5 pb-2">
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="" className="h-7 w-7 rounded-md" />
          <h1 className="text-sm leading-tight font-medium tracking-tight text-ink">
            <span className="block">Focal Point</span>
            <span className="block text-xs">Generator</span>
          </h1>
        </div>
        {image ? (
          <button
            type="button"
            onClick={() => replaceInputRef.current?.click()}
            className="inline-flex h-11 min-w-11 items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-ink transition-colors hover:border-line-strong hover:bg-raised"
          >
            <UploadIcon className="h-4 w-4" />
            Replace image
          </button>
        ) : (
          <p className="hidden text-xs text-faint sm:block">Paste an image anytime</p>
        )}
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

      {image ? (
        <main className="mx-auto grid w-full max-w-[1280px] items-start gap-6 px-6 pt-4 pb-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,420px)]">
          {error ? (
            <p className="text-sm text-red-300 lg:col-span-2" role="alert">
              {error}
            </p>
          ) : null}

          <section className="min-w-0 overflow-hidden rounded-xl border border-line bg-raised p-3 sm:p-4">
            <h2 className="mb-3 text-sm font-medium text-ink">Focal point</h2>
            <div className="focal-grid flex h-[min(58dvh,520px)] max-h-[520px] items-center justify-center overflow-hidden rounded-lg bg-canvas p-3">
              <ImageStage image={image} point={point} onChange={setPoint} />
            </div>
            <p className="mt-3 text-center text-xs text-faint">
              Click or drag to place the important point; drags snap to the edges and center unless
              you hold Alt. Arrow keys nudge; Shift moves faster.
            </p>
            <div className="mt-4 border-t border-line pt-4">
              <FocalPanel image={image} point={point} onChange={setPoint} onReset={handleReset} />
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

          <aside className="min-w-0 rounded-xl border border-line bg-raised p-4 lg:sticky lg:top-5 lg:overflow-hidden">
            <PreviewStrip
              src={image.src}
              fileName={image.name}
              point={point}
              zoomPercent={zoomPercent}
              activePresetId={activePresetId}
              customRatio={customRatio}
              onZoomChange={setZoomPercent}
              onSelectPreset={setActivePresetId}
              onCustomRatioChange={setCustomRatio}
            />
          </aside>
        </main>
      ) : (
        <UploadDropzone
          onFile={(file) => {
            void handleFile(file);
          }}
          error={error}
        />
      )}

      <footer className="mx-auto w-full max-w-[1280px] px-6 pb-24 text-center text-xs text-faint lg:pb-8">
        Built by{" "}
        <a
          href="https://mikkelscheike.com"
          className="text-ink underline-offset-2 transition-colors hover:underline"
        >
          Mikkel Scheike
        </a>
      </footer>

      {image ? (
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

      {dropActive ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/80 text-sm font-medium text-ink backdrop-blur-[2px]">
          Drop image to {image ? "replace" : "open"}
        </div>
      ) : null}
    </div>
  );
}
