# Color Bandit JS

An image color analysis library that helps you extract the average color, dominant color, and a color palette from an image element. This library is useful for applications like image processing, theming, or any feature that requires color extraction from images.

## Features

- **Average Color Calculation**
- **Dominant Color Detection**
- **Color Palette Generation**
- **Image Properties** — Extract brightness, warmth, saturation, and contrast
- **URL String Support** — Pass an image URL directly without creating an `<img>` element
- **Multiple Output Formats** — Get colors as `rgb`, `hex`, `hsl`, or `{ r, g, b }` objects
- **Alpha Channel Support** — Automatically skips fully transparent pixels
- **URL Caching** — Avoid re-analyzing the same image URL
- **Batch Processing** — Analyze multiple images in parallel
- **Web Worker Support** — Offload heavy analysis to a worker thread (no UI blocking)

## Installation

```bash
npm install color-bandit-js
```

Or with Yarn:

```bash
yarn add color-bandit-js
```

---

## Usage

```javascript
import { colorBandit } from 'color-bandit-js';

// Option 1: Pass an HTMLImageElement
const imageElement = document.getElementById('your-image-id');
const result = await colorBandit(imageElement, {
  maxSize: 100,
  paletteSize: 5,
});

// Option 2: Pass a URL string directly
const result = await colorBandit('https://example.com/photo.jpg', {
  maxSize: 100,
  paletteSize: 5,
});

console.log('Average Color:', result.averageColor);
console.log('Dominant Color:', result.dominantColor);
console.log('Color Palette:', result.palette);
console.log('Properties:', result.properties);
// Properties: { brightness: 0.72, warmth: 0.85, saturation: 0.65, contrast: 0.45 }
```

> **Important:** This library uses browser DOM APIs (`canvas`, `document`). It **only works in the browser** and cannot be used in Node.js.

## Options

You can customize the color analysis by passing an `options` object to the `analyzeColors` function. The available options are:

| Option              | Type   | Description                                                                                                                                                                                                                            | Default |
| ------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `maxSize`           | Number | The maximum width or height (in pixels) to which the image will be resized for analysis.                                                                                                                                               | `100`   |
| `quantizationLevel` | Number | Determines the level of color quantization. A lower number increases the number of color bins (finer color detail), while a higher number reduces color precision.                                                                     | `32`    |
| `sampleRate`        | Number | The fraction of pixels to sample from the image (between `0` and `1`). For example, `0.5` means half of the pixels will be sampled.                                                                                                    | `0.1`   |
| `paletteSize`       | Number | The number of distinct colors to include in the generated color palette. If set to `0`, no palette array will be generated.                                                                                                            | `5`     |
| `colorScale`        | Number | Adjusts the resulting colors by normalizing and scaling their intensity. A value of `0` means no scaling is applied, returning the original colors. Values greater than `0` will scale colors proportionally to their original ratios. | `0`     |
| `outputFormat`      | String | The output format for returned colors: `'rgb'`, `'hex'`, `'hsl'`, or `'object'`.                                                                                                                                                       | `'rgb'` |

### Output Formats

```javascript
// RGB (default)
const rgb = await colorBandit(url, { paletteSize: 3 });
// rgb.averageColor  -> "rgb(128,64,32)"

// Hex
const hex = await colorBandit(url, { paletteSize: 3, outputFormat: 'hex' });
// hex.averageColor  -> "#804020"

// HSL
const hsl = await colorBandit(url, { paletteSize: 3, outputFormat: 'hsl' });
// hsl.averageColor  -> "hsl(20,43%,31%)"

// Object
const obj = await colorBandit(url, { paletteSize: 3, outputFormat: 'object' });
// obj.averageColor  -> { r: 128, g: 64, b: 32 }
```

### Web Worker (No UI Blocking)

```javascript
import { colorBanditWorker } from 'color-bandit-js';

const result = await colorBanditWorker('https://example.com/photo.jpg', {
  paletteSize: 5,
});
// Same result as colorBandit(), but runs in a Web Worker
// Falls back to main thread if Workers are not supported
```

### Batch Processing

```javascript
import { colorBanditBatch } from 'color-bandit-js';

const results = await colorBanditBatch(
  ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
  { paletteSize: 5 }
);
// results = [result1, result2]
```

### Caching

