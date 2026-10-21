# UI end-to-end testing with Playwright

What this project shows: how to test a real single-page web app through its UI so that the tests are **fast,
independent, readable and honest about flakiness**, on desktop and mobile browsers. The app is
[OWASP Juice Shop](https://github.com/juice-shop/juice-shop) v20.3.0, an Angular + Material online shop, run from
its Docker image.

## 1. What is tested

| Area             | Spec                      | Oracle (where "expected" comes from)                                 |
| ---------------- | ------------------------- | -------------------------------------------------------------------- |
| Purchase journey | `journey/purchase` @smoke | prices from `/api/Products` and `/api/Deliverys`; order in the API   |
| Account          | `account/register-login`  | messages of the form; the account panel shows the e-mail             |
| Search           | `search/search`           | the shop's search API: the page must list exactly the same products  |
| Basket           | `basket/basket`           | price × quantity summed by the test; the basket over the API         |
| Checkout         | `checkout/delivery`       | each delivery method: summary total = items + delivery price         |
| Known defects    | `defects/known-defects`   | the correct behaviour, marked `test.fail()` (see `known-defects.md`) |

35 tests × 5 browser projects = 175 runs in CI.

## 2. Page Objects with role locators

`src/pages/*` and `src/components/NavBar.ts` hold one class per screen. Rules:

- **Locators by role and accessible name**, the way a user (and a screen reader) finds things:
  `getByRole('button', { name: 'Proceed to review' })`. No CSS chains of Material classes.
- When the app gives an element **no name** (an a11y defect), the fallback is an icon or id, with a comment and a
  defect id. The tests thus document the a11y gaps instead of hiding them.
- **Exact names**: `getByText(name, { exact: true })`, because "Apple Juice (1000ml)" is a substring of
  "Pineapple Juice (1000ml)" and a `hasText` filter would pick both.
- Page Objects return **locators**, and tests use web-first assertions (`await expect(basket.quantity(x)).toHaveText('2')`)
  that wait for the UI to settle. No `waitForTimeout` anywhere (an ESLint rule forbids it).
- No assertions about business rules inside Page Objects: they act and expose; the tests decide.

## 3. Fast set-up through the API, checks through the UI

Only the thing under test goes through the UI. Everything else is prepared over the REST API (`src/api/ShopApi.ts`):
accounts, basket items, addresses, cards. The checkout test for "Fast Delivery" doesn't click through the product
list: the basket, the address and the card already exist, and the test starts at the basket page.

**Login without the login form.** Juice Shop keeps the session in three places: a `token` cookie, the same token in
`localStorage` and the basket id in `sessionStorage`. The fixture logs in over the API, adds the cookie and an init
script that writes both storages before every page load. A standard `storageState` file would not be enough here,
because `sessionStorage` is not part of it: without `bid` the basket stays empty even though the user is "logged in".
The login form itself is covered by its own tests (`account/register-login`).

## 4. Fixtures and isolation

`src/fixtures.ts`:

| Fixture     | Scope  | What it is                                                                                  |
| ----------- | ------ | ------------------------------------------------------------------------------------------- |
| `user`      | worker | one account per worker, made over the API                                                   |
| `ui`        | test   | Page Objects on a page signed in as `user`, **basket emptied before each test**             |
| `freshUser` | test   | a brand-new account, for tests that leave state behind (orders, addresses, cards)           |
| `shopper`   | test   | Page Objects signed in as `freshUser`                                                       |
| `guest`     | test   | Page Objects on a guest page                                                                |
| `pageAs(a)` | test   | a second browser context as any account, same device as the project (two users at once)     |
| `page`      | test   | welcome banner and cookie notice dismissed (cookies), CTF "challenge solved" banners hidden |

An isolation bug found while writing: the guest-basket test logged in as the worker's `user`, whose basket was not
emptied on that path, so leftovers of earlier tests were merged in (4 instead of 1). It passed alone and failed in a
full run, on mobile only, by test order. The fix was a fresh account. Tests that change shared state must own it.

## 5. Browsers and devices

`playwright.config.ts` has five projects: `chromium`, `firefox`, `webkit` (desktop) and `mobile-chrome` (Pixel 7),
`mobile-safari` (iPhone 15). The same tests run everywhere; differences live in the Page Objects:

- On a phone the account menu is not in the top bar. `NavBar.openAccount()` uses the menu if it is there, otherwise
  the side navigation; it closes the side navigation with a tap on the backdrop (Escape doesn't close it).
- The Material `<mat-select>` for the security question never passed Playwright's "stable" check on emulated phones.
  `RegisterPage.pickQuestion()` opens it from the keyboard (focus + Space) on every browser, which also proves the
  select works without a mouse.

Locally, in a sandbox without browser downloads, `CHROMIUM_PATH` points to an existing Chromium and only the two
Chromium projects run. CI installs all three engines.

## 6. Traces, videos, screenshots

```ts
trace: 'on-first-retry',          // a full trace (DOM snapshots, network, console) when a test is retried
video: 'retain-on-failure',       // a video only of failed tests
screenshot: 'only-on-failure',
```

Allure gets them as attachments; the Playwright HTML report and `test-results/` (traces) are uploaded as a CI
artifact. A trace opens with `npx playwright show-trace trace.zip` or at trace.playwright.dev.

## 7. Flaky tests: retries that don't hide anything

Retries are on **only in CI** (2) and never locally: locally a flaky test should fail and be fixed. In CI a test that
fails and then passes is reported by Playwright as **flaky**, not green. `scripts/flaky-summary.mjs` reads the JSON
report and writes to the job summary a table per browser (passed / known defects / flaky / failed) and every flaky
test with the error of its first failed attempt. Allure has a "Flaky" category too.

Checking for flakiness before pushing: `npx playwright test --repeat-each=3`. Two real flakes came out of that:

- **Shared state**: the guest-basket test used the worker's account (section 4). Failed by test order, mobile only.
- **A transient signal**: "add to basket" waited for the "Placed … into basket." snack bar. Snack bars are replaced
  by the next notice, so on a quick second click it was sometimes gone before the check (1 in 105 runs). The Page
  Object now waits for the basket counter to go up by one, which is the state the user actually cares about.
- **A layout shift**: on a freshly started shop, the first test to trigger one of Juice Shop's CTF challenges gets
  a "You successfully solved a challenge" banner sliding in above the page, and the next click can land where the
  button was a moment ago. The banner belongs to the hacking game, not the shop, so the `page` fixture hides it
  with CSS from the first paint; `proceedToCheckout()` also retries until the URL really changes.

A side effect worth knowing: a known-defect test that **times out** is not counted as the expected failure.
Playwright marks it red, which is right: it failed for some other reason than the defect it pins.

## 8. Does the suite catch bugs? (mutation check)

`scripts/mutants.mjs` plants one bug at a time in Juice Shop's compiled frontend (`main.js`) and the suite is run
against it. M5 is the other direction: it _fixes_ a known defect, and the matching `test.fail()` test must turn red.

| Id  | Planted bug                                           | Caught by                                                                                                                                                     |
| --- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M1  | Basket total ignores quantities                       | 6 tests: basket totals, all three delivery checkouts, the purchase journey                                                                                    |
| M2  | Order summary shows delivery as free                  | One Day and Fast Delivery checkouts, the purchase journey (Standard is free anyway)                                                                           |
| M3  | Checkout button enabled for an empty basket           | "removing the last item … disables checkout"                                                                                                                  |
| M4  | Registration accepts passwords that don't match       | "passwords that do not match are flagged"                                                                                                                     |
| M5  | **Fix** of UI-SEC-1: the search term rendered as text | UI-SEC-1 turns red: "Expected to fail, but passed"                                                                                                            |
| M6  | "−" takes away 2 instead of 1                         | the quantity test, **after a fix**: the first version went 1 → 2 → 1 and the shop's floor of 1 hid the bug; it now starts from 2 and steps down one at a time |

6 of 6 caught (M6 on the second try). The lesson of M6: a test that only touches a boundary can be satisfied by
the boundary itself; step through values that the boundary does not clamp.

## 9. Accessibility and visual regression

Two more layers on the same Page Objects and fixtures, documented separately:
[`a11y.md`](a11y.md) (axe ratchet, Pa11y, keyboard, reflow, manual checklist) and [`visual.md`](visual.md)
(screenshots, baselines from the Playwright image, tolerances).

## 10. Running it

```bash
npm ci
npx playwright install --with-deps   # browsers (not needed with CHROMIUM_PATH)
npm run shop:up                      # Juice Shop v20.3.0 in Docker on :3000
npm test                             # all five projects
npm run test:smoke                   # @smoke only
npx playwright test --project=mobile-safari --headed
npx playwright test --ui             # watch mode with time-travel
npm run shop:down
```
