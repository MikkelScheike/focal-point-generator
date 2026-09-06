# Focal Point Generator

> Keep the important part of your image in the right place. Place a focal point in the browser, preview responsive crops, and copy `object-position` CSS. Nothing is uploaded.

Human page: https://focalpointgenerator.dev/
About (markdown): https://focalpointgenerator.dev/about.md
Site index for agents: https://focalpointgenerator.dev/llms.txt

## What this tool does

Responsive layouts crop the same photograph into many frames: 16:9 heroes, 4:5 cards, 1:1 thumbnails. `object-fit: cover` fills a container by cropping overflow. Without guidance, the browser keeps the **center**. Off-center faces, products, and signs get cut off.

`object-position` does not mean “put this pixel in the middle of the screen.” It means: align this point in the image with the same point in the container. So `object-position: 63% 42%` keeps that source point at 63% / 42% of the cropped frame.

## How to use it

1. Drop, upload, paste, or pick a sample image. The file stays in the tab (`URL.createObjectURL`). It is never sent to a server.
2. Click or drag on the source image to place the focal point. Arrow keys nudge; Shift moves faster. Alt disables snap-to-edge/center.
3. Preview Desktop, Tablet, Mobile, and Square crops. Optional zoom scales past cover with `transform-origin` at the point.
4. Copy generated code: CSS, Tailwind, inline style, or React. Snippets include the image filename.

Sample images include a “Here’s what I would do” guide. “Test layout” shows the same image in split login, wide hero, and mobile card frames, with or without the focal point.

## Generated CSS

```css
.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 63% 42%;
}
```

`0% 0%` is top-left. `50% 50%` is center. `100% 100%` is bottom-right. Reset returns to `50% 50%`.

## Privacy

- File API and object URLs only
- No accounts, database, or remote persistence
- Replacing the image or leaving the page revokes the object URL
