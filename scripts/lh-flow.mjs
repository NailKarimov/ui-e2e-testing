// Lighthouse user flow: Interaction to Next Paint (INP), the Core Web Vital that page-load runs cannot measure.
// A first-time visitor arrives, closes the welcome banner and the cookie notice, adds three products to the
// basket and searches; Lighthouse records the whole time span and reports the slowest interaction.
//   npm run perf:flow                 (Juice Shop on SHOP_URL; CHROMIUM_PATH optional)
// Writes lighthouse-report/flow.html and lighthouse-report/flow.json, prints INP, fails over the ceiling.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import puppeteer from 'puppeteer';
import { startFlow } from 'lighthouse';

const base = process.env.SHOP_URL ?? 'http://127.0.0.1:3000';
const TARGET = 200; // ms, Core Web Vitals "good"
const CEILING = Number(process.env.INP_CEILING ?? 300); // ms: CI median 123 ms (107–129) on 21.10.2026, plus a margin

const RUNS = Number(process.env.FLOW_RUNS ?? 3); // INP of one run jitters; the median of three is reported

async function once(run) {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox'],
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1350, height: 940 });
  const flow = await startFlow(page, {
    name: 'Juice Shop: first visit, fill the basket, search',
    config: { extends: 'lighthouse:default', settings: { preset: 'desktop' } },
  });

  await flow.navigate(`${base}/#/`, { name: 'Open the shop' });

  await flow.startTimespan({ name: 'Close banners, add 3 products, search' });
  await page.waitForSelector('button[aria-label="Close Welcome Banner"]', { visible: true });
  await page.click('button[aria-label="Close Welcome Banner"]');
  await page.click('a.cc-dismiss').catch(() => undefined);
  await page.waitForSelector('button[aria-label="Add to Basket"]', { visible: true });
  const add = await page.$$('button[aria-label="Add to Basket"]');
  for (const b of add.slice(0, 3)) {
    await b.click();
    await new Promise((r) => setTimeout(r, 700)); // let the snack bar and the counter settle, as a person would
  }
  await page.click('button[aria-label="Open search"]');
  await page.type('#searchQuery input', 'apple', { delay: 60 });
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => window.location.hash.includes('search?q=apple'));
  await new Promise((r) => setTimeout(r, 1000));
  await flow.endTimespan();

  const result = await flow.createFlowResult();
  mkdirSync('lighthouse-report', { recursive: true });
  writeFileSync(`lighthouse-report/flow-${run}.html`, await flow.generateReport());
  writeFileSync(`lighthouse-report/flow-${run}.json`, JSON.stringify(result, null, 1));
  await browser.close();
  const span = result.steps.find((s) => s.lhr.gatherMode === 'timespan').lhr;
  const breakdown = span.audits['inp-breakdown-insight']?.details?.items ?? [];
  return {
    run,
    inp: span.audits['interaction-to-next-paint']?.numericValue,
    tbt: span.audits['total-blocking-time'].numericValue,
    cls: span.audits['cumulative-layout-shift'].numericValue,
    parts: (breakdown.find((i) => i.type === 'table')?.items ?? []).map(
      (p) => `${p.label} ${Math.round(p.duration)} ms`,
    ),
    node: breakdown.find((i) => i.type === 'node')?.selector,
  };
}

const runs = [];
for (let i = 1; i <= RUNS; i++) runs.push(await once(i));
const valid = runs.filter((r) => r.inp != null).sort((a, b) => a.inp - b.inp);
if (!valid.length) {
  console.error('No interaction was recorded.');
  process.exit(1);
}
const median = valid[Math.floor(valid.length / 2)];
for (const r of runs)
  console.log(
    `run ${r.run}: INP ${Math.round(r.inp)} ms · TBT ${Math.round(r.tbt)} ms · CLS ${r.cls.toFixed(3)}`,
  );
console.log(
  `INP median ${Math.round(median.inp)} ms (target ${TARGET}, ceiling ${CEILING}) — slowest: ${median.node ?? 'n/a'}; ${median.parts.join(', ')}`,
);
// The median run's report is the one published.
writeFileSync('lighthouse-report/flow.html', readFileSync(`lighthouse-report/flow-${median.run}.html`));
writeFileSync(
  'lighthouse-report/flow-summary.json',
  JSON.stringify({ target: TARGET, ceiling: CEILING, median, runs }, null, 1),
);
if (median.inp > CEILING) {
  console.error(
    `INP ${Math.round(median.inp)} ms is over the ceiling of ${CEILING} ms: interactions got slower.`,
  );
  process.exit(1);
}
if (median.inp > TARGET)
  console.log(`::warning::INP ${Math.round(median.inp)} ms misses the ${TARGET} ms target`);
