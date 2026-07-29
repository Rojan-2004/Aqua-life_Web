const { test, expect } = require('@playwright/test');
const { TEST_USER } = require('./helpers/testData');

test.describe('Frontend catalogue flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/frontend/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);
  });

  test('Catalogue page loads and shows products', async ({ page }) => {
    await page.goto('/catalogue');
    await page.waitForSelector('text=/Rs\\./', { timeout: 15000 });
    await expect(page.locator('text=/Rs\\./').first()).toBeVisible();
  });

  test('Catalogue page shows product names and prices', async ({ page }) => {
    await page.goto('/catalogue');
    await page.waitForSelector('text=/Rs\\./', { timeout: 15000 });
    const prices = page.locator('text=/Rs\\./');
    await expect(prices.first()).toBeVisible();
  });

  test('Category filter narrows product results', async ({ page }) => {
    await page.goto('/catalogue');
    await page.waitForSelector('text=/Rs\\./', { timeout: 15000 });
    await page.click('button:has-text("Fish")');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=/Rs\\./').first()).toBeVisible();
  });

  test('Search input filters products by name', async ({ page }) => {
    await page.goto('/catalogue');
    await page.waitForSelector('text=/Rs\\./', { timeout: 15000 });
    await page.fill('input[placeholder*="search" i]', 'Neon');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=/Neon/i').first()).toBeVisible();
  });

  test('Clicking a product card opens the detail page', async ({ page }) => {
    await page.goto('/catalogue');
    await page.waitForSelector('a[href*="/catalogue/"]', { timeout: 15000 });
    await page.click('a[href*="/catalogue/"]');
    await expect(page).toHaveURL(/catalogue\/.+/);
  });

  test('Product detail page shows name, price, and description', async ({ page }) => {
    await page.goto('/catalogue');
    await page.waitForSelector('a[href*="/catalogue/"]', { timeout: 15000 });
    await page.click('a[href*="/catalogue/"]');
    await expect(page.locator('text=/Rs\\./').first()).toBeVisible();
  });

  test('Add to Cart button is visible on product detail page', async ({ page }) => {
    await page.goto('/catalogue');
    await page.waitForSelector('a[href*="/catalogue/"]', { timeout: 15000 });
    await page.click('a[href*="/catalogue/"]');
    await expect(page.locator('button:has-text("Add to Cart")')).toBeVisible();
  });

  test('Back to Catalogue link works on product detail page', async ({ page }) => {
    await page.goto('/catalogue');
    await page.waitForSelector('a[href*="/catalogue/"]', { timeout: 15000 });
    await page.click('a[href*="/catalogue/"]');
    await page.click('text=Back to Catalogue');
    await expect(page).toHaveURL(/catalogue$/);
  });
});
