import type { CodeFormat, CodeFormatId } from "./types";
import { toObjectPosition } from "./math";

const cssFormat: CodeFormat = {
  id: "css",
  label: "CSS",
  language: "css",
  generate: ({ focalPoint, srcPlaceholder }) => {
    const position = toObjectPosition(focalPoint);
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
  },
};

const tailwindFormat: CodeFormat = {
  id: "tailwind",
  label: "Tailwind",
  language: "html",
  generate: ({ focalPoint, srcPlaceholder }) => {
    const position = toObjectPosition(focalPoint);
    return `<img
  src="${srcPlaceholder}"
  alt=""
  class="h-full w-full object-cover"
  style="object-position: ${position};"
/>`;
  },
};

const inlineFormat: CodeFormat = {
  id: "inline",
  label: "Inline",
  language: "html",
  generate: ({ focalPoint, srcPlaceholder }) => {
    const position = toObjectPosition(focalPoint);
    return `<img
  src="${srcPlaceholder}"
  alt=""
  style="object-fit: cover; object-position: ${position};"
/>`;
  },
};

const reactFormat: CodeFormat = {
  id: "react",
  label: "React",
  language: "jsx",
  generate: ({ focalPoint, srcPlaceholder }) => {
    const position = toObjectPosition(focalPoint);
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
): string {
  return getCodeFormat(id).generate({ focalPoint, srcPlaceholder });
}
