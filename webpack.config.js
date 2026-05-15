import path from 'path';
import { fileURLToPath } from 'url';
import TerserPlugin from 'terser-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
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
  devtool: false,
  optimization: {
    minimize: true,
    usedExports: true,
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
  // plugins: [
  //   new JavaScriptObfuscator(
  //     {
  //       rotateStringArray: true,
  //       stringArray: true,
  //       stringArrayEncoding: ['rc4', 'base64'], // encode stream cipher and string
  //       stringArrayThreshold: 0.75, // percentage of string to encode
  //     },
  //     []
  //   ),
  // ],
};
