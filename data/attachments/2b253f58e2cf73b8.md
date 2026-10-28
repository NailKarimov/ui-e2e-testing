# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: defects/known-defects.spec.ts >> known UI defects >> UI-SEC-1: a search term is shown as text, never run as HTML
- Location: tests/defects/known-defects.spec.ts:9:7

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('#searchValue')
Expected: "<img src=x onerror=\"window.__xssProbe=1\">"
Received: ""
Timeout:  7000ms

Call log:
  - Expect "toHaveText" locator('#searchValue') with timeout 7000ms
  - waiting for locator('#searchValue')
    17 × locator resolved to <span id="searchValue" _ngcontent-ng-c1161564479="">…</span>
       - unexpected value ""

```

```yaml
- img
```

# Test source

```ts
  1   | import { test, expect, type Pages } from '../../src/fixtures';
  2   | import { TEST_ADDRESS, TEST_CARD, type Account, type ShopApi } from '../../src/api/ShopApi';
  3   | import { knownDefect } from '../../src/known-defects';
  4   | 
  5   | const APPLE = 'Apple Juice (1000ml)';
  6   | 
  7   | /** Each test asserts the correct behaviour; see src/known-defects.ts for how test.fail() is used. */
  8   | test.describe('known UI defects', () => {
  9   |   test('UI-SEC-1: a search term is shown as text, never run as HTML', async ({ guest }) => {
  10  |     knownDefect('UI-SEC-1');
  11  |     // A harmless probe: if the term is parsed as HTML, the broken image's onerror sets a flag.
  12  |     const probe = '<img src=x onerror="window.__xssProbe=1">';
  13  |     await guest.products.openSearch(probe);
> 14  |     await expect(guest.page.locator('#searchValue')).toHaveText(probe);
      |                                                      ^ Error: expect(locator).toHaveText(expected) failed
  15  |     expect(
  16  |       await guest.page.evaluate(() => (window as unknown as { __xssProbe?: number }).__xssProbe),
  17  |     ).toBeUndefined();
  18  |   });
  19  | 
  20  |   test('UI-A11Y-1: every basket row button has an accessible name', async ({ ui, api, user }) => {
  21  |     knownDefect('UI-A11Y-1');
  22  |     await api.addToBasket(user, APPLE);
  23  |     await ui.basket.open();
  24  |     const buttons = ui.basket.row(APPLE).getByRole('button');
  25  |     await expect(buttons).toHaveCount(3);
  26  |     for (const b of await buttons.all()) await expect(b).toHaveAccessibleName(/\S/);
  27  |   });
  28  | 
  29  |   test('UI-A11Y-2: delivery radio buttons are named after their option', async ({
  30  |     api,
  31  |     freshUser,
  32  |     shopper,
  33  |   }) => {
  34  |     knownDefect('UI-A11Y-2');
  35  |     await api.addToBasket(freshUser, APPLE);
  36  |     await api.addAddress(freshUser);
  37  |     await shopper.basket.open();
  38  |     await shopper.basket.proceedToCheckout();
  39  |     await shopper.address.choose(TEST_ADDRESS.fullName);
  40  |     await expect(shopper.page.getByRole('radio')).toHaveCount(3); // the radios are there...
  41  |     await expect(shopper.page.getByRole('radio', { name: /Fast Delivery/ })).toBeVisible(); // ...but nameless
  42  |   });
  43  | 
  44  |   /** Basket, address (State left empty, as many countries have none) and card over the API, then to the summary. */
  45  |   async function toSummary({
  46  |     api,
  47  |     freshUser,
  48  |     shopper,
  49  |   }: {
  50  |     api: ShopApi;
  51  |     freshUser: Account;
  52  |     shopper: Pages;
  53  |   }) {
  54  |     await api.addToBasket(freshUser, APPLE);
  55  |     await api.addAddress(freshUser);
  56  |     await api.addCard(freshUser);
  57  |     await shopper.basket.open();
  58  |     await shopper.basket.proceedToCheckout();
  59  |     await shopper.address.choose(TEST_ADDRESS.fullName);
  60  |     await shopper.delivery.choose('Standard Delivery');
  61  |     await shopper.payment.choose(TEST_CARD.number.slice(-4));
  62  |   }
  63  | 
  64  |   test('UI-TXT-1: an address without a State has no empty slot', async ({ api, freshUser, shopper }) => {
  65  |     knownDefect('UI-TXT-1');
  66  |     await toSummary({ api, freshUser, shopper });
  67  |     await expect(shopper.summary.card('Delivery Address')).toContainText(TEST_ADDRESS.city);
  68  |     await expect(shopper.summary.card('Delivery Address')).not.toContainText(', ,');
  69  |   });
  70  | 
  71  |   test('UI-TXT-3: the card holder label is clean', async ({ api, freshUser, shopper }) => {
  72  |     knownDefect('UI-TXT-3');
  73  |     await toSummary({ api, freshUser, shopper });
  74  |     await expect(shopper.summary.card('Payment Method')).toContainText(`Card Holder ${TEST_CARD.name}`);
  75  |   });
  76  | 
  77  |   test('UI-TXT-2: a one-day delivery says "1 Day"', async ({ api, freshUser, shopper }) => {
  78  |     knownDefect('UI-TXT-2');
  79  |     await api.addToBasket(freshUser, APPLE);
  80  |     await api.addAddress(freshUser);
  81  |     await shopper.basket.open();
  82  |     await shopper.basket.proceedToCheckout();
  83  |     await shopper.address.choose(TEST_ADDRESS.fullName);
  84  |     await expect(shopper.delivery.eta('One Day Delivery')).toHaveText('1 Day');
  85  |   });
  86  | 
  87  |   test('UI-TXT-4: the password counter shows the real limit of 40', async ({ guest }) => {
  88  |     knownDefect('UI-TXT-4');
  89  |     await guest.registerPage.open();
  90  |     await expect(guest.registerPage.password).toHaveAttribute('maxlength', '40');
  91  |     await guest.registerPage.password.fill('Qa-test-pass1');
  92  |     await expect(guest.page.locator('mat-hint').filter({ hasText: '13/' }).first()).toHaveText('13/40');
  93  |   });
  94  | 
  95  |   test('UI-AUTH-1: a guest who opens the order history is sent to log in', async ({ guest }) => {
  96  |     knownDefect('UI-AUTH-1');
  97  |     await guest.history.open();
  98  |     await expect(guest.page).toHaveURL(/#\/login/);
  99  |   });
  100 | });
  101 | 
```