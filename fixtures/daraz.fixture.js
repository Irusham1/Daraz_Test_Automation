const base = require('@playwright/test');
const { HomePage } = require('../pages/home/HomePage');
const { LoginPage } = require('../pages/auth/LoginPage');
const { SearchResultsPage } = require('../pages/search/SearchResultsPage');
const { ProductPage } = require('../pages/product/ProductPage');
const { CartPage } = require('../pages/cart/CartPage');
const { loadTestData } = require('../utils/testDataLoader');

const test = base.test.extend({
  /** @type {import('../pages/home/HomePage')} */
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  /** @type {import('../pages/auth/LoginPage')} */
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  /** @type {import('../pages/search/SearchResultsPage')} */
  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },

  /** @type {import('../pages/product/ProductPage')} */
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  /** @type {import('../pages/cart/CartPage')} */
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  testUsers: async ({}, use) => {
    await use(loadTestData('users.json'));
  },

  searchData: async ({}, use) => {
    await use(loadTestData('search.json'));
  },

  productData: async ({}, use) => {
    await use(loadTestData('products.json'));
  },

  /** Navigates to Daraz homepage before each test that uses this fixture. */
  darazHome: async ({ homePage }, use) => {
    await homePage.goto();
    await homePage.isLoaded();
    await use(homePage);
  },
});

const expect = base.expect;

module.exports = { test, expect };
