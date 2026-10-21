# Visual regression

Functional tests check that the Checkout button works; they don't notice it moved 4 px, lost its rounded corners
or turned grey. Visual tests compare what the customer sees with an approved picture, pixel by pixel.

## What is compared

`tests/visual/visual.spec.ts`, tagged `@visual`, on desktop Chromium and Pixel 7 (two layouts, 12 pictures):

| Screen                                    | Shot                        | What changes between runs, and how it is handled       |
| ----------------------------------------- | --------------------------- | ------------------------------------------------------ |
| Login                                     | full page                   | nothing                                                |
| Registration with three validation errors | the form card               | nothing: fixed invalid input                           |
| Product card "Apple Juice"                | the card                    | the stock ribbon is **masked**: other tests buy juice  |
| Top bar                                   | the toolbar                 | nothing                                                |
| Empty search result                       | the "No results found" card | nothing                                                |
| Basket with two products                  | the basket card             | the account's e-mail is **replaced** with a fixed text |

The basket shows why a mask is sometimes not enough: the new account's e-mail differs in length every run, and a
long one wraps the heading onto two lines, which moves everything below it. Masking hides the text but not the
wrap. Writing a fixed `(customer@example.test)` into the element keeps the real layout and makes it repeatable.

Settings in `playwright.config.ts`: animations stopped, caret hidden, `config/screenshot.css` hides notices that
appear by timing (snack bars, the game's "challenge solved" banners). The tolerance is
`maxDiffPixelRatio: 0.001` (0.1 % of pixels, enough for anti-aliasing, not for a moved button) with a per-pixel
colour threshold of 0.2.

## Where the baselines come from

A screenshot depends on the operating system, fonts and GPU. A baseline made on a laptop fails in CI and the other
way round. So baselines are made in **one place only**: the CI job `visual`, which runs inside Playwright's own
Docker image `mcr.microsoft.com/playwright:v1.64.1-noble` with Juice Shop as a service container.

- **First run, or a new screenshot added:** `--update-snapshots=missing` writes the missing picture and the job
  commits it to `tests/__screenshots__/` ("Visual baselines from CI"). Nothing is approved by accident: only
  pictures that did not exist are written.
- **A screen changed:** the job fails, and the artifact `visual-diffs` has the expected, actual and diff images.
  If the change is a bug, fix the shop. If it is intended, approve it: Actions → Tests → Run workflow →
  "Approve the current screens as the new visual baselines". That run uses `--update-snapshots=all` and commits.
- Locally, `npm run test:visual` against the committed baselines only makes sense in the same image:
  `docker run --rm --network host -v $PWD:/work -w /work mcr.microsoft.com/playwright:v1.64.1-noble npm run test:visual`.

## Does it catch anything? (mutation check)

Planted with `scripts/mutants.mjs` (CSS appended to the shop's `styles.css`), one at a time:

| Id  | Planted change                             | Caught by                                                              |
| --- | ------------------------------------------ | ---------------------------------------------------------------------- |
| M9  | Checkout button 4 px lower, square corners | visual: basket                                                         |
| M10 | Product prices in a lighter grey           | visual: product card, and axe: new colour-contrast on the product list |

M10 first **passed** the visual test. The tolerance was `maxDiffPixelRatio: 0.001`: 0.1 % of the card is 161
pixels, and a recoloured "1.99¤" changes about 150 pixels above the colour threshold. A ratio grows with the size
of the shot (0.1 % of a full page is ~900 px, larger than a whole price label), so the tolerance is now a fixed
budget, `maxDiffPixels: 10`, with a stricter colour threshold of 0.1. Three runs in a row stayed identical, so the
tight budget costs no flakiness.

## Running it

```bash
npm run test:visual           # compare
npm run test:visual:update    # approve the current screens (in the Playwright image)
```
