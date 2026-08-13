import { test, expect, type Page } from "@playwright/test";

/**
 * In-depth E2E for the /secret/magi command dashboard.
 *
 * The route renders /public/magi.html inside a full-screen iframe, so the
 * interaction tests run directly against /magi.html (same document, no frame
 * hops). Each Playwright test gets an isolated storage context, so the
 * dashboard's localStorage seed regenerates per test.
 *
 * The MAGI council calls a serverless model; we exercise it with ?magi=local
 * so the tests are deterministic and never depend on network/keys.
 */

// The boot overlay auto-dismisses after its sequence; wait it out first.
async function bootThrough(page: Page) {
  await expect(page.locator("#boot")).toBeHidden({ timeout: 20_000 });
}
async function openTerminal(page: Page, query = "") {
  await page.goto("/magi.html" + query);
  await bootThrough(page);
}
async function openSection(page: Page, sec: string) {
  await page.locator(`.navitem[data-sec="${sec}"]`).click();
  await expect(page.locator(`#s-${sec}`)).toBeVisible();
}

test.describe("/secret/magi route", () => {
  test("mounts the terminal full-screen in a same-origin iframe", async ({ page }) => {
    const res = await page.goto("/secret/magi");
    expect(res?.ok()).toBeTruthy();
    const frame = page.locator('iframe[src="/magi.html"]');
    await expect(frame).toBeVisible();
    const box = await frame.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(300);
    expect(box?.height ?? 0).toBeGreaterThan(300);
  });
});

test.describe("Terminal shell", () => {
  test("boots and exposes every section with live home stats", async ({ page }) => {
    await openTerminal(page);
    await expect(page.locator("h1.title")).toContainText("PILOT");
    for (const label of ["TERMINAL", "MAGI COUNCIL", "ACADEMY", "SYNC TRIALS", "DEPLOYMENT", "PILOT LOG", "TIME AXIS"]) {
      await expect(page.locator(".navitem", { hasText: label })).toBeVisible();
    }
    await expect(page.locator("#k-total")).toHaveText("17"); // 17 seeded applications
    await expect(page.locator("#ratio")).toContainText("%");
    await expect(page.locator(".magi .dot")).toHaveCount(3); // MELCHIOR / BALTHASAR / CASPER
  });

  test("navigation switches sections and updates the breadcrumb", async ({ page }) => {
    await openTerminal(page);
    await openSection(page, "magi");
    await expect(page.locator("#crumb")).toHaveText("MAGI COUNCIL");
    await openSection(page, "intern");
    await expect(page.locator("#crumb")).toHaveText("DEPLOYMENT");
    await openSection(page, "calendar");
    await expect(page.locator("#crumb")).toHaveText("TIME AXIS");
  });
});

test.describe("MAGI council", () => {
  test("deliberates (local fallback) and returns a majority consensus", async ({ page }) => {
    await openTerminal(page, "?magi=local");
    await openSection(page, "magi");
    await page.locator("#magi-q").fill("Should I take the Optiver offer over Jane Street?");
    await page.locator("#magi-go").click();

    // Each unit renders a verdict.
    for (const u of ["melchior", "balthasar", "casper"]) {
      await expect(page.locator("#mv-" + u)).toHaveText(/APPROVE|REJECT|CONDITIONAL/, { timeout: 8000 });
    }
    // A consensus banner reveals with a ruling + tally.
    const consensus = page.locator("#magi-consensus");
    await expect(consensus).toBeVisible({ timeout: 8000 });
    await expect(page.locator("#mc-ruling")).toHaveText(/APPROVED|REJECTED|CONDITIONAL|DEADLOCK/);
    await expect(page.locator("#mc-tally")).toContainText("MAJORITY");
    // Logged to the deliberation history.
    await expect(page.locator("#magi-history")).toContainText("Optiver");
  });

  test("empty query is rejected without deliberating", async ({ page }) => {
    await openTerminal(page, "?magi=local");
    await openSection(page, "magi");
    await page.locator("#magi-go").click();
    await expect(page.locator("#magi-state")).toContainText("state a decision");
    await expect(page.locator("#magi-consensus")).toBeHidden();
  });
});

