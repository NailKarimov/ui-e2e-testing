// Lighthouse CI: page-load performance of Juice Shop, three runs per page, median compared with budgets.
//   npm run perf:lhci            desktop
//   npm run perf:lhci:mobile     mobile (Moto G Power, slow 4G, 4× CPU slowdown: Lighthouse's default)
// Two levels of budget, see docs/lighthouse.md:
//   warn  = the target: Google's "good" thresholds for Core Web Vitals. Juice Shop misses some of them today.
//   error = the ceiling: today's measured value plus a margin. Crossing it means performance got worse.
const base = process.env.SHOP_URL ?? 'http://127.0.0.1:3000';
const mobile = process.env.LHCI_FORM_FACTOR === 'mobile';

// [median today (CI), ceiling]; desktop and mobile measured separately (docs/lighthouse.md, "Baseline").
const CEILING = mobile
  ? { lcp: 9000, fcp: 6500, tbt: 900, cls: 0.12, si: 8500, score: 0.35 }
  : { lcp: 2500, fcp: 1500, tbt: 600, cls: 0.12, si: 3000, score: 0.6 };

module.exports = {
  ci: {
    collect: {
      // Juice Shop routes after the "#", which Lighthouse CI drops when it groups runs by URL; a query string the
      // server ignores keeps the three pages apart.
      url: [`${base}/?page=home#/`, `${base}/?page=search#/search?q=apple`, `${base}/?page=login#/login`],
      numberOfRuns: 3,
      chromePath: process.env.CHROMIUM_PATH || undefined,
      settings: {
        ...(mobile ? {} : { preset: 'desktop' }),
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        chromeFlags: '--headless=new --no-sandbox',
      },
    },
    assert: {
      // Two sets over the same pages: the targets warn, the ceilings fail the build.
      assertMatrix: [
        {
          matchingUrlPattern: '.*',
          assertions: {
            'largest-contentful-paint': ['warn', { maxNumericValue: 2500, aggregationMethod: 'median' }],
            'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1, aggregationMethod: 'median' }],
            // TBT is the lab stand-in for INP: long tasks during load block every interaction.
            'total-blocking-time': ['warn', { maxNumericValue: 200, aggregationMethod: 'median' }],
            'first-contentful-paint': ['warn', { maxNumericValue: 1800, aggregationMethod: 'median' }],
          },
        },
        {
          matchingUrlPattern: '.*',
          assertions: {
            'largest-contentful-paint': [
              'error',
              { maxNumericValue: CEILING.lcp, aggregationMethod: 'median' },
            ],
            'cumulative-layout-shift': [
              'error',
              { maxNumericValue: CEILING.cls, aggregationMethod: 'median' },
            ],
            'total-blocking-time': ['error', { maxNumericValue: CEILING.tbt, aggregationMethod: 'median' }],
            'first-contentful-paint': [
              'error',
              { maxNumericValue: CEILING.fcp, aggregationMethod: 'median' },
            ],
            'speed-index': ['error', { maxNumericValue: CEILING.si, aggregationMethod: 'median' }],
            'categories:performance': ['error', { minScore: CEILING.score, aggregationMethod: 'median' }],
            // Byte and request budgets (transfer sizes): they do not jitter like timings. Lighthouse 12 dropped
            // budget.json, so they are asserted on the resource-summary audit instead.
            'resource-summary:script:size': ['error', { maxNumericValue: 520 * 1024 }],
            'resource-summary:image:size': ['error', { maxNumericValue: 600 * 1024 }],
            'resource-summary:total:size': ['error', { maxNumericValue: 1300 * 1024 }],
            'resource-summary:total:count': ['error', { maxNumericValue: 60 }],
          },
        },
      ],
    },
    upload: {
      target: 'filesystem',
      outputDir: mobile ? 'lighthouse-report/mobile' : 'lighthouse-report/desktop',
      reportFilenamePattern: '%%PATHNAME%%-%%HASH%%-%%DATETIME%%.report.%%EXTENSION%%',
    },
  },
};
