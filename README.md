# ui-e2e-testing

[![Tests](https://github.com/NailKarimov/ui-e2e-testing/actions/workflows/tests.yml/badge.svg)](https://github.com/NailKarimov/ui-e2e-testing/actions/workflows/tests.yml)
[![Allure report](https://img.shields.io/badge/report-Allure-orange)](https://nailkarimov.github.io/ui-e2e-testing/)

UI end-to-end tests of **[OWASP Juice Shop](https://github.com/juice-shop/juice-shop) v20.3.0** (Angular + Material)
with **Playwright Test** and TypeScript: real user journeys from search to order history, in five browsers and
devices.

- **Page Objects with role locators**: `getByRole('button', { name: 'Proceed to review' })`, exact product names,
  web-first assertions, no fixed sleeps.
- **Set-up over the API, checks in the UI**: accounts, baskets, addresses and cards are made over REST; login without
  the form (cookie + `localStorage` + `sessionStorage`, which a plain `storageState` file can't carry).
- **Oracles, not hard-coded numbers**: every total on screen is checked against the shop's own product and delivery
  prices; search results against the search API; the placed order against the order API.
- **Five projects**: Chromium, Firefox, WebKit, Pixel 7, iPhone 15. Mobile differences live in the Page Objects
  (account menu in the side navigation, a select opened from the keyboard).
- **Failure evidence**: trace on the first retry, video and screenshot of failed tests, all in Allure.
- **Flaky tests are visible**: retries only in CI, and `scripts/flaky-summary.mjs` lists every test that passed only
  on a retry, with its first error, in the job summary.
- **Accessibility, WCAG 2.2 AA**: axe-core on 11 screens with a ratchet (new problems fail, fixed ones must be
  removed), Pa11y as a second engine with every difference reviewed, keyboard-only checkout, focus visibility
  checked by comparing pictures, reflow at 320 px, and a manual checklist.
- **Visual regression**: `toHaveScreenshot` on 6 screens × 2 layouts, baselines made only in Playwright's Docker
  image in CI, new ones committed by the job, changes approved with one click.
- **22 known defects**: 8 functional (pinned with `test.fail()`, including a DOM XSS) and 14 accessibility ones.

## Functional tests (35 per browser, 175 in CI)

| Spec                      | What it proves                                                                                                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `journey/purchase` @smoke | search → basket → new address → delivery → new card → summary → pay → confirmation → order history, totals from API prices                                                                |
| `account/register-login`  | register and log in through the forms, account panel, logout; same message for a wrong password and an unknown e-mail; duplicate e-mail; field validation; submit enabled only when valid |
| `search/search`           | the page lists exactly what the search API finds; search from the top bar; no results; case-insensitive                                                                                   |
| `basket/basket`           | counter, + / − (stops at 1), remove, total = Σ price × quantity, survives reload and a new tab, isolated between customers, guest basket merged at login                                  |
| `checkout/delivery`       | delivery methods and prices as in the shop; for each method: items + delivery = total; next step disabled until an address is chosen                                                      |
| `defects/known-defects`   | 8 defects, each asserting the correct behaviour and marked `test.fail()`: [`docs/known-defects.md`](docs/known-defects.md)                                                                |

## Accessibility and visual tests (Chromium and Pixel 7)

| Spec                | What it proves                                                                                                                                                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `a11y/axe` (11)     | product list, search, login, registration, About Us, contact, basket, address, delivery, summary, order history: no new serious or critical WCAG 2.2 AA violation, and every known one still there (or the test asks to remove it) |
| `a11y/keyboard` (5) | log in, change a quantity and check out to the confirmation with the keyboard only; focus visible on every top-bar stop (pictures, not CSS); Escape returns focus                                                                  |
| `a11y/reflow` (5)   | at 320 px nothing sticks out sideways (WCAG 1.4.10); the product list does: UI-A11Y-14                                                                                                                                             |
| Pa11y (6 pages)     | HTML_CodeSniffer as a second opinion: each error sorted into known, reviewed false positive or NEW (`scripts/pa11y-summary.mjs`)                                                                                                   |
| `visual` (12)       | login, registration errors, product card, top bar, empty search, basket, pixel by pixel; masks and fixed text for what changes per run                                                                                             |

Details: [`docs/a11y.md`](docs/a11y.md) · [`docs/visual.md`](docs/visual.md) · visual guide:
[`docs/a11y-visual.html`](https://nailkarimov.github.io/ui-e2e-testing/a11y-visual.html).

**Does the suite catch bugs?** 6 bugs planted one at a time in Juice Shop's built frontend (`scripts/mutants.mjs`): wrong basket total, free delivery in the summary, checkout with an empty basket, mismatched passwords accepted, "−" by two, and one _fix_ of a known defect that a `test.fail()` test must notice. All 6 caught; the "−" bug survived the first version of its test, which now steps through values the shop's floor of 1 can't hide. Four more for accessibility and visuals (invisible focus, a fixed label, a moved button, a greyed price): all caught, two of them only after the tests were improved (pictures instead of styles for focus, a pixel budget instead of a ratio for screenshots). Details: [`docs/ui-e2e.md`](docs/ui-e2e.md) · visual guide:
[`docs/ui-e2e.html`](https://nailkarimov.github.io/ui-e2e-testing/ui-e2e.html).

## Running it

```bash
npm ci
npx playwright install --with-deps   # browsers
npm run shop:up                      # Juice Shop v20.3.0 in Docker on http://127.0.0.1:3000
npm test                             # everything except visual, all five projects
npm run test:smoke                   # @smoke only
npm run test:a11y                    # axe, keyboard, reflow
npm run a11y:pa11y                   # Pa11y, then: node scripts/pa11y-summary.mjs
npm run test:visual                  # screenshots (compare in the Playwright Docker image, docs/visual.md)
npx playwright test --project=mobile-safari --headed
npm run shop:down
```

Settings are in `.env` (see `.env.example`): `SHOP_URL`, and `CHROMIUM_PATH` to use an existing Chromium (then only
the Chromium projects run).

## Structure

```
src/api/ShopApi.ts        REST client for set-up and oracles
src/pages/*.ts            Page Objects (login, register, product list, basket, checkout steps, order history)
src/components/NavBar.ts  top bar / side navigation, desktop and mobile
src/fixtures.ts           user per worker, fresh user, guest, API login, second browser context
src/known-defects.ts      knownDefect(id): test.fail() with the defect id in the report
src/a11y/axe.ts           axe scan, known accessibility defects, the ratchet
src/keyboard.ts           tabTo(), Tab stops, focus visibility by screenshots
tests/**                  specs; tests/__screenshots__ holds the visual baselines made in CI
.pa11yci.js               Pa11y CI pages and settings
config/screenshot.css     hides timing-dependent notices while screenshots are taken
scripts/flaky-summary.mjs results by browser + flaky tests for the job summary
scripts/pa11y-summary.mjs Pa11y errors sorted into known / false positive / NEW
scripts/mutants.mjs       planted bugs for the mutation check
```

## CI

`.github/workflows/tests.yml`: Juice Shop as a service container, lint + format + typecheck, all three browser
engines, the five projects, flaky summary, Pa11y summary, Allure report with history on GitHub Pages; nightly at
03:00 UTC. A second job, `visual`, runs the screenshot tests inside `mcr.microsoft.com/playwright:v1.64.1-noble`
and commits new baselines; "Run workflow" with "approve the current screens" updates them on purpose.

Part of a QA portfolio: [github.com/NailKarimov](https://github.com/NailKarimov).
