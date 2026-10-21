# Lighthouse CI: page-load and interaction performance

What a customer waits for, measured on every push: how fast Juice Shop shows its main content, how much it
jumps around, and how quickly it reacts to a click. Two tools from the same family:

| Tool                                                   | Measures                                                              | Where                                                       |
| ------------------------------------------------------ | --------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Lighthouse CI** (`@lhci/cli`)                        | page load: LCP, FCP, TBT, CLS, Speed Index, score, bytes and requests | `lighthouserc.cjs`, `npm run perf:lhci`, `perf:lhci:mobile` |
| **Lighthouse user flow** (`lighthouse` 13 + Puppeteer) | INP: the slowest reaction to the user's clicks and typing             | `scripts/lh-flow.mjs`, `npm run perf:flow`                  |

Three pages (home, search results, login), desktop and mobile, three runs each; the median is compared.

## 1. Target and ceiling

Juice Shop does not meet every Core Web Vitals target on a phone today. A budget set at the target would fail
every build; a budget set loosely would never catch a regression. So each metric has two levels:

- **target (warn)**: Google's "good" threshold. Missing it is shown in yellow in the job summary, not a failure.
- **ceiling (error)**: today's CI value plus a margin for runner noise. Crossing it fails the build: performance
  got worse.

| Metric                                          | Target | Desktop today → ceiling | Mobile today → ceiling |
| ----------------------------------------------- | ------ | ----------------------- | ---------------------- |
| LCP, largest contentful paint                   | 2.5 s  | 1.2 s → 1.8 s           | 5.5–6.6 s → 8 s        |
| FCP, first contentful paint                     | 1.8 s  | 0.7 s → 1.1 s           | 3.5 s → 4.5 s          |
| TBT, total blocking time (lab stand-in for INP) | 200 ms | 14–23 ms → 150 ms       | 182–310 ms → 600 ms    |
| CLS, cumulative layout shift                    | 0.1    | ≤ 0.073 → 0.12          | ≤ 0.065 → 0.12         |
| Performance score                               | –      | 96–97 → 85              | 65–67 → 55             |
| INP (user flow, desktop)                        | 200 ms | 107–129 ms → 300 ms     | –                      |

Bytes and requests do not jitter like timings, so they have a single hard budget (transfer size): scripts
520 KB, images 600 KB, everything 1.3 MB, at most 60 requests. Lighthouse 12 removed `budget.json`; the budgets
are assertions on the `resource-summary` audit instead.

**Mobile is the finding**: on a mid-range phone over slow 4G, Juice Shop shows its products after 5.5–6.6 s,
more than twice the 2.5 s target. The report says where the time goes: 471 KB of JavaScript (7 files), 2.2 s of
main-thread work of which 1.2 s is script evaluation, and 158 KB of the JavaScript is never used on the home page
(44 % of `main.js`). Splitting the bundle by route is the obvious fix; the ceiling makes sure it does not get worse
in the meantime.

## 2. INP needs a user, not a page load

Lighthouse's normal run loads a page and stops: nobody clicks, so INP, the Core Web Vital for responsiveness,
cannot be measured. TBT approximates it (long tasks during load block whatever the user tries). The user flow
measures the real thing: a first-time visitor opens the shop, closes the welcome banner and the cookie notice,
adds three products to the basket and searches for "apple"; Lighthouse records the whole time span. Median of
three runs: **123 ms**, and the slowest interaction is typing in the search field (94 ms of processing).

## 3. Things that were not obvious

- **Hash routes collapse.** Lighthouse CI groups runs by URL without the `#fragment`, so `/#/`, `/#/search` and
  `/#/login` became one page with nine runs. A query string the server ignores (`/?page=search#/search?q=apple`)
  keeps them apart.
- **Local is not CI.** In this sandbox the same pages load 2–3 times slower than on the GitHub runner (another
  CPU, and Google Fonts are blocked here). Ceilings are calibrated on CI numbers only; local runs are for
  looking at reports, not for judging budgets.
- **Simulated throttling.** Lighthouse measures without throttling and computes what slow 4G and a 4× slower
  CPU would give. That keeps runs on a shared machine comparable, and is why three runs vary only a little.

## 4. Does it catch anything? (mutation check)

Planted in Juice Shop's built frontend with `scripts/mutants.mjs`, one at a time:

| Id  | Planted change                                   | Caught by                                    |
| --- | ------------------------------------------------ | -------------------------------------------- |
| M11 | Every click blocks the main thread for 400 ms    | user flow: INP 665 ms, over the ceiling      |
| M12 | A 1.5 s synchronous task at start-up             | Lighthouse CI: TBT and the performance score |
| M13 | A banner pushes the page down 0.8 s after load   | Lighthouse CI: CLS                           |
| M14 | 300 KB of incompressible data in the main bundle | Lighthouse CI: script size, **after a fix**  |

M14 first passed: the config used `budgets`, which Lighthouse 12 silently ignores, so the "performance-budget"
assertion had nothing to check. Moving the budgets to `resource-summary:script:size` caught it (542 KB against
520 KB).

## 5. Reports

Every CI run publishes the representative report of each page and the user flow to GitHub Pages:
[nailkarimov.github.io/ui-e2e-testing/lighthouse/](https://nailkarimov.github.io/ui-e2e-testing/lighthouse/),
with `summary.md` (the same table as the job summary). Visual guide: [`perf.html`](perf.html).

```bash
npm run perf:lhci            # desktop: 3 pages × 3 runs, assertions, reports in lighthouse-report/
npm run perf:lhci:mobile     # mobile
npm run perf:flow            # INP user flow, 3 runs
node scripts/perf-summary.mjs
```
