// Reads Playwright's JSON report and writes a Markdown summary: per browser, how many tests passed, failed, were
// expected failures (known defects) or flaky (failed first, passed on a retry). Flaky tests are listed with
// the error of their first failed attempt, so a retry never hides a problem. Usage:
//   node scripts/flaky-summary.mjs [test-results/results.json] >> "$GITHUB_STEP_SUMMARY"
import { readFileSync, existsSync } from 'node:fs';

const file = process.argv[2] ?? 'test-results/results.json';
if (!existsSync(file)) {
  console.log(`_No Playwright JSON report at ${file}._`);
  process.exit(0);
}
const report = JSON.parse(readFileSync(file, 'utf8'));

const rows = new Map(); // project -> counts
const flaky = [];
const failed = [];

function walk(suite, path) {
  for (const s of suite.suites ?? []) walk(s, [...path, s.title]);
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests) {
      const r = rows.get(t.projectName) ?? { passed: 0, failed: 0, flaky: 0, knownDefect: 0, skipped: 0 };
      const title = [...path.filter(Boolean), spec.title].join(' › ');
      if (t.status === 'flaky') {
        r.flaky++;
        const first = t.results.find((x) => x.status !== 'passed');
        const msg = (first?.error?.message ?? '')
          .split('\n')[0]
          .replace(new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m', 'g'), ''); // strip ANSI colours
        flaky.push({ project: t.projectName, title, retries: t.results.length - 1, msg });
      } else if (t.status === 'unexpected') {
        r.failed++;
        failed.push({ project: t.projectName, title });
      } else if (t.status === 'skipped') r.skipped++;
      else if (t.expectedStatus === 'failed') r.knownDefect++;
      else r.passed++;
      rows.set(t.projectName, r);
    }
  }
}
walk(report, []);

const out = [
  '## UI e2e: results by browser',
  '',
  '| Browser | Passed | Known defects | Flaky | Failed | Skipped |',
  '|---|---:|---:|---:|---:|---:|',
];
for (const [p, r] of [...rows].sort())
  out.push(`| ${p} | ${r.passed} | ${r.knownDefect} | ${r.flaky} | ${r.failed} | ${r.skipped} |`);
out.push('');
if (flaky.length) {
  out.push(
    `### ⚠️ Flaky: ${flaky.length} test(s) passed only on a retry`,
    '',
    '| Browser | Test | Retries | First failure |',
    '|---|---|---:|---|',
  );
  for (const f of flaky)
    out.push(`| ${f.project} | ${f.title} | ${f.retries} | ${f.msg.replace(/\|/g, '\\|').slice(0, 160)} |`);
} else out.push('No flaky tests in this run.');
if (failed.length) {
  out.push('', `### ❌ Failed: ${failed.length}`, '');
  for (const f of failed) out.push(`- **${f.project}**: ${f.title}`);
}
console.log(out.join('\n'));
