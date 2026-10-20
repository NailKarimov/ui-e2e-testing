import { test } from '@playwright/test';

/**
 * Juice Shop UI defects found while writing this suite. Each test states the correct behaviour and is marked
 * `test.fail()`: it stays green while the defect is there, and turns red ("expected to fail, but passed") the day
 * it is fixed, so the list never goes stale. The id links the test to docs/known-defects.md.
 */
export const DEFECTS = {
  'UI-SEC-1': 'Search term is rendered as HTML: DOM-based XSS through the q parameter',
  'UI-A11Y-1': 'Basket row buttons (+, −, delete) have no accessible name (WCAG 4.1.2)',
  'UI-A11Y-2': 'Radio buttons in the checkout tables (address, delivery, card) have no accessible name',
  'UI-TXT-1': 'An empty State leaves a double comma in the address: "Riga, , LV1050"',
  'UI-TXT-2': 'Delivery time says "1 Days"',
  'UI-TXT-3': 'Order summary label has a stray quote: Card Holder"',
  'UI-TXT-4': 'Password counter says /20 while the field accepts 40 characters',
  'UI-AUTH-1': 'Order history opens for a guest instead of sending them to log in',
} as const;

export function knownDefect(id: keyof typeof DEFECTS) {
  test.info().annotations.push({ type: 'known defect', description: `${id}: ${DEFECTS[id]}` });
  // SHOW_DEFECTS=1 runs them as ordinary tests, to see each defect's own failure message.
  if (!process.env.SHOW_DEFECTS) test.fail(true, `${id}: ${DEFECTS[id]}`);
}
