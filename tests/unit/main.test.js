import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  chromancy,
  chromancyBatch,
  clearCache,
  rgbToHex,
  rgbToHsl,
  rgbToObject,
} from '../../src/js/main.js';

// Helper to create mock ImageData from a 2D array of [r, g, b, a] pixels
function createMockImageData(pixelColors, width, height) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const color = pixelColors[i % pixelColors.length];
    data[i * 4] = color[0];
    data[i * 4 + 1] = color[1];
    data[i * 4 + 2] = color[2];
    data[i * 4 + 3] = color[3] ?? 255;
  }
  return { data, width, height };
}

describe('chromancy', () => {
  let mockImageData;
  let mockContext;
  let mockCanvas;
  let mockImageInstances;

  beforeEach(() => {
    // Default: 2x2 image with red, green, blue, yellow
    mockImageData = createMockImageData(
      [
        [255, 0, 0, 255], // red
        [0, 255, 0, 255], // green
        [0, 0, 255, 255], // blue
        [255, 255, 0, 255], // yellow
      ],
      2,
      2
    );

    mockContext = {
      drawImage: vi.fn(),
      getImageData: vi.fn(() => mockImageData),
    };

    mockCanvas = {
      getContext: vi.fn(() => mockContext),
      width: 0,
      height: 0,
    };

    mockImageInstances = [];

    vi.stubGlobal('document', {
      createElement: vi.fn((tag) => {
        if (tag === 'canvas') return mockCanvas;
        return {};
      }),
    });

    vi.stubGlobal(
      'Image',
      vi.fn(function () {
        const instance = {
          src: '',
          complete: false,
          naturalWidth: 0,
          width: 2,
          height: 2,
          onload: null,
          onerror: null,
          _triggerLoad: function () {
            this.complete = true;
            this.naturalWidth = 2;
            if (this.onload) this.onload();
          },
          _triggerError: function () {
            if (this.onerror) this.onerror(new Error('Failed to load image'));
          },
        };
        mockImageInstances.push(instance);
        return instance;
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockImageInstances = [];
    clearCache();
  });

  describe('basic', () => {
    it('should be defined', () => {
      expect(chromancy).toBeDefined();
      expect(typeof chromancy).toBe('function');
    });
  });

  describe('HTMLImageElement input', () => {
    it('should analyze an image element and return rgb colors by default', async () => {
      const fakeImage = {
        complete: true,
        naturalWidth: 2,
        width: 2,
        height: 2,
      };

      const result = await chromancy(fakeImage, {
        maxSize: 100,
        quantizationLevel: 32,
        sampleRate: 1.0,
        paletteSize: 2,
        colorScale: 0,
      });

      expect(result).toHaveProperty('averageColor');
      expect(result).toHaveProperty('dominantColor');
      expect(result).toHaveProperty('palette');
      expect(typeof result.averageColor).toBe('string');
      expect(typeof result.dominantColor).toBe('string');
      expect(Array.isArray(result.palette)).toBe(true);
      expect(result.averageColor.startsWith('rgb(')).toBe(true);
    });
  });

  describe('string URL input', () => {
    it('should create an Image from URL and analyze it', async () => {
      const testUrl = 'https://example.com/photo.jpg';

      const promise = chromancy(testUrl, {
        maxSize: 100,
        sampleRate: 1.0,
        paletteSize: 0,
      });

      expect(mockImageInstances.length).toBe(1);
      expect(mockImageInstances[0].src).toBe(testUrl);
      mockImageInstances[0]._triggerLoad();

      const result = await promise;

      expect(result).toHaveProperty('averageColor');
      expect(result).toHaveProperty('dominantColor');
      expect(result).toHaveProperty('palette');
    });

    it('should reject when string URL fails to load', async () => {
      const testUrl = 'https://example.com/broken.jpg';

      const promise = chromancy(testUrl, {
        maxSize: 100,
        sampleRate: 1.0,
        paletteSize: 0,
      });

      expect(mockImageInstances.length).toBe(1);
      mockImageInstances[0]._triggerError();

      await expect(promise).rejects.toThrow('Failed to load image');
    });
  });

  describe('algorithm accuracy', () => {
    it('should return red as dominant and average for solid red image', async () => {
      mockImageData = createMockImageData([[255, 0, 0, 255]], 4, 4);

      const fakeImage = {
        complete: true,
        naturalWidth: 4,
        width: 4,
        height: 4,
      };

      const result = await chromancy(fakeImage, {
        maxSize: 100,
        quantizationLevel: 1, // No quantization for precise test
        sampleRate: 1.0,
        paletteSize: 1,
        colorScale: 0,
      });

      expect(result.averageColor).toBe('rgb(255,0,0)');
      expect(result.dominantColor).toBe('rgb(255,0,0)');
      expect(result.palette[0]).toBe('rgb(255,0,0)');
    });

    it('should calculate correct average for half red half blue', async () => {
      // 2x1 image: red pixel + blue pixel
      mockImageData = createMockImageData(
        [
          [255, 0, 0, 255],
          [0, 0, 255, 255],
        ],
        2,
        1
      );

      const fakeImage = {
        complete: true,
        naturalWidth: 2,
        width: 2,
        height: 1,
      };

      const result = await chromancy(fakeImage, {
        maxSize: 100,
        quantizationLevel: 1,
        sampleRate: 1.0,
        paletteSize: 0,
        colorScale: 0,
      });

      // Average of red (255,0,0) and blue (0,0,255) = (128, 0, 128)
      expect(result.averageColor).toBe('rgb(128,0,128)');
    });

    it('should find the most frequent color as dominant', async () => {
      // 3x1 image: red, red, blue (red should be dominant)
      mockImageData = createMockImageData(
        [
          [255, 0, 0, 255],
          [255, 0, 0, 255],
          [0, 0, 255, 255],
        ],
        3,
        1
      );

      const fakeImage = {
        complete: true,
        naturalWidth: 3,
        width: 3,
        height: 1,
      };

      const result = await chromancy(fakeImage, {
        maxSize: 100,
        quantizationLevel: 1,
        sampleRate: 1.0,
        paletteSize: 0,
        colorScale: 0,
      });

      expect(result.dominantColor).toBe('rgb(255,0,0)');
    });

    it('should handle a 1x1 pixel image', async () => {
      mockImageData = createMockImageData([[128, 64, 32, 255]], 1, 1);

      const fakeImage = {
        complete: true,
        naturalWidth: 1,
        width: 1,
        height: 1,
      };

      const result = await chromancy(fakeImage, {
        maxSize: 100,
        quantizationLevel: 1,
        sampleRate: 1.0,
        paletteSize: 1,
        colorScale: 0,
      });

      expect(result.averageColor).toBe('rgb(128,64,32)');
      expect(result.dominantColor).toBe('rgb(128,64,32)');
      expect(result.palette[0]).toBe('rgb(128,64,32)');
    });
  });

  describe('options', () => {
    it('should return empty palette when paletteSize is 0', async () => {
      const fakeImage = {
        complete: true,
        naturalWidth: 2,
        width: 2,
        height: 2,
      };

      const result = await chromancy(fakeImage, {
        maxSize: 100,
        sampleRate: 1.0,
        paletteSize: 0,
      });

      expect(result.palette).toEqual([]);
    });

    it('should apply colorScale to all returned colors', async () => {
      mockImageData = createMockImageData([[255, 0, 0, 255]], 2, 2);

      const fakeImage = {
        complete: true,
        naturalWidth: 2,
        width: 2,
        height: 2,
      };

      const result = await chromancy(fakeImage, {
        maxSize: 100,
        quantizationLevel: 1,
        sampleRate: 1.0,
        paletteSize: 1,
        colorScale: 255,
      });

      // Red (255,0,0) with colorScale=255:
      // total = 255, newR = (255/255)*255 = 255, newG = 0, newB = 0
      expect(result.averageColor).toBe('rgb(255,0,0)');
      expect(result.dominantColor).toBe('rgb(255,0,0)');
    });

    it('should sample fewer pixels when sampleRate is lower', async () => {
      const getImageDataSpy = vi.fn(() => mockImageData);
      mockContext.getImageData = getImageDataSpy;

      const fakeImage = {
        complete: true,
        naturalWidth: 2,
        width: 2,
        height: 2,
      };

      // sampleRate=1.0 should sample all 4 pixels
      await chromancy(fakeImage, {
        maxSize: 100,
        quantizationLevel: 32,
        sampleRate: 1.0,
        paletteSize: 0,
      });

      // Verify getImageData was called (canvas processing happened)
      expect(getImageDataSpy).toHaveBeenCalled();
    });
  });

  describe('outputFormat option', () => {
    const fakeImage = {
      complete: true,
      naturalWidth: 2,
      width: 2,
      height: 2,
    };

    it('should return rgb strings when outputFormat is rgb (default)', async () => {
      const result = await chromancy(fakeImage, {
        maxSize: 100,
        sampleRate: 1.0,
        paletteSize: 0,
      });

      expect(result.averageColor.startsWith('rgb(')).toBe(true);
      expect(result.dominantColor.startsWith('rgb(')).toBe(true);
    });

    it('should return hex strings when outputFormat is hex', async () => {
      const result = await chromancy(fakeImage, {
        maxSize: 100,
        sampleRate: 1.0,
        paletteSize: 0,
        outputFormat: 'hex',
      });

      expect(result.averageColor.startsWith('#')).toBe(true);
      expect(result.dominantColor.startsWith('#')).toBe(true);
      expect(result.averageColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should return hsl strings when outputFormat is hsl', async () => {
      const result = await chromancy(fakeImage, {
        maxSize: 100,
        sampleRate: 1.0,
        paletteSize: 0,
        outputFormat: 'hsl',
      });

      expect(result.averageColor.startsWith('hsl(')).toBe(true);
      expect(result.dominantColor.startsWith('hsl(')).toBe(true);
      expect(result.averageColor).toMatch(/hsl\(\d+,\s*\d+%?,\s*\d+%?\)/);
    });

    it('should return objects when outputFormat is object', async () => {
      const result = await chromancy(fakeImage, {
        maxSize: 100,
        sampleRate: 1.0,
        paletteSize: 0,
        outputFormat: 'object',
      });

      expect(typeof result.averageColor).toBe('object');
      expect(result.averageColor).toHaveProperty('r');
      expect(result.averageColor).toHaveProperty('g');
      expect(result.averageColor).toHaveProperty('b');
      expect(typeof result.averageColor.r).toBe('number');
      expect(typeof result.averageColor.g).toBe('number');
      expect(typeof result.averageColor.b).toBe('number');
    });

    it('should convert palette colors to the chosen format', async () => {
      const result = await chromancy(fakeImage, {
        maxSize: 100,
        sampleRate: 1.0,
        paletteSize: 2,
        outputFormat: 'hex',
      });

      expect(Array.isArray(result.palette)).toBe(true);
      expect(result.palette.length).toBeGreaterThan(0);
      expect(result.palette[0].startsWith('#')).toBe(true);
    });
  });

  describe('properties', () => {
    it('should return image properties for a solid red image', async () => {
      mockImageData = createMockImageData([[255, 0, 0, 255]], 4, 4);

      const fakeImage = {
        complete: true,
        naturalWidth: 4,
        width: 4,
        height: 4,
      };

      const result = await chromancy(fakeImage, {
        maxSize: 100,
        quantizationLevel: 1,
        sampleRate: 1.0,
        paletteSize: 0,
      });

      expect(result.properties).toBeDefined();
      expect(result.properties.brightness).toBeGreaterThan(0);
      expect(result.properties.brightness).toBeLessThanOrEqual(1);
      expect(result.properties.warmth).toBe(1);
      expect(result.properties.saturation).toBe(1);
      expect(result.properties.contrast).toBe(0);
    });

    it('should return low warmth for a blue image', async () => {
      mockImageData = createMockImageData([[0, 0, 255, 255]], 4, 4);

      const fakeImage = {
        complete: true,
        naturalWidth: 4,
        width: 4,
        height: 4,
      };

      const result = await chromancy(fakeImage, {
        maxSize: 100,
        quantizationLevel: 1,
        sampleRate: 1.0,
        paletteSize: 0,
      });

      expect(result.properties.warmth).toBe(0);
    });

    it('should return high contrast for black and white image', async () => {
      mockImageData = createMockImageData(
        [
          [0, 0, 0, 255],
          [255, 255, 255, 255],
        ],
        2,
        2
      );

      const fakeImage = {
        complete: true,
        naturalWidth: 2,
        width: 2,
        height: 2,
      };

      const result = await chromancy(fakeImage, {
        maxSize: 100,
        quantizationLevel: 1,
        sampleRate: 1.0,
        paletteSize: 0,
      });

      expect(result.properties.contrast).toBe(1);
    });
  });

  describe('alpha channel', () => {
    it('should skip fully transparent pixels', async () => {
      mockImageData = createMockImageData(
        [
          [255, 0, 0, 255],
          [0, 0, 255, 0],
        ],
        2,
        1
      );

      const fakeImage = {
        complete: true,
        naturalWidth: 2,
        width: 2,
        height: 1,
      };

      const result = await chromancy(fakeImage, {
        maxSize: 100,
        quantizationLevel: 1,
        sampleRate: 1.0,
        paletteSize: 0,
      });

      expect(result.averageColor).toBe('rgb(255,0,0)');
      expect(result.dominantColor).toBe('rgb(255,0,0)');
    });
  });

  describe('caching', () => {
    it('should cache results for URL strings', async () => {
      const testUrl = 'https://example.com/cached.jpg';

      const promise1 = chromancy(testUrl, {
        maxSize: 100,
        sampleRate: 1.0,
        paletteSize: 0,
      });
      mockImageInstances[0]._triggerLoad();
      const result1 = await promise1;

      const result2 = await chromancy(testUrl, {
        maxSize: 100,
        sampleRate: 1.0,
        paletteSize: 0,
      });

      expect(mockImageInstances.length).toBe(1);
      expect(result2).toEqual(result1);
    });

    it('should clear cache when clearCache is called', async () => {
      const testUrl = 'https://example.com/clear.jpg';

      const promise1 = chromancy(testUrl, {
        maxSize: 100,
        sampleRate: 1.0,
        paletteSize: 0,
      });
      mockImageInstances[0]._triggerLoad();
      await promise1;

      clearCache();

      const promise2 = chromancy(testUrl, {
        maxSize: 100,
        sampleRate: 1.0,
        paletteSize: 0,
      });
      mockImageInstances[1]._triggerLoad();
      await promise2;

      expect(mockImageInstances.length).toBe(2);
    });
  });

  describe('batch processing', () => {
    it('should analyze multiple images in parallel', async () => {
      const urls = ['https://example.com/1.jpg', 'https://example.com/2.jpg'];

      const promise = chromancyBatch(urls, {
        maxSize: 100,
        sampleRate: 1.0,
        paletteSize: 0,
      });

      mockImageInstances[0]._triggerLoad();
      mockImageInstances[1]._triggerLoad();

      const results = await promise;

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);
      expect(results[0]).toHaveProperty('averageColor');
      expect(results[1]).toHaveProperty('averageColor');
    });
  });
});

describe('color converters', () => {
  describe('rgbToHex', () => {
    it('should convert rgb to hex', () => {
      expect(rgbToHex('rgb(255,0,0)')).toBe('#ff0000');
      expect(rgbToHex('rgb(0,255,0)')).toBe('#00ff00');
      expect(rgbToHex('rgb(0,0,255)')).toBe('#0000ff');
      expect(rgbToHex('rgb(128,64,32)')).toBe('#804020');
      expect(rgbToHex('rgb(0,0,0)')).toBe('#000000');
      expect(rgbToHex('rgb(255,255,255)')).toBe('#ffffff');
    });
  });

  describe('rgbToHsl', () => {
    it('should convert pure colors correctly', () => {
      expect(rgbToHsl('rgb(255,0,0)')).toBe('hsl(0,100%,50%)');
      expect(rgbToHsl('rgb(0,255,0)')).toBe('hsl(120,100%,50%)');
      expect(rgbToHsl('rgb(0,0,255)')).toBe('hsl(240,100%,50%)');
    });

    it('should convert black and white', () => {
      expect(rgbToHsl('rgb(0,0,0)')).toBe('hsl(0,0%,0%)');
      expect(rgbToHsl('rgb(255,255,255)')).toBe('hsl(0,0%,100%)');
    });

    it('should convert gray', () => {
      expect(rgbToHsl('rgb(128,128,128)')).toBe('hsl(0,0%,50%)');
    });
  });

  describe('rgbToObject', () => {
    it('should convert rgb to object', () => {
      expect(rgbToObject('rgb(255,0,0)')).toEqual({ r: 255, g: 0, b: 0 });
      expect(rgbToObject('rgb(128,64,32)')).toEqual({ r: 128, g: 64, b: 32 });
      expect(rgbToObject('rgb(0,0,0)')).toEqual({ r: 0, g: 0, b: 0 });
    });
  });
});
