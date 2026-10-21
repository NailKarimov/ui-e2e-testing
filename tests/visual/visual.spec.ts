import { test, expect } from '../../src/fixtures';

const APPLE = 'Apple Juice (1000ml)';
const BANANA = 'Banana Juice (1000ml)';

/**
 * Visual regression: what the customer sees, compared pixel by pixel with an approved baseline. Run with
 * `npm run test:visual`; baselines come from CI's Playwright container so fonts and anti-aliasing match
 * (docs/visual.md). Parts that legitimately change between runs are masked: e-mails, stock ribbons.
 */
test.describe('visual @visual', () => {
  test('login page', async ({ guest }) => {
    await guest.loginPage.open();
    await expect(guest.page).toHaveScreenshot('login.png', { fullPage: true });
  });

  test('registration form with validation errors', async ({ guest }) => {
    const { registerPage, page } = guest;
    await registerPage.open();
    await registerPage.email.fill('not-an-email');
    await registerPage.password.fill('abc');
    await registerPage.repeat.fill('abd');
    await registerPage.repeat.blur();
    await expect(registerPage.errors().first()).toBeVisible();
    await expect(page.locator('mat-card').first()).toHaveScreenshot('register-errors.png');
  });

  test('product card', async ({ guest }) => {
    await guest.products.open();
    const card = guest.products.card(APPLE);
    await expect(card.locator('img')).toHaveJSProperty('complete', true);
    // The ribbon shows the stock, which other tests change by placing orders.
    await expect(card).toHaveScreenshot('product-card.png', { mask: [card.locator('.ribbon')] });
  });

  test('top bar', async ({ guest }) => {
    await guest.products.open();
    await expect(guest.page.locator('mat-toolbar.navbar-toolbar')).toHaveScreenshot('top-bar.png');
  });

  test('empty search result', async ({ guest }) => {
    await guest.products.openSearch('no-such-product-xyz');
    await expect(guest.products.noResults()).toBeVisible();
    await expect(guest.page.locator('mat-card.emptyState')).toHaveScreenshot('no-results.png');
  });

  test('basket with two products', async ({ api, freshUser, shopper }) => {
    await api.addToBasket(freshUser, APPLE, 2);
    await api.addToBasket(freshUser, BANANA, 1);
    await shopper.basket.open();
    await expect(shopper.basket.rows()).toHaveCount(2);
    for (const img of await shopper.page.locator('mat-row img').all())
      await expect(img).toHaveJSProperty('complete', true);
    // The account's e-mail is new every run and its length decides whether the heading wraps, so a mask is not
    // enough: the text is replaced with a fixed one, keeping the real layout around it.
    await shopper.basket.heading
      .locator('small')
      .evaluate((el) => (el.textContent = '(customer@example.test)'));
    await expect(shopper.page.locator('app-basket mat-card').first()).toHaveScreenshot('basket.png');
  });
});
