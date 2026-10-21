// Pa11y CI: a second, independent accessibility engine next to axe-core (tests/a11y/axe.spec.ts).
// Pa11y's default runner is HTML_CodeSniffer, which implements WCAG with its own rules, so where the two agree a
// finding is solid, and where they differ the difference is worth a look (docs/a11y.md).
//   npm run a11y:pa11y            (Juice Shop on SHOP_URL; CHROMIUM_PATH optional)
const base = process.env.SHOP_URL ?? 'http://127.0.0.1:3000';
const dismiss = [
  // What a first-time visitor does: close the welcome banner and accept the cookie notice.
  'wait for element button[aria-label="Close Welcome Banner"] to be visible',
  'click element button[aria-label="Close Welcome Banner"]',
  'click element a.cc-dismiss',
];
const page = (path, extra = []) => ({ url: `${base}/#/${path}`, actions: [...dismiss, ...extra] });

module.exports = {
  defaults: {
    standard: 'WCAG2AA',
    runners: ['htmlcs'],
    timeout: 60000,
    wait: 1500,
    // Juice Shop's own "challenge solved" banners belong to the hacking game, not to the shop.
    hideElements: 'app-challenge-solved-notification',
    chromeLaunchConfig: {
      executablePath: process.env.CHROMIUM_PATH || undefined,
      args: ['--no-sandbox'],
    },
    reporters: ['cli', ['json', { fileName: 'pa11y-report/pa11y.json' }]],
  },
  urls: [page(''), page('search?q=juice'), page('login'), page('register'), page('about'), page('contact')],
};
