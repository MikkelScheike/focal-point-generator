import type { CodeFormat, CodeFormatId, FocalPoint } from "./types";
import {
  formatPercent,
  formatZoomScale,
  isZoomed,
  toObjectPosition,
} from "./math";

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
    style="
      object-position: ${position};
      transform: scale(${scale});
      transform-origin: ${position};
    "
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
    style="
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: ${position};
      transform: scale(${scale});
      transform-origin: ${position};
    "
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

const aiFormat: CodeFormat = {
  id: "ai",
  label: "AI Prompt",
  language: "prompt",
  generate: ({ focalPoint, srcPlaceholder, zoomPercent }) => {
    const { position, zoomed, scale } = cropValues(focalPoint, zoomPercent);
    const x = formatPercent(focalPoint.x);
    const y = formatPercent(focalPoint.y);
    const zoomLine = zoomed
      ? `- zoomPercent: ${zoomPercent} (CSS scale(${scale}))`
      : "- zoomPercent: 100 (no extra scale)";
    const zoomRules = zoomed
      ? `
Zoom
- The image should scale past cover: transform: scale(${scale}).
- Set transform-origin to ${position} (the same point as object-position).
- Wrap the <img> in a sized overflow: hidden frame so the scaled image does not spill.
`
      : "";

    return `Implement a focal point on \`${srcPlaceholder}\`. Do not crop, resize, or rewrite the image file.

Data
- src: ${srcPlaceholder}
- object-position: ${position}
- x: ${x}%
- y: ${y}%
${zoomLine}

What a focal point means
- This is the important part of the source image. It does not mean “put this pixel in the center of the frame.”
- Pair object-fit: cover with object-position: ${position}. That keeps this point aligned in every cropped frame (hero, card, thumbnail, background, and so on).
- 0% 0% is top-left. 50% 50% is center. 100% 100% is bottom-right.

Required CSS (or the equivalent in Tailwind, inline styles, or a framework Image component)
- object-fit: cover
- object-position: ${position}
- The image element (or CSS background) must fill a sized container. Cover crops the overflow; do not bake a cropped export.
${zoomRules}
Do not
- Recalculate object-position to “center the subject.”
- Use a different x/y than ${position}.
- Pixel-edit or server-process the image to fake the crop.

Apply these values everywhere \`${srcPlaceholder}\` is shown with a crop.`;
  },
};

export const CODE_FORMATS: readonly CodeFormat[] = [
  cssFormat,
  tailwindFormat,
  inlineFormat,
  reactFormat,
  aiFormat,
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
  return getCodeFormat(id).generate({
    focalPoint,
    srcPlaceholder,
    zoomPercent,
  });
}
