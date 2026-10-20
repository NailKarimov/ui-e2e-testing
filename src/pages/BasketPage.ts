import { expect, type Locator, type Page } from '@playwright/test';

/** Prices on the page look like "3.98¤". */
export const money = (s: string) => Number(/(\d+(?:\.\d+)?)/.exec(s)?.[1] ?? NaN);

export class BasketPage {
  readonly heading: Locator;
  readonly total: Locator;
  readonly checkout: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading', { name: /Your Basket/ });
    this.total = page.locator('#price');
    this.checkout = page.getByRole('button', { name: 'Checkout' });
  }

  async open() {
    await this.page.goto('/#/basket');
    await expect(this.heading).toBeVisible();
  }

  rows() {
    return this.page.locator('mat-row');
  }

  /** Exact product name, so "Apple Juice" never picks the "Pineapple Juice" row. */
  row(name: string) {
    return this.rows().filter({
      has: this.page.locator('.mat-column-product').getByText(name, { exact: true }),
    });
  }

  /** The quantity cell of a row: a locator, so tests can wait on it with toHaveText. */
  quantity(name: string) {
    return this.row(name).locator('.mat-column-quantity span.cell-initial-font');
  }

  // Row buttons have no accessible name (finding UI-A11Y-1), so they are found by their icon.
  async increase(name: string) {
    await this.row(name).locator('button:has(.fa-plus-square)').click();
  }

  async decrease(name: string) {
    await this.row(name).locator('button:has(.fa-minus-square)').click();
  }

  async remove(name: string) {
    await this.row(name).locator('button:has(.fa-trash-alt)').click();
  }

  /** Waits until the total shows `expected` (2 decimals), then returns it. */
  async expectTotal(expected: number) {
    await expect(this.total).toHaveText(`Total Price: ${expected === 0 ? '0' : expected.toFixed(2)}¤`);
  }

  /**
   * Goes to the address step. Juice Shop slides a "You successfully solved a challenge" banner in above the
   * page at unpredictable moments; it pushes the basket down, and a click can land where the button just was.
   * So the click is retried until the shop is really on the next step.
   */
  async proceedToCheckout() {
    await expect(async () => {
      if (!/#\/address\/select/.test(this.page.url())) await this.checkout.click({ timeout: 2_000 });
      await expect(this.page).toHaveURL(/#\/address\/select/, { timeout: 2_000 });
    }).toPass({ timeout: 15_000 });
  }

  async totalPrice() {
    return money((await this.total.textContent()) ?? '');
  }
}
