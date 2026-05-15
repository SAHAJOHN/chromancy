// Resolve input to HTMLImageElement (supports string URL or HTMLImageElement)
function resolveInput(input) {
  if (typeof input === 'string') {
    const img = new Image();
    img.src = input;
    return img;
  }
  return input;
}

// Function for loading images
function loadImage(imageElement) {
  return new Promise((resolve, reject) => {
    if (imageElement.complete && imageElement.naturalWidth !== 0) {
      resolve();
    } else {
      imageElement.onload = resolve;
      imageElement.onerror = reject;
    }
  });
}

// Function for resizing images
function getResizedImageData(imageElement, maxSize) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const { width, height } = imageElement;
  const scale = Math.min(maxSize / width, maxSize / height, 1);

  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);

  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// Single-pass analysis: compute average + color histogram in one loop
function analyzeImageData(imageData, quantizationLevel, sampleRate) {
  const data = imageData.data;
  const totalPixels = data.length / 4;
  const step = Math.floor(1 / sampleRate);

  let totalRed = 0;
  let totalGreen = 0;
  let totalBlue = 0;
  let sampledCount = 0;
  const colorMap = {};

  for (let i = 0; i < totalPixels; i += step) {
    const index = i * 4;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];

    totalRed += r;
    totalGreen += g;
    totalBlue += b;
    sampledCount++;

    const qr = Math.floor(r / quantizationLevel) * quantizationLevel;
    const qg = Math.floor(g / quantizationLevel) * quantizationLevel;
    const qb = Math.floor(b / quantizationLevel) * quantizationLevel;
    const key = `${qr},${qg},${qb}`;
    colorMap[key] = (colorMap[key] || 0) + 1;
  }

  // Find dominant color and build sorted list in one pass
  let dominantColor = null;
  let maxCount = 0;
  const entries = [];

  for (const [color, count] of Object.entries(colorMap)) {
    if (count > maxCount) {
      maxCount = count;
      dominantColor = color;
    }
    entries.push({ color, count });
  }

  entries.sort((a, b) => b.count - a.count);
  const sortedColors = entries.map((e) => e.color);

  return {
    averageColor: `rgb(${Math.round(totalRed / sampledCount)},${Math.round(totalGreen / sampledCount)},${Math.round(totalBlue / sampledCount)})`,
    dominantColor: `rgb(${dominantColor})`,
    sortedColors,
  };
}

// Normalizing
function applyColorScale(color, colorScale) {
  if (colorScale === 0) {
    return color;
  }
  const [r, g, b] = color.match(/\d+/g).map(Number);
  const totalColor = r + g + b;
  const newR = Math.round((r / totalColor) * colorScale);
  const newG = Math.round((g / totalColor) * colorScale);
  const newB = Math.round((b / totalColor) * colorScale);
  return `rgb(${newR},${newG},${newB})`;
}

// Euclidean Distance (3D)
function colorDifference(color1, color2) {
  const [r1, g1, b1] = color1.split(',').map(Number);
  const [r2, g2, b2] = color2.split(',').map(Number);
  return Math.sqrt((r2 - r1) ** 2 + (g2 - g1) ** 2 + (b2 - b1) ** 2);
}

// Color converters
export function rgbToHex(rgb) {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  const toHex = (n) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl(rgb) {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const diff = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / diff + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / diff + 4) / 6;
        break;
      default:
        break;
    }
  }

  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);

  return `hsl(${hDeg}, ${sPct}%, ${lPct}%)`;
}

export function rgbToObject(rgb) {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  return { r, g, b };
}

function convertColor(color, format) {
  switch (format) {
    case 'hex':
      return rgbToHex(color);
    case 'hsl':
      return rgbToHsl(color);
    case 'object':
      return rgbToObject(color);
    case 'rgb':
    default:
      return color;
  }
}

function convertResult(result, format) {
  if (format === 'rgb' || !format) {
    return result;
  }
  return {
    averageColor: convertColor(result.averageColor, format),
    dominantColor: convertColor(result.dominantColor, format),
    palette: result.palette.map((color) => convertColor(color, format)),
  };
}

// Main function for color analysis
export async function colorBandit(imageElementOrUrl, options = {}) {
  const imageElement = resolveInput(imageElementOrUrl);
  await loadImage(imageElement);

  const {
    maxSize = 100,
    quantizationLevel = 32,
    sampleRate = 0.5,
    paletteSize = 0,
    colorScale = 0,
    outputFormat = 'rgb',
  } = options;

  const imageData = getResizedImageData(imageElement, maxSize);
  const analysis = analyzeImageData(imageData, quantizationLevel, sampleRate);

  // Build palette
  let palette = [];

  if (paletteSize > 0 && analysis.sortedColors.length > 0) {
    const distinctColors = [analysis.sortedColors[0]];

    for (let i = 1; i < analysis.sortedColors.length; i++) {
      if (distinctColors.length >= paletteSize) break;
      const color = analysis.sortedColors[i];
      const isDistinct = distinctColors.every(
        (distinctColor) => colorDifference(color, distinctColor) > 100
      );
      if (isDistinct) {
        distinctColors.push(color);
      }
    }

    palette = distinctColors.map((color) => `rgb(${color})`);
  }

  // Apply color scale
  const result = {
    averageColor: applyColorScale(analysis.averageColor, colorScale),
    dominantColor: applyColorScale(analysis.dominantColor, colorScale),
    palette: palette.map((color) => applyColorScale(color, colorScale)),
  };

  return convertResult(result, outputFormat);
}
