const { test, expect } = require('@playwright/test');
const { TEST_USER } = require('./helpers/testData');

test.describe('Frontend auth flows', () => {
  test('Login page loads correctly', async ({ page }) => {
    await page.goto('/frontend/login');
    await expect(page).toHaveTitle(/Aqua Life/i);
    await expect(page.getByText('EMAIL ADDRESS')).toBeVisible();
    await expect(page.getByText('PASSWORD', { exact: true })).toBeVisible();
  });

  test('User can log in with valid credentials', async ({ page }) => {
    await page.goto('/frontend/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Login shows error with wrong password', async ({ page }) => {
    await page.goto('/frontend/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/invalid|incorrect|wrong/i').first()).toBeVisible();
  });

  test('Login shows validation error when fields are empty', async ({ page }) => {
    await page.goto('/frontend/login');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/Invalid email address|Password must be string/i').first()).toBeVisible();
  });

  test('Signup page loads correctly', async ({ page }) => {
    await page.goto('/frontend/register');
    await expect(page).toHaveURL(/register/);
  });

  test('User can register a new account', async ({ page }) => {
    await page.goto('/frontend/register');
    await page.fill('input[placeholder="First name"]', 'New');
    await page.fill('input[placeholder="Last name"]', 'User');
    await page.fill('input[type="email"]', `newuser_${Date.now()}@test.com`);
    await page.fill('input[placeholder="Choose a username"]', `newuser_${Date.now()}`);
    const passwordInputs = page.locator('input[placeholder="••••••••"]');
    await passwordInputs.nth(0).fill('newpassword123');
    await passwordInputs.nth(1).fill('newpassword123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/frontend\/login/);
  });

  test('Signup shows error with duplicate email', async ({ page }) => {
    await page.goto('/frontend/register');
    await page.fill('input[placeholder="First name"]', 'Test');
    await page.fill('input[placeholder="Last name"]', 'User');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[placeholder="Choose a username"]', `duplicate_${Date.now()}`);
    const passwordInputs = page.locator('input[placeholder="••••••••"]');
    await passwordInputs.nth(0).fill('somepassword');
    await passwordInputs.nth(1).fill('somepassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/already|exists|taken/i').first()).toBeVisible();
  });

  test('User can log out', async ({ page }) => {
    await page.goto('/frontend/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL(/login/);
  });

  test('Unauthenticated user is redirected from dashboard to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/);
  });
});
