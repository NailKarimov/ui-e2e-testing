// Summarises Lighthouse CI (desktop, mobile) and the user-flow INP run:
//  - prints a Markdown table for the job summary (median of the runs, target and ceiling per metric);
//  - writes lighthouse-report/index.html linking the representative report of each page, for GitHub Pages.
//   node scripts/perf-summary.mjs >> "$GITHUB_STEP_SUMMARY"
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const OUT = 'lighthouse-report';
const METRICS = [
  ['largest-contentful-paint', 'LCP', 2500, (v) => `${(v / 1000).toFixed(2)} s`],
  ['first-contentful-paint', 'FCP', 1800, (v) => `${(v / 1000).toFixed(2)} s`],
  ['total-blocking-time', 'TBT', 200, (v) => `${Math.round(v)} ms`],
  ['cumulative-layout-shift', 'CLS', 0.1, (v) => v.toFixed(3)],
];
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const lines = ['## Performance: Lighthouse CI (median of 3 runs)', ''];
const links = [];

for (const form of ['desktop', 'mobile']) {
  const manifestPath = `${OUT}/${form}/manifest.json`;
  if (!existsSync(manifestPath)) continue;
  process.env.LHCI_FORM_FACTOR = form;
  delete require.cache[require.resolve('../lighthouserc.cjs')];
  const ceilings = require('../lighthouserc.cjs').ci.assert.assertMatrix[1].assertions;
  const runs = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const pages = [...new Set(runs.map((r) => r.url))];
  lines.push(
    `### ${form}`,
    '',
    `| Page | Score | ${METRICS.map((m) => m[1]).join(' | ')} |`,
    `|---|---:|${METRICS.map(() => '---:').join('|')}|`,
  );
  for (const url of pages) {
    const mine = runs.filter((r) => r.url === url);
    const lhrs = mine.map((r) => JSON.parse(readFileSync(r.jsonPath, 'utf8')));
    const page = new URL(url).searchParams.get('page') ?? url;
    const score = Math.round(median(lhrs.map((l) => l.categories.performance.score)) * 100);
    const cells = METRICS.map(([id, , target, fmt]) => {
      const v = median(lhrs.map((l) => l.audits[id].numericValue));
      const ceiling = ceilings[id]?.[1]?.maxNumericValue;
      const mark = v <= target ? '🟢' : ceiling != null && v > ceiling ? '🔴' : '🟡';
      return `${mark} ${fmt(v)}`;
    });
    lines.push(`| ${page} | ${score} | ${cells.join(' | ')} |`);
    const rep = mine.find((r) => r.isRepresentativeRun) ?? mine[0];
    const name = `${form}-${page}.html`;
    copyFileSync(rep.htmlPath, `${OUT}/${name}`);
    links.push([form, page, name, score]);
  }
  lines.push('');
}

if (existsSync(`${OUT}/flow-summary.json`)) {
  const f = JSON.parse(readFileSync(`${OUT}/flow-summary.json`, 'utf8'));
  const v = f.median.inp;
  const mark = v <= f.target ? '🟢' : v > f.ceiling ? '🔴' : '🟡';
  lines.push(
    '### Interaction to Next Paint (user flow)',
    '',
    `${mark} **INP ${Math.round(v)} ms** (median of ${f.runs.length}: ${f.runs.map((r) => Math.round(r.inp)).join(', ')} ms; target ${f.target}, ceiling ${f.ceiling})`,
    '',
    `Slowest interaction: \`${f.median.node ?? 'n/a'}\` — ${f.median.parts.join(', ')}`,
    '',
  );
  links.push(['flow', 'first visit, basket, search', 'flow.html', null]);
}
lines.push(
  '🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)',
);
console.log(lines.join('\n'));
writeFileSync(`${OUT}/summary.md`, lines.join('\n') + '\n'); // published with the reports

const rows = links
  .map(
    ([form, page, file, score]) =>
      `<li><a href="${file}">${form}: ${page}</a>${score == null ? '' : ` — performance ${score}`}</li>`,
  )
  .join('\n');
writeFileSync(
  `${OUT}/index.html`,
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Lighthouse reports</title>
<style>body{font:16px/1.6 system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 16px}code{font-size:.9em}</style></head>
<body><h1>Lighthouse reports</h1><p>Juice Shop v20.3.0, latest CI run on <code>${basename(process.cwd())}</code>. Median run of three per page.</p><ul>${rows}</ul>
<p><a href="../">Allure report</a> · <a href="../lighthouse.html">How these budgets work</a></p></body></html>\n`,
);
