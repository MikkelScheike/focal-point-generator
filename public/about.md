# About Focal Point Generator

> A small developer utility. Not an image editor.

Human page: https://focalpointgenerator.dev/about
Site index for agents: https://focalpointgenerator.dev/llms.txt

## What it is

Focal Point Generator helps you keep the important part of a photo visible when layouts crop it. You place a point on the image, preview the crops, and copy `object-position` CSS to use with `object-fit: cover`.

It does not paint, resize, or export a new file. The image stays in this tab. Nothing is uploaded or stored on a server.

## Why it matters

A crop that looks right on one page often fails on the next. Desktop heroes, tablet banners, mobile cards, and square thumbnails all cut the same photo differently. Browsers keep the center. Faces, products, and signs that sit off-center get clipped.

A focal point is how you take control. You mark what must stay in frame, then every crop honors that point instead of guessing.

## When it works

The generated CSS uses `object-fit` and `object-position` on `<img>`. Those properties have been supported from:

| Browser | From version | Notes                                      |
| ------- | ------------ | ------------------------------------------ |
| Chrome  | 32+          |                                            |
| Firefox | 36+          |                                            |
| Safari  | 10+          | macOS and iOS                              |
| Edge    | 79+          | Chromium. Images also worked in Edge 16–18 |

Internet Explorer never shipped these properties. Optional crop zoom uses `transform: scale()` with `transform-origin` at the focal point, which those same browsers already supported.

This site itself needs a current evergreen browser with JavaScript on.

## Built by

Made by [Mikkel Scheike](https://mikkelscheike.com).
