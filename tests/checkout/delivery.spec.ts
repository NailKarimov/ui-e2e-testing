import { test, expect } from '../../src/fixtures';
import { TEST_ADDRESS, TEST_CARD } from '../../src/api/ShopApi';

const APPLE = 'Apple Juice (1000ml)';

/**
 * Checkout once per delivery option. Basket, address and card are prepared over the API (fast); the UI is
 * checked where the money is: the delivery list and the order summary must agree with the shop's own prices.
 */
test.describe('checkout: delivery options', () => {
  test("the delivery page offers exactly the shop's delivery methods and prices", async ({
    api,
    freshUser,
    shopper,
  }) => {
    await api.addToBasket(freshUser, APPLE);
    await api.addAddress(freshUser);
    await shopper.basket.open();
    await shopper.basket.proceedToCheckout();
    await shopper.address.choose(TEST_ADDRESS.fullName);
    const shown = await shopper.delivery.options();
    const expected = (await api.deliveries()).map(({ name, price }) => ({ name, price }));
    expect(shown).toEqual(expected);
  });

  for (const method of ['One Day Delivery', 'Fast Delivery', 'Standard Delivery']) {
    test(`${method}: summary total = items + delivery`, async ({ api, freshUser, shopper }) => {
      const apple = await api.product(APPLE);
      const delivery = (await api.deliveries()).find((d) => d.name === method)!;
      await api.addToBasket(freshUser, APPLE, 2);
      await api.addAddress(freshUser);
      await api.addCard(freshUser);

      await shopper.basket.open();
      await shopper.basket.proceedToCheckout();
      await shopper.address.choose(TEST_ADDRESS.fullName);
      await shopper.delivery.choose(method);
      await shopper.payment.choose(TEST_CARD.number.slice(-4));

      await shopper.summary.expectAmount('Items', 2 * apple.price);
      await shopper.summary.expectAmount('Delivery', delivery.price);
      await shopper.summary.expectAmount('Total Price', 2 * apple.price + delivery.price);
      await expect(shopper.summary.card('Delivery Address')).toContainText(TEST_ADDRESS.fullName);
      await expect(shopper.summary.card('Payment Method')).toContainText(TEST_CARD.number.slice(-4));
    });
  }

  test('without a chosen address the next step stays disabled', async ({ api, freshUser, shopper }) => {
    await api.addToBasket(freshUser, APPLE);
    await api.addAddress(freshUser);
    await shopper.basket.open();
    await shopper.basket.proceedToCheckout();
    await expect(shopper.address.rows()).toHaveCount(1);
    await expect(shopper.address.proceed).toBeDisabled();
  });
});
