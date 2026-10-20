import { expect, type Locator, type Page } from '@playwright/test';
import type { TEST_ADDRESS, TEST_CARD } from '../api/ShopApi';
import { money } from './BasketPage';

/** Step 1: choose or add a delivery address. */
export class AddressPage {
  readonly proceed: Locator;
  constructor(readonly page: Page) {
    this.proceed = page.getByRole('button', { name: 'Proceed to payment selection' });
  }

  rows() {
    return this.page.locator('mat-row');
  }

  async add(a: typeof TEST_ADDRESS) {
    await this.page.getByRole('button', { name: 'Add a new address' }).click();
    await this.page.getByRole('textbox', { name: 'Country' }).fill(a.country);
    await this.page.getByRole('textbox', { name: 'Name' }).fill(a.fullName);
    await this.page.getByRole('spinbutton', { name: 'Mobile Number' }).fill(String(a.mobileNum));
    await this.page.getByRole('textbox', { name: 'ZIP Code' }).fill(a.zipCode);
    await this.page.getByRole('textbox', { name: 'Address' }).fill(a.streetAddress);
    await this.page.getByRole('textbox', { name: 'City' }).fill(a.city);
    if (a.state) await this.page.getByRole('textbox', { name: 'State' }).fill(a.state);
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await expect(this.rows().filter({ hasText: a.fullName })).toBeVisible();
  }

  async choose(fullName: string) {
    // The radio has no accessible name (finding UI-A11Y-3); the row is picked by its text.
    await this.rows().filter({ hasText: fullName }).locator('mat-radio-button').click();
    await expect(this.proceed).toBeEnabled();
    await this.proceed.click();
  }
}

/** Step 2: delivery speed. */
export class DeliveryPage {
  readonly proceed: Locator;
  constructor(readonly page: Page) {
    this.proceed = page.getByRole('button', { name: 'Proceed to delivery method selection' });
  }

  rows() {
    return this.page.locator('mat-row');
  }

  async options(): Promise<{ name: string; price: number }[]> {
    await expect(this.rows().first()).toBeVisible();
    const out: { name: string; price: number }[] = [];
    for (const r of await this.rows().all()) {
      const name = ((await r.locator('.mat-column-Name').textContent()) ?? '').trim();
      out.push({ name, price: money((await r.locator('.mat-column-Price').textContent()) ?? '') });
    }
    return out;
  }

  eta(name: string) {
    return this.rows().filter({ hasText: name }).locator('.mat-column-ETA');
  }

  async choose(name: string) {
    await this.rows().filter({ hasText: name }).locator('mat-radio-button').click();
    await expect(this.proceed).toBeEnabled();
    await this.proceed.click();
  }
}

/** Step 3: payment card. */
export class PaymentPage {
  readonly proceed: Locator;
  constructor(readonly page: Page) {
    this.proceed = page.getByRole('button', { name: 'Proceed to review' });
  }

  async addCard(c: typeof TEST_CARD) {
    await this.page.getByRole('button', { name: /Add new card/ }).click();
    const form = this.page.getByRole('region', { name: /Add new card/ });
    await form.getByRole('textbox', { name: 'Name' }).fill(c.name);
    await form.getByRole('spinbutton', { name: 'Card Number' }).fill(c.number);
    await form.getByRole('combobox', { name: 'Expiry Month' }).selectOption(c.month);
    await form.getByRole('combobox', { name: 'Expiry Year' }).selectOption(c.year);
    await form.getByRole('button', { name: 'Submit' }).click();
  }

  card(last4: string) {
    return this.page.locator('mat-row').filter({ hasText: `************${last4}` });
  }

  async choose(last4: string) {
    await this.card(last4).locator('mat-radio-button').click();
    await expect(this.proceed).toBeEnabled();
    await this.proceed.click();
  }
}

/** Step 4: review and place the order. */
export class OrderSummaryPage {
  readonly place: Locator;
  constructor(readonly page: Page) {
    this.place = page.getByRole('button', { name: 'Complete your purchase' });
  }

  amount(label: 'Items' | 'Delivery' | 'Promotion' | 'Total Price') {
    return this.page
      .locator('.order-summary + table tr')
      .filter({ has: this.page.locator('td.label', { hasText: label }) })
      .locator('td.price');
  }

  /** Waits until a summary line shows `expected`, e.g. "4.48¤". */
  async expectAmount(label: Parameters<OrderSummaryPage['amount']>[0], expected: number) {
    await expect(this.amount(label)).toHaveText(`${expected.toFixed(2)}¤`);
  }

  /** The "Delivery Address" and "Payment Method" cards. */
  card(title: 'Delivery Address' | 'Payment Method') {
    return this.page
      .locator('mat-card')
      .filter({ has: this.page.locator('b', { hasText: title }) })
      .last();
  }
}

/** After the order: confirmation, and the order history. */
export class OrderCompletionPage {
  readonly thanks: Locator;
  constructor(readonly page: Page) {
    this.thanks = page.getByRole('heading', { name: 'Thank you for your purchase!' });
  }

  orderId() {
    return /order-completion\/([^/?#]+)/.exec(this.page.url())?.[1];
  }
}

export class OrderHistoryPage {
  constructor(readonly page: Page) {}
  async open() {
    await this.page.goto('/#/order-history');
  }
  order(id: string) {
    return this.page.locator('.table-container').filter({ hasText: `#${id}` });
  }
}
