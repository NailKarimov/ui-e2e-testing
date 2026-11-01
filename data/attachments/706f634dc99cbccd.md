# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y/reflow.spec.ts >> reflow at 320 px (WCAG 1.4.10) >> UI-A11Y-14: the product list fits without sideways scrolling
- Location: tests/a11y/reflow.spec.ts:48:7

# Error details

```
Error: elements wider than the screen:
<main class="container"> right edge 344 px
<div class="heading mat-elevation-z6 mat-headline-sm"> right edge 344 px
<div class=""> right edge 324 px
<div class=""> right edge 324 px
<div class="products-grid"> right edge 344 px

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 7

- Array []
+ Array [
+   "<main class=\"container\"> right edge 344 px",
+   "<div class=\"heading mat-elevation-z6 mat-headline-sm\"> right edge 344 px",
+   "<div class=\"\"> right edge 324 px",
+   "<div class=\"\"> right edge 324 px",
+   "<div class=\"products-grid\"> right edge 344 px",
+ ]
```

# Page snapshot

```yaml
- generic [active]:
  - generic [ref=e4]:
    - generic [ref=e7]:
      - button "Open Sidenav" [ref=e8] [cursor=pointer]:
        - img [aria-hidden] [ref=e9]: menu
      - button "Back to homepage" [ref=e12]:
        - img "OWASP Juice Shop" [ref=e15]
      - generic "Click to search" [ref=e19]:
        - button "Open search" [ref=e20] [cursor=pointer]:
          - img [aria-hidden] [ref=e21]: search
        - generic:
          - img [aria-hidden] [ref=e24]: search
          - textbox [ref=e25]
          - button "Close search" [ref=e26] [cursor=pointer]:
            - img [aria-hidden] [ref=e27]: close
      - generic [ref=e30]:
        - button "Show the shopping cart" [ref=e31]:
          - img [aria-hidden] [ref=e32]: shopping_cart
          - generic: "0"
        - button "Language selection menu" [ref=e36]:
          - img [aria-hidden] [ref=e37]: language
    - main [ref=e41]:
      - generic [ref=e42]: All Products
      - generic [ref=e44]:
        - article [ref=e47]:
          - button "Click for more information about the product" [ref=e48]:
            - img "Apple Juice (1000ml)" [ref=e52] [cursor=pointer]
            - generic [ref=e53]: Apple Juice (1000ml)
          - generic [ref=e55]:
            - generic [ref=e56]: 1.99¤
            - button "Add to Basket" [ref=e57]:
              - img [aria-hidden] [ref=e58]: add_shopping_cart
        - article [ref=e64]:
          - button "Click for more information about the product" [ref=e65]:
            - img "Apple Pomace" [ref=e69] [cursor=pointer]
            - generic [ref=e70]: Apple Pomace
          - generic [ref=e72]:
            - generic [ref=e73]: 0.89¤
            - button "Add to Basket" [ref=e74]:
              - img [aria-hidden] [ref=e75]: add_shopping_cart
        - article [ref=e81]:
          - button "Click for more information about the product" [ref=e82]:
            - img "Banana Juice (1000ml)" [ref=e86] [cursor=pointer]
            - generic [ref=e87]: Banana Juice (1000ml)
          - generic [ref=e89]:
            - generic [ref=e90]: 1.99¤
            - button "Add to Basket" [ref=e91]:
              - img [aria-hidden] [ref=e92]: add_shopping_cart
        - article [ref=e98]:
          - button "Click for more information about the product" [ref=e99]:
            - img "Basil Smoothie" [ref=e103] [cursor=pointer]
            - generic [ref=e104]: Basil Smoothie
          - generic [ref=e106]:
            - generic [ref=e107]: 2.99¤
            - button "Add to Basket" [ref=e108]:
              - img [aria-hidden] [ref=e109]: add_shopping_cart
        - article [ref=e115]:
          - button "Click for more information about the product" [ref=e116]:
            - img "Berry Juice (1000ml)" [ref=e120] [cursor=pointer]
            - generic [ref=e121]: Berry Juice (1000ml)
          - generic [ref=e123]:
            - generic [ref=e124]: 3.49¤
            - button "Add to Basket" [ref=e125]:
              - img [aria-hidden] [ref=e126]: add_shopping_cart
        - article [ref=e132]:
          - complementary [ref=e133]: Only 1 left
          - button "Click for more information about the product" [ref=e134]:
            - img "Best Juice Shop Salesman Artwork" [ref=e138] [cursor=pointer]
            - generic [ref=e139]: Best Juice Shop Salesman Artwork
          - generic [ref=e141]:
            - generic [ref=e142]: 5000¤
            - button "Add to Basket" [ref=e143]:
              - img [aria-hidden] [ref=e144]: add_shopping_cart
        - article [ref=e150]:
          - button "Click for more information about the product" [ref=e151]:
            - img "Bragă (500ml)" [ref=e155] [cursor=pointer]
            - generic [ref=e156]: Bragă (500ml)
          - generic [ref=e158]:
            - generic [ref=e159]: 2.49¤
            - button "Add to Basket" [ref=e160]:
              - img [aria-hidden] [ref=e161]: add_shopping_cart
        - article [ref=e167]:
          - button "Click for more information about the product" [ref=e168]:
            - img "Carrot Juice (1000ml)" [ref=e172] [cursor=pointer]
            - generic [ref=e173]: Carrot Juice (1000ml)
          - generic [ref=e175]:
            - generic [ref=e176]: 2.99¤
            - button "Add to Basket" [ref=e177]:
              - img [aria-hidden] [ref=e178]: add_shopping_cart
        - article [ref=e184]:
          - button "Click for more information about the product" [ref=e185]:
            - img "Dragonfruit Juice (500ml)" [ref=e189] [cursor=pointer]
            - generic [ref=e190]: Dragonfruit Juice (500ml)
          - generic [ref=e192]:
            - generic [ref=e193]: 3.99¤
            - button "Add to Basket" [ref=e194]:
              - img [aria-hidden] [ref=e195]: add_shopping_cart
        - article [ref=e201]:
          - button "Click for more information about the product" [ref=e202]:
            - img "Eggfruit Juice (500ml)" [ref=e206] [cursor=pointer]
            - generic [ref=e207]: Eggfruit Juice (500ml)
          - generic [ref=e209]:
            - generic [ref=e210]: 8.99¤
            - button "Add to Basket" [ref=e211]:
              - img [aria-hidden] [ref=e212]: add_shopping_cart
        - article [ref=e218]:
          - button "Click for more information about the product" [ref=e219]:
            - img "Elderflower Cordial (500ml)" [ref=e223] [cursor=pointer]
            - generic [ref=e224]: Elderflower Cordial (500ml)
          - generic [ref=e226]:
            - generic [ref=e227]: 3.29¤
            - button "Add to Basket" [ref=e228]:
              - img [aria-hidden] [ref=e229]: add_shopping_cart
        - article [ref=e235]:
          - button "Click for more information about the product" [ref=e236]:
            - img "Fruit Press" [ref=e240] [cursor=pointer]
            - generic [ref=e241]: Fruit Press
          - generic [ref=e243]:
            - generic [ref=e244]: 89.99¤
            - button "Add to Basket" [ref=e245]:
              - img [aria-hidden] [ref=e246]: add_shopping_cart
        - article [ref=e252]:
          - button "Click for more information about the product" [ref=e253]:
            - img "Grape Juice (1000ml)" [ref=e257] [cursor=pointer]
            - generic [ref=e258]: Grape Juice (1000ml)
          - generic [ref=e260]:
            - generic [ref=e261]: 2.99¤
            - button "Add to Basket" [ref=e262]:
              - img [aria-hidden] [ref=e263]: add_shopping_cart
        - article [ref=e269]:
          - button "Click for more information about the product" [ref=e270]:
            - img "Green Smoothie" [ref=e274] [cursor=pointer]
            - generic [ref=e275]: Green Smoothie
          - generic [ref=e277]:
            - generic [ref=e278]: 1.99¤
            - button "Add to Basket" [ref=e279]:
              - img [aria-hidden] [ref=e280]: add_shopping_cart
        - article [ref=e286]:
          - complementary [ref=e287]: Only 1 left
          - button "Click for more information about the product" [ref=e288]:
            - img "Juice Shop \"Permafrost\" 2020 Edition" [ref=e292] [cursor=pointer]
            - generic [ref=e293]: Juice Shop "Permafrost" 2020 Edition
          - generic [ref=e295]:
            - generic [ref=e296]: 9999.99¤
            - button "Add to Basket" [ref=e297]:
              - img [aria-hidden] [ref=e298]: add_shopping_cart
      - group [ref=e302]:
        - generic [ref=e304]:
          - generic [ref=e305]:
            - generic [aria-hidden] [ref=e306]: "Items per page:"
            - combobox "Items per page:" [ref=e311] [cursor=pointer]:
              - generic [ref=e312]: "15"
          - generic [ref=e320]:
            - status [ref=e321]: 1 – 15 of 46
            - button "Previous page" [disabled] [ref=e322]
            - button "Next page" [ref=e327] [cursor=pointer]
  - generic [ref=e339]:
    - generic [ref=e340]: Language has been changed to English
    - button "Force page reload" [ref=e342]
```

