import { expect, type Locator, type Page } from '@playwright/test';

export class RegisterPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly repeat: Locator;
  readonly question: Locator;
  readonly answer: Locator;
  readonly submit: Locator;

  constructor(readonly page: Page) {
    this.email = page.getByRole('textbox', { name: 'Email address field' });
    this.password = page.getByRole('textbox', { name: 'Field for the password' });
    this.repeat = page.getByRole('textbox', { name: 'Field to confirm the password' });
    this.question = page.getByRole('combobox', { name: 'Selection list for the security question' });
    this.answer = page.getByRole('textbox', { name: 'Field for the answer to the security question' });
    this.submit = page.getByRole('button', { name: 'Button to complete the registration' });
  }

  async open() {
    await this.page.goto('/#/register');
    await expect(this.email).toBeVisible();
  }

  async pickQuestion(text: string) {
    // Opened from the keyboard, as a keyboard user would: on the emulated phones a pointer click on this
    // mat-select never passes Playwright's "stable" check, and on desktop the form grows while it validates, so a
    // click can land as the select moves. Space on the focused select opens the list on every browser.
    const list = this.page.getByRole('listbox');
    await expect(async () => {
      if (!(await list.isVisible())) {
        await this.question.focus();
        await this.page.keyboard.press('Space');
      }
      await expect(list).toBeVisible({ timeout: 1_000 });
    }).toPass({ timeout: 10_000 });
    await list.getByRole('option', { name: text }).click();
    await expect(this.question).toContainText(text);
  }

  async register(u: {
    email: string;
    password: string;
    repeat?: string;
    question?: string;
    answer?: string;
  }) {
    await this.email.fill(u.email);
    await this.password.fill(u.password);
    await this.repeat.fill(u.repeat ?? u.password);
    await this.pickQuestion(u.question ?? 'Your eldest siblings middle name?');
    await this.answer.fill(u.answer ?? 'blue');
    await this.submit.click();
  }

  /** Validation messages under the fields (mat-error). */
  errors() {
    return this.page.locator('mat-error');
  }
}
