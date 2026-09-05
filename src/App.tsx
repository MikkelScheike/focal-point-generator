import { useCallback, useEffect, useRef, useState } from "react";
import {
  ACCEPT_ATTRIBUTE,
  DEFAULT_FOCAL_POINT,
  DEFAULT_PRESET_ID,
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
import { UploadIcon } from "./components/Icons";

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
  const [dropActive, setDropActive] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    try {
      const loaded = await loadImageFile(file);
      revokeLoadedImage(imageRef.current);
      imageRef.current = loaded;
      setImage(loaded);
      setPoint(DEFAULT_FOCAL_POINT);
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
          <div>
            <p className="text-sm font-medium tracking-tight text-ink">Focal Point</p>
            <p className="text-xs text-faint">Generator</p>
          </div>
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
            <div className="focal-grid flex h-[min(58dvh,520px)] max-h-[520px] items-center justify-center overflow-hidden rounded-lg bg-canvas p-3">
              <ImageStage image={image} point={point} onChange={setPoint} />
            </div>
            <p className="mt-3 text-center text-xs text-faint">
              Click or drag to place the important point. Arrow keys nudge; Shift moves faster.
            </p>
            <div className="mt-4 border-t border-line pt-4">
              <FocalPanel image={image} point={point} onChange={setPoint} onReset={handleReset} />
            </div>
          </section>

          <aside className="min-w-0 rounded-xl border border-line bg-raised p-4 lg:sticky lg:top-5">
            <PreviewStrip
              src={image.src}
              fileName={image.name}
              point={point}
              activePresetId={activePresetId}
              customRatio={customRatio}
              onSelectPreset={setActivePresetId}
              onCustomRatioChange={setCustomRatio}
              onGenerate={() => setCodeOpen(true)}
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

      <footer className="mx-auto w-full max-w-[1280px] px-6 pb-8 text-center text-xs text-faint">
        Client-side only. MIT licensed.
      </footer>

      {image ? (
        <CodePanel
          open={codeOpen}
          point={point}
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
