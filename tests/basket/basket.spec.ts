import { test, expect } from '../../src/fixtures';

const APPLE = 'Apple Juice (1000ml)';
const BANANA = 'Banana Juice (1000ml)';

// Tests that use the worker's `user` start with an empty basket (the fixture empties it), so they can run in any order.
test.describe('basket', () => {
  test('adding from the product list updates the counter and the basket @smoke', async ({ ui, api }) => {
    const apple = await api.product(APPLE);
    await ui.products.open();
    await expect(ui.nav.basketCount()).toHaveText('0');
    await ui.products.addToBasket(APPLE);
    await expect(ui.nav.basketCount()).toHaveText('1');
    await ui.nav.openBasket();
    await expect(ui.basket.rows()).toHaveCount(1);
    await expect(ui.basket.quantity(APPLE)).toHaveText('1');
    await ui.basket.expectTotal(apple.price);
  });

  test('+ and − change the quantity by one and the total with it; − stops at 1', async ({
    ui,
    api,
    user,
  }) => {
    // Starts from 2, not 1: from 1, a "−" that took away 2 would still land on the floor of 1 and look right
    // (planted bug M6 survived the first version of this test).
    const apple = await api.product(APPLE);
    await api.addToBasket(user, APPLE, 2);
    await ui.basket.open();

    await ui.basket.increase(APPLE);
    await expect(ui.basket.quantity(APPLE)).toHaveText('3');
    await ui.basket.expectTotal(3 * apple.price);

    await ui.basket.decrease(APPLE);
    await expect(ui.basket.quantity(APPLE)).toHaveText('2');
    await ui.basket.expectTotal(2 * apple.price);
    await ui.basket.decrease(APPLE);
    await expect(ui.basket.quantity(APPLE)).toHaveText('1');
    await ui.basket.decrease(APPLE);
    await expect(ui.basket.quantity(APPLE)).toHaveText('1'); // removing is a separate action
    await ui.basket.expectTotal(apple.price);
    expect((await api.basket(user))[0].quantity).toBe(1);
  });

  test('removing the last item empties the basket and disables checkout', async ({ ui, api, user }) => {
    await api.addToBasket(user, APPLE);
    await ui.basket.open();
    await expect(ui.basket.checkout).toBeEnabled();
    await ui.basket.remove(APPLE);
    await expect(ui.basket.rows()).toHaveCount(0);
    await ui.basket.expectTotal(0);
    await expect(ui.basket.checkout).toBeDisabled();
    await expect(ui.nav.basketCount()).toHaveText('0');
  });

  test('the total is the sum of price × quantity over all rows', async ({ ui, api, user }) => {
    const [apple, banana] = [await api.product(APPLE), await api.product(BANANA)];
    await api.addToBasket(user, APPLE, 3);
    await api.addToBasket(user, BANANA, 2);
    await ui.basket.open();
    await expect(ui.basket.rows()).toHaveCount(2);
    await ui.basket.expectTotal(3 * apple.price + 2 * banana.price);
  });

  test('the basket survives a reload and a new tab', async ({ ui, api, user, userPage }) => {
    await api.addToBasket(user, BANANA, 2);
    await ui.basket.open();
    await expect(ui.basket.quantity(BANANA)).toHaveText('2');
    await userPage.reload();
    await expect(ui.basket.quantity(BANANA)).toHaveText('2');
    const tab = await userPage.context().newPage();
    await tab.goto('/#/basket');
    await expect(tab.locator('mat-row').filter({ hasText: BANANA })).toBeVisible();
  });

  test("one customer's basket is not visible to another", async ({ api, freshUser, pageAs }) => {
    const other = await api.register();
    await api.addToBasket(freshUser, APPLE);
    const mine = await pageAs(freshUser);
    const theirs = await pageAs(other);
    await mine.goto('/#/basket');
    await theirs.goto('/#/basket');
    await expect(mine.locator('mat-row').filter({ hasText: APPLE })).toBeVisible();
    await expect(theirs.getByRole('heading', { name: new RegExp(other.email) })).toBeVisible();
    await expect(theirs.locator('mat-row')).toHaveCount(0);
  });

  test('a guest basket is kept and merged into the account at login', async ({ guest, api, freshUser }) => {
    // A fresh account, not the worker's `user`: the guest page does not go through the fixture that empties
    // the worker user's basket, so items left by earlier tests would be merged in too.
    await guest.products.openSearch('juice');
    await guest.products.addToBasket(APPLE);
    await guest.products.addToBasket(BANANA);
    await expect(guest.nav.basketCount()).toHaveText('2');
    await guest.basket.open();
    await expect(guest.basket.rows()).toHaveCount(2);

    await guest.loginPage.open();
    await guest.loginPage.loginAs(freshUser);
    await guest.basket.open();
    await expect(guest.basket.heading).toContainText(freshUser.email);
    await expect(guest.basket.quantity(APPLE)).toHaveText('1');
    await expect(guest.basket.quantity(BANANA)).toHaveText('1');
    expect((await api.basket(freshUser)).map((i) => i.name).sort()).toEqual([APPLE, BANANA]);
  });
});
