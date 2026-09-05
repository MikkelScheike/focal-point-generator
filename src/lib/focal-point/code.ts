import type { CodeFormat, CodeFormatId, FocalPoint } from "./types";
import { formatZoomScale, isZoomed, toObjectPosition } from "./math";

function cropValues(focalPoint: FocalPoint, zoomPercent: number) {
  const position = toObjectPosition(focalPoint);
  return {
    position,
    zoomed: isZoomed(zoomPercent),
    scale: formatZoomScale(zoomPercent),
  };
}

const cssFormat: CodeFormat = {
  id: "css",
  label: "CSS",
  language: "css",
  generate: ({ focalPoint, srcPlaceholder, zoomPercent }) => {
    const { position, zoomed, scale } = cropValues(focalPoint, zoomPercent);
    if (!zoomed) {
      return `<img
  class="hero-image"
  src="${srcPlaceholder}"
  alt=""
/>

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: ${position};
}`;
    }
    return `<div class="hero-frame">
  <img
    class="hero-image"
    src="${srcPlaceholder}"
    alt=""
  />
</div>

.hero-frame {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.hero-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: ${position};
  transform: scale(${scale});
  transform-origin: ${position};
}`;
  },
};

const tailwindFormat: CodeFormat = {
  id: "tailwind",
  label: "Tailwind",
  language: "html",
  generate: ({ focalPoint, srcPlaceholder, zoomPercent }) => {
    const { position, zoomed, scale } = cropValues(focalPoint, zoomPercent);
    if (!zoomed) {
      return `<img
  src="${srcPlaceholder}"
  alt=""
  class="h-full w-full object-cover"
  style="object-position: ${position};"
/>`;
    }
    return `<div class="h-full w-full overflow-hidden">
  <img
    src="${srcPlaceholder}"
    alt=""
    class="h-full w-full object-cover"
    style="object-position: ${position}; transform: scale(${scale}); transform-origin: ${position};"
  />
</div>`;
  },
};

const inlineFormat: CodeFormat = {
  id: "inline",
  label: "Inline",
  language: "html",
  generate: ({ focalPoint, srcPlaceholder, zoomPercent }) => {
    const { position, zoomed, scale } = cropValues(focalPoint, zoomPercent);
    if (!zoomed) {
      return `<img
  src="${srcPlaceholder}"
  alt=""
  style="object-fit: cover; object-position: ${position};"
/>`;
    }
    return `<div style="overflow: hidden; width: 100%; height: 100%;">
  <img
    src="${srcPlaceholder}"
    alt=""
    style="display: block; width: 100%; height: 100%; object-fit: cover; object-position: ${position}; transform: scale(${scale}); transform-origin: ${position};"
  />
</div>`;
  },
};

const reactFormat: CodeFormat = {
  id: "react",
  label: "React",
  language: "jsx",
  generate: ({ focalPoint, srcPlaceholder, zoomPercent }) => {
    const { position, zoomed, scale } = cropValues(focalPoint, zoomPercent);
    if (!zoomed) {
      return `<img
  src="${srcPlaceholder}"
  alt=""
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: '${position}',
  }}
/>`;
    }
    return `<div style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
  <img
    src="${srcPlaceholder}"
    alt=""
    style={{
      display: 'block',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: '${position}',
      transform: 'scale(${scale})',
      transformOrigin: '${position}',
    }}
  />
</div>`;
  },
};

export const CODE_FORMATS: readonly CodeFormat[] = [
  cssFormat,
  tailwindFormat,
  inlineFormat,
  reactFormat,
];

export function getCodeFormat(id: CodeFormatId): CodeFormat {
  const format = CODE_FORMATS.find((item) => item.id === id);
  if (!format) {
    return cssFormat;
  }
  return format;
}

export function generateCode(
  id: CodeFormatId,
  focalPoint: { x: number; y: number },
  srcPlaceholder = "image.jpg",
  zoomPercent = 100,
): string {
  return getCodeFormat(id).generate({ focalPoint, srcPlaceholder, zoomPercent });
}
