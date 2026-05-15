/**
 * Options for the colorBandit function.
 */
export interface ColorBanditOptions {
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
   * - `'rgb'` returns strings like `"rgb(128, 64, 32)"`
   * - `'hex'` returns strings like `"#804020"`
   * - `'hsl'` returns strings like `"hsl(20, 43%, 31%)"`
   * - `'object'` returns objects like `{ r: 128, g: 64, b: 32 }`
   * @default 'rgb'
   */
  outputFormat?: 'rgb' | 'hex' | 'hsl' | 'object';
}

/**
 * RGB color result returned by the colorBandit function.
 */
export interface ColorBanditResult {
  /** The average color of the image as an RGB string (e.g., "rgb(128, 64, 32)"). */
  averageColor: string;

  /** The dominant (most frequent) color of the image as an RGB string. */
  dominantColor: string;

  /** An array of distinct colors in the palette as RGB strings. Empty if paletteSize is 0. */
  palette: string[];
}

/**
 * Hex color result returned by the colorBandit function.
 */
export interface ColorBanditHexResult {
  /** The average color of the image as a hex string (e.g., "#804020"). */
  averageColor: string;

  /** The dominant (most frequent) color of the image as a hex string. */
  dominantColor: string;

  /** An array of distinct colors in the palette as hex strings. Empty if paletteSize is 0. */
  palette: string[];
}

/**
 * HSL color result returned by the colorBandit function.
 */
export interface ColorBanditHslResult {
  /** The average color of the image as an HSL string (e.g., "hsl(20, 43%, 31%)"). */
  averageColor: string;

  /** The dominant (most frequent) color of the image as an HSL string. */
  dominantColor: string;

  /** An array of distinct colors in the palette as HSL strings. Empty if paletteSize is 0. */
  palette: string[];
}

/**
 * Object color result returned by the colorBandit function.
 */
export interface ColorBanditObjectResult {
  /** The average color of the image as an RGB object. */
  averageColor: { r: number; g: number; b: number };

  /** The dominant (most frequent) color of the image as an RGB object. */
  dominantColor: { r: number; g: number; b: number };

  /** An array of distinct colors in the palette as RGB objects. Empty if paletteSize is 0. */
  palette: { r: number; g: number; b: number }[];
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
 * const result = await colorBandit(imageElement, {
 *   maxSize: 150,
 *   paletteSize: 5,
 * });
 *
 * // Using a URL string
 * const result = await colorBandit('https://example.com/photo.jpg', {
 *   maxSize: 150,
 *   outputFormat: 'hex',
 * });
 * console.log(result.averageColor);  // "#804020"
 * ```
 */
export function colorBandit(
  source: HTMLImageElement | string,
  options?: ColorBanditOptions
): Promise<ColorBanditResult>;

export function colorBandit(
  source: HTMLImageElement | string,
  options: ColorBanditOptions & { outputFormat: 'hex' }
): Promise<ColorBanditHexResult>;

export function colorBandit(
  source: HTMLImageElement | string,
  options: ColorBanditOptions & { outputFormat: 'hsl' }
): Promise<ColorBanditHslResult>;

export function colorBandit(
  source: HTMLImageElement | string,
  options: ColorBanditOptions & { outputFormat: 'object' }
): Promise<ColorBanditObjectResult>;
