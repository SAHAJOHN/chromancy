# Agent Guide for color-bandit-js

> This file is intended for AI coding agents. It describes the project architecture, conventions, and workflows. All documentation and source comments in this project are written in **English**.

---

## Project Overview

**color-bandit-js** is a browser-side JavaScript library for extracting color information from HTML `<img>` elements. It calculates:

- **Average Color** — arithmetic mean of all sampled pixels.
- **Dominant Color** — the most frequently occurring color bin after quantization.
- **Color Palette** — a set of visually distinct colors selected from the histogram.

The library is published as an **ES Module** (`dist/color-bandit.js`) and is intended to be imported into browser applications (vanilla JS or frameworks like React).

- **Version**: 1.0.0
- **Author**: Johnny Dev
- **License**: MIT
- **Repository**: `/Users/johnnydev/developer/personal/color-bandit-js`

---

## Technology Stack

| Layer         | Technology                                       |
| ------------- | ------------------------------------------------ |
| Language      | JavaScript (ES6+ / ES2015+)                      |
| Module Format | ES Module (`type: "module"` in webpack output)   |
| Bundler       | Webpack 5 (`webpack.config.js`)                  |
| Transpiler    | Babel 7 (`@babel/preset-env`)                    |
| Linter        | ESLint 8.22.0 with Airbnb base config + Prettier |
| Minifier      | Terser Webpack Plugin                            |

**Important**: This project has **zero runtime dependencies**. All image processing is done via the native browser Canvas API.

---

## Project Structure

```
color-bandit-js/
├── src/
│   └── js/
│       └── main.js          # Only source file — exports `colorBandit`
├── dist/
│   ├── color-bandit.js      # Webpack bundle (ES module, minified)
│   └── color-bandit.js.LICENSE.txt
├── package.json             # Project metadata & dev dependencies
├── webpack.config.js        # Build configuration
├── .babelrc                 # Babel preset: @babel/preset-env
├── .eslintrc                # Linting rules (Airbnb base + Prettier)
├── .gitignore               # Standard Node.js / Next.js ignores
├── .npmignore               # Excludes source & config from npm publish
├── README.md                # Usage documentation and API reference
└── LICENSE                  # MIT License
```

### Source Code Organization

There is only one source file: `src/js/main.js` (~163 lines). It contains several private helper functions and one exported public function:

| Function                     | Visibility       | Purpose                                                                                  |
| ---------------------------- | ---------------- | ---------------------------------------------------------------------------------------- |
| `loadImage`                  | Private          | Returns a Promise that resolves when an `<img>` element has loaded.                      |
| `getResizedImageData`        | Private          | Draws the image onto an off-screen canvas, scaled to `maxSize`, and returns `ImageData`. |
| `getSampledPixels`           | Private          | Iterates over pixel data at a given `sampleRate` and extracts `[R, G, B]` arrays.        |
| `getAverageColorFromSampled` | Private          | Computes the mean RGB values from sampled pixels.                                        |
| `applyColorScale`            | Private          | Normalizes and scales color intensity when `colorScale > 0`.                             |
| `colorDifference`            | Private (nested) | Euclidean distance between two quantized color keys.                                     |
| `colorBandit`                | **Public**       | Async entry point. Accepts an `HTMLImageElement` and an options object.                  |

The algorithm works as follows:

1. Wait for the image to load.
2. Resize it on a canvas to `maxSize` (preserving aspect ratio).
3. Sample pixels at the given `sampleRate`.
4. Build a quantized color histogram using `quantizationLevel`.
5. Determine the dominant color (bin with highest count).
6. Select up to `paletteSize` distinct colors using Euclidean distance threshold (`> 100`).
7. Apply optional `colorScale` normalization.
8. Return `{ averageColor, dominantColor, palette }` as RGB strings.

---

## Build Commands

```bash
# Install dependencies
npm install

# Build the library for production
npm run build
```

The `build` script runs Webpack in production mode. It:

- Bundles `src/js/main.js` into `dist/color-bandit.js`.
- Outputs an **ES Module** (`library.type: 'module'`, `experiments.outputModule: true`).
- Minifies the bundle with Terser.
- **Strips all `console.*` calls** (`drop_console: true`).
- Removes comments from the output.

