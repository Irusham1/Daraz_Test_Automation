const { test, expect } = require('../fixtures/daraz.fixture');
const { EXPECTED } = require('../config/constants');

test.describe('Product Details @product', () => {
  test.setTimeout(90_000);
  test.beforeEach(async ({ darazHome, searchResultsPage, productData }) => {
    await darazHome.search(productData.searchKeyword);
    await searchResultsPage.waitForResults();
    await searchResultsPage.openFirstProduct();
  });

  test('TC-23: Product page shows Add to Cart button @high @smoke', async ({ productPage }) => {
    await productPage.waitForProductPage();
    expect(await productPage.hasAddToCartButton()).toBeTruthy();
    await expect(productPage.addToCartButton).toBeVisible();
  });

  test('TC-24: Navigating to product updates URL to /products/ @high', async ({ productPage }) => {
    await productPage.waitForProductPage();
    const url = await productPage.getProductUrl();

    expect(url).toMatch(EXPECTED.productUrlPattern);
  });

  test('TC-25: Product page shows Buy Now button @high', async ({ productPage }) => {
    await productPage.waitForProductPage();
    expect(await productPage.hasBuyNowButton()).toBeTruthy();
    await expect(productPage.buyNowButton).toBeVisible();
  });
});
