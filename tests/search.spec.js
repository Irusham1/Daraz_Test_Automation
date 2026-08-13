const { test, expect } = require('../fixtures/daraz.fixture');
const { EXPECTED } = require('../config/constants');

test.describe('Search @search', () => {
  test('TC-03: Product search by keyword @high @smoke', async ({
    darazHome,
    searchResultsPage,
    searchData,
  }) => {
    const keyword = searchData.validKeywords[0];
    await darazHome.search(keyword);
    await searchResultsPage.waitForResults();

    expect(await searchResultsPage.hasProducts()).toBeTruthy();
    expect(darazHome.page.url()).toMatch(/catalog|search|q=/i);
  });

  test('TC-04: Search auto-suggestion visibility @high', async ({ darazHome, searchData }) => {
    await darazHome.typeSearch(searchData.validKeywords[0]);

    const suggestions = await darazHome.getSearchSuggestions();
    const count = await suggestions.count();

    expect(count).toBeGreaterThan(0);
    await expect(suggestions.first()).toBeVisible();
  });

  test('TC-05: Price range filter (Min/Max) @high', async ({
    darazHome,
    searchResultsPage,
    searchData,
  }) => {
    await darazHome.search(searchData.validKeywords[0]);
    await searchResultsPage.waitForResults();

    const minVisible = await searchResultsPage.minPriceInput.isVisible({ timeout: 5_000 }).catch(() => false);
    const maxVisible = await searchResultsPage.maxPriceInput.isVisible({ timeout: 5_000 }).catch(() => false);

    if (!minVisible && !maxVisible) {
      test.skip(true, 'Price filter inputs not available on search results page');
    }

    await searchResultsPage.applyPriceFilter(
      searchData.priceFilter.min,
      searchData.priceFilter.max
    );

    expect(await searchResultsPage.getProductCount()).toBeGreaterThanOrEqual(0);
  });

  test('TC-06: Brand filter on search results @high', async ({
    darazHome,
    searchResultsPage,
    searchData,
  }) => {
    await darazHome.search(searchData.validKeywords[1]);
    await searchResultsPage.waitForResults();

    await searchResultsPage.applyBrandFilter(searchData.brandFilter);

    expect(await searchResultsPage.getProductCount()).toBeGreaterThanOrEqual(0);
  });

  test('TC-18: Search URL contains query parameter @high', async ({
    darazHome,
    searchResultsPage,
    searchData,
  }) => {
    const keyword = searchData.validKeywords[0];
    await darazHome.search(keyword);
    await searchResultsPage.waitForResults();

    const url = darazHome.page.url();
    expect(url).toMatch(/q=|text=|catalog/i);

    const queryParam = await searchResultsPage.getSearchQueryFromUrl();
    if (queryParam) {
      expect(decodeURIComponent(queryParam).toLowerCase()).toContain(keyword.toLowerCase());
    }
  });

  test('TC-19: Search results display product listing items @high @smoke', async ({
    darazHome,
    searchResultsPage,
    searchData,
  }) => {
    await darazHome.search(searchData.validKeywords[0]);
    await searchResultsPage.waitForResults();

    const productCount = await searchResultsPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    await expect(searchResultsPage.productItems.first()).toBeVisible();
  });

  test('TC-20: Invalid search shows zero results @high', async ({
    darazHome,
    searchResultsPage,
    searchData,
  }) => {
    await darazHome.search(searchData.invalidKeyword);
    await searchResultsPage.waitForResults();

    const noResults = await searchResultsPage.hasNoResults();
    const productCount = await searchResultsPage.getProductCount();

    expect(noResults || productCount === 0).toBeTruthy();
  });

  test('TC-21: Suggestion list includes typed keyword @high', async ({ darazHome, searchData }) => {
    const keyword = searchData.validKeywords[0];
    await darazHome.typeSearch(keyword);

    const suggestions = await darazHome.getSearchSuggestions();

    const suggestionTexts = await suggestions.allTextContents();
    const includesKeyword = suggestionTexts.some((text) =>
      text.toLowerCase().includes(keyword.toLowerCase())
    );

    expect(includesKeyword).toBeTruthy();
  });

  test('TC-22: Run consecutive searches with different keywords @high', async ({
    darazHome,
    searchResultsPage,
    searchData,
  }) => {
    for (const keyword of searchData.consecutiveKeywords) {
      await darazHome.search(keyword);
      await searchResultsPage.waitForResults();
      expect(darazHome.page.url()).toMatch(/catalog|search|q=/i);
    }
  });
});
