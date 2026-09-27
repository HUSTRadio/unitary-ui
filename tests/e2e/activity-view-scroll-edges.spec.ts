import { expect, test, type Page } from "@playwright/test";

async function openActivityView(page: Page, width = 390) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width, height: 844 });
  await page.goto("/#/components/activity-view");
  await page.locator('[data-demo-card="default"]').getByRole("button", { name: "Share", exact: true }).click();
  const row = page.locator('[data-slot="activity-view-targets"]');
  await expect(row.getByRole("button")).toHaveCount(8);
  return row;
}

for (const theme of ["light", "dark"] as const) {
  test(`overflow hints follow target scrolling (${theme})`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem("unitary-theme-preference", value), theme);
    const row = await openActivityView(page);
    const start = page.locator('[data-slot="activity-view-scroll-start"]');
    const end = page.locator('[data-slot="activity-view-scroll-end"]');
    await expect(end).toBeVisible();
    await expect(start).toHaveCount(0);
    expect(await end.evaluate((node) => getComputedStyle(node).pointerEvents)).toBe("none");
    const initial = await row.evaluate((node) => ({ visible: node.clientWidth, total: node.scrollWidth }));
    expect(initial.total).toBeGreaterThan(initial.visible);

    await row.evaluate((node) => { node.scrollLeft = node.scrollWidth; });
    await expect(start).toBeVisible();
    await expect(end).toHaveCount(0);
    const last = row.getByRole("button", { name: "More" });
    await expect(last).toBeInViewport();
    await last.click();
    await expect(page.locator('[data-slot="bottom-sheet"]')).toHaveCount(0);
    await expect(page.getByText("Opened more targets")).toBeVisible();
  });

  test(`keyboard reaches the clipped target and resize updates hints (${theme})`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem("unitary-theme-preference", value), theme);
    const row = await openActivityView(page);
    const first = row.getByRole("button", { name: "Copy" });
    await first.focus();
    await expect(first).toBeFocused();
    for (let index = 0; index < 7; index++) await page.keyboard.press("Tab");
    const last = row.getByRole("button", { name: "More" });
    await expect(last).toBeFocused();
    await expect(last).toBeInViewport();
    await expect(page.locator('[data-slot="activity-view-scroll-start"]')).toBeVisible();
    await row.evaluate((node) => { node.scrollLeft = node.scrollWidth; });
    await expect(page.locator('[data-slot="activity-view-scroll-end"]')).toHaveCount(0);
    await page.setViewportSize({ width: 900, height: 844 });
    await expect(page.locator('[data-slot="activity-view-scroll-start"]')).toHaveCount(0);
    await expect(page.locator('[data-slot="activity-view-scroll-end"]')).toHaveCount(0);
  });
}
