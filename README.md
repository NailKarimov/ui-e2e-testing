# ui-e2e-testing

[![Tests](https://github.com/NailKarimov/ui-e2e-testing/actions/workflows/tests.yml/badge.svg)](https://github.com/NailKarimov/ui-e2e-testing/actions/workflows/tests.yml)
[![Allure report](https://img.shields.io/badge/report-Allure-orange)](https://nailkarimov.github.io/ui-e2e-testing/)

### ▶ Open online

| Page                                                                                                 | What it is        |
| ---------------------------------------------------------------------------------------------------- | ----------------- |
| **[Allure test report](https://nailkarimov.github.io/ui-e2e-testing/)**                              | latest CI run     |
| [Lighthouse reports](https://nailkarimov.github.io/ui-e2e-testing/lighthouse/)                       | latest CI run     |
| [UI e2e](https://nailkarimov.github.io/ui-e2e-testing/ui-e2e.html)                                   | interactive guide |
| [Accessibility and visual regression](https://nailkarimov.github.io/ui-e2e-testing/a11y-visual.html) | interactive guide |
| [Speed budgets](https://nailkarimov.github.io/ui-e2e-testing/perf.html)                              | interactive guide |

Click these links: opening an `.html` file in the file list shows its source code, GitHub does not run it.

UI end-to-end tests of **[OWASP Juice Shop](https://github.com/juice-shop/juice-shop) v20.3.0**, an Angular +
Material shop, with Playwright Test and TypeScript. They follow real user journeys, from search to order history,
in five browsers and devices. On top of that they check accessibility, visual regression and performance budgets.

|                        |                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **System under test**  | OWASP Juice Shop v20.3.0 (third-party, open source), in Docker                                                                                                                                                                                                                                                                                                                  |
| **Language and tools** | TypeScript · Playwright Test · axe-core · Pa11y · Lighthouse CI · Allure                                                                                                                                                                                                                                                                                                        |
| **Types of testing**   | UI end-to-end, cross-browser and mobile, accessibility (WCAG 2.2 AA), visual regression, web performance (Core Web Vitals)                                                                                                                                                                                                                                                      |
| **Tests**              | 217 (35 functional × 5 projects, a11y and visual on Chromium and Pixel 7) + 12 screenshots + Lighthouse on 3 pages                                                                                                                                                                                                                                                              |
| **Test quality**       | 14/14 planted bugs caught: 6 functional, 4 accessibility and visual, 4 performance (`scripts/mutants.mjs`)                                                                                                                                                                                                                                                                      |
| **Reports**            | [Allure](https://nailkarimov.github.io/ui-e2e-testing/) · [Lighthouse](https://nailkarimov.github.io/ui-e2e-testing/lighthouse/) · guides: [UI e2e](https://nailkarimov.github.io/ui-e2e-testing/ui-e2e.html), [accessibility and visual](https://nailkarimov.github.io/ui-e2e-testing/a11y-visual.html), [performance](https://nailkarimov.github.io/ui-e2e-testing/perf.html) |

## What is tested

| Suite                                   | Tool               | What it proves                                                                                                                              |
| --------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `journey/purchase` @smoke               | Playwright         | search → basket → new address → delivery → new card → summary → pay → confirmation → order history; totals from API prices                  |
| `account/register-login`                | Playwright         | registration and login through the forms; the same message for a wrong password and an unknown e-mail; validation                           |
| `search`, `basket`, `checkout/delivery` | Playwright         | search results equal the search API; basket counter, + / −, total = Σ price × quantity, isolation between customers; delivery prices        |
| `defects/known-defects`                 | Playwright         | 8 functional defects, each asserting the correct behaviour and marked `test.fail()`                                                         |
| `a11y/axe` (11)                         | axe-core           | 11 screens: no new serious or critical WCAG 2.2 AA violation (a ratchet: fixed ones must be removed)                                        |
| `a11y/keyboard`, `a11y/reflow`          | Playwright         | checkout with the keyboard only; focus visible on every stop (pictures, not CSS); reflow at 320 px                                          |
| Pa11y (6 pages)                         | Pa11y              | HTML_CodeSniffer as a second opinion; every error sorted into known, false positive or NEW                                                  |
| `visual` (12)                           | `toHaveScreenshot` | 6 screens × 2 layouts, pixel by pixel; baselines made only in Playwright's Docker image                                                     |
| Lighthouse CI                           | Lighthouse         | 3 pages × desktop / mobile × 3 runs: Core Web Vitals targets as warnings, measured ceilings as failures, byte budgets, INP from a user flow |

## Findings

Each defect is also a bug report in [Issues](https://github.com/NailKarimov/ui-e2e-testing/issues?q=is%3Aissue+label%3Abug), with steps, expected and actual results, severity and a link to the test that pins it.

**22 defects** are listed in [`docs/known-defects.md`](docs/known-defects.md): 8 functional and 14 accessibility
ones.

| ID         | Severity | Summary                                                                         |
| ---------- | -------- | ------------------------------------------------------------------------------- |
| UI-SEC-1   | critical | DOM XSS: `#/search?q=<img src=x onerror=…>` runs the script                     |
| UI-A11Y-1  | major    | basket buttons (+, −, delete) are icons with no accessible name                 |
| UI-A11Y-2  | major    | radio buttons in the address, delivery and card tables have no accessible name  |
| UI-A11Y-14 | WCAG AA  | at 320 px product cards are cut off and the page scrolls sideways (WCAG 1.4.10) |
| UI-AUTH-1  | minor    | a guest who opens `#/order-history` gets an empty page instead of the login     |

Performance on mobile: LCP 5.5–6.6 s against a 2.5 s target. The desktop meets every target.

## Running it

Requirements: Node.js 22+, Docker, Java 17+ for a local Allure report.

```bash
npm ci
npx playwright install --with-deps   # browsers
npm run shop:up                      # Juice Shop v20.3.0 in Docker on http://127.0.0.1:3000
npm test                             # everything except visual, all five projects
npm run test:smoke                   # @smoke only
npm run test:a11y                    # axe, keyboard, reflow
npm run a11y:pa11y                   # Pa11y, then: node scripts/pa11y-summary.mjs
npm run perf:lhci                    # Lighthouse CI desktop (perf:lhci:mobile, perf:flow for INP)
npm run test:visual                  # screenshots (compare in the Playwright Docker image)
node scripts/mutants.mjs             # mutation check
npm run shop:down
```

Settings go in `.env` (see `.env.example`): `SHOP_URL`, and `CHROMIUM_PATH` to use an existing Chromium.

## Project structure

```text
src/api/ShopApi.ts        REST client for set-up and oracles
src/pages/                Page Objects (login, register, product list, basket, checkout steps, order history)
src/components/NavBar.ts  top bar and side navigation, desktop and mobile
src/fixtures.ts           user per worker, fresh user, guest, API login, second browser context
src/known-defects.ts      knownDefect(id): test.fail() with the defect id in the report
src/a11y/, src/keyboard.ts   axe scan with the ratchet; Tab stops and focus by screenshots
tests/                    specs; tests/__screenshots__ holds the visual baselines made in CI
config/screenshot.css     hides timing-dependent notices during screenshots
scripts/                  flaky, Pa11y and performance summaries; INP flow; mutation check
docs/                     test plan, test report, known defects, guides
```

## CI

`.github/workflows/tests.yml` runs on push, pull request, nightly at 03:00 UTC and on demand:

- the main job runs Juice Shop as a service container; lint, format and typecheck; five projects across three
  browser engines; the flaky summary and the Pa11y summary; Lighthouse CI and the INP flow; then Allure with
  history on GitHub Pages;
- the `visual` job runs the screenshot tests inside `mcr.microsoft.com/playwright` and commits new baselines.
  "Run workflow" with "approve the current screens" updates them on purpose.

## Documentation

| Document                                                                                                                                     | What it is                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [`docs/test-plan.md`](docs/test-plan.md)                                                                                                     | test plan (ISO/IEC/IEEE 29119-3)                                                       |
| [`docs/test-report.md`](docs/test-report.md)                                                                                                 | test summary report: latest results, defects, recommendations                          |
| [`docs/known-defects.md`](docs/known-defects.md)                                                                                             | all 22 defects with steps, expected and actual results, and the pinning test           |
| [`docs/ui-e2e.md`](docs/ui-e2e.md) · [visual](https://nailkarimov.github.io/ui-e2e-testing/ui-e2e.html)                                      | the locator ladder, login without the form, phones, flaky tests, planted bugs          |
| [`docs/a11y.md`](docs/a11y.md), [`docs/visual.md`](docs/visual.md) · [visual](https://nailkarimov.github.io/ui-e2e-testing/a11y-visual.html) | axe with a ratchet, Pa11y, keyboard, reflow; screenshot tolerances and baselines in CI |
| [`docs/lighthouse.md`](docs/lighthouse.md) · [visual](https://nailkarimov.github.io/ui-e2e-testing/perf.html)                                | Lighthouse CI: targets and ceilings, budgets, INP through a user flow                  |

## Part of a portfolio

One of 13 test automation projects by [Nail Karimov](https://github.com/NailKarimov):
[all projects](https://github.com/NailKarimov) ·
[testing map](https://nailkarimov.github.io/api-test-automation/testing-map.html) ·
[toolbox](https://nailkarimov.github.io/api-test-automation/toolbox.html).