There is **no development server**, **no watch mode**, and **no hot reload** configured. If you need incremental builds during development, run `npx webpack --watch` manually.

---

## Code Style Guidelines

Linting is enforced via ESLint with the following base extends:

- `airbnb-base`
- `plugin:prettier/recommended`
- `plugin:@next/next/recommended`

Prettier is configured to use **single quotes**.

**Notable style decisions** (see `.eslintrc`):

- Many Airbnb rules are explicitly turned off for this project, including `no-console`, `no-param-reassign`, `no-plusplus`, `no-nested-ternary`, `consistent-return`, `class-methods-use-this`, and `import/prefer-default-export`.
- There is also a TypeScript override block in `.eslintrc`, but the project currently contains **no TypeScript files**.
- The codebase is very permissive — agents should not expect strict enforcement of many common lint rules.

When modifying code:

- Keep the existing functional style (private functions at module scope).
- Use `async/await` for asynchronous flow.
- Continue using `forEach`, `Object.entries`, and standard array methods as seen in the current source.
- Follow existing inline `eslint-disable` comments when they are needed to suppress false positives.

---

## Testing Instructions

**There is no testing framework in this project.**

- No test scripts exist in `package.json`.
- No test files or `__tests__` / `*.spec.js` / `*.test.js` files are present.
- There is no CI/CD pipeline configured.

If you add tests, you will need to install a test runner (e.g., Jest or Vitest) and add the appropriate script to `package.json`.

### Manual verification

Because the library depends on the browser Canvas API and DOM `Image` elements, it **cannot be tested in a pure Node.js environment** without a headless browser or a DOM emulation library (e.g., JSDOM, Playwright, Puppeteer).

The quickest way to verify changes is to:

1. Run `npm run build`.
2. Open a local HTML file that imports `dist/color-bandit.js` as a module and calls `colorBandit` on an `<img>` element.

---

## Security Considerations

1. **CORS (Cross-Origin Resource Sharing)**  
   The library reads pixel data from a canvas. If the source image is from a different origin without appropriate CORS headers, the browser will taint the canvas and throw a security error when `getImageData` is called. This is a browser security policy, not a library bug. The README explicitly documents this limitation.

2. **No Input Sanitization**  
   The `colorBandit` function assumes the first argument is a valid `HTMLImageElement`. Passing non-image elements or objects without `complete`, `naturalWidth`, `width`, `height`, `onload`, or `onerror` properties will cause runtime errors.

3. **No External Network Calls**  
   The library does not fetch images itself, nor does it make any network requests. The consumer is responsible for loading the image into the DOM before calling `colorBandit`.

4. **Build-time Obfuscation**  
   The `webpack-obfuscator` plugin is present as a devDependency but is **commented out** in `webpack.config.js`. The distributed bundle is only minified, not obfuscated.

---

## Deployment / Distribution

This library is intended to be distributed as an npm package or copied directly into a project:

- `package.json` points `"main"` to `dist/color-bandit.js`.
- `.npmignore` excludes source files, config files, and `node_modules` from the published tarball.
- There is no automated publishing script, GitHub Actions workflow, or version-bump tooling (e.g., `semantic-release`). Publishing must be done manually with `npm publish`.

---

## Key Files Reference

| File                | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `src/js/main.js`    | Sole source file — contains all logic.                         |
| `webpack.config.js` | Production build configuration.                                |
| `package.json`      | Dependencies, scripts, and package metadata.                   |
| `.eslintrc`         | Linting rules and Prettier integration.                        |
| `.babelrc`          | Babel transpilation preset.                                    |
| `README.md`         | Public API documentation, usage examples (vanilla JS + React). |

---

## Quick Reference for Agents

- **Always run `npm run build` after changing `src/js/main.js`** — the distributed file is `dist/color-bandit.js`.
- **Do not add Node.js-only APIs** (e.g., `fs`, `path`, `Buffer`) — this is a browser library.
- **Keep the single-file structure** unless the feature genuinely warrants modularization.
- **No tests exist yet** — verify changes manually in a browser or add a test framework if instructed.
- **English is the working language** for all comments, documentation, and commit messages.
