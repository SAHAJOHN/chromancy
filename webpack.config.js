const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
// const JavaScriptObfuscator = require('webpack-obfuscator');
module.exports = {
  entry: {
    main: './src/js/main.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'color-bandit.js',
    library: {
      type: 'module',
    },
  },
  experiments: {
    outputModule: true,
  },
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
          output: {
            comments: false,
          },
        },
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
  // plugins: [
  //   new JavaScriptObfuscator(
  //     {
  //       rotateStringArray: true,
  //       stringArray: true,
  //       stringArrayEncoding: ['rc4', 'base64'], // เข้ารหัส stream cipher และ string
  //       stringArrayThreshold: 0.75, // เปอร์เซ็นต์ของ string ที่จะเข้ารหัส
  //     },
  //     []
  //   ),
  // ],
};
