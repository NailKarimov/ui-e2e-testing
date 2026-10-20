import { test, expect, type Pages } from '../../src/fixtures';
import { TEST_ADDRESS, TEST_CARD, type Account, type ShopApi } from '../../src/api/ShopApi';
import { knownDefect } from '../../src/known-defects';

const APPLE = 'Apple Juice (1000ml)';

/** Each test asserts the correct behaviour; see src/known-defects.ts for how test.fail() is used. */
test.describe('known UI defects', () => {
  test('UI-SEC-1: a search term is shown as text, never run as HTML', async ({ guest }) => {
    knownDefect('UI-SEC-1');
    // A harmless probe: if the term is parsed as HTML, the broken image's onerror sets a flag.
    const probe = '<img src=x onerror="window.__xssProbe=1">';
    await guest.products.openSearch(probe);
    await expect(guest.page.locator('#searchValue')).toHaveText(probe);
    expect(
      await guest.page.evaluate(() => (window as unknown as { __xssProbe?: number }).__xssProbe),
    ).toBeUndefined();
  });

  test('UI-A11Y-1: every basket row button has an accessible name', async ({ ui, api, user }) => {
    knownDefect('UI-A11Y-1');
    await api.addToBasket(user, APPLE);
    await ui.basket.open();
    const buttons = ui.basket.row(APPLE).getByRole('button');
    await expect(buttons).toHaveCount(3);
    for (const b of await buttons.all()) await expect(b).toHaveAccessibleName(/\S/);
  });

  test('UI-A11Y-2: delivery radio buttons are named after their option', async ({
    api,
    freshUser,
    shopper,
  }) => {
    knownDefect('UI-A11Y-2');
    await api.addToBasket(freshUser, APPLE);
    await api.addAddress(freshUser);
    await shopper.basket.open();
    await shopper.basket.proceedToCheckout();
    await shopper.address.choose(TEST_ADDRESS.fullName);
    await expect(shopper.page.getByRole('radio')).toHaveCount(3); // the radios are there...
    await expect(shopper.page.getByRole('radio', { name: /Fast Delivery/ })).toBeVisible(); // ...but nameless
  });

  /** Basket, address (State left empty, as many countries have none) and card over the API, then to the summary. */
  async function toSummary({
    api,
    freshUser,
    shopper,
  }: {
    api: ShopApi;
    freshUser: Account;
    shopper: Pages;
  }) {
    await api.addToBasket(freshUser, APPLE);
    await api.addAddress(freshUser);
    await api.addCard(freshUser);
    await shopper.basket.open();
    await shopper.basket.proceedToCheckout();
    await shopper.address.choose(TEST_ADDRESS.fullName);
    await shopper.delivery.choose('Standard Delivery');
    await shopper.payment.choose(TEST_CARD.number.slice(-4));
  }

  test('UI-TXT-1: an address without a State has no empty slot', async ({ api, freshUser, shopper }) => {
    knownDefect('UI-TXT-1');
    await toSummary({ api, freshUser, shopper });
    await expect(shopper.summary.card('Delivery Address')).toContainText(TEST_ADDRESS.city);
    await expect(shopper.summary.card('Delivery Address')).not.toContainText(', ,');
  });

  test('UI-TXT-3: the card holder label is clean', async ({ api, freshUser, shopper }) => {
    knownDefect('UI-TXT-3');
    await toSummary({ api, freshUser, shopper });
    await expect(shopper.summary.card('Payment Method')).toContainText(`Card Holder ${TEST_CARD.name}`);
  });

  test('UI-TXT-2: a one-day delivery says "1 Day"', async ({ api, freshUser, shopper }) => {
    knownDefect('UI-TXT-2');
    await api.addToBasket(freshUser, APPLE);
    await api.addAddress(freshUser);
    await shopper.basket.open();
    await shopper.basket.proceedToCheckout();
    await shopper.address.choose(TEST_ADDRESS.fullName);
    await expect(shopper.delivery.eta('One Day Delivery')).toHaveText('1 Day');
  });

  test('UI-TXT-4: the password counter shows the real limit of 40', async ({ guest }) => {
    knownDefect('UI-TXT-4');
    await guest.registerPage.open();
    await expect(guest.registerPage.password).toHaveAttribute('maxlength', '40');
    await guest.registerPage.password.fill('Qa-test-pass1');
    await expect(guest.page.locator('mat-hint').filter({ hasText: '13/' }).first()).toHaveText('13/40');
  });

  test('UI-AUTH-1: a guest who opens the order history is sent to log in', async ({ guest }) => {
    knownDefect('UI-AUTH-1');
    await guest.history.open();
    await expect(guest.page).toHaveURL(/#\/login/);
  });
});
