import { expect, test } from "@playwright/test";
import { finishMotion, pauseWAAPI } from "./helpers/motion";

test.setTimeout(120_000);

for (const theme of ["light", "dark"] as const) {
  test.describe(`Carousel effects (${theme})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await pauseWAAPI(page, '[data-slot="carousel"]');
      await page.addInitScript((value) => {
        localStorage.setItem("unitary-docs-language", "en-US");
        localStorage.setItem("unitary-theme-preference", value);
      }, theme);
    });

    test("effects retain selection, overlap images and fit narrow viewports", async ({ page }) => {
      for (const width of [320, 1280]) {
        await page.setViewportSize({ width, height: 844 });
        await page.goto("/#/components/carousel", { waitUntil: "domcontentloaded" });
        const demo = page.locator('[data-demo-container="variants"]');
        const carousel = demo.locator('[data-slot="carousel"]');
        const region = carousel.locator('[data-slot="full-page-scroller"]');
        await expect(carousel).toBeVisible({ timeout: 30_000 });
        await page.evaluate(() => document.fonts.ready);
        await region.scrollIntoViewIfNeeded();
        await region.focus();
        await page.keyboard.press("Home");
        await carousel.getByRole("button", { name: "Next image", exact: true }).click();
        for (const name of ["Fade", "Fade and scale", "Slide"]) {
          await demo.getByRole("combobox", { name: "Transition effect" }).click();
          await page.getByRole("option", { name, exact: true }).click();
          await expect(page.locator('[data-slot="select-content"]')).toHaveCount(0);
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
        await demo.screenshot({ path: test.info().outputPath(`${theme}-${width}.png`) });
      }
    });

    test("all fades have nonlinear progress and reverse smoothly", async ({
      page,
    }) => {
      await page.goto("/#/components/carousel", { waitUntil: "domcontentloaded" });
      const demo = page.locator('[data-demo-container="variants"]');
      const carousel = demo.locator('[data-slot="carousel"]');
      const region = carousel.locator('[data-slot="full-page-scroller"]');
      const incoming = region.locator('[data-slot="full-page-section"]').nth(1);
      await expect(carousel).toBeVisible({ timeout: 30_000 });
      await page.evaluate(() => document.fonts.ready);
      for (const name of ["Fade", "Fade and scale"]) {
        await demo.getByRole("combobox", { name: "Transition effect" }).click();
        await page.getByRole("option", { name, exact: true }).click();
        await expect(page.locator('[data-slot="select-content"]')).toHaveCount(0);
        await region.scrollIntoViewIfNeeded();
        await region.focus();
        await page.keyboard.press("Home");
        await expect(region).toHaveAttribute("data-index", "0");
        await region.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
        await carousel.getByRole("button", { name: "Next image", exact: true }).click();
        await expect(region).toHaveAttribute("data-index", "1");
        const progress = await incoming.evaluate(async (element) => {
          const animation = element
            .getAnimations()
            .find((item) => item.effect instanceof KeyframeEffect && item.effect.getKeyframes().some(frame => frame.opacity !== undefined));
          if (!animation) throw new Error("Missing opacity transition");
          const group = [...element.closest('[data-slot="carousel"]')!.querySelectorAll('[data-slot="full-page-section"]')]
            .flatMap(node => node.getAnimations());
          group.forEach(item => item.pause());
          await Promise.all(group.map(item => item.ready));
          const duration = Number(animation.effect!.getTiming().duration);
          group.forEach(item => { item.currentTime = duration * 0.2; });
          const opacity = parseFloat(getComputedStyle(element).opacity);
          // Keep the sampled frame fixed until the reverse selection commits.
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
            .find((item) => item.effect instanceof KeyframeEffect && item.effect.getKeyframes().some(frame => frame.opacity !== undefined));
          const effect = animation?.effect;
          return { before, from: Number(effect instanceof KeyframeEffect ? effect.getKeyframes()[0].opacity : undefined) };
        });
        expect(reversal.from).toBeGreaterThan(0);
        expect(reversal.from).toBeLessThan(1);
        expect(Math.abs(reversal.from - reversal.before)).toBeLessThan(0.1);
        await expect(region).toHaveAttribute("data-index", "0");
        await finishMotion(region);
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
