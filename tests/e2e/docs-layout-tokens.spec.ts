import { expect, test } from "@playwright/test";

test.use({ actionTimeout: 10_000 });
test.setTimeout(60_000);

for (const theme of ["light", "dark"] as const) {
  test.describe(`docs layout token consumers (${theme})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((value) => {
        localStorage.setItem("unitary-theme-preference", value);
        localStorage.setItem("unitary-docs-language", "en-US");
      }, theme);
      await page.emulateMedia({ reducedMotion: "reduce" });
    });

    test("shares shell geometry and derives the brand column from sidebar and gutter", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/#/layout/grid");
      const navbar = page.locator('[data-slot="navbar"]').first();
      const main = page.locator("#main-content");
      const sidebar = page.locator('[data-slot="docs-sidebar"]');
      const brandColumn = page.locator('[data-slot="docs-topbar-brand"]').locator("..");
      await expect(navbar).toHaveCSS("max-width", "1220px");
      await expect(main).toHaveCSS("max-width", "1220px");
      await expect(sidebar).toHaveCSS("width", "260px");
      await expect(brandColumn).toHaveCSS("width", "238px");
      await expect(main).toHaveCSS("margin-top", "0px");
      await expect(sidebar).toHaveCSS("top", "0px");
      await expect(sidebar).toHaveCSS("height", "836px");
      const headerBounds = await navbar.boundingBox();
      const mainBounds = await main.boundingBox();
      const sidebarBounds = await sidebar.boundingBox();
      expect(mainBounds!.y).toBe(headerBounds!.y + headerBounds!.height);
      expect(sidebarBounds!.y).toBe(mainBounds!.y);
      expect(sidebarBounds!.y + sidebarBounds!.height).toBe(900);
      await page.screenshot({ path: `.scratch/docs-layout-tokens/shell-${theme}.png` });
      await main.evaluate((element) => { element.scrollTop = 400; });
      await expect.poll(async () => (await sidebar.boundingBox())!.y).toBe(mainBounds!.y);
      expect((await navbar.boundingBox())!.y).toBe(0);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      await main.evaluate((element) => { element.scrollTop = 0; });

      await page.evaluate(() => {
        const style = document.documentElement.style;
        style.setProperty("--uni-doc-layout-shell-width", "1236px");
        style.setProperty("--uni-doc-layout-sidebar-width", "280px");
        style.setProperty("--uni-doc-layout-shell-gutter", "24px");
      });
      await expect(navbar).toHaveCSS("width", "1236px");
      await expect(main).toHaveCSS("width", "1236px");
      await expect(sidebar).toHaveCSS("width", "280px");
      await expect(brandColumn).toHaveCSS("width", "256px");
      const tracks = await main.evaluate(
        (element) => getComputedStyle(element).gridTemplateColumns,
      );
      expect(tracks.split(" ")[0]).toBe("280px");

      await page.setViewportSize({ width: 390, height: 844 });
      await navbar.locator('[data-slot="hamburger-trigger"]').click();
      const panel = page.locator('[data-slot="expand-panel"]');
      await expect(panel).toHaveCSS("width", "292px");
      await page.evaluate(() =>
        document.documentElement.style.setProperty("--uni-doc-layout-mobile-nav-width", "304px"),
      );
      await expect(panel).toHaveCSS("width", "304px");
      await page.keyboard.press("Escape");
      await expect(panel).toHaveCount(0);
    });

    test("preserves the strict 480px footer breakpoint and capsule centering", async ({ page }) => {
      await page.goto("/#/layout/grid");
      const footer = page.locator('[data-slot="feedback-anchor"]');
      const row = page.locator("nav").filter({ has: footer });
      for (const width of [320, 390, 479, 480, 481, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await expect(footer).toBeVisible();
        const geometry = await footer.evaluate((element) => {
          const column = element.parentElement!;
          const nav = column.parentElement!;
          const feedback = element.getBoundingClientRect();
          const bounds = nav.getBoundingClientRect();
          return {
            column: getComputedStyle(column).gridColumnStart,
            span: getComputedStyle(column).gridColumnEnd,
            tracks: getComputedStyle(nav).gridTemplateColumns.split(" ").length,
            center: feedback.x + feedback.width / 2 - (bounds.x + bounds.width / 2),
            height: column.getBoundingClientRect().height,
          };
        });
        expect(geometry.tracks, `viewport ${width}`).toBe(width < 480 ? 2 : 3);
        expect(geometry.column).toBe(width < 480 ? "1" : "2");
        expect(geometry.span).toBe(width < 480 ? "span 2" : "auto");
        expect(Math.abs(geometry.center)).toBeLessThanOrEqual(2);
        expect(geometry.height).toBe(48);
        await expect(row).toBeVisible();
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await footer.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `.scratch/docs-layout-tokens/footer-${theme}.png` });
    });

    test("consumes prose rhythm and indents only the marked list", async ({ page }) => {
      await page.goto("/#/colors");
      const markedList = page.locator('[data-slot="docs-prose-list"].list-disc');
      await expect(markedList).toHaveCSS("padding-left", "20px");
      await page.evaluate(() =>
        document.documentElement.style.setProperty("--uni-doc-list-indent", "2rem"),
      );
      await expect(markedList).toHaveCSS("padding-left", "32px");

      await page.goto("/#/layout/grid");
      const list = page.locator('[data-grid-demo="best-practices"] ul');
      await expect(list).toHaveCSS("padding-left", "0px");
      const lead = page.locator('[data-slot="docs-prose-lead"]').first();
      const section = page.locator('[data-slot="docs-prose-section"]').first();
      const paragraph = page.locator('[data-slot="docs-prose-paragraph"]').first();
      await expect(lead).toHaveCSS("margin-top", "12px");
      await expect(section).toHaveCSS("margin-top", "40px");
      await expect(paragraph).toHaveCSS("margin-top", "16px");
      await expect(list.locator("li").nth(1)).toHaveCSS("margin-top", "12px");
      await page.evaluate(() => {
        const style = document.documentElement.style;
        for (const suffix of ["title-lead", "section", "heading-body", "paragraph", "list-item"]) {
          style.setProperty(`--uni-doc-space-${suffix}`, "2rem");
        }
      });
      for (const element of [lead, section, paragraph, list, list.locator("li").nth(1)]) {
        await expect(element).toHaveCSS("margin-top", "32px");
      }
    });

    test("updates Menu and ContextMenu padding through the shared public token", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/#/layout/grid");
      await page.locator('[data-slot="navbar"] button[aria-label="Select language"]').click();
      const menu = page.locator('[data-slot="menu"]');
      await expect(menu).toHaveCSS("padding", "6px");
      await page.evaluate(() =>
        document.documentElement.style.setProperty("--uni-popover-padding", "10px"),
      );
      await expect(menu).toHaveCSS("padding", "10px");
      await page.keyboard.press("Escape");

      await page.goto("/#/components/context-menu");
      const trigger = page.getByLabel("Context menu target").first();
      await trigger.click({ button: "right" });
      const context = page.getByRole("menu");
      await expect(context).toHaveCSS("padding", "10px");
      await page.evaluate(() =>
        document.documentElement.style.removeProperty("--uni-popover-padding"),
      );
      await expect(context).toHaveCSS("padding", "6px");
    });

    test("reuses radius tokens for demo frames and the icon editor", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/#/components/button");
      const card = page.locator("[data-demo-card]").first();
      const showCode = card.getByRole("button", { name: "Show code", exact: true });
      await expect(card).toHaveCSS("border-top-left-radius", "8px");
      await expect(showCode).toHaveCSS("border-bottom-left-radius", "8px");
      await showCode.click();
      await expect(showCode).toHaveCSS("border-bottom-left-radius", "0px");

      // 离线 fallback 也沿用相同圆角尺。 / Exercise the same radius scale offline.
      await page.route("https://cdn.simpleicons.org/**", (route) => route.abort());
      await page.goto("/#/icons");
      await page.getByRole("button", { name: "ArrowUp", exact: true }).click();
      const dialog = page.getByRole("dialog");
      const preview = dialog.locator("div.h-40");
      const color = dialog.locator("#icon-color");
      await expect(preview).toHaveCSS("border-top-left-radius", "8px");
      await expect(color).toHaveCSS("border-top-left-radius", "6px");
      await page.evaluate(() => document.documentElement.style.setProperty("--radius", "10px"));
      await expect(color).toHaveCSS("border-top-left-radius", "10px");
      await page.keyboard.press("Escape");
      const fallback = page.locator('button[aria-label$="(simple-icons)"] span.rounded-sm').first();
      await expect(fallback).toHaveCSS("border-top-left-radius", "8px");
    });
  });
}
