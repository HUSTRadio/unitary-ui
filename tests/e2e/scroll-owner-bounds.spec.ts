import { expect, test } from "@playwright/test";
import { collectLocalScrollOwners } from "./helpers/scroll-owner-bounds";

test("scroll audit respects ancestor clips without accepting visible escapes", async ({ page }) => {
  for (const clip of ["hidden", "clip", "auto", "visible"]) {
    await page.setContent(`<main id="main-content" style="width:300px;height:200px"><div style="width:300px;height:100px;overflow:${clip}"><div data-slot="docs-local-scroll" style="width:250px;height:400px;overflow-x:auto"><div style="width:600px">wide content</div></div></div></main>`);
    const owners = await page.evaluate(collectLocalScrollOwners);
    const child = owners.find((owner) => owner.selector.includes("docs-local-scroll"))!;
    expect(child.rect.height).toBe(400);
    expect(child.insideMain).toBe(clip !== "visible");
    if (clip !== "visible") expect(child.visibleRect.height).toBe(100);
  }
  await page.setContent('<main id="main-content" style="width:300px;height:200px"><div data-slot="docs-local-scroll" style="width:400px;overflow-x:auto"><div style="width:600px">escape</div></div></main>');
  expect((await page.evaluate(collectLocalScrollOwners))[0].insideMain).toBe(false);
});

for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 1280]) {
    test(`App Shell anchor navigation preserves its local owner at ${width}px (${theme})`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((value) => {
        localStorage.setItem("unitary-theme-preference", value);
        localStorage.setItem("unitary-docs-language", "en-US");
      }, theme);
      await page.goto("/#/patterns/app-shell");
      const viewport = page.locator('[data-slot="app-shell-viewport"]');
      await expect(viewport).toBeVisible();
      await viewport.scrollIntoViewIfNeeded();
      await page.evaluate(async () => { await document.fonts.ready; });
      const frame = viewport.locator("..");
      await viewport.evaluate((node) => {
        node.scrollTop = 0;
        (node as HTMLElement).style.setProperty("--uni-motion-state", "1s");
      });
      if (width < 1024) await frame.locator('[data-slot="hamburger-trigger"]').click();
      const navigation = width < 1024
        ? frame.locator('[data-slot="menu-nav"] a[href="#demo-api"]')
        : frame.locator('[data-slot="sidebar-nav"] a[href="#demo-api"]');
      // Let Playwright finish actionability scrolling before measuring the actual navigation.
      await navigation.click({ trial: true });
      const outerPositions = await viewport.evaluate((node) => {
        const positions: number[] = [];
        for (let ancestor = node.parentElement; ancestor; ancestor = ancestor.parentElement) positions.push(ancestor.scrollTop);
        return positions;
      });
      await navigation.click();
      await expect(page).toHaveURL(/#\/patterns\/app-shell$/);
      await expect.poll(() => viewport.evaluate((node) => {
        const target = node.querySelector<HTMLElement>("#demo-api")!;
        const offset = target.getBoundingClientRect().top - node.getBoundingClientRect().top - node.clientTop;
        const margin = Number.parseFloat(getComputedStyle(target).scrollMarginBlockStart) || 0;
        const padding = Number.parseFloat(getComputedStyle(node).scrollPaddingBlockStart) || 0;
        const destination = Math.min(node.scrollHeight - node.clientHeight, Math.max(0, node.scrollTop + offset - margin - padding));
        return Math.abs(node.scrollTop - destination);
      })).toBeLessThanOrEqual(1);
      await expect.poll(() => viewport.evaluate((node) =>
        (node as HTMLElement).style.getPropertyValue("scroll-behavior"),
      )).toBe("");
      expect(await viewport.evaluate((node) => {
        const positions: number[] = [];
        for (let ancestor = node.parentElement; ancestor; ancestor = ancestor.parentElement) positions.push(ancestor.scrollTop);
        return positions;
      })).toEqual(outerPositions);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    });
  }
  test(`App Shell local scroll bounds stay contained across the matrix (${theme})`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem("unitary-theme-preference", value), theme);
    await page.goto("/#/patterns/app-shell");
    const viewport = page.locator('[data-slot="app-shell-viewport"]');
    await expect(viewport).toBeVisible();
    for (const width of [320, 390, 768, 1024, 1100, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (const end of [false, true]) {
        await viewport.evaluate((element, end) => { element.scrollTop = end ? element.scrollHeight : 0; }, end);
        const owners = await page.evaluate(collectLocalScrollOwners);
        expect(owners.length).toBeGreaterThan(0);
        expect(owners.filter((owner) => !owner.insideMain)).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
      }
    }
  });
}
