# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Start dev server at http://localhost:3000
npm run build    # Production build to /build
npm test         # Run tests in watch mode
npm test -- --watchAll=false  # Run tests once (CI mode)
```

## Architecture

Single-component React app (`src/App.js`) bootstrapped with Create React App.

- **QR generation**: Uses `qrcode.react` — renders a `<QRCode>` SVG/canvas element directly from the `inputValue` state. The QR code only renders when `inputValue` is non-empty. Current config: size 512px, error correction level "H".
- **Styling**: Plain CSS in `src/App.css` — no CSS framework.
- **Entry point**: `src/index.js` mounts `<App>` into `#root`.
