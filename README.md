# Chromancy

[![npm version](https://badge.fury.io/js/chromancy.svg)](https://www.npmjs.com/package/chromancy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://badgen.net/bundlephobia/minzip/chromancy)](https://bundlephobia.com/package/chromancy)

> The fastest way to steal colors from images in the browser. Extract average, dominant, and palette colors with property analysis, batch processing, and Web Worker support — all in a 15KB package.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [`chromancy(source, options)`](#chromancysource-options)
  - [`chromancyWorker(source, options)`](#chromancyworkersource-options)
  - [`chromancyBatch(sources, options)`](#chromancybatchsources-options)
  - [`clearCache()`](#clearcache)
  - [`rgbToHex(rgb)`](#rgbtohexrgb)
  - [`rgbToHsl(rgb)`](#rgbtohslrgb)
  - [`rgbToObject(rgb)`](#rgbtoobjectrgb)
- [Options](#options)
- [Output Formats](#output-formats)
- [Examples](#examples)
  - [Vanilla JavaScript](#vanilla-javascript)
  - [React](#react)
  - [TypeScript](#typescript)
  - [Next.js](#nextjs)
- [Browser Support](#browser-support)
- [License](#license)

## Features

- 🎨 **Average, Dominant & Palette** — Extract average color, dominant color, and a full color palette from any image
- 🌈 **Multiple Output Formats** — Get colors as `rgb`, `hex`, `hsl`, or `{ r, g, b }` objects
- 📊 **Image Properties** — Analyze brightness, warmth, saturation, and contrast
- 🚀 **Web Worker Support** — Offload heavy analysis to a worker thread without blocking the UI
- ⚡ **Batch Processing** — Analyze multiple images in parallel with a single call
- 💾 **URL Caching** — Automatically cache results for URL inputs to avoid re-analysis
- 🪶 **Lightweight** — Only ~15KB minified, zero dependencies
- 🖼️ **Flexible Input** — Pass an `HTMLImageElement` or a URL string directly
- 🧊 **Alpha Channel Support** — Automatically skips fully transparent pixels

## Installation

```bash
npm install chromancy
```

Or with Yarn:

```bash
yarn add chromancy
```

## Quick Start

```javascript
import { chromancy } from 'chromancy';

const result = await chromancy('https://example.com/photo.jpg');

console.log(result.averageColor);  // "rgb(128,64,32)"
console.log(result.dominantColor); // "rgb(200,100,50)"
console.log(result.palette);       // ["rgb(...)", "rgb(...)", ...]
console.log(result.properties);    // { brightness, warmth, saturation, contrast }
```

## API Reference

### `chromancy(source, options)`

The main function for extracting colors from an image.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `source` | `HTMLImageElement \| string` | An image element or a URL string |
| `options` | `ChromancyOptions` | *(Optional)* Configuration options |

**Returns:** `Promise<ChromancyResult>`

```javascript
import { chromancy } from 'chromancy';

// With an image element
const img = document.getElementById('my-image');
const result = await chromancy(img, { paletteSize: 5 });

// With a URL string
const result = await chromancy('https://example.com/photo.jpg', {
  outputFormat: 'hex',
  paletteSize: 3,
});
```

### `chromancyWorker(source, options)`

Runs color analysis in a Web Worker to avoid blocking the main thread. Falls back to `chromancy()` if Web Workers are not supported.

**Parameters:** Same as `chromancy()`

**Returns:** `Promise<ChromancyResult>`

```javascript
import { chromancyWorker } from 'chromancy';

const result = await chromancyWorker('https://example.com/photo.jpg', {
  paletteSize: 5,
});
```

### `chromancyBatch(sources, options)`

Analyzes multiple images in parallel.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `sources` | `Array<HTMLImageElement \| string>` | Array of image elements or URL strings |
| `options` | `ChromancyOptions` | *(Optional)* Configuration options |

**Returns:** `Promise<ChromancyResult[]>`

```javascript
import { chromancyBatch } from 'chromancy';

const results = await chromancyBatch([
  'https://example.com/1.jpg',
  'https://example.com/2.jpg',
  'https://example.com/3.jpg',
], { paletteSize: 5 });

// results[0] -> result for 1.jpg
// results[1] -> result for 2.jpg
// results[2] -> result for 3.jpg
```

### `clearCache()`

Clears the URL result cache.

```javascript
import { chromancy, clearCache } from 'chromancy';

// First call — analyzes the image
await chromancy('https://example.com/photo.jpg');

// Second call — returns cached result instantly
await chromancy('https://example.com/photo.jpg');

// Clear cache when needed
clearCache();
```

### `rgbToHex(rgb)`

Converts an RGB string to a Hex string.

```javascript
import { rgbToHex } from 'chromancy';

rgbToHex('rgb(128, 64, 32)'); // "#804020"
```

### `rgbToHsl(rgb)`

Converts an RGB string to an HSL string.

```javascript
import { rgbToHsl } from 'chromancy';

rgbToHsl('rgb(128, 64, 32)'); // "hsl(20, 43%, 31%)"
```

### `rgbToObject(rgb)`

Converts an RGB string to an `{ r, g, b }` object.

```javascript
import { rgbToObject } from 'chromancy';

rgbToObject('rgb(128, 64, 32)'); // { r: 128, g: 64, b: 32 }
```

## Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `maxSize` | `number` | Maximum width or height (in pixels) to resize the image for analysis | `100` |
| `quantizationLevel` | `number` | Color quantization level. Lower = more color bins (finer detail), Higher = less precision | `32` |
| `sampleRate` | `number` | Fraction of pixels to sample (0 to 1). `0.5` = half of pixels | `0.1` |
| `paletteSize` | `number` | Number of distinct colors in the palette. Set to `0` to disable | `5` |
| `colorScale` | `number` | Normalizes and scales color intensity. `0` = no scaling | `0` |
| `outputFormat` | `string` | Output format: `'rgb'`, `'hex'`, `'hsl'`, or `'object'` | `'rgb'` |

## Output Formats

```javascript
// RGB (default)
const rgb = await chromancy(url, { paletteSize: 3 });
// rgb.averageColor  -> "rgb(128,64,32)"

// Hex
const hex = await chromancy(url, { paletteSize: 3, outputFormat: 'hex' });
// hex.averageColor  -> "#804020"

// HSL
const hsl = await chromancy(url, { paletteSize: 3, outputFormat: 'hsl' });
// hsl.averageColor  -> "hsl(20,43%,31%)"

// Object
const obj = await chromancy(url, { paletteSize: 3, outputFormat: 'object' });
// obj.averageColor  -> { r: 128, g: 64, b: 32 }
```

## Examples

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Chromancy Example</title>
  </head>
  <body>
    <img id="my-image" src="photo.jpg" alt="Sample" />

    <script type="module">
      import { chromancy } from 'chromancy';

      const img = document.getElementById('my-image');

      chromancy(img, { maxSize: 150, paletteSize: 5 })
        .then((result) => {
          document.body.style.backgroundColor = result.dominantColor;
          console.log('Palette:', result.palette);
        })
        .catch((err) => console.error(err));
    </script>
  </body>
</html>
```

### React

```jsx
import { useRef, useEffect } from 'react';
import { chromancy } from 'chromancy';

function ImageAnalyzer() {
  const imageRef = useRef(null);

  useEffect(() => {
    async function analyze() {
      if (!imageRef.current) return;
      const result = await chromancy(imageRef.current, { paletteSize: 5 });
      document.body.style.backgroundColor = result.dominantColor;
    }
    analyze();
  }, []);

  return <img ref={imageRef} src="photo.jpg" alt="Sample" style={{ maxWidth: '100%' }} />;
}

export default ImageAnalyzer;
```

### TypeScript

```typescript
import { chromancy, ChromancyOptions, ChromancyResult } from 'chromancy';

const options: ChromancyOptions = {
  maxSize: 150,
  quantizationLevel: 16,
  sampleRate: 0.2,
  paletteSize: 5,
  outputFormat: 'hex',
};

const result: ChromancyResult = await chromancy('https://example.com/photo.jpg', options);

console.log(result.averageColor);   // string (e.g., "#804020")
console.log(result.dominantColor);  // string
console.log(result.palette);        // string[]
console.log(result.properties);     // { brightness, warmth, saturation, contrast }
```

### Next.js

Because this library requires the browser's DOM, use **dynamic import** with `ssr: false`:

```tsx
'use client';

import { useRef, useEffect } from 'react';

export default function ImageAnalyzer() {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    async function analyze() {
      if (!imageRef.current) return;

      const { chromancy } = await import('chromancy');
      const result = await chromancy(imageRef.current, { maxSize: 150, paletteSize: 5 });

      document.body.style.backgroundColor = result.dominantColor;
    }

    analyze();
  }, []);

  return (
    <img
      ref={imageRef}
      src="/your-image.jpg"
      alt="Sample"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}
```

## Browser Support

Chromancy uses browser DOM APIs (`canvas`, `document`) and works in all modern browsers:

| Chrome | Firefox | Safari | Edge |
|--------|---------|--------|------|
| ✅ 60+ | ✅ 60+ | ✅ 12+ | ✅ 79+ |

> ⚠️ **Note:** Cross-origin images require proper CORS headers. The library will throw an error if the image cannot be loaded due to CORS restrictions.

## License

[MIT](LICENSE) © sahajohn
