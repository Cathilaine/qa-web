const js = require('@eslint/js');
const playwright = require('eslint-plugin-playwright');
const prettierConfig = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['core/tests/**/*.spec.js'],
    plugins: { playwright },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
    },
  },
  prettierConfig,
  {
    ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**'],
  },
];
