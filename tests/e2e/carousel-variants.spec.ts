import { expect, test } from "@playwright/test";

test.setTimeout(120_000);

for (const theme of ["light", "dark"] as const) {
  test.describe(`Carousel effects (${theme})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((value) => {
        localStorage.setItem("unitary-docs-language", "en-US");
        localStorage.setItem("unitary-theme-preference", value);
      }, theme);
    });

    test("effects retain selection, overlap images and fit narrow viewports", async ({ page }) => {
      for (const width of [320, 1280]) {
        await page.setViewportSize({ width, height: 844 });
        await page.goto("/#/components/carousel");
        const demo = page.locator('[data-demo-container="variants"]');
        const carousel = demo.locator('[data-slot="carousel"]');
        const region = carousel.locator('[data-slot="full-page-scroller"]');
        await region.focus();
        await page.keyboard.press("Home");
        await carousel.getByRole("button", { name: "Next image", exact: true }).click();
        for (const name of ["Fade", "Fade and scale", "Slide"]) {
          await demo.getByRole("combobox", { name: "Transition effect" }).click();
          await page.getByRole("option", { name, exact: true }).click();
          await expect(region).toHaveAttribute("data-index", "1");
          const layout = await region.evaluate((element) => {
            const sections = [...element.querySelectorAll('[data-slot="full-page-section"]')];
            const rects = sections.map((section) => section.getBoundingClientRect());
            return {
              track: getComputedStyle(element.querySelector('[data-slot="full-page-track"]')!)
                .transform,
              // Scaling expands the edges, while stacked slides keep the same center.
              overlap: rects.every((rect) => rect.width > 0 && rect.height > 0
                && Math.abs(rect.left + rect.width / 2 - (rects[0].left + rects[0].width / 2)) < 1
                && Math.abs(rect.top + rect.height / 2 - (rects[0].top + rects[0].height / 2)) < 1),
              ratio: element.clientWidth / element.clientHeight,
            };
          });
          expect(layout.ratio).toBeCloseTo(16 / 9, 1);
          if (name !== "Slide") {
            expect(layout.track).toBe("none");
            expect(layout.overlap).toBe(true);
          }
          expect(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          ).toBe(true);
        }
        await demo.screenshot({ path: `.scratch/carousel-variants/${theme}-${width}.png` });
      }
    });

    test("all fades have nonlinear progress and reverse smoothly", async ({
      page,
    }) => {
      await page.goto("/#/components/carousel");
      const demo = page.locator('[data-demo-container="variants"]');
      const carousel = demo.locator('[data-slot="carousel"]');
      const region = carousel.locator('[data-slot="full-page-scroller"]');
      const incoming = region.locator('[data-slot="full-page-section"]').nth(1);
      for (const name of ["Fade", "Fade and scale"]) {
        await demo.getByRole("combobox", { name: "Transition effect" }).click();
        await page.getByRole("option", { name, exact: true }).click();
        await region.focus();
        await page.keyboard.press("Home");
        await page.waitForTimeout(550);
        await carousel.getByRole("button", { name: "Next image", exact: true }).click();
        const progress = await incoming.evaluate((element) => {
          const animation = element
            .getAnimations()
            .find((item) => item instanceof CSSTransition && item.transitionProperty === "opacity");
          if (!animation) throw new Error("Missing opacity transition");
          animation.pause();
          const duration = Number(animation.effect!.getTiming().duration);
          animation.currentTime = duration * 0.2;
          const opacity = parseFloat(getComputedStyle(element).opacity);
          animation.play();
          return opacity;
        });
        expect(progress).toBeGreaterThan(0.6);
        expect(progress).toBeLessThan(0.8);

        const reversal = await incoming.evaluate(async (element) => {
          const before = parseFloat(getComputedStyle(element).opacity);
          element
            .closest('[data-slot="carousel"]')!
            .querySelector<HTMLButtonElement>('[aria-label="Previous image"]')!
            .click();
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          const animation = element
            .getAnimations()
            .find((item) => item instanceof CSSTransition && item.transitionProperty === "opacity");
          return { before, from: Number(animation?.effect?.getKeyframes()[0].opacity) };
        });
        expect(reversal.from).toBeGreaterThan(0);
        expect(reversal.from).toBeLessThan(1);
        expect(Math.abs(reversal.from - reversal.before)).toBeLessThan(0.1);
        await expect(region).toHaveAttribute("data-index", "0");
        await expect(incoming).toHaveCSS("opacity", "0");
      }
      await demo.getByRole("combobox", { name: "Transition effect" }).click();
      await page.getByRole("option", { name: "Fade and scale", exact: true }).click();
      await expect(page.locator('[data-slot="select-content"]')).toHaveCount(0);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await carousel.getByRole("button", { name: "Next image", exact: true }).click();
      await expect(incoming).toHaveCSS("opacity", "1");
      expect(
        await incoming.evaluate((element) =>
          parseFloat(getComputedStyle(element).transitionDuration),
        ),
      ).toBeLessThanOrEqual(0.00001);
      await expect(incoming).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
    });
  });
}

test("fade effects keep horizontal touch paging", async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem("unitary-docs-language", "en-US"));
  await page.goto(`${baseURL}/#/components/carousel`);
  const region = page.locator('[data-demo-container="variants"] [data-slot="full-page-scroller"]');
  await region.scrollIntoViewIfNeeded();
  const box = (await region.boundingBox())!;
  const x = box.x + box.width * 0.75,
    y = box.y + box.height / 2;
  const session = await context.newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: x - 90, y }],
  });
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(region).toHaveAttribute("data-index", "1");
  await expect(region.locator('[data-slot="full-page-section"]').nth(1)).toHaveCSS("opacity", "1");
  await context.close();
});
