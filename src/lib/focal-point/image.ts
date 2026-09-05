import type { LoadedImage } from "./types";

const IMAGE_EXTENSION = /\.(jpe?g|png|webp|gif|avif|bmp)$/i;

export const ACCEPT_ATTRIBUTE = "image/jpeg,image/png,image/webp,image/gif,image/avif,image/bmp,.jpg,.jpeg,.png,.webp,.gif,.avif,.bmp";

export const INVALID_IMAGE_MESSAGE = "Please choose a valid image file.";

export function isProbablyImage(file: File): boolean {
  if (file.type === "image/svg+xml") {
    return false;
  }
  if (file.type.startsWith("image/")) {
    return true;
  }
  return IMAGE_EXTENSION.test(file.name);
}

export function loadImageFile(file: File): Promise<LoadedImage> {
  if (!isProbablyImage(file)) {
    return Promise.reject(new Error(INVALID_IMAGE_MESSAGE));
  }

  const src = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      if (image.naturalWidth < 1 || image.naturalHeight < 1) {
        URL.revokeObjectURL(src);
        reject(new Error(INVALID_IMAGE_MESSAGE));
        return;
      }

      resolve({
        src,
        file,
        width: image.naturalWidth,
        height: image.naturalHeight,
        name: file.name || "image",
        type: file.type,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error(INVALID_IMAGE_MESSAGE));
    };

    image.src = src;
  });
}

export function revokeLoadedImage(image: LoadedImage | null): void {
  if (image) {
    URL.revokeObjectURL(image.src);
  }
}

export async function imageFromClipboard(event: ClipboardEvent): Promise<File | null> {
  const items = event.clipboardData?.items;
  if (!items) {
    return null;
  }

  for (const item of items) {
    if (item.kind === "file") {
      const file = item.getAsFile();
      if (file) {
        return file;
      }
    }
  }

  return null;
}
