const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
  entry: {
    main: './src/js/analyzeColors.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'color-bandit.js', // ใช้ชื่อไฟล์คงที่
    chunkFilename: '[name].bundle.js', // สำหรับไฟล์ chunk
    library: 'ColorBandit',
    libraryTarget: 'umd', // เพื่อให้รองรับทั้ง CommonJS, AMD และ ES Modules
    globalObject: 'this',
  },
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            toplevel: true, // ทำให้ตัวแปรและฟังก์ชันระดับบนสุดถูกย่อ
          },
          compress: {
            drop_console: true, // ลบ console.log
            drop_debugger: true, // ลบ debugger
          },
          output: {
            comments: false, // ลบคอมเมนต์ออกจากโค้ด
          },
        },
        extractComments: false,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new JavaScriptObfuscator(
      {
        rotateStringArray: true,
        stringArray: true,
        stringArrayEncoding: ['base64'], // เข้ารหัส string
        stringArrayThreshold: 0.75, // เปอร์เซ็นต์ของ string ที่จะเข้ารหัส
      },
      []
    ),
  ],
};
