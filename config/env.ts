import 'dotenv/config';

/** Test environment settings. Nothing here is secret. */
export const env = {
  /** The Juice Shop under test: a Docker container in CI (npm run shop:up), any local copy otherwise. */
  shopUrl: process.env.SHOP_URL ?? 'http://127.0.0.1:3000',
  /** Optional: a Chromium binary to use instead of Playwright's download (sandboxes without browser downloads). */
  chromiumPath: process.env.CHROMIUM_PATH || undefined,
};
