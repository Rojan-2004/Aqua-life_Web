const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./",
  timeout: 30000,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    ignoreHTTPSErrors: true,
    baseURL: "http://localhost:3001",
  },
  webServer: {
    command: "cd .. && npm run dev",
    url: "http://localhost:3001",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
