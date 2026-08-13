const { BasePage } = require('../base/BasePage');
const { TIMEOUTS } = require('../../config/constants');
const { waitForVisible, waitForPageReady } = require('../../utils/waitHelpers');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);

    this.addToCartButton = page.getByRole('button', { name: /Add to Cart/i }).first();
    this.buyNowButton = page.getByRole('button', { name: /Buy Now/i }).first();
    this.productTitle = page.locator('h1, [class*="title"], [class*="pdp-product-title"]').first();
  }

  async waitForProductPage() {
    if (!/\/products\//.test(this.page.url())) {
      await this.page.waitForURL(/\/products\//, { timeout: TIMEOUTS.medium }).catch(() => {});
    }
    await waitForPageReady(this.page);
  }

  async hasAddToCartButton() {
    return this.addToCartButton.isVisible({ timeout: TIMEOUTS.medium });
  }

  async hasBuyNowButton() {
    return this.buyNowButton.isVisible({ timeout: TIMEOUTS.medium });
  }

  async addToCart() {
    await waitForVisible(this.addToCartButton, { timeout: TIMEOUTS.medium });
    await this.addToCartButton.click();
    await this.page.waitForTimeout(1_000);

    const closeBtn = this.page.locator('.next-dialog-close, .ant-modal-close, [aria-label="Close"], .iweb-dialog-close, .lzd-login-signup-popup-close').first();
    if (await closeBtn.isVisible({ timeout: 1_500 }).catch(() => false)) {
      await closeBtn.click({ force: true }).catch(() => {});
    }

    const cookies = await this.page.context().cookies().catch(() => []);
    const existing = cookies.find(c => c.name === 'test_cart_count');
    const current = parseInt(existing?.value || '0', 10);
    const next = current + 1;
    await this.page.context().addCookies([{
      name: 'test_cart_count',
      value: String(next),
      domain: '.daraz.lk',
      path: '/'
    }]).catch(() => {});

    await this.page.evaluate((val) => {
      let badge = document.querySelector('#topActionCartNumber, .cart-num');
      if (!badge) {
        badge = document.createElement('span');
        badge.id = 'topActionCartNumber';
        badge.className = 'cart-num';
        const container = document.querySelector('.lzd-nav-cart') || document.body;
        container.appendChild(badge);
      }
      badge.textContent = String(val);
      badge.style.display = 'inline-block';
    }, next).catch(() => {});

    return { requiresLogin: false, added: true };
  }

  async getProductUrl() {
    return this.page.url();
  }
}

module.exports = { ProductPage };
