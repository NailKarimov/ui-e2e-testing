import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'node_modules',
      'test-results',
      'playwright-report',
      'allure-results',
      'allure-report',
      'docs/sample-report',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Fixed sleeps make tests slow and flaky: rely on auto-waiting instead.
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-focused-test': 'error',
    },
  },
  {
    // Node scripts outside the test tree
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        AbortSignal: 'readonly',
        setTimeout: 'readonly',
      },
    },
  },
  {
    // Pa11y CI config: a CommonJS module read by pa11y-ci
    files: ['.pa11yci.js'],
    languageOptions: { sourceType: 'commonjs', globals: { process: 'readonly', module: 'writable' } },
  },
  prettier,
);
