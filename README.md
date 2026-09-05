# Focal Point Generator

A small, client-side developer utility for choosing an image focal point and generating the CSS needed to keep that point visible across responsive crops.

**Keep the important part of your image in the right place.**

Responsive layouts crop the same photograph into many frames: 16:9 heroes, 4:5 mobile cards, 1:1 thumbnails. A focal point tells the browser which part of the image matters. This tool lets you place that point visually, preview the crops, and copy the code.

The image never leaves your browser. There is no account, API, or server-side processing.

## Why focal points

`object-fit: cover` fills a container by cropping overflow. Without guidance, the browser keeps the **center** of the image. Faces, products, and subjects that sit off-center get cut off.

`object-position` does **not** mean “put this pixel in the middle of the screen.” It means:

> Align this point in the image with the same point in the container.

So `object-position: 63% 42%` keeps the point at 63% across and 42% down of the source image at 63% / 42% of the cropped frame.

```css
.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 63% 42%;
}
```

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). Local development uses the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/) so the app runs the same way it does on Workers.

## Build

```bash
npm run build
```

Static assets are emitted by Vite. Preview the production build in the Workers runtime:

```bash
npm run preview
```

## Deploy with Wrangler

This project is an assets-only Cloudflare Worker (SPA). Deploy from the repo root:

```bash
npm run deploy
```

That runs `vite build` and then `wrangler deploy`. Sign in with `npx wrangler login` first if needed.

Configuration lives in `wrangler.jsonc`:

- `compatibility_date` — Workers runtime
- `assets.not_found_handling: "single-page-application"` — serve `index.html` for unknown routes
- `observability.enabled` — Workers logs and traces

## How the generated CSS works

The tool never edits pixels. It records a normalized focal point:

| Origin | Meaning |
| --- | --- |
| `0% 0%` | top-left |
| `50% 50%` | center |
| `100% 100%` | bottom-right |

That pair is written into `object-position` (and equivalent Tailwind / inline / React output). Pair it with `object-fit: cover` and a sized container.

Core math and code generation live in `src/lib/focal-point/` so they can later be extracted as `focal-point-core` / `focal-point-react` without rewriting the site.

## Privacy

- Images are read with the File API
- Object URLs are created in the tab (`URL.createObjectURL`)
- Nothing is uploaded, persisted remotely, or sent to an API
- Replacing or leaving the page revokes the object URL

## Contribute

Issues and pull requests are welcome.

1. Keep the product a **developer utility**, not an image editor.
2. The manual focal point is the source of truth.
3. Prefer client-side behavior. Do not add a backend for the MVP features.
4. New code formats belong in `src/lib/focal-point/code.ts` so the UI can list them automatically.
5. Auto-detect adapters should implement `FocalPointDetector` in `src/lib/focal-point/detector.ts` and never overwrite the user’s point unless they confirm.

Run `npm run build` before opening a PR.

## License

[MIT](./LICENSE)
