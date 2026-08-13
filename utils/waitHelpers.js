const { TIMEOUTS } = require('../config/constants');

/**
 * Waits for network to settle after navigation or search actions.
 */
async function waitForPageReady(page, options = {}) {
  const timeout = options.timeout ?? TIMEOUTS.medium;

  await page.waitForLoadState('domcontentloaded', { timeout }).catch(() => {});
  await page.waitForLoadState('networkidle', { timeout }).catch(() => {
    // Daraz often has long-polling; networkidle may not always resolve.
  });
}

/**
 * Retries a locator visibility check with polling.
 */
async function waitForVisible(locator, options = {}) {
  const timeout = options.timeout ?? TIMEOUTS.medium;
  await locator.waitFor({ state: 'visible', timeout }).catch(() => {});
}

/**
 * Waits for URL to match a pattern.
 */
async function waitForUrl(page, pattern, options = {}) {
  const timeout = options.timeout ?? TIMEOUTS.medium;
  const currentUrl = page.url();
  if (typeof pattern === 'string' && currentUrl.includes(pattern)) return;
  if (pattern instanceof RegExp && pattern.test(currentUrl)) return;
  await page.waitForURL(pattern, { timeout }).catch(() => {});
}

module.exports = {
  waitForPageReady,
  waitForVisible,
  waitForUrl,
};
