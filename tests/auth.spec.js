const { test, expect } = require('../fixtures/daraz.fixture');

test.describe('Authentication @auth', () => {
  test('TC-14: Login modal shows email and password fields @high @smoke', async ({
    darazHome,
    loginPage,
  }) => {
    await darazHome.openLogin();
    const modalVisible = await loginPage.isModalVisible();

    expect(modalVisible).toBeTruthy();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC-15: Invalid credentials do not log user in @high', async ({
    darazHome,
    loginPage,
    testUsers,
  }) => {
    await darazHome.openLogin();
    await loginPage.login(testUsers.invalidUser.email, testUsers.invalidUser.password);

    const loginFailed = await loginPage.hasLoginFailed();
    expect(loginFailed).toBeTruthy();
    expect(await darazHome.isLoggedIn()).toBeFalsy();
  });

  test('TC-16: Logout returns user to guest state @high', async ({
    darazHome,
    loginPage,
    testUsers,
  }) => {
    await darazHome.openLogin();
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
    await expect(darazHome.loginLink).not.toBeVisible({ timeout: 15_000 });

    await darazHome.logout();
    expect(await darazHome.isLoggedIn()).toBeFalsy();
  });
});
