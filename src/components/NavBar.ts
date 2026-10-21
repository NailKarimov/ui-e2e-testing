import { expect, type Locator, type Page } from '@playwright/test';

/**
 * The top bar on every page: search, account, basket. On a phone the account menu is not in the bar: it moves
 * into the side navigation, so account actions go through whichever one is on screen.
 */
export class NavBar {
  readonly accountButton: Locator;
  readonly basketButton: Locator;
  readonly sidenavButton: Locator;

  constructor(readonly page: Page) {
    this.accountButton = page.getByRole('button', { name: 'Show/hide account menu' });
    this.basketButton = page.getByRole('button', { name: 'Show the shopping cart' });
    this.sidenavButton = page.getByRole('button', { name: 'Open Sidenav' });
  }

  async search(query: string) {
    await this.page.getByRole('button', { name: 'Open search' }).click();
    // The search field has no accessible name (defect UI-A11Y-3), so it is found by its id.
    const box = this.page.locator('#searchQuery input');
    await box.fill(query);
    await box.press('Enter');
  }

  /** The number on the basket button. */
  basketCount(): Locator {
    return this.basketButton.locator('.warn-notification');
  }

  async openBasket() {
    await this.basketButton.click();
    await this.page.waitForURL(/#\/basket/);
  }

  /** Opens the account panel (menu on desktop, side navigation on a phone) and returns it. */
  async openAccount(): Promise<Locator> {
    await expect(this.basketButton).toBeVisible();
    if (await this.accountButton.isVisible()) {
      await this.accountButton.click();
      return this.page.getByRole('menu');
    }
    const sidenav = this.page.locator('mat-sidenav.mat-drawer-opened');
    if (!(await sidenav.isVisible())) await this.sidenavButton.click();
    await expect(sidenav).toBeVisible();
    // Taps during the slide-in animation are ignored by Material, so wait until it has settled.
    await expect(sidenav).not.toHaveClass(/mat-drawer-animating/);
    return sidenav;
  }

  /** Closes the menu (Escape) or the side navigation (a tap on the dimmed backdrop beside it). */
  async closeAccount() {
    const backdrop = this.page.locator('.mat-drawer-backdrop.mat-drawer-shown');
    const sidenav = this.page.locator('mat-sidenav.mat-drawer-opened');
    if (await backdrop.isVisible()) {
      await expect(async () => {
        if (await sidenav.isVisible()) {
          const box = (await backdrop.boundingBox())!;
          await backdrop.click({ position: { x: box.width - 10, y: box.height / 2 }, timeout: 2_000 });
        }
        await expect(sidenav).toBeHidden({ timeout: 2_000 });
      }).toPass({ timeout: 10_000 });
    } else await this.page.keyboard.press('Escape');
    await expect(sidenav).toBeHidden();
    await expect(this.page.getByRole('menu')).toBeHidden();
  }

  async logout() {
    const panel = await this.openAccount();
    await panel.getByText('Logout').click();
  }

  /** Signed-in pages say who is signed in inside the account panel. */
  async expectSignedInAs(email: string) {
    const panel = await this.openAccount();
    await expect(panel).toContainText(email);
    await this.closeAccount();
  }
}
