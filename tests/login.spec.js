const { test, expect } = require('../fixtures/daraz.fixture');
const { EXPECTED, LANGUAGES } = require('../config/constants');

test.describe('Login & Language @login', () => {
  test('TC-01: Successful login with valid credentials @high @smoke', async ({
    darazHome,
    loginPage,
    testUsers,
  }) => {
    await darazHome.openLogin();
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);

    await expect(darazHome.loginLink).not.toBeVisible({ timeout: 15_000 });
    expect(await darazHome.isLoggedIn()).toBeTruthy();
  });

  test('TC-02: Multi-language UI (English/Sinhala) @high', async ({ darazHome, page }) => {
    const bodyText = await page.locator('body').innerText();

    const hasEnglish = /Login|Search|Cart|Become a Seller/i.test(bodyText);
    const hasSinhala = /[\u0D80-\u0DFF]/.test(bodyText);

    expect(hasEnglish || hasSinhala).toBeTruthy();
  });

  test('TC-17: Switch language to Sinhala and back to English @high', async ({ darazHome, page }) => {
    await darazHome.switchLanguage(LANGUAGES.sinhala.altLabel);
    let bodyText = await page.locator('body').innerText();
    const hasSinhala = /[\u0D80-\u0DFF]/.test(bodyText);
    expect(hasSinhala).toBeTruthy();

    await darazHome.switchLanguage(LANGUAGES.english.label);
    bodyText = await page.locator('body').innerText();
    expect(/Login|Search|Daraz/i.test(bodyText)).toBeTruthy();
  });
});
