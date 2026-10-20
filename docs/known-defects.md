# Known UI defects in OWASP Juice Shop v20.3.0

Found while writing this suite. Each one has a test in `tests/defects/known-defects.spec.ts` that asserts the
**correct** behaviour and is marked `test.fail()` through `knownDefect(id)` (`src/known-defects.ts`):

- while the defect is there, the test fails as expected and the run stays green;
- the day it is fixed, Playwright reports "Expected to fail, but passed" and the run turns red: remove the marker;
- `SHOW_DEFECTS=1 npx playwright test tests/defects` runs them as ordinary tests, to see each failure message.

Juice Shop is deliberately insecure, so UI-SEC-1 is "by design" there; in a real product it would be critical.

| Id        | Severity | What happens                                                                     | Expected                                    | How the test sees it                                            |
| --------- | -------- | -------------------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| UI-SEC-1  | Critical | `#/search?q=<img src=x onerror=…>` runs the script: the term is bound as HTML    | the term is shown as text                   | a harmless probe sets `window.__xssProbe`; the heading is empty |
| UI-A11Y-1 | Major    | Basket row buttons (+, −, delete) are icons with no accessible name (WCAG 4.1.2) | "Increase quantity", "Remove Apple Juice"…  | `toHaveAccessibleName(/\S/)` on each button                     |
| UI-A11Y-2 | Major    | Radio buttons in the address, delivery and card tables have no accessible name   | each radio named after its row              | 3 radios exist, none is found by `getByRole('radio', {name})`   |
| UI-AUTH-1 | Minor    | A guest who opens `#/order-history` gets an empty history page                   | sent to log in, as with the basket checkout | URL stays on `#/order-history`                                  |
| UI-TXT-1  | Minor    | An address without a State reads `Riga, , LV1050`                                | `Riga, LV1050`                              | address card contains `, ,`                                     |
| UI-TXT-2  | Trivial  | Delivery time "1 Days"                                                           | "1 Day"                                     | ETA cell text                                                   |
| UI-TXT-3  | Trivial  | Order summary label `Card Holder"` (stray quote)                                 | `Card Holder`                               | payment card text                                               |
| UI-TXT-4  | Minor    | Password counter says `13/20`, the field accepts 40 and the hint says 5–40       | `13/40`                                     | `maxlength="40"` vs the counter                                 |

The a11y defects also shaped the Page Objects: where an element has no accessible name, the locator falls back to
an icon or an id, with a comment pointing here. When the defect is fixed, the locator can move to `getByRole`.
