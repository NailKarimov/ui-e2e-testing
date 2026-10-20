import { test, expect } from '../../src/fixtures';
import { uniqueEmail } from '../../src/api/ShopApi';

test.describe('registration and login through the form', () => {
  test('register, log in, see the account, log out @smoke', async ({ guest }) => {
    const { registerPage, loginPage, nav, page } = guest;
    const email = uniqueEmail('ui');
    const password = 'Qa-test-pass1';

    await registerPage.open();
    await registerPage.register({ email, password });
    // A successful registration lands on the login page with a confirmation.
    await expect(page).toHaveURL(/#\/login/);
    await expect(page.getByText('Registration completed successfully. You can now log in.')).toBeVisible();

    await loginPage.loginAs({ email, password });
    await nav.expectSignedInAs(email);

    await nav.logout();
    await expect(page).toHaveURL(/#\/$/);
    await loginPage.open(); // a guest can reach the login form again
  });

  test('wrong password is rejected without saying which part was wrong', async ({ guest, user }) => {
    await guest.loginPage.open();
    await guest.loginPage.login(user.email, 'not-the-password');
    await expect(guest.loginPage.error).toHaveText('Invalid email or password.');
    await expect(guest.page).toHaveURL(/#\/login/);
  });

  test('unknown email gets the same message as a wrong password', async ({ guest }) => {
    await guest.loginPage.open();
    await guest.loginPage.login(uniqueEmail('nobody'), 'whatever-1');
    await expect(guest.loginPage.error).toHaveText('Invalid email or password.');
  });

  test('an email that is already registered cannot register again', async ({ guest, user }) => {
    await guest.registerPage.open();
    await guest.registerPage.register({ email: user.email, password: 'Qa-test-pass1' });
    await expect(guest.page.getByText('Email must be unique')).toBeVisible();
    await expect(guest.page).toHaveURL(/#\/register/);
  });
});

test.describe('registration form validation', () => {
  const cases = [
    { field: 'email', value: 'not-an-email', message: 'Email address is not valid.' },
    { field: 'password', value: 'abc', message: 'Password must be 5-40 characters long.' },
  ] as const;

  for (const c of cases) {
    test(`invalid ${c.field} "${c.value}" shows "${c.message}" and blocks submit`, async ({ guest }) => {
      const { registerPage } = guest;
      await registerPage.open();
      await registerPage[c.field].fill(c.value);
      await registerPage[c.field].blur();
      await expect(registerPage.errors().filter({ hasText: c.message })).toBeVisible();
      await expect(registerPage.submit).toBeDisabled();
    });
  }

  test('passwords that do not match are flagged', async ({ guest }) => {
    const { registerPage } = guest;
    await registerPage.open();
    await registerPage.password.fill('Qa-test-pass1');
    await registerPage.repeat.fill('Qa-test-pass2');
    await registerPage.repeat.blur();
    await expect(registerPage.errors().filter({ hasText: 'Passwords do not match' })).toBeVisible();
    await expect(registerPage.submit).toBeDisabled();
  });

  test('the submit button only enables once every field is valid', async ({ guest }) => {
    const { registerPage } = guest;
    await registerPage.open();
    await expect(registerPage.submit).toBeDisabled();
    await registerPage.email.fill(uniqueEmail('form'));
    await registerPage.password.fill('Qa-test-pass1');
    await registerPage.repeat.fill('Qa-test-pass1');
    await expect(registerPage.submit).toBeDisabled(); // no security question yet
    await registerPage.pickQuestion('Your eldest siblings middle name?');
    await registerPage.answer.fill('blue');
    await expect(registerPage.submit).toBeEnabled();
  });
});
