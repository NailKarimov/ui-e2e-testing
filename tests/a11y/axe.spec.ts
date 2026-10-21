import type { Page } from '@playwright/test';
import { test, expect, type Pages } from '../../src/fixtures';
import { TEST_ADDRESS, TEST_CARD, type Account, type ShopApi } from '../../src/api/ShopApi';
import { scan, describeFindings, KNOWN_A11Y, ANYWHERE, type A11yDefect } from '../../src/a11y/axe';

const APPLE = 'Apple Juice (1000ml)';
type Ctx = { guest: Pages; shopper: Pages; api: ShopApi; freshUser: Account };

/**
 * One axe scan per screen of the customer journey, signed in where the screen needs it. A scan fails on any
 * serious or critical violation that is not a known defect, and also when a known defect expected on that
 * screen is gone: then it was fixed, and its entry should be removed (a ratchet: the list can only shrink).
 * Defects listed under `may` depend on data (stock levels) and are allowed but not required.
 */
const SCREENS: {
  name: string;
  open: (c: Ctx) => Promise<Page>;
  expect: A11yDefect[];
  may?: A11yDefect[];
}[] = [
  {
    name: 'product list',
    open: async ({ guest }) => (await guest.products.open(), guest.page),
    expect: ['UI-A11Y-3'],
    may: ['UI-A11Y-5'],
  },
  {
    name: 'search results',
    open: async ({ guest }) => (await guest.products.openSearch('juice'), guest.page),
    expect: ['UI-A11Y-3'],
    may: ['UI-A11Y-5'],
  },
  {
    name: 'login',
    open: async ({ guest }) => (await guest.loginPage.open(), guest.page),
    expect: ['UI-A11Y-3'],
  },
  {
    name: 'registration',
    open: async ({ guest }) => (await guest.registerPage.open(), guest.page),
    expect: ['UI-A11Y-3'],
  },
  {
    name: 'about us',
    open: async ({ guest }) => {
      await guest.page.goto('/#/about');
      // The carousel photos load lazily; scan once the first one is on screen.
      await expect(guest.page.locator('gallery-image[imagestate="success"]').first()).toBeVisible();
      return guest.page;
    },
    expect: ['UI-A11Y-3', 'UI-A11Y-8', 'UI-A11Y-10'],
    // On a phone the Terms link sits in its own line, where colour alone is no longer the only cue.
    may: ['UI-A11Y-9'],
  },
  {
    name: 'contact',
    open: async ({ guest }) => {
      await guest.page.goto('/#/contact');
      await expect(guest.page.locator('#rating')).toBeVisible();
      await expect(guest.page.locator('#captcha')).not.toBeEmpty(); // the puzzle arrives from the API
      return guest.page;
    },
    expect: ['UI-A11Y-3', 'UI-A11Y-11'],
    // axe flags the aria-label on the CAPTCHA only while the element is still empty (before the puzzle loads).
    may: ['UI-A11Y-12'],
  },
  {
    name: 'basket',
    open: async ({ shopper, api, freshUser }) => {
      await api.addToBasket(freshUser, APPLE);
      await shopper.basket.open();
      await expect(shopper.basket.rows()).toHaveCount(1);
      return shopper.page;
    },
    expect: ['UI-A11Y-1', 'UI-A11Y-3', 'UI-A11Y-4', 'UI-A11Y-6'],
  },
  {
    name: 'address',
    open: async ({ shopper, api, freshUser }) => {
      await api.addToBasket(freshUser, APPLE);
      await api.addAddress(freshUser);
      await shopper.basket.open();
      await shopper.basket.proceedToCheckout();
      await expect(shopper.address.rows()).toHaveCount(1);
      return shopper.page;
    },
    expect: ['UI-A11Y-2', 'UI-A11Y-3', 'UI-A11Y-6'],
  },
  {
    name: 'delivery',
    open: async ({ shopper, api, freshUser }) => {
      await api.addToBasket(freshUser, APPLE);
      await api.addAddress(freshUser);
      await shopper.basket.open();
      await shopper.basket.proceedToCheckout();
      await shopper.address.choose(TEST_ADDRESS.fullName);
      await expect(shopper.delivery.rows()).toHaveCount(3);
      return shopper.page;
    },
    expect: ['UI-A11Y-2', 'UI-A11Y-3'],
  },
  {
    name: 'order summary',
    open: async ({ shopper, api, freshUser }) => {
      await api.addToBasket(freshUser, APPLE);
      await api.addAddress(freshUser);
      await api.addCard(freshUser);
      await shopper.basket.open();
      await shopper.basket.proceedToCheckout();
      await shopper.address.choose(TEST_ADDRESS.fullName);
      await shopper.delivery.choose('Standard Delivery');
      await shopper.payment.choose(TEST_CARD.number.slice(-4));
      await expect(shopper.summary.place).toBeVisible();
      return shopper.page;
    },
    // The summary repeats the basket table with its empty header row. The low-contrast e-mail is there too on a
    // desktop; on a phone the card behind it is lighter and it passes, so it is allowed, not required.
    expect: ['UI-A11Y-3', 'UI-A11Y-6'],
    may: ['UI-A11Y-4'],
  },
  {
    name: 'order history',
    open: async ({ shopper }) => {
      await shopper.history.open();
      await expect(shopper.page.getByText('Order History')).toBeVisible();
      return shopper.page;
    },
    expect: ['UI-A11Y-3'],
  },
];

test.describe('accessibility: axe-core, WCAG 2.2 A + AA', () => {
  for (const s of SCREENS) {
    test(`${s.name}: no new serious violations, known ones still listed`, async ({
      guest,
      shopper,
      api,
      freshUser,
    }, testInfo) => {
      const page = await s.open({ guest, shopper, api, freshUser });
      const r = await scan(page, testInfo, s.name);

      testInfo.annotations.push(
        {
          type: 'a11y known',
          description: [...r.known].map((id) => `${id}: ${KNOWN_A11Y[id].what}`).join('; ') || 'none',
        },
        {
          type: 'a11y minor',
          description: r.minor.map((f) => `${f.rule} (${f.impact})`).join('; ') || 'none',
        },
      );

      expect(
        r.unexpected,
        `New serious or critical violations on "${s.name}":\n${describeFindings(r.unexpected)}`,
      ).toEqual([]);
      const gone = s.expect.filter((id) => !r.known.has(id));
      expect(
        gone,
        `Known defects no longer found on "${s.name}": fixed? Remove them from SCREENS and KNOWN_A11Y.`,
      ).toEqual([]);
      const extra = [...r.known].filter(
        (id) => !s.expect.includes(id) && ![...(s.may ?? []), ...ANYWHERE].includes(id),
      );
      expect(extra, `Known defects that spread to "${s.name}": add them to this screen on purpose.`).toEqual(
        [],
      );
    });
  }
});
