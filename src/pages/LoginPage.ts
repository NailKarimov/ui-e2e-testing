import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;

  constructor(readonly page: Page) {
    this.email = page.getByRole('textbox', { name: 'Text field for the login email' });
    this.password = page.getByRole('textbox', { name: 'Text field for the login password' });
    this.submit = page.getByRole('button', { name: 'Login', exact: true });
    this.error = page.locator('.error');
  }

  async open() {
    await this.page.goto('/#/login');
    await expect(this.email).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }

  /** Logs in and waits for the shop to land on the product list (where a successful login goes). */
  async loginAs(a: { email: string; password: string }) {
    await this.login(a.email, a.password);
    await expect(this.page).toHaveURL(/#\/search/);
  }
}
