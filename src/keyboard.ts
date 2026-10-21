import { expect, type Locator, type Page } from '@playwright/test';

/** Snapshot of the element that holds keyboard focus after one Tab press. */
export type TabStop = {
  index: number;
  /** Short readable description: tag, accessible text and href. */
  label: string;
  /** Identity of the focused DOM element (stable within one page load). */
  key: string;
  /** True when focus is on <body> (nothing focusable was reached). */
  onBody: boolean;
  /** True when focus visibly changes the element's style (outline, shadow, border, colours, underline). */
  hasFocusIndicator: boolean;
  /** True when at least part of the element is inside the viewport. */
  inViewport: boolean;
};

/**
 * Presses Tab `count` times from the top of the page and records every focus stop.
 * Before tabbing, the unfocused style of every focusable element is remembered, so a
 * focus indicator counts as present when ANY visible style changes on focus — not only
 * the browser's default outline.
 */
export async function collectTabStops(page: Page, count: number): Promise<TabStop[]> {
  await page.evaluate(() => {
    const w = window as unknown as { __ks: Record<string, string>; __ksSig: (el: Element) => string };
    // Style signature of the element, its ::before/::after and those of its direct children: Angular Material
    // draws the keyboard focus ring and the focus "state layer" on child spans (.mat-focus-indicator,
    // .mat-mdc-button-persistent-ripple), not on the button itself.
    const one = (el: Element) =>
      [null, '::before', '::after']
        .map((pseudo) => {
          const s = getComputedStyle(el, pseudo);
          return [
            s.outlineStyle,
            s.outlineWidth,
            s.outlineColor,
            s.boxShadow,
            s.borderTopColor,
            s.borderBottomColor,
            s.borderBottomWidth,
            s.backgroundColor,
            s.color,
            s.textDecorationLine,
            s.opacity,
            s.transform,
          ].join('|');
        })
        .join('||');
    w.__ksSig = (el: Element) => [el, ...Array.from(el.children)].map(one).join('###');
    (document.activeElement as HTMLElement | null)?.blur();
    window.scrollTo(0, 0);
    w.__ks = {};
    const focusable = document.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])',
    );
    focusable.forEach((el, i) => {
      el.dataset.ksId = String(i);
      w.__ks[String(i)] = w.__ksSig(el);
    });
  });

  const stops: TabStop[] = [];
  for (let i = 0; i < count; i++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate((index) => {
      const w = window as unknown as { __ks: Record<string, string>; __ksSig: (el: Element) => string };
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body || el === document.documentElement) {
        return {
          index,
          label: '<body>',
          key: 'body',
          onBody: true,
          hasFocusIndicator: false,
          inViewport: false,
        };
      }
      const id = el.dataset.ksId ?? `new-${index}`;
      const before = w.__ks[id];
      // An element we did not see before (rendered later) is compared with its blurred-out default.
      const hasFocusIndicator = before === undefined ? true : before !== w.__ksSig(el);
      const r = el.getBoundingClientRect();
      const inViewport =
        r.bottom > 0 && r.right > 0 && r.top < window.innerHeight && r.left < window.innerWidth;
      const text = (el.getAttribute('aria-label') || el.textContent || '')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 40);
      const href = (el.getAttribute('href') || '').split('?')[0];
      return {
        index,
        label: `<${el.tagName.toLowerCase()}> "${text}"${href ? ` ${href}` : ''}`,
        key: id,
        onBody: false,
        hasFocusIndicator,
        inViewport,
      };
    }, i + 1);
    stops.push(stop);
  }
  return stops;
}

/**
 * Presses Tab until `target` has keyboard focus, the way a keyboard user gets there, and returns how many
 * presses it took. Fails if the element is not reached within `max` presses (skipped or not focusable).
 */
export async function tabTo(page: Page, target: Locator, max = 40): Promise<number> {
  for (let i = 1; i <= max; i++) {
    await page.keyboard.press('Tab');
    if (await target.evaluate((el) => el === document.activeElement || el.contains(document.activeElement)))
      return i;
  }
  throw new Error(`Not reached with ${max} Tab presses: ${target}`);
}

export type FocusShot = { label: string; changed: boolean };

/**
 * Focus Visible, checked the way a sighted keyboard user would: by looking. Takes a picture of each of the first
 * `count` Tab stops at rest, then Tabs to each one and takes the same picture again. If the two pictures are
 * identical, the focus is invisible there, whatever the CSS says (a style can change on an element that is not
 * drawn: comparing computed styles alone missed a planted bug that hid Material's focus layer).
 */
export async function focusShots(page: Page, count: number, ready: Locator): Promise<FocusShot[]> {
  // Pass 1: learn the order and where each stop is drawn.
  const stops = (await collectTabStops(page, count)).filter((s) => !s.onBody);
  const clips: { x: number; y: number; width: number; height: number }[] = [];
  for (const s of stops) {
    const box = (await page.locator(`[data-ks-id="${s.key}"]`).boundingBox())!;
    const m = 4; // outlines are drawn just outside the element
    clips.push({
      x: Math.max(0, box.x - m),
      y: Math.max(0, box.y - m),
      width: box.width + 2 * m,
      height: box.height + 2 * m,
    });
  }
  // Pass 2, on a fresh load so the browser's "where Tab starts" point is the top of the page again.
  await page.reload();
  await expect(ready).toBeVisible();
  const before = [];
  for (const clip of clips) before.push(await page.screenshot({ clip, animations: 'disabled' }));
  const result: FocusShot[] = [];
  for (const [i, s] of stops.entries()) {
    await page.keyboard.press('Tab');
    const after = await page.screenshot({ clip: clips[i], animations: 'disabled' });
    result.push({ label: s.label, changed: !after.equals(before[i]) });
  }
  return result;
}
