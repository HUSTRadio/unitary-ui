import { expect, test } from "@playwright/test";

test.setTimeout(90_000);

for (const theme of ["light", "dark"] as const) {
  for (const language of ["zh-CN", "en-US"] as const) {
    for (const width of [390, 1440]) {
      test(`network and async navigation (${language}, ${theme}, ${width}px)`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 900 });
        await page.addInitScript(({ theme, language }) => {
          localStorage.setItem("unitary-theme-preference", theme);
          localStorage.setItem("unitary-docs-language", language);
        }, { theme, language });
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto("/#/network/lazy-load");
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        const zh = language === "zh-CN";
        await expect(page.locator("#main-content h1")).toHaveText(zh ? "延迟加载" : "Lazy Load");

        const mobile = width < 1024;
        if (mobile) {
          await page.locator('[data-slot="navbar"] [data-slot="hamburger-trigger"]').click();
        }
        const nav = page.locator(mobile ? '[data-slot="menu-nav"]' : '[data-slot="docs-sidebar"]');
        const headingSlot = mobile ? "menu-group-heading" : "sidebar-nav-heading";
        const groupSlot = mobile ? "menu-group" : "sidebar-nav-group";
        const networkTitle = zh ? "网络与异步" : "Network & Async";
        const componentTitle = zh ? "组件" : "Components";
        const headings = await nav.locator(`[data-slot="${headingSlot}"]`).allTextContents();
        const index = headings.indexOf(networkTitle);
        expect(index).toBeGreaterThan(0);
        expect(headings[index - 1]).toBe("API");
        expect(headings[index + 1]).toBe(componentTitle);

        const network = nav.locator(`[data-slot="${groupSlot}"]`).filter({
          has: page.locator(`[data-slot="${headingSlot}"]`, { hasText: networkTitle }),
        });
        await expect(network.locator("a")).toHaveText(zh ? ["延迟加载", "预载"] : ["Lazy Load", "Prefetch"]);
        const components = nav.locator(`[data-slot="${groupSlot}"]`).filter({
          has: page.locator(`[data-slot="${headingSlot}"]`, { hasText: componentTitle }),
        });
        await expect(components.locator('a[href*="/network/lazy-load"], a[href*="/network/prefetch"]')).toHaveCount(0);

        await network.screenshot({ path: testInfo.outputPath("network-navigation.png") });
        await network.getByRole("link", { name: zh ? "预载" : "Prefetch", exact: true }).click();
        await expect(page).toHaveURL(/#\/network\/prefetch$/);
        await expect(page.locator("#main-content h1")).toHaveText(zh ? "预载" : "Prefetch");
        await expect(page.locator('[data-demo-card="default"] [data-slot="prefetch-demo"]')).toBeVisible();
        if (mobile) {
          await expect(page.locator('[data-slot="expand-panel"][data-state="open"]')).toHaveCount(0);
        }

        await page.keyboard.press("Control+k");
        await page.getByRole("combobox").fill(zh ? "延迟加载" : "Lazy Load");
        await expect(page.locator('[cmdk-group-heading]:visible')).toHaveText(networkTitle);
        await page.getByRole("option", { name: zh ? "延迟加载" : "Lazy Load", exact: true }).click();
        await expect(page).toHaveURL(/#\/network\/lazy-load$/);
        await expect(page.locator("#main-content h1")).toHaveText(zh ? "延迟加载" : "Lazy Load");
        expect(errors).toEqual([]);
      });
    }
  }
}
