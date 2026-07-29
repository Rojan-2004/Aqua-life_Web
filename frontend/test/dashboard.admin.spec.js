const { test, expect } = require('@playwright/test');
const { TEST_USER, TEST_ADMIN } = require('./helpers/testData');

test.describe('Frontend dashboard and admin flows', () => {
  test('Customer dashboard shows stats after login', async ({ page }) => {
    await page.goto('/frontend/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);
    await expect(page.locator('text=/orders|wishlist/i').first()).toBeVisible();
  });

  test('Admin dashboard loads for admin user', async ({ page }) => {
    await page.goto('/frontend/login');
    await page.fill('input[type="email"]', TEST_ADMIN.email);
    await page.fill('input[type="password"]', TEST_ADMIN.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);
    await page.goto('/admin');
    await expect(page.locator('text=/store overview|admin/i').first()).toBeVisible();
  });

  test('Admin can navigate to products page', async ({ page }) => {
    await page.goto('/frontend/login');
    await page.fill('input[type="email"]', TEST_ADMIN.email);
    await page.fill('input[type="password"]', TEST_ADMIN.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);
    await page.goto('/admin/products');
    await expect(page).toHaveURL(/products/);
  });

  test('Admin can navigate to orders page', async ({ page }) => {
    await page.goto('/frontend/login');
    await page.fill('input[type="email"]', TEST_ADMIN.email);
    await page.fill('input[type="password"]', TEST_ADMIN.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);
    await page.goto('/admin/orders');
    await expect(page.locator('text=/orders/i').first()).toBeVisible();
  });

  test('AI Assistant page loads and shows chat interface', async ({ page }) => {
    await page.goto('/frontend/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);
    await page.goto('/ai-assistant');
    await expect(page.locator('textarea, input[placeholder*="ask" i]').first()).toBeVisible();
  });
});
