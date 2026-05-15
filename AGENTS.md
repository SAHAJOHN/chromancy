# Agent Guide for chromancy

> This file is intended for AI coding agents. It describes the project architecture, conventions, and workflows. All documentation and source comments in this project are written in **English**.

---

## Project Overview

**chromancy** is a browser-side JavaScript library for extracting color information from images. It calculates:

- **Average Color** — arithmetic mean of all sampled pixels.
- **Dominant Color** — the most frequently occurring color bin after quantization.
- **Color Palette** — a set of visually distinct colors selected from the histogram.
- **Image Properties** — brightness, warmth, saturation, and contrast.

The library is published as an **ES Module** (`dist/chromancy.js`) and is intended to be imported into browser applications (vanilla JS or frameworks like React, Next.js).

- **Version**: 1.0.0
- **Author**: Johnny Dev
- **License**: MIT
- **Package**: `chromancy` on npm

---

## Technology Stack

| Layer | Technology |
| ----- | ---------- |
| Language | JavaScript (ES6+ / ES2015+) |
| Module Format | ES Module (`"type": "module"`) |
| Bundler | Webpack 5 (`webpack.config.js`) |
| Transpiler | Babel 7 (`@babel/preset-env`) |
| Linter | ESLint 9 flat config (`eslint.config.js`) |
| Formatter | Prettier 3 (`.prettierrc`) |
| Minifier | Terser Webpack Plugin |
| Test Runner | Vitest (jsdom environment) |
| E2E Testing | Playwright |

**Important**: This project has **zero runtime dependencies**. All image processing is done via the native browser Canvas API.

---

## Project Structure

```
chromancy/
├── src/
│   ├── js/
│   │   └── main.js          # Sole source file — exports chromancy, chromancyWorker, chromancyBatch
│   └── index.d.ts           # TypeScript declarations
├── dist/
│   ├── chromancy.js      # Webpack bundle (ES module, minified, ~15KB)
│   └── index.d.ts           # Copied from src/ during build
├── tests/
│   └── unit/
│       └── main.test.js     # Vitest unit tests (30 tests)
├── .github/
│   └── workflows/
│       └── publish.yml      # GitHub Actions CI/CD for npm publish
├── package.json             # Project metadata & dev dependencies
├── webpack.config.js        # Build configuration
├── eslint.config.js         # ESLint 9 flat config
├── .prettierrc              # Prettier configuration
├── .gitignore               # Standard Node.js ignores
├── .npmignore               # Excludes source & config from npm publish
├── README.md                # Usage documentation and API reference
├── AGENTS.md                # This file
└── LICENSE                  # MIT License
```

### Source Code Organization

There is one source file: `src/js/main.js`. It contains private helper functions and exported public functions:

| Function | Visibility | Purpose |
| -------- | ---------- | ------- |
| `resolveInput` | Private | Converts URL strings to `HTMLImageElement` |
| `loadImage` | Private | Returns a Promise that resolves when an image has loaded |
| `getResizedImageData` | Private | Draws image onto off-screen canvas, scaled to `maxSize` |
| `analyzeImageData` | Private | Single-pass loop: average + histogram + properties |
| `getLightness` | Private | Calculates HSL lightness from RGB |
| `getSaturation` | Private | Calculates HSL saturation from RGB |
| `getHue` | Private | Calculates HSL hue from RGB |
| `applyColorScale` | Private | Normalizes and scales color intensity |
| `colorDifference` | Private | Euclidean distance between two colors |
| `convertColor` | Private | Applies output format conversion |
| `convertResult` | Private | Converts full result to chosen format |
| `getWorker` | Private | Creates/reuses inline Web Worker |
| `chromancy` | **Public** | Async entry point. Accepts `HTMLImageElement \| string` |
| `chromancyWorker` | **Public** | Web Worker variant with automatic fallback |
| `chromancyBatch` | **Public** | Parallel multi-image processing |
| `clearCache` | **Public** | Clears URL result cache |
| `rgbToHex` | **Public** | Color converter: RGB → Hex |
| `rgbToHsl` | **Public** | Color converter: RGB → HSL |
| `rgbToObject` | **Public** | Color converter: RGB → {r, g, b} |

The algorithm works as follows:

1. Resolve input (URL string → `Image()` element).
2. Wait for the image to load.
3. Resize it on a canvas to `maxSize` (preserving aspect ratio).
4. Single-pass loop over pixel data at `sampleRate`:
   - Running sum for average color.
   - Color histogram (quantized by `quantizationLevel`).
   - Property calculations (lightness, saturation, hue/warmth, min/max for contrast).
   - Skip pixels where alpha === 0.
