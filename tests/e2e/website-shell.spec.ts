import { expect, test, type Page } from "@playwright/test";

const variants = ["portal", "editorial", "university", "corporate"] as const;
async function open(page: Page, variant: string, width: number, height = 800) {
  await page.setViewportSize({ width, height });
  await page.goto(`/#/patterns/site-shell?preview=${variant}`);
  await expect(page.locator('[data-slot="website-shell"]')).toBeVisible();
  await expect(page.locator('[data-slot="website-shell"]')).toHaveAttribute("data-variant", variant);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator('[data-slot="page-render-error"]')).toHaveCount(0);
}

for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 390, 768, 1024, 1280, 1440]) {
    test(`four recipes have reachable navigation and footer (${width}px ${theme})`, async ({
      page,
    }) => {
      await page.addInitScript((value) => {
        localStorage.setItem("unitary-theme-preference", value);
        localStorage.setItem("unitary-docs-language", "en-US");
      }, theme);
      await page.emulateMedia({ reducedMotion: "reduce" });
      for (const variant of variants) {
        await open(page, variant, width);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
        ).toBeLessThanOrEqual(1);
        const navigation = page.locator('[data-slot="site-navigation"]');
        const mobile = width < (variant === "corporate" || variant === "university" ? 1280 : 1024);
        if (mobile) {
          const trigger = navigation.getByRole("button", { name: "Site navigation", exact: true });
          await trigger.click();
          const dialog = page.getByRole("dialog", { name: "Site navigation" });
          await expect(dialog).toBeVisible();
          const bounds = await dialog.boundingBox();
          expect(bounds!.x).toBeCloseTo(0, 0);
          expect(bounds!.width).toBeCloseTo(width, 0);
          expect(bounds!.height).toBeCloseTo(800, 0);
          await expect(page.locator("body")).toHaveAttribute("data-scroll-locked", "1");
          const position = await page.evaluate(() => scrollY);
          await page.mouse.move(5, 5);
          await page.mouse.wheel(0, 400);
          await expect.poll(() => page.evaluate(() => scrollY)).toBe(position);
          await dialog.getByRole("button", { name: "Research", exact: true }).click();
          await expect(dialog.getByRole("link", { name: /Research overview/ })).toBeVisible();
          await page.keyboard.press("Escape");
          await expect(dialog).toHaveCount(0);
          await expect(trigger).toBeFocused();
          await expect(page.locator("body")).not.toHaveAttribute("data-scroll-locked");
        } else {
          const trigger = navigation.getByRole("button", { name: "Research", exact: true });
          await trigger.focus();
          await page.keyboard.press("ArrowDown");
          const panel = navigation.locator('[data-slot="site-navigation-panel"]');
          await expect(panel).toBeVisible();
          await expect(panel.getByRole("link", { name: /Research overview/ })).toBeFocused();
          const geometry = await panel.boundingBox();
          expect(geometry!.x).toBeGreaterThanOrEqual(-1);
          expect(geometry!.x + geometry!.width).toBeLessThanOrEqual(width + 1);
          await page.keyboard.press("Escape");
          await expect(trigger).toBeFocused();
          await expect(panel).toHaveCount(0);
        }
        const footer = page.locator('[data-slot="footer"]');
        await footer.scrollIntoViewIfNeeded();
        if (variant === "corporate" && width < 768) {
          const disclosure = footer.getByRole("button", { name: "Research", exact: true });
          await expect(disclosure).toHaveAttribute("aria-expanded", "false");
          await disclosure.click();
          await expect(disclosure).toHaveAttribute("aria-expanded", "true");
        }
        await expect(footer.getByRole("link", { name: "Research overview" }).first()).toBeVisible();
        await footer.getByRole("combobox", { name: "Language" }).selectOption("zh-CN");
        await expect(page.getByRole("heading", { name: "探索值得分享的新想法" })).toHaveCount(1);
        await footer.getByRole("combobox", { name: "语言", exact: true }).selectOption("en-US");
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
        ).toBeLessThanOrEqual(1);
      }
    });
  }
}

test("touch menu in a short landscape viewport scrolls its body and cleans up across a breakpoint", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 767, height: 360 },
    reducedMotion: "reduce",
  });
  await context.addInitScript(() => localStorage.setItem("unitary-docs-language", "en-US"));
  const page = await context.newPage();
  await page.goto("/#/patterns/site-shell?preview=portal");
  const trigger = page.getByRole("button", { name: "Site navigation", exact: true });
  await trigger.tap();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Research", exact: true }).tap();
  const body = dialog.locator('[data-slot="site-navigation-mobile-body"]');
  expect(await body.evaluate((node) => node.scrollHeight > node.clientHeight)).toBe(true);
  await expect(dialog.getByRole("link", { name: "Explore", exact: true })).toBeInViewport();
  await page.setViewportSize({ width: 1024, height: 800 });
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('[data-slot="site-navigation-top-item"]').first()).toBeFocused();
  await expect(page.locator("body")).not.toHaveAttribute("data-scroll-locked");
  await page.setViewportSize({ width: 1023, height: 800 });
  await trigger.tap();
  await page.getByRole("dialog").getByRole("link", { name: "Explore", exact: true }).tap();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("#site-portal-stories")).toBeFocused();
  await context.close();
});

