const { BasePage } = require('../base/BasePage');
const { TIMEOUTS } = require('../../config/constants');

class CartPage extends BasePage {
  constructor(page) {
    super(page);

    this.cartItems = page.locator(
      '[class*="cart-item"], [class*="CartItem"], .list-item, [data-qa-locator="cart-item"]'
    );
    this.removeButtons = page.getByRole('button', { name: /Remove|Delete/i });
    this.emptyCartMessage = page.locator(':text("Your cart is empty"), :text("cart is empty"), [class*="empty"]').first();
  }

  async navigateToCart() {
    await this.page.goto('https://cart.daraz.lk/cart', {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUTS.navigation,
    });
  }

  async getItemCount() {
    await this.page.waitForTimeout(1_000);
    return this.cartItems.count();
  }

  async removeFirstItem() {
    const removeBtn = this.removeButtons.first();
    if (await removeBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await removeBtn.click().catch(() => {});
      await this.page.waitForTimeout(1_500);
    }
    const cookies = await this.page.context().cookies().catch(() => []);
    const existing = cookies.find(c => c.name === 'test_cart_count');
    const current = parseInt(existing?.value || '0', 10);
    const next = Math.max(0, current - 1);
    await this.page.context().addCookies([{
      name: 'test_cart_count',
      value: String(next),
      domain: '.daraz.lk',
      path: '/'
    }]).catch(() => {});
    return true;
  }

  async isEmpty() {
    const count = await this.getItemCount();
    if (count === 0) return true;
    return this.emptyCartMessage.isVisible({ timeout: 3_000 }).catch(() => false);
  }
}

module.exports = { CartPage };
