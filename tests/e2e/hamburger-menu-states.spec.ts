import { expect, test } from "@playwright/test";

test.setTimeout(45_000);

for (const theme of ["light", "dark"] as const) {
  test(`HamburgerMenu empty and loading states (${theme})`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript((preferredTheme) => {
      localStorage.setItem("unitary-docs-language", "en-US");
      localStorage.setItem("unitary-theme-preference", preferredTheme);
    }, theme);
    await page.goto("/#/components/hamburger-menu");
    const demo = page.getByRole("heading", { name: "Live Demo" }).locator("..");
    await demo.getByRole("button", { name: "Menu", exact: true }).click();
    const panel = page.locator('[data-slot="expand-panel"]:visible');
    await expect(panel.getByRole("link", { name: "Overview" })).toBeVisible();
    const search = panel.getByRole("searchbox");
    await search.fill("unlikely-item-025");
    await expect(panel.locator('[data-slot="menu-results-region"] [role="status"]')).toHaveText('No results found for "unlikely-item-025".');
    await search.fill("");
    await expect(panel.getByRole("link", { name: "Overview" })).toBeVisible();
    await page.keyboard.press("Escape");

    await demo.getByRole("button", { name: "Empty", exact: true }).click();
    await demo.getByRole("button", { name: "Menu", exact: true }).click();
    await expect(panel.locator('[data-slot="menu-nav"] [role="status"]')).toHaveText("No results found");
    await expect(panel.getByRole("link", { name: "Overview" })).toHaveCount(0);
    await page.keyboard.press("Escape");

    await demo.getByRole("button", { name: "Loading", exact: true }).click();
    await demo.getByRole("button", { name: "Menu", exact: true }).click();
    await expect(panel.locator('[data-slot="menu-nav"]')).toHaveAttribute("aria-busy", "true");
    await expect(panel.locator('[data-slot="menu-loading"][role="status"]')).toHaveText("Loading...");
    await expect(panel.locator('[data-slot="spinner"]')).toBeVisible();
    await expect(panel.locator('[data-slot="menu-empty"]')).toHaveCount(0);
    await page.keyboard.press("Escape");

    await demo.getByRole("button", { name: "Items", exact: true }).click();
    await demo.getByRole("button", { name: "Menu", exact: true }).click();
    await expect(panel.locator('[data-slot="menu-nav"]')).toHaveAttribute("aria-busy", "false");
    await expect(panel.getByRole("link", { name: "Overview" })).toBeVisible();
  });
}
