import AxeBuilder from '@axe-core/playwright';
import type { Page, TestInfo } from '@playwright/test';
import type { Result } from 'axe-core';

/** WCAG 2.2 level A and AA, the bar of EN 301 549 and most accessibility laws. */
export const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/**
 * Accessibility defects already known in Juice Shop, as axe reports them. A violation node that matches one of
 * these is "known"; any other serious or critical node fails the test. See docs/known-defects.md.
 */
export const KNOWN_A11Y = {
  'UI-A11Y-1': {
    rule: 'button-name',
    node: /mat-column-(quantity|remove)/,
    what: 'basket + / − / delete buttons have no name',
  },
  'UI-A11Y-2': { rule: 'label', node: /type="radio"/, what: 'checkout radio buttons have no label' },
  'UI-A11Y-3': {
    rule: 'label',
    node: /autocapitalize="none"/,
    what: 'the search field has no label (on every page)',
  },
  'UI-A11Y-4': {
    rule: 'color-contrast',
    node: /^<small/,
    what: 'the e-mail in the basket heading: contrast 1.6:1',
  },
  'UI-A11Y-5': {
    rule: 'color-contrast',
    node: /left<\/span>|Sold Out/i,
    what: 'stock ribbon "Only N left": contrast 2.9:1',
  },
  'UI-A11Y-6': {
    rule: 'aria-required-children',
    node: /mat-header-row/,
    what: 'tables with an empty header row',
  },
  'UI-A11Y-7': {
    rule: 'color-contrast',
    node: /snack-?bar|Force page reload|Language has been changed/,
    what: 'the "Language has been changed" notice: its text and "Force page reload" button fail contrast',
  },
  'UI-A11Y-8': {
    rule: 'image-alt',
    node: /carousel|g-image-item/,
    what: 'About Us: carousel photos have no alt text',
  },
  'UI-A11Y-9': {
    rule: 'link-in-text-block',
    node: /legal\.md/,
    what: 'About Us: the Terms of Use link differs from the text by colour only (1.3:1)',
  },
  'UI-A11Y-10': {
    rule: 'scrollable-region-focusable',
    node: /g-slider/,
    what: 'About Us: the carousel scrolls but cannot be reached with the keyboard',
  },
  'UI-A11Y-11': {
    rule: 'label',
    node: /type="range"|mdc-slider/,
    what: 'Contact: the rating slider has no label',
  },
  'UI-A11Y-12': {
    rule: 'aria-prohibited-attr',
    node: /captcha/,
    what: 'Contact: aria-label on the CAPTCHA <code> is not allowed there (flagged while the puzzle is loading)',
  },
} as const;
export type A11yDefect = keyof typeof KNOWN_A11Y;

/** Known defects that can show up on any screen: the language notice pops up on some first visits only. */
export const ANYWHERE: A11yDefect[] = ['UI-A11Y-7'];

export type Finding = {
  rule: string;
  impact: string;
  help: string;
  node: string;
  html: string;
  defect?: A11yDefect;
};

export type Scan = {
  /** Serious or critical nodes that match no known defect: these fail the test. */
  unexpected: Finding[];
  /** Known defects seen on this page. */
  known: Set<A11yDefect>;
  /** Moderate and minor findings: reported, not failing. */
  minor: Finding[];
  /** Rules that passed (for the report). */
  passes: number;
};

const flatten = (violations: Result[]): Finding[] =>
  violations.flatMap((v) =>
    v.nodes.map((n) => {
      const node = n.target.join(' ');
      const defect = (Object.keys(KNOWN_A11Y) as A11yDefect[]).find(
        (id) =>
          KNOWN_A11Y[id].rule === v.id &&
          (KNOWN_A11Y[id].node.test(node) || KNOWN_A11Y[id].node.test(n.html)),
      );
      return {
        rule: v.id,
        impact: v.impact ?? 'unknown',
        help: v.help,
        node,
        html: n.html.slice(0, 160),
        defect,
      };
    }),
  );

/** Runs axe on the page as it is now and attaches the full result to the report. */
export async function scan(page: Page, testInfo: TestInfo, name: string): Promise<Scan> {
  // Contrast is computed from the colours on screen: a card still fading in reads as low contrast. Wait until
  // every CSS animation and transition has finished (or the page has been still for a while).
  await page
    .waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'), null, {
      timeout: 5_000,
    })
    .catch(() => undefined);
  const result = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    // The game's "challenge solved" banner is hidden by the fixtures; it is not part of the shop.
    .exclude('app-challenge-solved-notification')
    .analyze();
  await testInfo.attach(`axe ${name}.json`, {
    body: JSON.stringify(result.violations, null, 2),
    contentType: 'application/json',
  });
  const all = flatten(result.violations);
  const severe = (f: Finding) => f.impact === 'serious' || f.impact === 'critical';
  return {
    unexpected: all.filter((f) => severe(f) && !f.defect),
    known: new Set(all.filter((f) => f.defect).map((f) => f.defect!)),
    minor: all.filter((f) => !severe(f) && !f.defect),
    passes: result.passes.length,
  };
}

export const describeFindings = (fs: Finding[]) =>
  fs.map((f) => `[${f.impact}] ${f.rule}: ${f.help}\n    ${f.node}\n    ${f.html}`).join('\n') || 'none';