# Test source

```ts
  1  | import { test, expect } from '../../src/fixtures';
  2  | import { knownDefect } from '../../src/known-defects';
  3  | 
  4  | /**
  5  |  * WCAG 1.4.10 Reflow: at 320 CSS px wide (a 1280 px screen zoomed to 400 %) content must fit without scrolling
  6  |  * sideways. Juice Shop scrolls inside its content area, not the page, so the check is on that element, and on
  7  |  * every element that pokes out of it.
  8  |  */
  9  | test.use({ viewport: { width: 320, height: 640 } });
  10 | 
  11 | async function overflow(page: import('@playwright/test').Page) {
  12 |   return page.evaluate(() => {
  13 |     const area = document.querySelector('mat-sidenav-content') as HTMLElement;
  14 |     const sticking = [...area.querySelectorAll<HTMLElement>('*')]
  15 |       .filter(
  16 |         (e) =>
  17 |           getComputedStyle(e).visibility !== 'hidden' &&
  18 |           e.getBoundingClientRect().right > area.clientWidth + 1,
  19 |       )
  20 |       // Carousels and tables scroll on purpose inside their own box; WCAG allows that for 2-D content.
  21 |       .filter((e) => !e.closest('gallery, .g-slider, mat-table'))
  22 |       .map(
  23 |         (e) =>
  24 |           `<${e.tagName.toLowerCase()} class="${String(e.className).slice(0, 40)}"> right edge ${Math.round(e.getBoundingClientRect().right)} px`,
  25 |       );
  26 |     return { scroll: area.scrollWidth - area.clientWidth, sticking: sticking.slice(0, 5) };
  27 |   });
  28 | }
  29 | 
  30 | const pages = [
  31 |   { name: 'login', path: '/#/login', ready: '#email' },
  32 |   { name: 'registration', path: '/#/register', ready: '#emailControl' },
  33 |   { name: 'contact', path: '/#/contact', ready: '#rating' },
  34 |   { name: 'about us', path: '/#/about', ready: 'gallery' },
  35 | ];
  36 | 
  37 | test.describe('reflow at 320 px (WCAG 1.4.10)', () => {
  38 |   for (const p of pages) {
  39 |     test(`${p.name} fits without sideways scrolling`, async ({ guest }) => {
  40 |       await guest.page.goto(p.path);
  41 |       await expect(guest.page.locator(p.ready).first()).toBeVisible();
  42 |       const r = await overflow(guest.page);
  43 |       expect(r.sticking, `elements wider than the screen:\n${r.sticking.join('\n')}`).toEqual([]);
  44 |       expect(r.scroll).toBeLessThanOrEqual(1);
  45 |     });
  46 |   }
  47 | 
  48 |   test('UI-A11Y-14: the product list fits without sideways scrolling', async ({ guest }) => {
  49 |     knownDefect('UI-A11Y-14');
  50 |     await guest.products.open();
  51 |     const r = await overflow(guest.page);
> 52 |     expect(r.sticking, `elements wider than the screen:\n${r.sticking.join('\n')}`).toEqual([]);
     |                                                                                     ^ Error: elements wider than the screen:
  53 |     expect(r.scroll).toBeLessThanOrEqual(1);
  54 |   });
  55 | });
  56 | 
```