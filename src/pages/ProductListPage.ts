import { expect, type Locator, type Page } from '@playwright/test';

/** The start page and search results: product cards. */
export class ProductListPage {
  readonly heading: Locator;

  constructor(readonly page: Page) {
    this.heading = page.locator('.heading').first();
  }

  async open() {
    await this.page.goto('/#/');
    await expect(this.cards().first()).toBeVisible();
  }

  async openSearch(q: string) {
    await this.page.goto(`/#/search?q=${encodeURIComponent(q)}`);
  }

  cards() {
    return this.page.locator('app-product');
  }

  /** Exact name: "Apple Juice (1000ml)" must not match "Pineapple Juice (1000ml)". */
  card(name: string) {
    return this.cards().filter({ has: this.page.locator('.name').getByText(name, { exact: true }) });
  }

  async names(): Promise<string[]> {
    return (await this.cards().locator('.name').allTextContents()).map((s) => s.trim());
  }

  /**
   * Adds one item and waits until the basket counter has gone up by one. The "Placed … into basket." snack bar is
   * not the signal: it is transient and the next notice replaces it, so a quick second click can make it vanish
   * before the check sees it (that flaked once in 105 runs).
   */
  async addToBasket(name: string) {
    const counter = this.page
      .getByRole('button', { name: 'Show the shopping cart' })
      .locator('.warn-notification');
    const before = Number(((await counter.textContent()) ?? '0').trim());
    await this.card(name).getByRole('button', { name: 'Add to Basket' }).click();
    await expect(counter).toHaveText(String(before + 1));
  }

  noResults() {
    return this.page.getByRole('img', { name: 'No results found' });
  }
}
