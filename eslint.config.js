import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'es5',
        },
      ],
      'no-console': 'off',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-nested-ternary': 'off',
      'consistent-return': 'off',
      'class-methods-use-this': 'off',
      'no-restricted-syntax': 'off',
      'no-undef': 'off',
      'import/prefer-default-export': 'off',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        HTMLImageElement: 'readonly',
      },
    },
  },
  {
    files: ['src/**/*.js'],
  },
];
