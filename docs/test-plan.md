# Test plan: OWASP Juice Shop UI (ui-e2e-testing)

The structure follows ISO/IEC/IEEE 29119-3 (test plan), shortened for one project.

## 1. Context

- **System under test:** OWASP Juice Shop v20.3.0, an Angular + Material web shop, run as a Docker container.
- **Goal:** show that a customer can find, buy and track an order in every supported browser and device. Show
  whether the shop is accessible and fast enough, and pin every defect found with a test.
- **References:**
  - WCAG 2.2 AA and EN 301 549;
  - Core Web Vitals (LCP, CLS, INP);
  - ISO/IEC 25010;
  - ISTQB test design techniques.

## 2. Scope

| In scope                                                                | Out of scope                                                          |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------- |
| search, basket, checkout with address, delivery and card, order history | Juice Shop's hacking challenges (except the DOM XSS found on the way) |
| registration and login                                                  | the admin area                                                        |
| Chromium, Firefox, WebKit, Pixel 7, iPhone 15 (emulated)                | real devices (backlog: BrowserStack)                                  |
| accessibility of 11 screens, keyboard, reflow                           | a full manual screen-reader audit (a checklist is included)           |
| visual regression of 6 screens, Lighthouse on 3 pages                   | load testing (covered in microservices-testing)                       |

## 3. Quality characteristics (ISO/IEC 25010)

| Characteristic            | Covered by                                                                  |
| ------------------------- | --------------------------------------------------------------------------- |
| Functional correctness    | journeys with totals checked against API prices                             |
| Compatibility             | five Playwright projects                                                    |
| Usability (accessibility) | axe with a ratchet, Pa11y, keyboard-only checkout, focus pictures, reflow   |
| Performance efficiency    | Lighthouse CI with targets, ceilings and byte budgets; INP from a user flow |
| Security                  | the DOM XSS pinned as UI-SEC-1                                              |

## 4. Approach

- **Levels:** UI end-to-end with set-up over the API (accounts, baskets, addresses, cards) and checks in the UI.
- **Techniques:**
  - oracles from the shop's own API instead of hard-coded numbers;
  - boundary values, such as quantity down to 1;
  - equivalence classes for login errors;
  - state transitions in checkout.
- **Locators:** roles and accessible names first (the locator ladder); no fixed sleeps.
- **Defects:** every defect becomes a test asserting the correct behaviour, marked `test.fail()` with its id.
- **Test quality:** `scripts/mutants.mjs` plants bugs in the built frontend; accessibility, visual and
  performance bugs are planted the same way.

## 5. Risks

| Risk                                                          | Mitigation                                                                                  |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Flaky UI tests                                                | web-first assertions; retries only in CI; a flaky summary of every test that needed a retry |
| Screenshots differ between machines                           | baselines made only in Playwright's Docker image in CI                                      |
| Performance numbers vary between runners                      | 3 runs per page, ceilings calibrated on CI, targets as warnings                             |
| Automated accessibility checks find only part of the problems | keyboard and reflow tests, and a manual checklist                                           |

## 6. Entry and exit criteria

- **Entry:** Juice Shop is healthy; lint, format and typecheck pass.
- **Exit:** no unexpected failures in any project; no new accessibility violation; screenshots within tolerance;
  Lighthouse under its ceilings; every planted bug caught.

## 7. Deliverables

The test suite, the Allure and Lighthouse reports on GitHub Pages, [`test-report.md`](test-report.md),
[`known-defects.md`](known-defects.md) and the three guides.