5. Determine dominant color (bin with highest count).
6. Build palette from histogram (up to `paletteSize` distinct colors).
7. Apply optional `colorScale` normalization.
8. Convert result to chosen `outputFormat`.
9. Cache result for URL inputs.
10. Return `{ averageColor, dominantColor, palette, properties }`.

---

## Build Commands

```bash
# Install dependencies
yarn install

# Build for production
yarn build

# Watch mode
yarn watch

# Development build
yarn dev
```

The `build` script runs Webpack in production mode:

- Bundles `src/js/main.js` into `dist/chromancy.js`.
- Copies `src/index.d.ts` to `dist/index.d.ts`.
- Outputs an **ES Module** (`library.type: 'module'`).
- Minifies with Terser (`extractComments: false`).
- **No source maps** in production (`devtool: false`).

---

## Code Style Guidelines

Linting is enforced via ESLint 9 flat config (`eslint.config.js`):

- `@eslint/js` recommended rules
- `eslint-config-prettier` (disables conflicting rules)
- `eslint-plugin-prettier` (enforces Prettier as ESLint rules)

Prettier is configured with `.prettierrc`:

- Single quotes
- 2-space indentation
- 100 character print width
- Trailing commas (ES5)

When modifying code:

- Keep the existing functional style (private functions at module scope).
- Use `async/await` for asynchronous flow.
- Follow existing patterns for option defaults and validation.
- Run `yarn lint` and `yarn format:check` before committing.

---

## Testing

### Unit Tests (Vitest)

```bash
# Run tests once
yarn test

# Watch mode
yarn test:watch
```

**30 passing tests** covering:
- Basic functionality & input types
- Algorithm accuracy (solid colors, mixed colors, dominant frequency)
- Options edge cases (paletteSize: 0, colorScale, sampleRate)
- Output formats (rgb, hex, hsl, object)
- Image properties (brightness, warmth, saturation, contrast)
- Alpha channel handling
- URL caching
- Batch processing
- Web Worker (success path + fallback)
- Color converters (rgbToHex, rgbToHsl, rgbToObject)

### Browser Tests (Playwright)

```bash
yarn test:browser
yarn test:browser:ui
```

### Type Checking

```bash
yarn typecheck   # tsc --noEmit
```

---

## CI/CD

GitHub Actions workflow (`.github/workflows/publish.yml`):

- Triggers on push tags `v*`.
- Runs on Ubuntu with Node.js 20.
- Installs dependencies, builds, and publishes to npm.
- Requires `NPM_TOKEN` secret in repository settings.

---

## Security Considerations

1. **CORS (Cross-Origin Resource Sharing)**
   The library reads pixel data from a canvas. If the source image is from a different origin without appropriate CORS headers, the browser will taint the canvas and throw a security error when `getImageData` is called.

2. **No Input Sanitization**
   `chromancy` assumes valid input. Passing non-image elements may cause runtime errors.

3. **No External Network Calls**
   The library does not fetch images itself. The consumer is responsible for loading images or passing valid URLs.

4. **Web Worker Inline Code**
   The worker code is embedded as a string in `main.js` to avoid separate file dependencies.

---

## Deployment / Distribution

- `package.json` points `"main"` to `dist/chromancy.js`.
- `package.json` points `"types"` to `dist/index.d.ts`.
- `.npmignore` excludes source files, tests, and config files from the published tarball.
- Publishing is done via GitHub Actions (triggered by tag push) or manually with `npm publish`.

---

## Key Files Reference

| File | Purpose |
| ---- | ------- |
| `src/js/main.js` | Sole source file — contains all logic |
| `src/index.d.ts` | TypeScript declarations |
| `webpack.config.js` | Production build configuration |
| `package.json` | Dependencies, scripts, and package metadata |
| `eslint.config.js` | ESLint 9 flat config |
| `.prettierrc` | Prettier formatting rules |
| `README.md` | Public API documentation and usage examples |

---

## Quick Reference for Agents

- **Always run `yarn build` after changing `src/js/main.js`** — the distributed file is `dist/chromancy.js`.
- **Do not add Node.js-only APIs** (e.g., `fs`, `path`) — this is a browser library.
- **Keep the single-file structure** unless the feature genuinely warrants modularization.
- **Run tests before committing** — `yarn test` (30 tests must pass).
- **English is the working language** for all comments, documentation, and commit messages.
- **Do not push or publish** — let the user handle git push and npm publish.
