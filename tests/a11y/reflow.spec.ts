import { test, expect } from '../../src/fixtures';
import { knownDefect } from '../../src/known-defects';

/**
 * WCAG 1.4.10 Reflow: at 320 CSS px wide (a 1280 px screen zoomed to 400 %) content must fit without scrolling
 * sideways. Juice Shop scrolls inside its content area, not the page, so the check is on that element, and on
 * every element that pokes out of it.
 */
test.use({ viewport: { width: 320, height: 640 } });

async function overflow(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const area = document.querySelector('mat-sidenav-content') as HTMLElement;
    const sticking = [...area.querySelectorAll<HTMLElement>('*')]
      .filter(
        (e) =>
          getComputedStyle(e).visibility !== 'hidden' &&
          e.getBoundingClientRect().right > area.clientWidth + 1,
      )
      // Carousels and tables scroll on purpose inside their own box; WCAG allows that for 2-D content.
      .filter((e) => !e.closest('gallery, .g-slider, mat-table'))
      .map(
        (e) =>
          `<${e.tagName.toLowerCase()} class="${String(e.className).slice(0, 40)}"> right edge ${Math.round(e.getBoundingClientRect().right)} px`,
      );
    return { scroll: area.scrollWidth - area.clientWidth, sticking: sticking.slice(0, 5) };
  });
}

const pages = [
  { name: 'login', path: '/#/login', ready: '#email' },
  { name: 'registration', path: '/#/register', ready: '#emailControl' },
  { name: 'contact', path: '/#/contact', ready: '#rating' },
  { name: 'about us', path: '/#/about', ready: 'gallery' },
];

test.describe('reflow at 320 px (WCAG 1.4.10)', () => {
  for (const p of pages) {
    test(`${p.name} fits without sideways scrolling`, async ({ guest }) => {
      await guest.page.goto(p.path);
      await expect(guest.page.locator(p.ready).first()).toBeVisible();
      const r = await overflow(guest.page);
      expect(r.sticking, `elements wider than the screen:\n${r.sticking.join('\n')}`).toEqual([]);
      expect(r.scroll).toBeLessThanOrEqual(1);
    });
  }

  test('UI-A11Y-14: the product list fits without sideways scrolling', async ({ guest }) => {
    knownDefect('UI-A11Y-14');
    await guest.products.open();
    const r = await overflow(guest.page);
    expect(r.sticking, `elements wider than the screen:\n${r.sticking.join('\n')}`).toEqual([]);
    expect(r.scroll).toBeLessThanOrEqual(1);
  });
});
