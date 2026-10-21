// Reads Pa11y's JSON report and sorts every issue into: a known defect (both engines agree, or Pa11y alone),
// a reviewed false positive, or NEW (needs a look). Prints Markdown for the job summary and exits 1 on NEW.
//   node scripts/pa11y-summary.mjs [pa11y-report/pa11y.json] >> "$GITHUB_STEP_SUMMARY"
import { existsSync, readFileSync } from 'node:fs';

const file = process.argv[2] ?? 'pa11y-report/pa11y.json';
if (!existsSync(file)) {
  console.log(`_No Pa11y report at ${file}._`);
  process.exit(0);
}
const { results } = JSON.parse(readFileSync(file, 'utf8'));

// [verdict, id, what, test(issue)] — the first match wins. Reviewed by hand against the page (docs/a11y.md).
const RULES = [
  ['known', 'UI-A11Y-3', 'search field without a name (axe: label)', (i) => /searchQuery/.test(i.selector)],
  [
    'known',
    'UI-A11Y-8',
    'carousel photos without alt (axe: image-alt)',
    (i) => /H37/.test(i.code) && /gallery/.test(i.selector),
  ],
  ['known', 'UI-A11Y-11', 'rating slider without a name (axe: label)', (i) => /InputRange/.test(i.code)],
  [
    'known',
    'UI-A11Y-13',
    'menu icon in the top bar: 2.9:1, below the 3:1 that WCAG 1.4.11 asks of icons (Pa11y only: axe skips aria-hidden icons)',
    (i) => /G18/.test(i.code) && /mat-icon/.test(i.context),
  ],
  [
    'false positive',
    '',
    "the closed side navigation's hidden focus-absorbing button (axe ignores hidden elements, rightly)",
    (i) => /Button\.Name/.test(i.code) && /auto-focus-absorb/.test(i.context),
  ],
  [
    'false positive',
    '',
    'links like href="#/register" are routes of a hash-routed app, not in-page anchors',
    (i) => /NoSuchID/.test(i.code) && /href="#\//.test(i.context),
  ],
  [
    'false positive',
    '',
    'an <input hidden> is not shown to anyone',
    (i) => /InputText\.Name/.test(i.code) && /\shidden=/.test(i.context),
  ],
];

const rows = new Map();
for (const [url, issues] of Object.entries(results)) {
  const page = url.replace(/^https?:\/\/[^/]+/, '') || '/';
  for (const issue of issues) {
    if (typeof issue !== 'object' || issue.type !== 'error') continue;
    const rule = RULES.find((r) => r[3](issue));
    const [verdict, id, what] = rule ?? ['NEW', '', `${issue.message.split('.')[0]} — ${issue.selector}`];
    const key = `${verdict}|${id}|${what}`;
    const row = rows.get(key) ?? {
      verdict,
      id,
      what,
      code: issue.code.replace(/^WCAG2AA\.Principle\d\./, ''),
      pages: new Set(),
      n: 0,
    };
    row.pages.add(page);
    row.n++;
    rows.set(key, row);
  }
}

const order = { NEW: 0, known: 1, 'false positive': 2 };
const list = [...rows.values()].sort(
  (a, b) => order[a.verdict] - order[b.verdict] || a.id.localeCompare(b.id, 'en', { numeric: true }),
);
const out = [
  '## Pa11y (HTML_CodeSniffer, WCAG 2 AA): second opinion',
  '',
  '| Verdict | Defect | What | Pages | Issues |',
  '|---|---|---|---|---:|',
];
for (const r of list) {
  const v = r.verdict === 'NEW' ? '❗ NEW' : r.verdict === 'known' ? 'known' : 'false positive';
  out.push(`| ${v} | ${r.id} | ${r.what.replace(/\|/g, '\\|')} | ${[...r.pages].join(' ')} | ${r.n} |`);
}
const fresh = list.filter((r) => r.verdict === 'NEW');
out.push(
  '',
  fresh.length
    ? `**${fresh.length} new finding(s)**: review them and add a rule above.`
    : 'Nothing new: every Pa11y error is a known defect or a reviewed false positive.',
);
console.log(out.join('\n'));
process.exit(fresh.length ? 1 : 0);
