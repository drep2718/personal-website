import { test, expect } from "@playwright/test";

/**
 * Whole-site smoke sweep. Cheap but broad: every route must return 2xx and
 * render a non-empty document. If a build/route/import breaks anywhere, this
 * fails in CI on the merge to main — not silently in production.
 */
const routes = [
  "/",
  "/about",
  "/projects",
  "/experience",
  "/resume",
  "/skills",
  "/interests",
  "/blog",
  "/secret",
  "/secret/magi",
  "/secret/vault",
  "/secret/photos",
  "/secret/blog",
  "/secret/blogentry",
];

for (const route of routes) {
  test(`route ${route} responds 2xx and renders`, async ({ page }) => {
    const res = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(res, `${route} produced no response`).not.toBeNull();
    expect(res!.ok(), `${route} returned ${res!.status()}`).toBeTruthy();
    await expect(page.locator("body")).not.toBeEmpty();
  });
}

test("the terminal document itself is served from /public", async ({ page }) => {
  const res = await page.goto("/magi.html", { waitUntil: "domcontentloaded" });
  expect(res?.ok()).toBeTruthy();
  await expect(page).toHaveTitle(/MAGI Terminal/i);
});

test("the MAGI bridge /api/magi responds (200 whether or not a key is set)", async ({ request }) => {
  const res = await request.post("/api/magi", { data: { query: "smoke test" } });
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json).toHaveProperty("configured"); // false in CI (no key), true when a model key is set
});
