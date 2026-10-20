import { test as base, expect, type Page, type BrowserContext } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ShopApi, type Account } from './api/ShopApi';
import { NavBar } from './components/NavBar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProductListPage } from './pages/ProductListPage';
import { BasketPage } from './pages/BasketPage';
import {
  AddressPage,
  DeliveryPage,
  OrderCompletionPage,
  OrderHistoryPage,
  OrderSummaryPage,
  PaymentPage,
} from './pages/CheckoutPages';

const OWNER = 'Nail Karimov';

/** Cookies that keep the welcome banner and the cookie notice from covering the page. */
async function dismissBanners(context: BrowserContext, baseURL: string) {
  await context.addCookies([
    { name: 'welcomebanner_status', value: 'dismiss', url: baseURL },
    { name: 'cookieconsent_status', value: 'dismiss', url: baseURL },
  ]);
}

/**
 * Juice Shop is also a hacking game: when a test happens to trigger one of its challenges (an unhandled error, a
 * XSS probe), a "You successfully solved a challenge" banner slides in above the page and pushes everything down,
 * so a click can land where a button just was. The banner belongs to the game, not to the shop under test, so it is
 * hidden with CSS from the first paint. Nothing else on the page is touched.
 */
async function hideCtfNotifications(context: BrowserContext) {
  await context.addInitScript(() => {
    const css = 'app-challenge-solved-notification { display: none !important; }';
    const add = () => {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    };
    if (document.head) add();
    else document.addEventListener('DOMContentLoaded', add, { once: true });
  });
}

/**
 * Signs a browser context in without the login form: Juice Shop keeps the session in a `token` cookie, the same
 * token in localStorage and the basket id in sessionStorage. sessionStorage is not part of storageState, so the
 * basket id is put back by an init script on every page load.
 */
export async function signIn(context: BrowserContext, baseURL: string, a: Account) {
  await context.addCookies([{ name: 'token', value: a.token, url: baseURL }]);
  await context.addInitScript(
    ([token, bid]) => {
      localStorage.setItem('token', token);
      sessionStorage.setItem('bid', String(bid));
    },
    [a.token, a.bid] as const,
  );
}

export type Pages = {
  page: Page;
  nav: NavBar;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  products: ProductListPage;
  basket: BasketPage;
  address: AddressPage;
  delivery: DeliveryPage;
  payment: PaymentPage;
  summary: OrderSummaryPage;
  completion: OrderCompletionPage;
  history: OrderHistoryPage;
};

export const pagesFor = (page: Page): Pages => ({
  page,
  nav: new NavBar(page),
  loginPage: new LoginPage(page),
  registerPage: new RegisterPage(page),
  products: new ProductListPage(page),
  basket: new BasketPage(page),
  address: new AddressPage(page),
  delivery: new DeliveryPage(page),
  payment: new PaymentPage(page),
  summary: new OrderSummaryPage(page),
  completion: new OrderCompletionPage(page),
  history: new OrderHistoryPage(page),
});

/**
 * - `page` is a guest page with banners dismissed.
 * - `user` is a fresh account per worker, created over the API; `userPage` is a page signed in as that user with
 *   an empty basket (the basket is cleared before every test, so tests in a worker don't see each other's items).
 * - `freshUser` is a brand-new account for tests that change account state (orders, addresses, cards).
 * - `shopper` is the same set signed in as `freshUser`.
 * - `ui` holds the Page Objects bound to `userPage`; `guest` the same bound to the guest `page`.
 */
export const test = base.extend<
  {
    allureLabels: void;
    api: ShopApi;
    userPage: Page;
    freshUser: Account;
    ui: Pages;
    /** Page Objects on the default page, signed in as `freshUser`. */
    shopper: Pages;
    guest: Pages;
    /** Opens a page signed in as any account (two users, a fresh user...). Closed after the test. */
    pageAs: (a: Account) => Promise<Page>;
  },
  { user: Account; workerApi: ShopApi }
>({
  allureLabels: [
    // Playwright requires a destructuring pattern for the fixtures argument.
    // eslint-disable-next-line no-empty-pattern
    async ({}, use, testInfo) => {
      await allure.owner(OWNER);
      await allure.layer('ui');
      await allure.epic('OWASP Juice Shop');
      await allure.severity(testInfo.tags.includes('@smoke') ? 'critical' : 'normal');
      await allure.label('browser', testInfo.project.name);
      await use();
    },
    { auto: true },
  ],
  workerApi: [
    async ({ playwright }, use, workerInfo) => {
      const ctx = await playwright.request.newContext({ baseURL: workerInfo.project.use.baseURL });
      await use(new ShopApi(ctx));
      await ctx.dispose();
    },
    { scope: 'worker' },
  ],
  user: [async ({ workerApi }, use) => use(await workerApi.register()), { scope: 'worker' }],
  api: async ({ workerApi }, use) => use(workerApi),
  freshUser: async ({ api }, use) => use(await api.register()),
  page: async ({ page, context, baseURL }, use) => {
    await dismissBanners(context, baseURL!);
    await hideCtfNotifications(context);
    await use(page);
  },
  pageAs: async ({ browser, baseURL }, use, testInfo) => {
    const opened: BrowserContext[] = [];
    // Same device as the project (viewport, touch, user agent), so a second user on "mobile-safari" is on a phone too.
    const { viewport, userAgent, deviceScaleFactor, isMobile, hasTouch, locale } = testInfo.project.use;
    await use(async (a) => {
      const ctx = await browser.newContext({
        baseURL,
        viewport,
        userAgent,
        deviceScaleFactor,
        isMobile,
        hasTouch,
        locale,
      });
      opened.push(ctx);
      await dismissBanners(ctx, baseURL!);
      await hideCtfNotifications(ctx);
      await signIn(ctx, baseURL!, a);
      return ctx.newPage();
    });
    for (const c of opened) await c.close();
  },
  userPage: async ({ page, context, baseURL, user, api }, use) => {
    await api.emptyBasket(user);
    await signIn(context, baseURL!, user);
    await use(page);
  },
  shopper: async ({ page, context, baseURL, freshUser }, use) => {
    await signIn(context, baseURL!, freshUser);
    await use(pagesFor(page));
  },
  ui: async ({ userPage }, use) => use(pagesFor(userPage)),
  guest: async ({ page }, use) => use(pagesFor(page)),
});

export { expect };
