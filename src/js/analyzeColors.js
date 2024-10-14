// ฟังก์ชันสำหรับโหลดรูปภาพ
function loadImage(imageElement) {
  return new Promise((resolve, reject) => {
    if (imageElement.complete && imageElement.naturalWidth !== 0) {
      resolve();
    } else {
      // eslint-disable-next-line no-param-reassign
      imageElement.onload = resolve;
      // eslint-disable-next-line no-param-reassign
      imageElement.onerror = reject;
    }
  });
}

// ฟังก์ชันสำหรับปรับขนาดภาพ
function getResizedImageData(imageElement, maxSize = 100) {
  // eslint-disable-next-line no-undef
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const { naturalWidth: width, naturalHeight: height } = imageElement;
  const scale = Math.min(maxSize / width, maxSize / height, 1);

  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);

  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// ฟังก์ชันสำหรับสุ่มตัวอย่างพิกเซล
function getSampledPixels(imageData, sampleRate = 0.1) {
  const sampledData = [];
  const totalPixels = imageData.data.length / 4;
  const step = Math.floor(1 / sampleRate);

  for (let i = 0; i < totalPixels; i += step) {
    const index = i * 4;
    sampledData.push([
      imageData.data[index], // Red
      imageData.data[index + 1], // Green
      imageData.data[index + 2], // Blue
    ]);
  }

  return sampledData;
}

// คำนวณสีเฉลี่ยจากพิกเซลที่สุ่มตัวอย่าง
function getAverageColorFromSampled(sampledPixels) {
  let totalRed = 0;
  let totalGreen = 0;
  let totalBlue = 0;

  sampledPixels.forEach((pixel) => {
    totalRed += pixel[0];
    totalGreen += pixel[1];
    totalBlue += pixel[2];
  });

  const pixelCount = sampledPixels.length;
  const avgRed = Math.round(totalRed / pixelCount);
  const avgGreen = Math.round(totalGreen / pixelCount);
  const avgBlue = Math.round(totalBlue / pixelCount);

  return `rgb(${avgRed}, ${avgGreen}, ${avgBlue})`;
}

// ฟังก์ชันหลักสำหรับการวิเคราะห์สี
// eslint-disable-next-line import/prefer-default-export
export async function analyzeColors(imageElement, options = {}) {
  await loadImage(imageElement);

  const {
    maxSize = 100,
    quantizationLevel = 32,
    sampleRate = 0.1,
    paletteSize = 5,
  } = options;

  const imageData = getResizedImageData(imageElement, maxSize);
  const sampledPixels = getSampledPixels(imageData, sampleRate);
  const colorMap = {};

  // สร้างฮิสโตแกรมของสีจากพิกเซลที่สุ่มตัวอย่างมา
  sampledPixels.forEach((pixel) => {
    const r = Math.floor(pixel[0] / quantizationLevel) * quantizationLevel;
    const g = Math.floor(pixel[1] / quantizationLevel) * quantizationLevel;
    const b = Math.floor(pixel[2] / quantizationLevel) * quantizationLevel;
    const key = `${r},${g},${b}`;
    colorMap[key] = (colorMap[key] || 0) + 1;
  });

  // หาสีที่เด่นที่สุด (Dominant Color)
  let dominantColor = null;
  let maxCount = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const [color, count] of Object.entries(colorMap)) {
    if (count > maxCount) {
      maxCount = count;
      dominantColor = color;
    }
  }
  dominantColor = `rgb(${dominantColor})`;

  // ฟังก์ชันคำนวณความแตกต่างของสี
  function colorDifference(color1, color2) {
    const [r1, g1, b1] = color1.split(',').map(Number);
    const [r2, g2, b2] = color2.split(',').map(Number);
    return Math.sqrt((r2 - r1) ** 2 + (g2 - g1) ** 2 + (b2 - b1) ** 2);
  }

  // หาสีที่ต่างกันมากที่สุด
  const sortedColors = Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color);

  const distinctColors = [sortedColors[0]]; // เริ่มต้นด้วยสีที่เด่นที่สุด

  sortedColors.forEach((color) => {
    if (distinctColors.length >= paletteSize) return; // เอาสีเท่าที่กำหนดใน paletteSize

    const isDistinct = distinctColors.every(
      (distinctColor) => colorDifference(color, distinctColor) > 100 // ปรับค่านี้ตามต้องการ
    );

    if (isDistinct) {
      distinctColors.push(color);
    }
  });

  const palette = distinctColors.map((color) => `rgb(${color})`);

  return {
    averageColor: getAverageColorFromSampled(sampledPixels),
    dominantColor,
    palette,
  };
}
