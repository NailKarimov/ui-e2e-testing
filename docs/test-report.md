# Test summary report: OWASP Juice Shop UI (ui-e2e-testing)

The structure follows ISO/IEC/IEEE 29119-3 (test completion report), shortened.

- **Period:** 20.10.2026 – 23.10.2026
- **Build:** Juice Shop v20.3.0; latest nightly run in GitHub Actions
- **Allure report:** https://nailkarimov.github.io/ui-e2e-testing/; Lighthouse under `…/lighthouse/`

## 1. Summary

The customer journey works in all five browsers and devices. The shop has one critical security defect (a DOM
XSS) and 14 accessibility defects, two of them blocking for screen-reader users in checkout. Desktop
performance meets every target, while mobile LCP is about 2.5 times the target.

## 2. Results

| Metric                          | Value                                            |
| ------------------------------- | ------------------------------------------------ |
| Tests run                       | 217                                              |
| Passed / failed / skipped       | 216 / 0 / 1                                      |
| Expected failures (`test.fail`) | 8 defects (6 functional, 2 accessibility)        |
| Visual                          | 12 screenshots within tolerance                  |
| Lighthouse, desktop             | LCP 1.2 s, TBT 14–23 ms, CLS ≤ 0.073, INP 123 ms |
| Lighthouse, mobile              | LCP 5.5–6.6 s, TBT 182–310 ms, CLS ≤ 0.065       |
| Duration                        | ~7.5 min for all five projects                   |
| Mutation check                  | 14 of 14 planted bugs caught                     |

## 3. Defects

All 20, with steps and the pinning test, are in [`known-defects.md`](known-defects.md). The most important ones:

| ID         | Severity | Summary                                                  | Status       |
| ---------- | -------- | -------------------------------------------------------- | ------------ |
| UI-SEC-1   | critical | DOM XSS through the search term                          | open, pinned |
| UI-A11Y-1  | major    | basket buttons without accessible names                  | open, pinned |
| UI-A11Y-2  | major    | radio buttons in checkout tables without names           | open, pinned |
| UI-A11Y-14 | WCAG AA  | content cut off and scrolling sideways at 320 px         | open, pinned |
| UI-AUTH-1  | minor    | a guest sees an empty order history instead of the login | open, pinned |

## 4. Deviations from the plan

- Mobile browsers are emulated. Real devices are in the backlog.

## 5. Recommendations

1. Fix UI-SEC-1 first: bind the search term as text.
2. Name the icon buttons and checkout radios (UI-A11Y-1 and UI-A11Y-2), which unblocks checkout for screen-reader
   users.
3. Mobile LCP: split the JavaScript bundle by route. 158 KB of JavaScript (44 % of `main.js`) is never used on
   the home page.
