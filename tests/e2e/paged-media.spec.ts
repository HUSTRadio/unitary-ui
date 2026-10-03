import { expect, test } from "@playwright/test";

test.setTimeout(120_000);

for (const theme of ["light", "dark"] as const) {
  test.describe(`Paged media and mobile navigation (${theme})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((value) => {
        localStorage.setItem("unitary-docs-language", "en-US");
        localStorage.setItem("unitary-theme-preference", value);
      }, theme);
    });

    test("numbered pagination and carousel work with narrow, wide and keyboard input", async ({
      page,
    }) => {
      for (const width of [320, 1280]) {
        await page.setViewportSize({ width, height: 844 });
        await page.goto("/#/components/pagination");
        const pager = page.locator('[data-slot="numbered-pagination"]');
        await expect(pager).toBeVisible();
        await expect(pager.locator('[aria-current="page"]')).toHaveText("6");
        await pager.getByRole("button", { name: "Go to page 24", exact: true }).click();
        await expect(pager.locator('[aria-current="page"]')).toHaveText("24");
        await expect(pager.getByRole("button", { name: "Next", exact: true })).toBeDisabled();
        await page.goto("/#/components/carousel");
        const carousel = page.locator('[data-slot="carousel"]').first();
        const region = carousel.locator('[data-slot="full-page-scroller"]');
        await carousel.getByRole("button", { name: "Next image", exact: true }).click();
        await expect(region).toHaveAttribute("data-index", "1");
        await region.focus();
        await page.keyboard.press("End");
        await expect(region).toHaveAttribute("data-index", "2");
        const active = region.locator('[data-slot="full-page-section"]:not([inert])');
        const sizes = await region.evaluate((element) => ({
          width: element.clientWidth,
          height: element.clientHeight,
        }));
        expect(sizes.height).toBeGreaterThan(80);
        expect(sizes.width / sizes.height).toBeCloseTo(16 / 9, 1);
        await expect(active.getByRole("img")).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
          ),
        ).toBe(true);
        await carousel.screenshot({ path: `.scratch/paged-media/carousel-${theme}-${width}.png` });
      }
    });

    test("wheel thresholds, momentum, keyboard and fullscreen preserve whole sections", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/#/components/full-page-scroller");
      const region = page.locator('[data-slot="full-page-scroller"]');
      await region.scrollIntoViewIfNeeded();
      await region.hover();
      await page.mouse.wheel(0, 30);
      await expect(region).toHaveAttribute("data-index", "0");
      await page.mouse.wheel(0, 55);
      await expect(region).toHaveAttribute("data-index", "1");
      await page.mouse.wheel(0, 200);
      await expect(region).toHaveAttribute("data-index", "1");
      await page.waitForTimeout(650);
      await page.mouse.wheel(0, 100);
      await expect(region).toHaveAttribute("data-index", "2");
      await region.focus();
      await page.keyboard.press("Home");
      await expect(region).toHaveAttribute("data-index", "0");
      await page.getByRole("button", { name: "Open fullscreen" }).click();
      await expect.poll(() => page.evaluate(() => document.fullscreenElement !== null)).toBe(true);
      const dimensions = await region.evaluate((element) => ({
        height: element.clientHeight,
        viewport: window.innerHeight,
      }));
      expect(dimensions.height).toBe(dimensions.viewport);
      await page.evaluate(() => document.exitFullscreen());
      await expect.poll(() => page.evaluate(() => document.fullscreenElement === null)).toBe(true);
      await page.emulateMedia({ reducedMotion: "reduce" });
      expect(
        await region
          .locator('[data-slot="full-page-track"]')
          .evaluate((element) => parseFloat(getComputedStyle(element).transitionDuration)),
      ).toBeLessThanOrEqual(0.00001);
    });

    test("lazy content mounts in its local viewport and keeps placeholder geometry", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/#/components/lazy-load");
      const viewport = page.locator('[data-slot="lazy-demo-viewport"]');
      await viewport.scrollIntoViewIfNeeded();
      const regions = viewport.locator('[data-slot="lazy-load"]');
      await expect(regions.first()).toHaveAttribute("data-loaded", "true");
      await expect(regions.last()).toHaveAttribute("data-loaded", "false");
      const before = await regions.last().boundingBox();
      const totalHeight = await viewport.evaluate((element) => element.scrollHeight);
      await viewport.evaluate((element) => {
        element.scrollTop = element.scrollHeight;
      });
      await expect(regions.last()).toHaveAttribute("data-loaded", "true");
      expect(await viewport.evaluate((element) => element.scrollHeight)).toBe(totalHeight);
      expect((await regions.last().boundingBox())!.height).toBeCloseTo(before!.height, 1);
      await viewport.evaluate((element) => {
        element.scrollTop = 0;
      });
      await expect(regions.last()).toHaveAttribute("data-loaded", "true");
      await expect(regions.first().getByRole("img")).toBeVisible();
    });
  });
}

test("touch threshold and horizontal carousel gestures work on a touch device", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem("unitary-docs-language", "en-US"));
  await page.goto("http://127.0.0.1:5211/#/components/full-page-scroller");
  const session = await context.newCDPSession(page);
  const region = page.locator('[data-slot="full-page-scroller"]').first();
  await region.scrollIntoViewIfNeeded();
  const swipe = async (dx: number, dy: number) => {
    const box = (await region.boundingBox())!;
    const x = box.x + box.width / 2,
      y = box.y + box.height / 2;
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x + dx, y: y + dy }],
    });
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  };
  await swipe(0, -25);
  await expect(region).toHaveAttribute("data-index", "0");
  await swipe(0, -90);
  await expect(region).toHaveAttribute("data-index", "1");
  await page.goto("http://127.0.0.1:5211/#/components/carousel");
  await region.scrollIntoViewIfNeeded();
  await swipe(-90, 0);
  await expect(region).toHaveAttribute("data-index", "1");
  await context.close();
});
