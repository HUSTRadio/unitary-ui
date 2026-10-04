import { expect, test } from "@playwright/test";

test.setTimeout(90_000);

for (const language of ["zh-CN", "en-US"] as const) {
  for (const theme of ["light", "dark"] as const) {
    for (const width of [390, 1440]) {
      test(`API provenance stays concise and accurate (${language}, ${theme}, ${width}px)`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.addInitScript(({ language, theme }) => {
          localStorage.setItem("unitary-docs-language", language);
          localStorage.setItem("unitary-theme-preference", theme);
        }, { language, theme });
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));

        await page.goto("/#/network/prefetch");
        const api = page.locator("#api-reference");
        const note = api.locator('[data-api-origin="extension"]');
        await expect(note).toHaveText(language === "zh-CN"
          ? "本表 API 均为 Unitary 扩展。" : "All APIs in this table are Unitary extensions.");
        await expect(api.locator('[data-slot="docs-api-extension-badge"]')).toHaveCount(0);
        const resourceRow = api.locator("tbody tr").filter({ has: page.locator("td code", { hasText: /^resource$/ }) });
        await expect(resourceRow.locator("td").first()).toHaveText("resource*");
        await expect(api.locator("tbody tr")).toHaveCount(15);
        await note.evaluate((element) => element.scrollIntoView({ block: "start" }));
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
        await page.screenshot({ path: `.scratch/api-origin/${language}-${theme}-${width}.png` });

        await page.goto("/#/components/checkbox");
        await expect(api.locator('[data-slot="docs-api-extension-badge"]')).toHaveCount(2);
        await expect(api.locator('[data-api-origin="extension"]')).toHaveCount(0);
        const markedNames = await api.locator('tbody tr:has([data-slot="docs-api-extension-badge"]) td:first-child code').allTextContents();
        expect(markedNames).toEqual(["defaultChecked", "size"]);

        await page.goto("/#/components/button");
        await expect(api.locator("table")).toBeVisible();
        await expect(api.locator('[data-api-origin="extension"], [data-slot="docs-api-extension-badge"]')).toHaveCount(0);
        expect(errors).toEqual([]);
      });
    }
  }
}
