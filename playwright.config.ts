import { defineConfig, devices } from "@playwright/test";

/**
 * E2E config. By default the tests run against a production build
 * (`next build && next start`) on port 3100. Locally, if you already have a
 * server on that port, it's reused.
 */
const PORT = Number(process.env.E2E_PORT ?? 3100);
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `${baseURL}/secret/magi`,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
