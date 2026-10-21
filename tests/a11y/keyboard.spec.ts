import { test, expect } from '../../src/fixtures';
import { TEST_ADDRESS, TEST_CARD } from '../../src/api/ShopApi';
import { focusShots, tabTo } from '../../src/keyboard';

const APPLE = 'Apple Juice (1000ml)';

/** WCAG 2.1.1 Keyboard, 2.4.3 Focus Order, 2.4.7 Focus Visible: the shop without a mouse. */
test.describe('keyboard only', () => {
  test('log in with the keyboard: Tab to the fields, type, Enter', async ({ guest, user }) => {
    const { page, loginPage, nav } = guest;
    await loginPage.open();
    await page.locator('body').focus();
    await tabTo(page, loginPage.email);
    await page.keyboard.type(user.email);
    await page.keyboard.press('Tab');
    await expect(loginPage.password).toBeFocused();
    await page.keyboard.type(user.password);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#\/search/);
    await nav.expectSignedInAs(user.email);
  });

  test('every stop in the top bar shows where the focus is', async ({ guest }) => {
    await guest.products.open();
    const shots = await focusShots(guest.page, 6, guest.products.cards().first());
    const report = shots
      .map((s, i) => `${i + 1}. ${s.label} ${s.changed ? '✓' : '✗ looks the same focused and unfocused'}`)
      .join('\n');
    await test.info().attach('focus visible', { body: report, contentType: 'text/plain' });
    expect(shots).toHaveLength(6);
    expect(
      shots.filter((s) => !s.changed).map((s) => s.label),
      report,
    ).toEqual([]);
  });

  test('change a quantity in the basket from the keyboard', async ({ ui, api, user }) => {
    await api.addToBasket(user, APPLE);
    await ui.basket.open();
    const plus = ui.basket.row(APPLE).locator('button:has(.fa-plus-square)');
    await ui.page.locator('body').focus();
    await tabTo(ui.page, plus);
    await ui.page.keyboard.press('Enter');
    await expect(ui.basket.quantity(APPLE)).toHaveText('2');
  });

  test('check out from basket to confirmation without a mouse', async ({ api, freshUser, shopper }) => {
    const { page, basket, address, delivery, payment, summary, completion } = shopper;
    await api.addToBasket(freshUser, APPLE);
    await api.addAddress(freshUser);
    await api.addCard(freshUser);
    await basket.open();
    await page.locator('body').focus();

    await tabTo(page, basket.checkout);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#\/address\/select/);

    await tabTo(page, address.rows().filter({ hasText: TEST_ADDRESS.fullName }).getByRole('radio'));
    await page.keyboard.press('Space');
    await tabTo(page, address.proceed);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#\/delivery-method/); // Tab on the old page would go nowhere

    await tabTo(page, delivery.rows().filter({ hasText: 'Standard Delivery' }).getByRole('radio'));
    await page.keyboard.press('Space');
    await tabTo(page, delivery.proceed);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#\/payment\/shop/);

    await tabTo(page, payment.card(TEST_CARD.number.slice(-4)).getByRole('radio'));
    await page.keyboard.press('Space');
    await tabTo(page, payment.proceed);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#\/order-summary/);

    await tabTo(page, summary.place);
    await page.keyboard.press('Enter');
    await expect(completion.thanks).toBeVisible();
  });

  test('Escape closes the account menu and gives the focus back to its button', async ({ guest }) => {
    await guest.products.open();
    test.skip(!(await guest.nav.accountButton.isVisible()), 'phones have no account menu in the top bar');
    await guest.nav.accountButton.focus();
    await guest.page.keyboard.press('Enter');
    await expect(guest.page.getByRole('menu')).toBeVisible();
    await guest.page.keyboard.press('Escape');
    await expect(guest.page.getByRole('menu')).toBeHidden();
    await expect(guest.nav.accountButton).toBeFocused();
  });
});
