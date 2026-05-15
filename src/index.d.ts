/**
 * Image properties extracted during color analysis.
 */
export interface ImageProperties {
  /** Average lightness of the image (0 = dark, 1 = bright). */
  brightness: number;

  /** Ratio of warm hues (red-orange-yellow) to total pixels (0 = cool, 1 = warm). */
  warmth: number;

  /** Average saturation of the image (0 = grayscale, 1 = vivid). */
  saturation: number;

  /** Difference between the lightest and darkest pixels (0 = flat, 1 = high contrast). */
  contrast: number;
}

/**
 * Options for the chromancy function.
 */
export interface ChromancyOptions {
  /**
   * The maximum width or height (in pixels) to which the image will be resized for analysis.
   * @default 100
   */
  maxSize?: number;

  /**
   * Determines the level of color quantization. A lower number increases the number of color bins
   * (finer color detail), while a higher number reduces color precision.
   * @default 32
   */
  quantizationLevel?: number;

  /**
   * The fraction of pixels to sample from the image (between 0 and 1).
   * For example, 0.5 means half of the pixels will be sampled.
   * @default 0.5
   */
  sampleRate?: number;

  /**
   * The number of distinct colors to include in the generated color palette.
   * If set to 0, no palette array will be generated.
   * @default 0
   */
  paletteSize?: number;

  /**
   * Adjusts the resulting colors by normalizing and scaling their intensity.
   * A value of 0 means no scaling is applied, returning the original colors.
   * Values greater than 0 will scale colors proportionally to their original ratios.
   * @default 0
   */
  colorScale?: number;

  /**
   * The output format for returned colors.
   * - `'rgb'` returns strings like `"rgb(128,64,32)"`
   * - `'hex'` returns strings like `"#804020"`
   * - `'hsl'` returns strings like `"hsl(20,43%,31%)"`
   * - `'object'` returns objects like `{ r: 128, g: 64, b: 32 }`
   * @default 'rgb'
   */
  outputFormat?: 'rgb' | 'hex' | 'hsl' | 'object';
}

/**
 * RGB color result returned by the chromancy function.
 */
export interface ChromancyResult {
  /** The average color of the image as an RGB string (e.g., "rgb(128,64,32)"). */
  averageColor: string;

  /** The dominant (most frequent) color of the image as an RGB string. */
  dominantColor: string;

  /** An array of distinct colors in the palette as RGB strings. Empty if paletteSize is 0. */
  palette: string[];

  /** Image properties (brightness, warmth, saturation, contrast). */
  properties: ImageProperties;
}

/**
 * Hex color result returned by the chromancy function.
 */
export interface ChromancyHexResult {
  /** The average color of the image as a hex string (e.g., "#804020"). */
  averageColor: string;

  /** The dominant (most frequent) color of the image as a hex string. */
  dominantColor: string;

  /** An array of distinct colors in the palette as hex strings. Empty if paletteSize is 0. */
  palette: string[];

  /** Image properties (brightness, warmth, saturation, contrast). */
  properties: ImageProperties;
}

/**
 * HSL color result returned by the chromancy function.
 */
export interface ChromancyHslResult {
  /** The average color of the image as an HSL string (e.g., "hsl(20,43%,31%)"). */
  averageColor: string;

  /** The dominant (most frequent) color of the image as an HSL string. */
  dominantColor: string;

  /** An array of distinct colors in the palette as HSL strings. Empty if paletteSize is 0. */
  palette: string[];

  /** Image properties (brightness, warmth, saturation, contrast). */
  properties: ImageProperties;
}

/**
 * Object color result returned by the chromancy function.
 */
export interface ChromancyObjectResult {
  /** The average color of the image as an RGB object. */
  averageColor: { r: number; g: number; b: number };

  /** The dominant (most frequent) color of the image as an RGB object. */
  dominantColor: { r: number; g: number; b: number };

  /** An array of distinct colors in the palette as RGB objects. Empty if paletteSize is 0. */
  palette: { r: number; g: number; b: number }[];

  /** Image properties (brightness, warmth, saturation, contrast). */
  properties: ImageProperties;
}

/**
 * Analyzes an image and extracts color information.
 *
 * @param source - An HTMLImageElement or a string URL (including data URLs) pointing to the image.
 * @param options - Optional configuration for the analysis.
 * @returns A promise that resolves to the color analysis result.
 *
 * @example
 * ```typescript
 * // Using an image element
 * const result = await chromancy(imageElement, {
 *   maxSize: 150,
 *   paletteSize: 5,
 * });
 *
 * // Using a URL string
 * const result = await chromancy('https://example.com/photo.jpg', {
 *   maxSize: 150,
 *   outputFormat: 'hex',
 * });
 * console.log(result.averageColor);  // "#804020"
 * console.log(result.properties.brightness);  // 0.72
 * ```
 */
export function chromancy(
  source: HTMLImageElement | string,
  options?: ChromancyOptions
): Promise<ChromancyResult>;

export function chromancy(
  source: HTMLImageElement | string,
  options: ChromancyOptions & { outputFormat: 'hex' }
): Promise<ChromancyHexResult>;

export function chromancy(
  source: HTMLImageElement | string,
  options: ChromancyOptions & { outputFormat: 'hsl' }
): Promise<ChromancyHslResult>;

export function chromancy(
  source: HTMLImageElement | string,
  options: ChromancyOptions & { outputFormat: 'object' }
): Promise<ChromancyObjectResult>;

/**
 * Web Worker version: offloads color analysis to a worker thread
 * to avoid blocking the main UI thread.
 *
 * Falls back to `chromancy()` if Web Workers are not supported.
 *
 * @param source - An HTMLImageElement or a string URL.
 * @param options - Optional configuration for the analysis.
 * @returns A promise that resolves to the color analysis result.
 */
  source: HTMLImageElement | string,
  options?: ChromancyOptions
): Promise<ChromancyResult>;

/**
 * Batch processing: analyze multiple images in parallel.
 *
 * @param sources - Array of HTMLImageElements or string URLs.
 * @param options - Optional configuration applied to all images.
 * @returns A promise that resolves to an array of color analysis results.
 */
export function chromancyBatch(
  sources: (HTMLImageElement | string)[],
  options?: ChromancyOptions
): Promise<ChromancyResult[]>;

/**
 * Clear the URL-based result cache.
 */
export function clearCache(): void;
