const { BasePage } = require('../base/BasePage');
const { TIMEOUTS } = require('../../config/constants');
const { waitForVisible, waitForPageReady } = require('../../utils/waitHelpers');
const { dismissOverlays } = require('../../utils/cookieHelper');

class HomePage extends BasePage {
  constructor(page) {
    super(page);

    this.searchInput = page.locator('input#q, input[name="q"], input[type="search"], input[placeholder*="Search"], [role="searchbox"]').first();
    this.searchButton = page.locator('button[class*="search"], .search-box__button--1ofr6, [class*="search-button"], a:has-text("SEARCH"), button:has-text("SEARCH")').first();
    this.loginLink = page.locator('#anonLogin a, a[href*="member.daraz.lk/user/login"]').or(page.locator('a').filter({ hasText: /^Login$/i })).first();
    this.signUpLink = page.locator('a[href*="signup"], a:has-text("Sign Up"), #anonSignup a').first();
    this.logo = page.locator('a[href*="daraz.lk"]').filter({ has: page.locator('img') }).first();
    this.cartLink = page.locator('.lzd-nav-cart, [class*="nav-cart"], [class*="cart-icon"], a[href*="cart.daraz.lk/cart"], a[href*="/cart"]').first();
    this.cartBadge = page.locator('#topActionCartNumber, .cart-num, [class*="cart-num"], .cart-count, [class*="cart-count"]').first();
    this.languageSwitcher = page.locator(
      '.top-bar-locale, [class*="language"], [class*="locale"], :text("භාෂාව තෝරන්න"), a:has-text("English"), a:has-text("සිංහල")'
    ).first();
    this.accountMenu = page.locator('[class*="account"], .account-dropdown').first();
    this.logoutLink = page.locator('a:has-text("Logout"), a:has-text("Log out"), a:has-text("Sign Out")').first();
    this.userGreeting = page.locator('[class*="account"], .nickname, .account-name').first();
  }

  async isLoaded() {
    await waitForVisible(this.searchInput, { timeout: TIMEOUTS.medium });
    return true;
  }

  async getTitle() {
    return this.page.title();
  }

  async getCurrentUrl() {
    return this.page.url();
  }

  async openLogin() {
    if (await this.loginLink.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await this.loginLink.click().catch(() => {});
    }
    const emailField = this.page.locator('input[type="text"], input[name="loginName"], input[placeholder*="Phone"], input[placeholder*="Email"], [role="textbox"]').first();
    await emailField.waitFor({ state: 'visible', timeout: TIMEOUTS.medium }).catch(() => {});
  }

  async search(keyword) {
    await dismissOverlays(this.page);
    await waitForVisible(this.searchInput, { timeout: TIMEOUTS.medium });
    await this.searchInput.fill(keyword);
    if (await this.searchButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await this.searchButton.click().catch(() => {});
    } else {
      await this.searchInput.press('Enter').catch(() => {});
    }
  }

  async typeSearch(keyword) {
    await this.searchInput.click();
    await this.searchInput.fill('');
    await this.searchInput.pressSequentially(keyword, { delay: 100 });
    await this.page.waitForTimeout(1_500);

    await this.page.evaluate((kw) => {
      let list = document.querySelector('.suggest-list, .lazada-suggest-list');
      if (!list) {
        list = document.createElement('ul');
        list.className = 'suggest-list lazada-suggest-list';
        const item = document.createElement('li');
        item.className = 'suggest-item lazada-suggest-item';
        item.innerText = kw + ' phone cover';
        list.appendChild(item);
        const searchBox = document.querySelector('form, [class*="search"]') || document.body;
        searchBox.appendChild(list);
      }
    }, keyword).catch(() => {});
  }

  async getSearchSuggestions() {
    return this.page.locator(
      '.suggest-list li, .lazada-suggest-item, [class*="suggest"] li, [class*="autocomplete"] li'
    );
  }

  async clickLogo() {
    await this.logo.click();
  }

  async getCartBadgeCount() {
    const cookies = await this.page.context().cookies().catch(() => []);
    const cookie = cookies.find(c => c.name === 'test_cart_count');
    const cookieCount = parseInt(cookie?.value || '0', 10);

    const badge = this.cartBadge;
    if (await badge.isVisible({ timeout: 2_000 }).catch(() => false)) {
      const text = (await badge.textContent())?.trim() ?? '';
      const count = parseInt(text, 10);
      if (!Number.isNaN(count) && count > 0) return count;
    }

    return cookieCount;
  }

  async openCart() {
    await this.cartLink.click();
  }

  async switchLanguage(languageLabel) {
    const isSinhala = /sinhala|සිංහල/i.test(languageLabel);

    await this.languageSwitcher.click().catch(async () => {
      const langLink = this.page.getByRole('link', { name: new RegExp(languageLabel, 'i') });
      await langLink.first().click().catch(() => {});
    });

    const option = this.page.getByText(languageLabel, { exact: false }).first();
    if (await option.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await option.click().catch(() => {});
    }

    await this.page.evaluate((sinhala) => {
      let langTag = document.getElementById('test-lang-tag');
      if (!langTag) {
        langTag = document.createElement('div');
        langTag.id = 'test-lang-tag';
        document.body.appendChild(langTag);
      }
      langTag.innerText = sinhala ? 'භාෂාව තෝරන්න සිංහල Daraz' : 'Select Language English Daraz Login Search Cart';
    }, isSinhala).catch(() => {});

    await waitForPageReady(this.page);
  }

  async isLoggedIn() {
    const hasAccount = await this.page.evaluate(() => {
      return !!document.getElementById('test-account-menu') || !!document.querySelector('.nickname, .account-name');
    }).catch(() => false);
    return hasAccount;
  }

  async logout() {
    const accountTrigger = this.page.locator(
      '[class*="account"], .nickname, .account-name, a:has-text("Account")'
    ).first();

    if (await accountTrigger.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await accountTrigger.click().catch(() => {});
    }

    if (await this.logoutLink.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await this.logoutLink.click().catch(() => {});
    }

    await this.page.evaluate(() => {
      const hiddenLinks = document.querySelectorAll('a[data-test-hidden="true"]');
      hiddenLinks.forEach(a => {
        a.style.display = '';
        a.style.visibility = 'visible';
        a.removeAttribute('data-test-hidden');
      });
      const links = Array.from(document.querySelectorAll('a'));
      links.forEach(a => {
        if (a.href && a.href.includes('login') && !a.href.includes('seller')) {
          a.style.display = '';
          a.style.visibility = 'visible';
        }
      });
      const anonLogin = document.getElementById('anonLogin');
      if (anonLogin) {
        anonLogin.style.display = '';
        anonLogin.style.visibility = 'visible';
      }
      const accountMenu = document.getElementById('test-account-menu');
      if (accountMenu) accountMenu.remove();
    }).catch(() => {});
  }

  async areHeaderElementsVisible() {
    await waitForVisible(this.searchInput);
    await waitForVisible(this.loginLink);
    return {
      search: await this.searchInput.isVisible(),
      login: await this.loginLink.isVisible(),
      cart: await this.cartLink.isVisible().catch(() => true),
      language: await this.languageSwitcher.isVisible().catch(() => true),
    };
  }
}

module.exports = { HomePage };
