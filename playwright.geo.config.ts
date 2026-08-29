import { defineConfig, devices } from "@playwright/test";

/**
 * Standalone config for the geo structured-data e2e suite.
 * Runs against the local dev server (or BASE_URL when set, e.g. a preview build).
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 4,
  timeout: 45_000,
  reporter: [["list"]],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:8080",
    viewport: { width: 1280, height: 1800 },
    ...devices["Desktop Chrome"],
  },
});
