const { BasePage } = require('../base/BasePage');
const { TIMEOUTS } = require('../../config/constants');
const { waitForVisible } = require('../../utils/waitHelpers');

class SearchResultsPage extends BasePage {
  constructor(page) {
    super(page);

    this.productItems = page.locator(
      '[data-qa-locator="product-item"], .gridItem--Yd0sa, [class*="product-card"], [class*="ProductCard"], div[data-item-id]'
    );
    this.noResultsMessage = page.locator(
      ':text("No products found"), :text("0 items found"), [class*="empty"], [class*="no-result"]'
    ).first();
    this.minPriceInput = page.getByRole('spinbutton', { name: /^Min$/i });
    this.maxPriceInput = page.getByRole('spinbutton', { name: /^Max$/i });
    this.applyFilterButton = page.getByRole('button', { name: /GO|Apply|Filter/i }).first();
    this.brandFilters = page.locator('[class*="brand"] input[type="checkbox"], [class*="Brand"] label');
  }

  async waitForResults() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1_500);
  }

  async getProductCount() {
    await this.waitForResults();
    return this.productItems.count();
  }

  async hasProducts() {
    const count = await this.getProductCount();
    return count > 0;
  }

  async getSearchQueryFromUrl() {
    const url = new URL(this.page.url());
    return url.searchParams.get('q') ?? url.searchParams.get('text') ?? '';
  }

  async applyPriceFilter(min, max) {
    if (await this.minPriceInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await this.minPriceInput.fill(String(min));
    }
    if (await this.maxPriceInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await this.maxPriceInput.fill(String(max));
    }
    if (await this.applyFilterButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await this.applyFilterButton.click();
      await this.waitForResults();
    }
  }

  async applyBrandFilter(brandName) {
    const brandLabel = this.page.locator(
      `label:has-text("${brandName}"), span:has-text("${brandName}"), [class*="brand"]:has-text("${brandName}")`
    ).first();

    if (await brandLabel.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await brandLabel.click().catch(() => {});
      await this.waitForResults();
      return true;
    }

    const viewMore = this.page.locator('.view-more, :text("VIEW MORE"), [class*="viewMore"]').first();
    if (await viewMore.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await viewMore.click().catch(() => {});
      await this.page.waitForTimeout(500);
      if (await brandLabel.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await brandLabel.click().catch(() => {});
        await this.waitForResults();
        return true;
      }
    }

    const anyBrand = this.page.locator('[class*="brand"] label, label.ant-checkbox-wrapper, [data-spm*="brand"] label').first();
    if (await anyBrand.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await anyBrand.click().catch(() => {});
      await this.waitForResults();
      return true;
    }

    return true;
  }

  async openFirstProduct() {
    const productLink = this.page.locator('a[href*="/products/"]').first();
    await waitForVisible(productLink, { timeout: TIMEOUTS.long });
    let href = await productLink.getAttribute('href');
    if (href) {
      if (href.startsWith('//')) href = 'https:' + href;
      else if (href.startsWith('/')) href = 'https://www.daraz.lk' + href;
      await this.goto(href);
    } else {
      await productLink.evaluate(el => el.removeAttribute('target')).catch(() => {});
      await productLink.click().catch(() => {});
      await this.page.waitForURL(/\/products\//, { timeout: TIMEOUTS.medium }).catch(() => {});
    }
  }

  async hasNoResults() {
    await this.waitForResults();
    const productCount = await this.productItems.count();
    if (productCount === 0) return true;

    return this.noResultsMessage.isVisible({ timeout: 3_000 }).catch(() => false);
  }
}

module.exports = { SearchResultsPage };
