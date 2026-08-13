/**
 * Dismisses common Daraz overlays (cookie banners, popups).
 */
async function dismissOverlays(page) {
  const closeSelectors = [
    '.ant-modal-close',
    '[aria-label="Close"]',
    'button:has-text("Accept")',
    'button:has-text("Got it")',
    '.next-dialog-close',
    '.iweb-dialog-close',
    '.lzd-login-signup-popup-close',
    '.mod-login-close',
  ];

  for (const selector of closeSelectors) {
    const element = page.locator(selector).first();
    if (await element.isVisible({ timeout: 1_000 }).catch(() => false)) {
      await element.click({ force: true }).catch(() => {});
    }
  }

  await page.evaluate(() => {
    const overlays = document.querySelectorAll(
      '.iweb-dialog-mask, .lzd-login-signup-popup-mask, .login-popup, .next-dialog, .iweb-mask'
    );
    overlays.forEach(el => el.style.display = 'none');
  }).catch(() => {});
}

module.exports = { dismissOverlays };
