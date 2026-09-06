import { useRef, useState } from "react";
import {
  ACCEPT_ATTRIBUTE,
  INVALID_IMAGE_MESSAGE,
  SAMPLE_IMAGES,
  type SampleImage,
} from "../lib/focal-point";
import { UploadIcon } from "./Icons";

interface UploadDropzoneProps {
  onFile: (file: File) => void;
  onSample: (sample: SampleImage) => void;
  error: string | null;
  sampleLoadingId: string | null;
}

export function UploadDropzone({
  onFile,
  onSample,
  error,
  sampleLoadingId,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  function takeFile(file: File | undefined) {
    if (!file) {
      return;
    }
    onFile(file);
  }

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col items-center px-6 pt-16 pb-20 sm:pt-24">
      <h1 className="max-w-[22ch] text-center text-3xl font-medium tracking-tight text-ink sm:text-4xl">
        Keep the important part of your image in the right place.
      </h1>
      <p className="mt-4 max-w-[46ch] text-center text-sm leading-relaxed text-muted">
        Hero images, cards, and thumbnails all crop the same photo differently.
        Browsers keep the center. Faces, products, and signs that sit off-center
        get cut off.
      </p>
      <p className="mt-3 max-w-[46ch] text-center text-sm leading-relaxed text-muted">
        This tool lets you mark the part that matters, preview the crops, and
        copy{" "}
        <code className="font-mono text-[12px] text-ink">object-position</code>{" "}
        CSS. The image never leaves your browser.
      </p>

      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={(event) => {
          if (event.currentTarget.contains(event.relatedTarget as Node)) {
            return;
          }
          setOver(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          takeFile(event.dataTransfer.files[0]);
        }}
        className={`mt-10 flex w-full flex-col items-center rounded-2xl border border-dashed px-6 py-14 transition-colors ${
          over
            ? "border-accent bg-accent-dim"
            : "border-line-strong bg-raised/80"
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-overlay text-muted">
          <UploadIcon className="h-5 w-5" />
        </div>
        <h3 className="mt-5 text-base font-medium text-ink">
          Drop an image here
        </h3>
        <p className="mt-1 text-sm text-muted">or</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 inline-flex h-11 min-w-[44px] items-center justify-center rounded-lg bg-ink px-4 text-sm font-medium text-canvas transition-opacity hover:opacity-90"
        >
          Upload image
        </button>
        <p className="mt-4 text-xs text-faint">
          JPEG, PNG, WebP, GIF, AVIF, BMP
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          className="sr-only"
          onChange={(event) => {
            takeFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>

      <div className="mt-10 w-full">
        <p className="text-center text-xs text-faint">Or try a sample</p>
        <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
          {SAMPLE_IMAGES.map((sample) => {
            const loading = sampleLoadingId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                disabled={sampleLoadingId !== null}
                onClick={() => onSample(sample)}
                aria-label={`Try sample: ${sample.alt}`}
                className="group overflow-hidden rounded-lg border border-line bg-overlay text-left transition-colors hover:border-line-strong disabled:opacity-60"
              >
                <img
                  src={sample.src}
                  alt=""
                  className="aspect-[4/3] w-full object-cover"
                />
                <span className="block px-2 py-1.5 text-[11px] text-muted group-hover:text-ink">
                  {loading ? "Loading…" : sample.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-300" role="alert">
          {error === "" ? INVALID_IMAGE_MESSAGE : error}
        </p>
      ) : (
        <p className="mt-6 text-center text-xs text-faint">
          Runs entirely in your browser. Your image never leaves your device.
        </p>
      )}
    </div>
  );
}