test.describe("Deployment tracker", () => {
  test("holds the real internship manifest (17 rows)", async ({ page }) => {
    await openTerminal(page);
    await openSection(page, "intern");
    const body = page.locator("#tbl-intern tbody");
    for (const co of ["Susquehanna", "Point72", "Apple", "Jane Street", "Citadel", "DRW"]) {
      await expect(body).toContainText(co);
    }
    await expect(page.locator("#tbl-intern tbody tr")).toHaveCount(17);
  });

  test("changing a status recomputes the live counts", async ({ page }) => {
    await openTerminal(page);
    await openSection(page, "intern");
    const submitted = page.locator("#c-Submitted");
    const before = Number(await submitted.textContent());
    await page.locator("#tbl-intern tbody tr").first().locator("select.pill").selectOption("Submitted");
    await expect(submitted).toHaveText(String(before + 1));
  });

  test("adding an application persists across a reload", async ({ page }) => {
    await openTerminal(page);
    await openSection(page, "intern");
    await page.locator("#s-intern .addrow").click();
    await expect(page.locator("#tbl-intern tbody tr")).toHaveCount(18);
    await expect(page.locator("#k-total")).toHaveText("18");
    await page.reload();
    await bootThrough(page);
    await openSection(page, "intern");
    await expect(page.locator("#tbl-intern tbody tr")).toHaveCount(18);
  });

  test("editing a company cell is saved", async ({ page }) => {
    await openTerminal(page);
    await openSection(page, "intern");
    const cell = page.locator('#tbl-intern tbody tr:first-child td[contenteditable][data-c="0"]');
    await cell.click();
    await cell.fill("Susquehanna International");
    await page.locator("#s-intern h2.sec").click(); // blur -> persist
    await page.reload();
    await bootThrough(page);
    await openSection(page, "intern");
    await expect(page.locator("#tbl-intern tbody")).toContainText("Susquehanna International");
  });
});

test.describe("Sync Trials (LeetCode)", () => {
  test("shows the seeded trial and logs a new one", async ({ page }) => {
    await openTerminal(page);
    await openSection(page, "leetcode");
    await expect(page.locator("#tbl-lc tbody")).toContainText("Two Sum");
    const total = page.locator("#lc-total");
    const before = Number(await total.textContent());
    await page.locator("#s-leetcode .addrow").click();
    await expect(total).toHaveText(String(before + 1));
    await expect(page.locator("#tbl-lc tbody")).toContainText("New Problem");
  });
});

test.describe("Academy (classes)", () => {
  test("shows seeded coursework and can add a course", async ({ page }) => {
    await openTerminal(page);
    await openSection(page, "classes");
    await expect(page.locator("#tbl-classes tbody")).toContainText("Stochastic Calculus");
    const rows = page.locator("#tbl-classes tbody tr");
    const before = await rows.count();
    await page.locator("#s-classes .addrow").click();
    await expect(rows).toHaveCount(before + 1);
  });
});

test.describe("Pilot Log (personal)", () => {
  test("commits a personal entry with mood + sync, persists, and purges", async ({ page }) => {
    await openTerminal(page);
    await openSection(page, "blog");
    await page.locator('.mood-btn[data-mood="SYNCHED"]').click();
    await page.locator("#plog-body").fill("Closed a hard problem today.");
    await page.locator("#s-blog .btn").click();

    const entry = page.locator(".plog-entry", { hasText: "Closed a hard problem today." });
    await expect(entry).toBeVisible();
    await expect(entry.locator(".pe-mood")).toHaveText("SYNCHED");

    await page.reload();
    await bootThrough(page);
    await openSection(page, "blog");
    const again = page.locator(".plog-entry", { hasText: "Closed a hard problem today." });
    await expect(again).toBeVisible();

    await again.locator(".del").click();
    await expect(page.locator(".plog-entry", { hasText: "Closed a hard problem today." })).toHaveCount(0);
  });
});

test.describe("Time Axis (calendar)", () => {
  test("navigates between months and returns to today", async ({ page }) => {
    await openTerminal(page);
    await openSection(page, "calendar");
    const start = (await page.locator("#cal-month").textContent()) ?? "";
    await page.locator("button", { hasText: "NEXT" }).click();
    await expect(page.locator("#cal-month")).not.toHaveText(start);
    await page.locator("button", { hasText: "TODAY" }).click();
    await expect(page.locator("#cal-month")).toHaveText(start);
  });

  test("logs an event, persists it across reload, and can delete it", async ({ page }) => {
    await openTerminal(page);
    await openSection(page, "calendar");
    const stamp = `E2E-${Date.now()}`;
    await page.locator("#ev-input").fill(stamp);
    await page.locator(".day-add button").click();
    await expect(page.locator("#cal-upcoming")).toContainText(stamp);

    await page.reload();
    await bootThrough(page);
    await openSection(page, "calendar");
    await expect(page.locator("#cal-upcoming")).toContainText(stamp);

    await page.locator(".day-panel .evrow", { hasText: stamp }).locator("button").click();
    await expect(page.locator("#cal-upcoming")).not.toContainText(stamp);
  });
});
