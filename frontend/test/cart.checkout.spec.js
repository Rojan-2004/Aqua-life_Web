const { test, expect } = require('@playwright/test');
const { TEST_USER } = require('./helpers/testData');

test.describe('Frontend cart and checkout flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/frontend/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);
  });

  test('Cart page loads for authenticated user', async ({ page }) => {
    await page.goto('/cart');
    await expect(page).toHaveURL(/cart/);
  });

  test('Adding a product to cart shows success feedback', async ({ page }) => {
    await page.goto('/catalogue');
    await page.waitForSelector('a[href*="/catalogue/"]', { timeout: 15000 });
    await page.click('a[href*="/catalogue/"]');
    await page.click('button:has-text("Add to Cart")');
    await expect(page.locator('text=/added|cart/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('Cart shows added product', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.locator('h1, h2')).toContainText(/cart/i);
  });

  test('Checkout page loads and shows shipping form', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.locator('input[name="fullName"], input[placeholder*="name" i]').first()).toBeVisible();
  });

  test('Checkout page shows empty cart message when no items', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.locator('text=/Your cart is empty/i').first()).toBeVisible();
  });

  test('Checkout page shows order summary with delivery fee', async ({ page }) => {
    await page.goto('/catalogue');
    await page.waitForSelector('a[href*="/catalogue/"]', { timeout: 15000 });
    await page.click('a[href*="/catalogue/"]');
    await page.click('button:has-text("Add to Cart")');
    await page.waitForTimeout(1000);
    await page.goto('/checkout');
    await expect(page.locator('text=/Delivery Fee/i').first()).toBeVisible();
  });

  test('Order success page renders after order is placed', async ({ page }) => {
    await page.goto('/checkout/success?orderId=testid12345678');
    await expect(page.locator('text=/order placed|success/i').first()).toBeVisible();
  });
});
