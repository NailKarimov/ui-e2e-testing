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
- **8 known UI defects** found and pinned with `test.fail()`, including a DOM XSS and missing accessible names.

## Tests (35 per browser, 175 in CI)

| Spec                      | What it proves                                                                                                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `journey/purchase` @smoke | search → basket → new address → delivery → new card → summary → pay → confirmation → order history, totals from API prices                                                                |
| `account/register-login`  | register and log in through the forms, account panel, logout; same message for a wrong password and an unknown e-mail; duplicate e-mail; field validation; submit enabled only when valid |
| `search/search`           | the page lists exactly what the search API finds; search from the top bar; no results; case-insensitive                                                                                   |
| `basket/basket`           | counter, + / − (stops at 1), remove, total = Σ price × quantity, survives reload and a new tab, isolated between customers, guest basket merged at login                                  |
| `checkout/delivery`       | delivery methods and prices as in the shop; for each method: items + delivery = total; next step disabled until an address is chosen                                                      |
| `defects/known-defects`   | 8 defects, each asserting the correct behaviour and marked `test.fail()`: [`docs/known-defects.md`](docs/known-defects.md)                                                                |

**Does the suite catch bugs?** 6 bugs planted one at a time in Juice Shop's built frontend (`scripts/mutants.mjs`): wrong basket total, free delivery in the summary, checkout with an empty basket, mismatched passwords accepted, "−" by two, and one _fix_ of a known defect that a `test.fail()` test must notice. All 6 caught; the "−" bug survived the first version of its test, which now steps through values the shop's floor of 1 can't hide. Details: [`docs/ui-e2e.md`](docs/ui-e2e.md) · visual guide:
[`docs/ui-e2e.html`](https://nailkarimov.github.io/ui-e2e-testing/ui-e2e.html).

## Running it

```bash
npm ci
npx playwright install --with-deps   # browsers
npm run shop:up                      # Juice Shop v20.3.0 in Docker on http://127.0.0.1:3000
npm test                             # all five projects
npm run test:smoke                   # @smoke only
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
tests/**                  specs
scripts/flaky-summary.mjs results by browser + flaky tests for the job summary
scripts/mutants.mjs       planted bugs for the mutation check
```

## CI

`.github/workflows/tests.yml`: Juice Shop as a service container, lint + format + typecheck, all three browser
engines, the five projects, flaky summary, Allure report with history on GitHub Pages; nightly at 03:00 UTC.

Part of a QA portfolio: [github.com/NailKarimov](https://github.com/NailKarimov).
