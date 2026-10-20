import { test, expect } from '../../src/fixtures';

/** The shop's search API is the oracle: the page must list exactly what the API finds. */
// Queries with fewer hits than one page (12+), so every match is on screen.
for (const q of ['apple', 'sticker', '1000ml']) {
  test(`search "${q}" lists exactly the products the shop finds`, async ({ guest, api }) => {
    const expected = (await api.search(q)).sort();
    expect(expected.length).toBeGreaterThan(0);
    await guest.products.openSearch(q);
    await expect(guest.page.getByText(`Search Results - ${q}`)).toBeVisible();
    await expect(guest.products.cards()).toHaveCount(expected.length);
    expect((await guest.products.names()).sort()).toEqual(expected);
  });
}

test('search from the top bar puts the query in the URL @smoke', async ({ guest }) => {
  await guest.products.open();
  await guest.nav.search('lemon');
  await expect(guest.page).toHaveURL(/#\/search\?q=lemon/);
  await expect(guest.products.card('Lemon Juice (500ml)')).toBeVisible();
});

test('a search with no matches says so', async ({ guest }) => {
  await guest.products.openSearch('no-such-product-xyz');
  await expect(guest.products.noResults()).toBeVisible();
  await expect(guest.products.cards()).toHaveCount(0);
});

test('search is case-insensitive', async ({ guest, api }) => {
  const lower = (await api.search('banana')).sort();
  await guest.products.openSearch('BaNaNa');
  await expect(guest.products.cards()).toHaveCount(lower.length);
});
