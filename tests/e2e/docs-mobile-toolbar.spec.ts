import { expect, test } from "@playwright/test";

test.use({ hasTouch: true, actionTimeout: 15_000 });
test.setTimeout(120_000);

for (const theme of ["light", "dark"] as const) {
  test.describe(`Docs mobile toolbar (${theme})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript((value) => {
        localStorage.setItem("unitary-docs-language", "en-US");
        localStorage.setItem("unitary-theme-preference", value);
      }, theme);
    });

    for (const width of [320, 390, 767]) {
      test(`theme is left-aligned and current language is right-aligned at ${width}px`, async ({
        page,
      }, testInfo) => {
        await page.setViewportSize({ width, height: 844 });
        await page.goto("/#/components/pagination");
        await page.locator('[data-slot="navbar"] [data-slot="hamburger-trigger"]').click();
        const panel = page.locator('[data-slot="expand-panel"][data-state="open"]');
        const toolbar = panel.locator('[data-slot="panel-toolbar"]');
        const language = toolbar.getByRole("button", { name: "Select language" });
        await expect(toolbar).toBeVisible();
        await expect(language).toHaveText("English");
        await page.evaluate(() => document.fonts.ready);

        const geometry = await toolbar.evaluate((element) => {
          const row = element.getBoundingClientRect();
          const switcher = element.querySelector('[data-slot="theme-switcher"]')!;
          const themeBox = switcher.getBoundingClientRect();
          const languageBox = element.querySelector('[aria-haspopup="menu"]')!.getBoundingClientRect();
          return {
            leftInset: themeBox.left - row.left,
            rightInset: row.right - languageBox.right,
            gap: languageBox.left - themeBox.right,
            centerOffset: (themeBox.top + themeBox.bottom - languageBox.top - languageBox.bottom) / 2,
            languageHeight: languageBox.height,
            radios: Array.from(switcher.querySelectorAll('[role="radio"]')).map((button) => {
              const box = button.getBoundingClientRect();
              const icon = Array.from(button.querySelectorAll("svg")).find(
                (svg) => getComputedStyle(svg).visibility === "visible",
              )!;
              const iconBox = icon.getBoundingClientRect();
              return {
                width: box.width,
                height: box.height,
                iconWidth: iconBox.width,
                iconHeight: iconBox.height,
              };
            }),
          };
        });
        expect(geometry.leftInset).toBeCloseTo(16, 0);
        expect(geometry.rightInset).toBeCloseTo(16, 0);
        expect(geometry.gap).toBeGreaterThanOrEqual(8);
        expect(geometry.centerOffset).toBeCloseTo(0, 0);
        expect(geometry.languageHeight).toBeCloseTo(44, 2);
        expect(geometry.radios).toHaveLength(3);
        // 本 spec 全程 hasTouch，命中组件的 pointer-coarse:min-h-11/min-w-11：
        // 视觉档位与顶栏一致（默认 size-8 + size-4 图标），命中区仍为 44×44（HIG-AUD-013）。
        for (const radio of geometry.radios) {
          expect(radio.width).toBeCloseTo(44, 2);
          expect(radio.height).toBeCloseTo(44, 2);
          expect(radio.iconWidth).toBeCloseTo(16, 0);
          expect(radio.iconHeight).toBeCloseTo(16, 0);
        }
        await expect(toolbar.locator(".lucide-smartphone")).toBeVisible();
        await expect(toolbar.locator(".lucide-monitor")).toBeHidden();

        await language.click();
        const menu = page.getByRole("menu", { name: "Select language", exact: true });
        await expect(menu.getByRole("menuitem", { name: "English", exact: true })).toHaveAttribute("aria-current", "true");
        await menu.getByRole("menuitem", { name: "中文", exact: true }).click();
        await expect(toolbar.getByRole("button", { name: "选择语言" })).toHaveText("中文");
        await expect(panel).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        if (width === 390) {
          await toolbar.screenshot({ path: testInfo.outputPath("toolbar.png") });
          await panel.screenshot({ path: testInfo.outputPath("sidebar.png") });
        }
      });
    }

    test("theme and language selection preserve the open panel and saved preferences", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/#/components/pagination");
      await page.locator('[data-slot="navbar"] [data-slot="hamburger-trigger"]').click();
      const panel = page.locator('[data-slot="expand-panel"][data-state="open"]');
      const toolbar = panel.locator('[data-slot="panel-toolbar"]');
      for (const [label, preference] of [["Dark", "dark"], ["Light", "light"], ["System", "system"]] as const) {
        const radio = toolbar.getByRole("radio", { name: label, exact: true });
        await radio.click();
        await expect(radio).toHaveAttribute("aria-checked", "true");
        await expect(page.locator("html")).toHaveAttribute("data-theme", preference === "system" ? theme : preference);
        expect(await page.evaluate(() => localStorage.getItem("unitary-theme-preference"))).toBe(preference);
        await expect(panel).toBeVisible();
      }

      await toolbar.getByRole("button", { name: "Select language" }).click();
      await page.getByRole("menuitem", { name: "中文", exact: true }).click();
      const language = toolbar.getByRole("button", { name: "选择语言" });
      await expect(language).toHaveText("中文");
      expect(await page.evaluate(() => localStorage.getItem("unitary-docs-language"))).toBe("zh-CN");
      await language.focus();
      await page.keyboard.press("Enter");
      await page.getByRole("menuitem", { name: "English", exact: true }).focus();
      await page.keyboard.press("Enter");
      await expect(toolbar.getByRole("button", { name: "Select language" })).toHaveText("English");
      await expect(panel).toBeVisible();
      expect(await page.evaluate(() => localStorage.getItem("unitary-docs-language"))).toBe("en-US");
    });
  });
}
