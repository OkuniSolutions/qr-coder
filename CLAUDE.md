# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Start Vite dev server (http://localhost:5173)
npm run build    # Production build to /dist
npm run preview  # Preview production build locally
```

No test runner is currently configured.

## Architecture

Multi-page React 18 app built with **Vite** (+ WASM plugin for `@jsquash/avif`). UI is in Spanish.

### Routing & Layout

`src/App.jsx` uses `react-router-dom` v7 with `<BrowserRouter>`. Every route shares a common layout: `<Navbar>` + `<main>` + `<Footer>`.

Routes map 1:1 to page components in `src/pages/`:

| Route | Page Component | Key Dependency |
|---|---|---|
| `/` | `Home` | — |
| `/qr-generator` | `QRGenerator` | `qrcode.react` |
| `/image-converter` | `ImageConverter` | `@jsquash/avif`, Canvas API |
| `/image-compressor` | `ImageCompressor` | `browser-image-compression` |
| `/image-cropper` | `ImageCropper` | `cropperjs` |
| `/exif-remover` | `ExifRemover` | `piexifjs` |
| `/favicon-generator` | `FaviconGenerator` | Canvas API, `jszip` |
| `/ocr` | `OcrTool` | `tesseract.js` |
| `/pdf-generator` | `PdfGenerator` | `jspdf` |
| `/pdf-compressor` | `PdfCompressor` | `pdfjs-dist`, `jspdf` |

### Conventions

- Each page is a self-contained component with a co-located `.css` file (plain CSS, no framework).
- Shared components (`Navbar`, `Footer`) live in `src/components/`.
- The `TOOLS` array in `Navbar.jsx` is the single source of truth for the tools dropdown — add new tools there when adding routes.
- All processing (compression, conversion, OCR, etc.) runs client-side in the browser.