```javascript
import { colorBandit, clearCache } from 'color-bandit-js';

// First call — analyzes the image
const result1 = await colorBandit('https://example.com/photo.jpg');

// Second call — returns cached result instantly
const result2 = await colorBandit('https://example.com/photo.jpg');

// Clear cache when needed
clearCache();
```

## Example

### Vanilla JavaScript

Here's an example demonstrating how to use the library in a basic HTML/JavaScript setup:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>ColorBandit Example</title>
  </head>
  <body>
    <img id="your-image-id" src="path-to-your-image.jpg" alt="Sample Image" />

    <script type="module">
      import { colorBandit } from './color-bandit.js';

      const imageElement = document.getElementById('your-image-id');

      colorBandit(imageElement, {
        maxSize: 150,
        quantizationLevel: 16,
        sampleRate: 0.2,
        paletteSize: 3,
        colorScale: 0,
      })
        .then((result) => {
          console.log('Average Color:', result.averageColor);
          console.log('Dominant Color:', result.dominantColor);
          console.log('Color Palette:', result.palette);

          // Apply the dominant color as the background
          document.body.style.backgroundColor = result.dominantColor;
        })
        .catch((error) => {
          console.error('Error analyzing colors:', error);
        });
    </script>
  </body>
</html>
```

### React (Using `useRef`)

Here's an example demonstrating how to use the library in a React application with the `useRef` hook:

```jsx
import React, { useRef, useEffect } from 'react';
import { colorBandit } from 'color-bandit-js';

const ImageAnalyzer = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const analyzeImageColors = async () => {
      if (!imageRef.current) return;

      try {
        const result = await colorBandit(imageRef.current, {
          maxSize: 150,
          quantizationLevel: 16,
          sampleRate: 0.2,
          paletteSize: 5,
          colorScale: 0,
        });

        console.log('Average Color:', result.averageColor);
        console.log('Dominant Color:', result.dominantColor);
        console.log('Color Palette:', result.palette);

        // Set the dominant color as the background color
        document.body.style.backgroundColor = result.dominantColor;
      } catch (error) {
        console.error('Error analyzing colors:', error);
      }
    };

    analyzeImageColors();
  }, []);

  return (
    <div>
      <img
        ref={imageRef}
        src="path-to-your-image.jpg"
        alt="Sample Image"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default ImageAnalyzer;
```

### TypeScript

The library includes TypeScript declarations out of the box:

```typescript
import { colorBandit, ColorBanditOptions } from 'color-bandit-js';

const options: ColorBanditOptions = {
  maxSize: 150,
  quantizationLevel: 16,
  sampleRate: 0.2,
  paletteSize: 5,
  outputFormat: 'hex',
};

const result = await colorBandit('https://example.com/photo.jpg', options);
// result.averageColor   -> string (e.g., "#804020")
// result.dominantColor  -> string
// result.palette        -> string[]
// result.properties     -> { brightness, warmth, saturation, contrast }

// With outputFormat: 'object'
const objResult = await colorBandit(imageElement, {
  ...options,
  outputFormat: 'object',
});
// objResult.averageColor -> { r: 128, g: 64, b: 32 }
// objResult.properties   -> { brightness: 0.72, warmth: 0.85, ... }
```

### Next.js

Because this library requires the browser's DOM, you must use **dynamic import** with `ssr: false`:

```tsx
'use client';

import { useRef, useEffect } from 'react';

export default function ImageAnalyzer() {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    async function analyze() {
      if (!imageRef.current) return;

      // Dynamic import — only runs in the browser
      const { colorBandit } = await import('color-bandit-js');

      const result = await colorBandit(imageRef.current, {
        maxSize: 150,
        paletteSize: 5,
      });

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

## Limitations

| Limitation                   | Description                                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Cross-Origin Images**      | Due to browser security policies (CORS), the library may not work with images from different origins unless the appropriate CORS headers are set.                  |
| **Performance**              | Analyzing very large images can be resource-intensive. Adjust the `maxSize` and `sampleRate` options to optimize performance.                                      |
| **Accuracy vs. Performance** | There's a trade-off between accuracy and performance. Increasing `sampleRate` and decreasing `quantizationLevel` will improve accuracy but may reduce performance. |

## Contributing

Contributions are welcome! If you have suggestions, bug reports, or pull requests, feel free to submit them on the project's GitHub repository.

### To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear messages.
4. Submit a pull request describing your changes.

## License

This project is licensed under the [MIT License](LICENSE).
