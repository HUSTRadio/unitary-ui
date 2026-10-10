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

    test("mobile topbar has symmetric insets and one working search entry", async ({ page }) => {
      for (const width of [320, 390, 767]) {
        await page.setViewportSize({ width, height: 844 });
        await page.goto("/#/components/pagination");
        const header = page.locator('[data-slot="navbar"]').first();
        const trigger = header.locator('[data-slot="hamburger-trigger"]');
        const search = header.locator('button[aria-label="Search documentation"]');
        await expect(trigger).toBeVisible();
        const geometry = await header.evaluate((element) => {
          const shell = element.getBoundingClientRect();
          const button = element
            .querySelector('[data-slot="hamburger-trigger"]')!
            .getBoundingClientRect();
          const brand = element
            .querySelector('[data-slot="docs-topbar-brand"]')!
            .getBoundingClientRect();
          return {
            inset: button.left - shell.left,
            center: (brand.left + brand.right) / 2 - (shell.left + shell.right) / 2,
          };
        });
        expect(geometry.inset).toBeGreaterThanOrEqual(12);
        expect(Math.abs(geometry.center)).toBeLessThanOrEqual(2);
        await trigger.click();
        const panel = page.locator('[data-slot="expand-panel"][data-state="open"]');
        await expect(panel).toBeVisible();
        await expect(panel.locator('button[aria-label="Search"]')).toHaveCount(0);
        await expect(search).toBeVisible();
        await search.click();
        await expect(page.getByRole("dialog", { name: "Command Menu" })).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog", { name: "Command Menu" })).toHaveCount(0);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
          ),
        ).toBe(true);
      }
    });

    test("rapid real pointer clicks reverse the same panel and leave no stale lock", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/#/components/hamburger-menu");
      const trigger = page.locator('[data-slot="navbar"] [data-slot="hamburger-trigger"]').first();
      const box = await trigger.boundingBox();
      expect(box).not.toBeNull();
      const click = () => page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
      await click();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await page.locator('[data-slot="expand-panel"]').evaluate((element) => {
        (element as HTMLElement).dataset.continuity = "retained";
      });
      for (let i = 0; i < 10; i++) {
        await page.waitForTimeout(35);
        await click();
        await expect(trigger).toHaveAttribute("aria-expanded", i % 2 === 0 ? "false" : "true");
        await expect(page.locator('[data-slot="expand-panel"]')).toHaveAttribute(
          "data-continuity",
          "retained",
        );
      }
      // Rapid reversals may already settle at the open endpoint. Establish a
      // fresh opening and sample its timeline explicitly for the continuity check.
      await click();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(page.locator('[data-slot="expand-panel"]')).toHaveCount(0);
      await click();
      const panel = page.locator('[data-slot="expand-panel"]');
      await expect(panel).toHaveAttribute("data-motion-state", "open");
      const continuity = await panel.evaluate(async (element) => {
        const opening = element.getAnimations().find((animation) =>
          animation instanceof CSSTransition && animation.transitionProperty === "translate");
        if (!opening?.effect) throw new Error("Expected an opening translate transition");
        opening.pause();
        opening.currentTime = Number(opening.effect.getComputedTiming().duration) / 2;
        const before = getComputedStyle(element).translate;
        document
          .querySelector<HTMLButtonElement>('[data-slot="navbar"] [data-slot="hamburger-trigger"]')!
          .click();
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const transition = element
          .getAnimations()
          .find((animation) => animation instanceof CSSTransition && animation.transitionProperty === "translate");
        return { before, from: transition?.effect?.getKeyframes()[0].translate };
      });
      // The compositor can advance one frame before React commits the click.
      expect(
        Math.abs(parseFloat(String(continuity.from)) - parseFloat(continuity.before)),
      ).toBeLessThan(8);
      expect(parseFloat(String(continuity.from))).toBeLessThan(0);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(panel).toHaveCount(0);
      expect(await page.evaluate(() => document.body.style.pointerEvents)).not.toBe("none");
      await click();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Escape");
      await expect(panel).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });
  });
}
