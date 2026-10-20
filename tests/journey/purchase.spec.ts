import { test, expect } from '../../src/fixtures';
import { TEST_ADDRESS, TEST_CARD } from '../../src/api/ShopApi';

/**
 * The main user journey, end to end through the UI: find products, fill the basket, add an address and a card,
 * pick a delivery, pay, and find the order in the history. Prices are not hard-coded: the API's product and
 * delivery prices are the oracle for every total the UI shows.
 */
test('a new customer buys two products and sees the order in the history @smoke', async ({
  api,
  freshUser,
  shopper,
}) => {
  const { nav, products, basket, address, delivery, payment, summary, completion, history } = shopper;
  const apple = await api.product('Apple Juice (1000ml)');
  const banana = await api.product('Banana Juice (1000ml)');

  await test.step('find and add products', async () => {
    await products.open();
    await nav.search('juice');
    await products.addToBasket(apple.name);
    await products.addToBasket(apple.name);
    await products.addToBasket(banana.name);
    await expect(nav.basketCount()).toHaveText('3');
  });

  const items = 2 * apple.price + banana.price;

  await test.step('basket shows quantities and the total', async () => {
    await nav.openBasket();
    await expect(basket.quantity(apple.name)).toHaveText('2');
    await expect(basket.quantity(banana.name)).toHaveText('1');
    await basket.expectTotal(items);
    await basket.proceedToCheckout();
  });

  await test.step('add an address', async () => {
    await address.add(TEST_ADDRESS);
    await address.choose(TEST_ADDRESS.fullName);
  });

  const fast = (await api.deliveries()).find((d) => d.name === 'Fast Delivery')!;

  await test.step('choose delivery', async () => {
    await delivery.choose(fast.name);
  });

  await test.step('add a card and pay', async () => {
    await payment.addCard(TEST_CARD);
    await payment.choose(TEST_CARD.number.slice(-4));
    await summary.expectAmount('Items', items);
    await summary.expectAmount('Delivery', fast.price);
    await summary.expectAmount('Total Price', items + fast.price);
    await summary.place.click();
  });

  const orderId = await test.step('order is confirmed', async () => {
    await expect(completion.thanks).toBeVisible();
    const id = completion.orderId();
    expect(id).toBeTruthy();
    await expect(nav.basketCount()).toHaveText('0');
    return id!;
  });

  await test.step('order is in the history, in the UI and in the API', async () => {
    await history.open();
    await expect(history.order(orderId)).toContainText(`${(items + fast.price).toFixed(2)}¤`);
    const [order] = await api.orders(freshUser);
    expect(order.orderId).toBe(orderId);
    expect(order.totalPrice).toBeCloseTo(items + fast.price, 2);
  });
});
