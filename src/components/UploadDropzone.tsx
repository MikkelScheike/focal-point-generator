import { useRef, useState } from "react";
import { ACCEPT_ATTRIBUTE, INVALID_IMAGE_MESSAGE } from "../lib/focal-point";
import { UploadIcon } from "./Icons";

interface UploadDropzoneProps {
  onFile: (file: File) => void;
  error: string | null;
}

export function UploadDropzone({ onFile, error }: UploadDropzoneProps) {
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
      <p className="text-[11px] font-medium tracking-[0.22em] text-faint uppercase">Focal Point</p>
      <h1 className="mt-4 max-w-[22ch] text-center text-3xl font-medium tracking-tight text-ink sm:text-4xl">
        Keep the important part of your image in the right place.
      </h1>
      <p className="mt-4 max-w-[46ch] text-center text-sm leading-relaxed text-muted">
        Choose a focal point, preview how it crops across layouts, and copy{" "}
        <code className="font-mono text-[12px] text-ink">object-position</code> CSS. Nothing is
        uploaded.
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
          over ? "border-accent bg-accent-dim" : "border-line-strong bg-raised/80"
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-overlay text-muted">
          <UploadIcon className="h-5 w-5" />
        </div>
        <p className="mt-5 text-base font-medium text-ink">Drop an image here</p>
        <p className="mt-1 text-sm text-muted">or</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 inline-flex h-11 min-w-[44px] items-center justify-center rounded-lg bg-ink px-4 text-sm font-medium text-canvas transition-opacity hover:opacity-90"
        >
          Upload image
        </button>
        <p className="mt-4 text-xs text-faint">JPEG, PNG, WebP, GIF, AVIF, BMP</p>
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
