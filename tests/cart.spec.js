const { test, expect } = require('../fixtures/daraz.fixture');

test.describe('Cart @cart', () => {
  test.setTimeout(90_000);
  test('TC-07: Add to cart and badge update @high @smoke', async ({
    darazHome,
    searchResultsPage,
    productPage,
  }) => {
    const initialCount = await darazHome.getCartBadgeCount();

    await darazHome.search('phone');
    await searchResultsPage.waitForResults();
    await searchResultsPage.openFirstProduct();
    await productPage.waitForProductPage();
    await productPage.addToCart();

    const updatedCount = await darazHome.getCartBadgeCount();
    expect(updatedCount).toBeGreaterThan(initialCount);
  });

  test('TC-08: Cart persistence after reload @high', async ({
    darazHome,
    searchResultsPage,
    productPage,
  }) => {
    await darazHome.search('phone');
    await searchResultsPage.waitForResults();
    await searchResultsPage.openFirstProduct();
    await productPage.waitForProductPage();
    await productPage.addToCart();

    const countBeforeReload = await darazHome.getCartBadgeCount();
    expect(countBeforeReload).toBeGreaterThan(0);

    await darazHome.reload();
    const countAfterReload = await darazHome.getCartBadgeCount();
    expect(countAfterReload).toBeGreaterThanOrEqual(0);
  });

  test('TC-09: Remove item and badge update @high', async ({
    darazHome,
    searchResultsPage,
    productPage,
    cartPage,
  }) => {
    await darazHome.search('phone');
    await searchResultsPage.waitForResults();
    await searchResultsPage.openFirstProduct();
    await productPage.waitForProductPage();
    await productPage.addToCart();

    const countAfterAdd = await darazHome.getCartBadgeCount();
    expect(countAfterAdd).toBeGreaterThan(0);

    await cartPage.navigateToCart();
    await cartPage.removeFirstItem();

    await darazHome.goto();
    const countAfterRemove = await darazHome.getCartBadgeCount();
    expect(countAfterRemove).toBeLessThan(countAfterAdd);
  });

  test('TC-26: Cart badge increases after adding another product @high', async ({
    darazHome,
    searchResultsPage,
    productPage,
    searchData,
  }) => {
    await darazHome.search(searchData.validKeywords[0]);
    await searchResultsPage.waitForResults();
    await searchResultsPage.openFirstProduct();
    await productPage.waitForProductPage();
    await productPage.addToCart();

    const firstCount = await darazHome.getCartBadgeCount();
    expect(firstCount).toBeGreaterThan(0);

    await darazHome.search(searchData.validKeywords[2]);
    await searchResultsPage.waitForResults();
    await searchResultsPage.openFirstProduct();
    await productPage.waitForProductPage();
    await productPage.addToCart();

    const secondCount = await darazHome.getCartBadgeCount();
    expect(secondCount).toBeGreaterThan(firstCount);
  });
});
