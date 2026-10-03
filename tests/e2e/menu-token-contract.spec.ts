import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"] as const) {
  test.describe(`menu row tokens (${theme})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((theme) => {
        localStorage.setItem("unitary-docs-language", "en-US");
        localStorage.setItem("unitary-theme-preference", theme);
      }, theme);
    });

    test("updates both menu families and preserves keyboard navigation", async ({ page }) => {
      await page.goto("/#/components/menu");
      const trigger = page.getByRole("button", { name: "Actions", exact: true }).first();
      await trigger.click();
      const item = page.locator('[data-slot="menu-item"]').first();
      await expect(item).toHaveCSS("height", "36px");
      await page.evaluate(() =>
        document.documentElement.style.setProperty("--uni-popover-row-height", "52px"),
      );
      await expect(item).toHaveCSS("height", "52px");
      await page.keyboard.press("Home");
      await expect(page.getByRole("menuitem", { name: "One", exact: true })).toBeFocused();
      await page.keyboard.press("End");
      await expect(page.getByRole("menuitem", { name: "Delete", exact: true })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(trigger).toBeFocused();

      await page.goto("/#/components/context-menu");
      await page.getByLabel("Context menu target").first().click({ button: "right" });
      const contextItem = page.getByRole("menuitem").first();
      await expect(contextItem).toHaveCSS("height", "52px");
      await page.evaluate(() => document.documentElement.style.removeProperty("--uni-popover-row-height"));
      await expect(contextItem).toHaveCSS("height", "36px");
      await page.keyboard.press("Escape");
      await expect(page.getByRole("menu")).toHaveCount(0);
    });

    test("keeps the touch minimum when the configured row height is smaller", async ({ browser, baseURL }) => {
      const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, hasTouch: true });
      try {
        const page = await context.newPage();
        await page.addInitScript((theme) => {
          localStorage.setItem("unitary-docs-language", "en-US");
          localStorage.setItem("unitary-theme-preference", theme);
        }, theme);
        await page.goto("/#/components/menu");
        expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
        await page.getByRole("button", { name: "Actions", exact: true }).first().tap();
        const item = page.locator('[data-slot="menu-item"]').first();
        await expect(item).toHaveCSS("height", "44px");
        await page.evaluate(() => document.documentElement.style.setProperty("--uni-popover-row-height", "20px"));
        await expect(item).toHaveCSS("height", "44px");
        await page.evaluate(() => document.documentElement.style.setProperty("--uni-popover-row-height", "52px"));
        await expect(item).toHaveCSS("height", "52px");
      } finally {
        await context.close();
      }
    });
  });
}
