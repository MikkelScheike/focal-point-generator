# AGENTS.md

Guidance for coding agents working on Focal Point Generator.

## Product

This is a **developer utility**, not an image editor.

Workflow: upload an image → place a focal point → preview responsive crops → copy generated code.

A focal point does **not** mean “put this pixel in the center.” It means: this is the important part of the image; `object-fit: cover` plus `object-position: X% Y%` keeps that point aligned in cropped frames.

`0% 0%` is top-left. `50% 50%` is center. `100% 100%` is bottom-right. The manual point is the source of truth.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Cloudflare Workers static assets via `@cloudflare/vite-plugin` and `wrangler.jsonc`
- No backend, database, auth, or server-side image processing

Commands:

```bash
npm install
npm run dev
npm run build
npm run preview
npm run deploy
```

Use `npm run dev` locally. Use `npm run deploy` (Wrangler) only for production. Do not use `wrangler deploy` as a development loop.

## Layout of the code

```
src/lib/focal-point/   extractable core: math, presets, code formats, image loading, detector registry
src/components/        UI only
src/App.tsx            client state and layout
wrangler.jsonc         SPA assets Worker (`not_found_handling: single-page-application`)
```

New output formats go in `src/lib/focal-point/code.ts` and are listed automatically. Auto-detect adapters implement `FocalPointDetector` in `src/lib/focal-point/detector.ts` and must not overwrite the user’s point unless they confirm.

## Privacy (hard rule)

Images must stay in the browser:

- File API, `URL.createObjectURL()`, `Image()`, pointer events
- Never upload, persist remotely, send to an API, or store in a database
- Revoke object URLs when replacing or tearing down the image
- Invalid files: show `Please choose a valid image file.`

## UI conventions

- Minimal, developer-tool aesthetic (Linear / Vercel). No marketing chrome.
- Left: full source image for placing the focal point (crosshair + marker).
- Right: one crop **preview** of the selected preset. The preview **is** the `<img>` with `object-fit: cover` and the selected aspect ratio. Do not wrap it in a fake device/monitor frame.
- Preset buttons (Desktop, Tablet, Mobile, Square, Portrait, Custom) must change that preview’s aspect ratio, not only the label.
- Focal marker belongs on the editor, not on the crop examples.
- **Generate code** sits centered under the previews and opens an overlay. Generated snippets must include the image filename (`src="hero.png"`).
- Cap the editor image (`max-h` / fixed stage) so the layout does not jump.
- Keyboard: arrow keys nudge the point; X/Y number fields are the accessible alternative. Clamp 0–100.
- Reset returns to `50% 50%`. Replace image stays client-side.

## TypeScript

- `strict: true`, no `any`
- Prefer shared types from `src/lib/focal-point`
- Do not add a large UI component library

## Do not

- Add accounts, a backend, or server-side image processing for MVP features
- Pixel-edit the image; only emit positioning instructions
- Over-extract packages (`packages/focal-point-*`) until the site needs it
