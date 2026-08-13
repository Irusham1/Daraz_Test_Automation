const { HOME_URL, TIMEOUTS } = require('../../config/constants');
const { dismissOverlays } = require('../../utils/cookieHelper');
const { waitForPageReady } = require('../../utils/waitHelpers');

class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async goto(path = HOME_URL) {
    try {
      await this.page.goto(path, {
        waitUntil: 'domcontentloaded',
        timeout: TIMEOUTS.navigation,
      });
    } catch (err) {
      await this.page.goto(path, {
        waitUntil: 'commit',
        timeout: TIMEOUTS.navigation,
      }).catch(() => {});
    }
    await dismissOverlays(this.page);
  }

  async reload() {
    await this.page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
    await dismissOverlays(this.page);
  }
}

module.exports = { BasePage };
