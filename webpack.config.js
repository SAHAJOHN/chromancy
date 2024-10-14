const path = require('path');

module.exports = {
  entry: './src/js/analyzeColors.js', // จุดเริ่มต้นของโค้ด
  output: {
    path: path.resolve(__dirname, 'dist'), // ผลลัพธ์จะถูกบันทึกที่นี่
    filename: 'color-bandit.js', // ชื่อไฟล์ output
    libraryTarget: 'module', // ใช้ ES Modules (ไม่ต้องใช้ library)
  },
  experiments: {
    outputModule: true, // เปิดใช้งาน ES Modules output
  },
  module: {
    rules: [
      {
        test: /\.m?js$/, // จัดการไฟล์ .js และ .mjs
        exclude: /(node_modules)/, // ยกเว้น node_modules
        use: {
          loader: 'babel-loader', // ใช้ babel-loader
          options: {
            presets: ['@babel/preset-env'], // ตั้งค่า preset-env เพื่อแปลงโค้ด ES6+
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'], // ทำให้การ import ไม่จำเป็นต้องระบุ .js
  },
  mode: 'production', // สร้างไฟล์แบบ production
};