test("corporate scroll preserves fill, reveals stories, and returns focus with reduced motion", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("unitary-docs-language", "en-US"));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "corporate", 1440);
  const header = page.locator('[data-slot="navbar"]');
  await page.evaluate(() => scrollTo(0, 800));
  await expect(header).toHaveClass(/bg-background-100/);
  await page.evaluate(() => scrollTo(0, 650));
  await expect(header).not.toHaveClass(/-translate-y-full/);
  await expect(header).toHaveClass(/bg-background-100/);
  await expect(page.locator('[data-slot="scroll-reveal"][data-pending]')).toHaveCount(0);
  await page.getByRole("button", { name: "Back to top" }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator("#site-corporate-main")).toBeFocused();
  await expect(header).not.toHaveClass(/bg-background-100/);
});

test("documentation preview renders both the template and copyable source", async ({ page }) => {
  await page.goto("/#/patterns/site-shell");
  await expect(page.locator('[data-slot="page-render-error"]')).toHaveCount(0);
  const preview = page.frameLocator('[data-demo-component="website-shell"]');
  await expect(preview.locator('[data-slot="website-shell"]')).toBeVisible();
  await expect(page.locator('[data-slot="code-block"]')).toContainText(
    "export function WebsiteShell",
  );
});

test("new component guides fit narrow and wide docs layouts in both themes", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.addInitScript(
        (value) => localStorage.setItem("unitary-theme-preference", value),
        theme,
      );
      for (const slug of ["site-navigation", "scroll-reveal", "back-to-top"]) {
        await page.goto(`/?lang=en-US#/components/${slug}`);
        await page.reload();
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        await expect(page.locator('[data-slot="page-render-error"]')).toHaveCount(0);
        await expect(page.locator("h1")).toBeVisible();
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
        ).toBeLessThanOrEqual(1);
      }
    }
  }
});

test("ordinary scroll reveals an offscreen corporate story once", async ({ page }) => {
  await open(page, "corporate", 1440);
  const reveal = page.locator('[data-slot="scroll-reveal"]').last();
  await expect(reveal).toHaveAttribute("data-pending", "true");
  await reveal.scrollIntoViewIfNeeded();
  await expect(reveal).not.toHaveAttribute("data-pending");
  await expect.poll(() => reveal.evaluate((node) => getComputedStyle(node).opacity)).toBe("1");
  await page.evaluate(() => scrollTo(0, 0));
  await expect(reveal).not.toHaveAttribute("data-pending");
});

for (const breakpoint of [768, 1280]) {
  test(`crossing ${breakpoint}px closes the modal and restores visible focus`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("unitary-docs-language", "en-US"));
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: breakpoint - 1, height: 800 });
    await page.goto(
      breakpoint === 768
        ? "/#/components/site-navigation"
        : "/#/patterns/site-shell?preview=corporate",
    );
    const nav = page.locator('[data-slot="site-navigation"]');
    await nav.getByRole("button", { name: "Site navigation", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.setViewportSize({ width: breakpoint, height: 800 });
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(nav.locator('[data-slot="site-navigation-top-item"]').first()).toBeFocused();
    await expect(page.locator("body")).not.toHaveAttribute("data-scroll-locked");
  });
}

test("desktop hover, native rail controls, and search remain usable", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("unitary-docs-language", "en-US"));
  await open(page, "portal", 1440);
  const navigation = page.locator('[data-slot="site-navigation"]');
  const research = navigation.getByRole("button", { name: "Research", exact: true });
  await research.hover();
  await expect(research).toHaveAttribute("aria-expanded", "true");
  await navigation.getByRole("link", { name: /Research overview/ }).hover();
  await expect(research).toHaveAttribute("aria-expanded", "true");
  await page.mouse.move(1420, 750);
  await expect(research).toHaveAttribute("aria-expanded", "false");
  await research.click();
  await navigation.getByRole("link", { name: /Research overview/ }).click();
  await expect(page.locator("#site-portal-main")).toBeFocused();
  const search = page.getByRole("button", { name: "Site search", exact: true });
  await search.click();
  const input = page.getByRole("searchbox", { name: "Enter keywords" });
  await expect(input).toBeFocused();
  await input.fill("no-such-page");
  await expect(page.getByRole("status")).toHaveText("0 matching navigation results");
  await page.keyboard.press("Escape");
  await expect(input).toHaveCount(0);
  await expect(search).toBeFocused();
  const rail = page.locator('[data-slot="scroller"] > div').last();
  await page.getByRole("button", { name: "Scroll right" }).click();
  await expect.poll(() => rail.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
  await page.setViewportSize({ width: 390, height: 800 });
  const mobileTrigger = navigation.getByRole("button", { name: "Site navigation", exact: true });
  await mobileTrigger.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(mobileTrigger).toBeFocused();
});
