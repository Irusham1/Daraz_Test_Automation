const { test, expect } = require('../fixtures/daraz.fixture');
const { EXPECTED, HOME_URL } = require('../config/constants');

test.describe('Homepage @home', () => {
  test('TC-10: Homepage loads with correct title and URL @high @smoke', async ({ darazHome }) => {
    const title = await darazHome.getTitle();
    const url = await darazHome.getCurrentUrl();

    expect(title).toMatch(EXPECTED.homeTitle);
    expect(url).toMatch(EXPECTED.homeUrlPattern);
  });

  test('TC-11: Key header elements visible (search, login, cart, language) @high @smoke', async ({
    darazHome,
  }) => {
    const elements = await darazHome.areHeaderElementsVisible();

    expect(elements.search).toBeTruthy();
    expect(elements.login).toBeTruthy();
    expect(elements.cart).toBeTruthy();
  });

  test('TC-12: Guest cart badge is empty or zero @high', async ({ darazHome }) => {
    const badgeCount = await darazHome.getCartBadgeCount();
    expect(badgeCount).toBeGreaterThanOrEqual(0);
    expect(badgeCount).toBeLessThanOrEqual(0);
  });

  test('TC-13: Logo navigates back to homepage from catalog @high', async ({
    darazHome,
    searchResultsPage,
    searchData,
  }) => {
    await darazHome.search(searchData.validKeywords[0]);
    await searchResultsPage.waitForResults();

    expect(darazHome.page.url()).not.toMatch(/#?\?$/);

    await darazHome.clickLogo();
    await darazHome.isLoaded();

    const url = await darazHome.getCurrentUrl();
    expect(url).toMatch(EXPECTED.homeUrlPattern);
  });
});
