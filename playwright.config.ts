import { defineConfig, devices } from '@playwright/test';
import { env } from './config/env';

const isCI = !!process.env.CI;

/**
 * One suite, five browsers. Locally, with CHROMIUM_PATH set (a sandbox without browser downloads), only the
 * Chromium-based projects run on that binary; in CI Playwright installs all three engines.
 */
const local = env.chromiumPath ? { launchOptions: { executablePath: env.chromiumPath } } : {};
// Accessibility and visual tests run on the two Chromium projects only: axe analyses the DOM, so another engine
// adds little, Tab in WebKit skips links and buttons unless macOS's "Keyboard navigation" is on, and visual
// baselines are kept for two layouts (desktop, phone) rather than five (docs/a11y.md, docs/visual.md).
const functionalOnly = { testIgnore: ['**/a11y/**', '**/visual/**'] };
const all = [
  { name: 'chromium', use: { ...devices['Desktop Chrome'], ...local } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] }, ...functionalOnly },
  { name: 'webkit', use: { ...devices['Desktop Safari'] }, ...functionalOnly },
  { name: 'mobile-chrome', use: { ...devices['Pixel 7'], ...local } },
  { name: 'mobile-safari', use: { ...devices['iPhone 15'] }, ...functionalOnly },
];

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  // Retries only in CI, and every retry is reported: a test that passed on retry is flaky, not green (scripts/flaky-summary.mjs).
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : 4,
  timeout: 45_000,
  expect: {
    timeout: 7_000,
    // Visual regression (tests/visual): baselines are made in CI's Playwright container, see docs/visual.md.
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      stylePath: './config/screenshot.css',
      // A fixed pixel budget, not a ratio: 0.1 % of a full-page shot is ~900 px, more than a whole price label,
      // and a planted grey price passed under it. 10 px of anti-aliasing noise at most, per-pixel threshold 0.1.
      maxDiffPixels: 10,
      threshold: 0.1,
    },
  },
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}-{projectName}{ext}',
  reporter: [
    [isCI ? 'github' : 'list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['allure-playwright'],
  ],
  use: {
    baseURL: env.shopUrl,
    // What is kept when a test fails: a trace from the first retry, a video and a screenshot.
    trace: 'on-first-retry',
    // Video needs Playwright's ffmpeg, which comes with `playwright install` (CI), not with a bare CHROMIUM_PATH.
    video: env.chromiumPath ? 'off' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    testIdAttribute: 'id',
  },
  projects: env.chromiumPath ? all.filter((p) => p.name === 'chromium' || p.name === 'mobile-chrome') : all,
});
