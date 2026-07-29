const { test, expect } = require("@playwright/test");

test.describe("Frontend login page", () => {
  test("should load login page and show login form", async ({ page }) => {
    await page.goto("http://localhost:3001/frontend/login");
    await expect(page).toHaveTitle(/Aqua Life/i);
    await expect(page.getByText("EMAIL ADDRESS")).toBeVisible();
    await expect(page.getByText("PASSWORD", { exact: true })).toBeVisible();
  });
});
