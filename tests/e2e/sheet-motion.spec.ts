import { expect, test, type Locator, type Page } from "@playwright/test";

test.setTimeout(60_000);
const PANEL = '[data-slot="sheet-content"]';
const OVERLAY = '[data-slot="sheet-overlay"]';
const SIDES = ["top", "right", "bottom", "left"] as const;

async function openRoute(page: Page, theme: "light" | "dark", reduced = false) {
  await page.emulateMedia({ reducedMotion: reduced ? "reduce" : "no-preference" });
  await page.addInitScript((value) => {
    localStorage.setItem("unitary-docs-language", "en-US");
    localStorage.setItem("unitary-theme-preference", value);
  }, theme);
  await page.goto("/#/components/sheet");
  await expect(page.getByRole("button", { name: "Open left", exact: true })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  await page.evaluate(async () => {
    await document.fonts.ready;
    // Pause each real CSS animation before its first frame, including state changes.
    const seen = new WeakSet<Animation>();
    new MutationObserver(() => {
      document.querySelectorAll('[data-slot="sheet-content"], [data-slot="sheet-overlay"]')
        .forEach((node) => node.getAnimations().forEach((animation) => {
          if (!(animation instanceof CSSAnimation)) return;
          if (seen.has(animation)) return;
          seen.add(animation);
          animation.pause();
          animation.currentTime = 0;
        }));
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-state"] });
  });
}

async function samples(node: Locator) {
  return node.evaluate((node) => {
    const animation = node.getAnimations().find((animation) => animation instanceof CSSAnimation);
    if (!animation?.effect) throw new Error("Expected Sheet CSS animation");
    const timing = animation.effect.getTiming();
    const duration = Number(timing.duration);
    const frames = [0, 0.25, 0.5, 0.75, 0.999].map((progress) => {
      animation.currentTime = duration * progress;
      const style = getComputedStyle(node);
      const matrix = new DOMMatrixReadOnly(style.transform);
      const box = node.getBoundingClientRect();
      return { x: matrix.m41, y: matrix.m42, opacity: Number(style.opacity), width: box.width, height: box.height };
    });
    return { duration, easing: getComputedStyle(node).animationTimingFunction, frames };
  });
}

async function finish(page: Page) {
  await page.locator(`${PANEL}, ${OVERLAY}`).evaluateAll((nodes) => {
    nodes.forEach((node) => node.getAnimations().forEach((animation) => animation.finish()));
  });
}

for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 900 }]) {
  for (const theme of ["light", "dark"] as const) {
    test(`Sheet slides opaquely along the same edge (${theme}, ${viewport.width})`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openRoute(page, theme);
      for (const side of SIDES) {
        const trigger = page.getByRole("button", { name: `Open ${side}`, exact: true });
        await trigger.click();
        const panel = page.locator(PANEL);
        await expect(panel).toHaveAttribute("data-state", "open");
        const entry = await samples(panel);
        const axis = side === "left" || side === "right" ? "x" : "y";
        const otherAxis = axis === "x" ? "y" : "x";
        const direction = side === "left" || side === "top" ? -1 : 1;
        const distance = axis === "x" ? entry.frames[0].width : entry.frames[0].height;
        expect(entry.duration).toBe(250);
        expect(entry.easing).toBe("cubic-bezier(0.22, 1, 0.36, 1)");
        expect(entry.frames[0][axis]).toBeCloseTo(direction * distance, 1);
        expect(entry.frames.at(-1)![axis]).toBeCloseTo(0, 1);
        const overlayEntry = await samples(page.locator(OVERLAY));
        expect(overlayEntry.duration).toBe(entry.duration);
        expect(overlayEntry.frames[0].opacity).toBe(0);
        expect(overlayEntry.frames.at(-1)!.opacity).toBeCloseTo(0.8, 2);
        await finish(page);
        await expect(panel).toHaveCSS("transform", "none");
        await page.keyboard.press("Escape");
        await expect(panel).toHaveAttribute("data-state", "closed");
        const exit = await samples(panel);
        expect(exit.duration).toBe(150);
        expect(exit.easing).toBe("cubic-bezier(0.4, 0, 1, 1)");
        expect(exit.frames[0][axis]).toBeCloseTo(0, 1);
        expect(Math.abs(exit.frames.at(-1)![axis] - direction * distance)).toBeLessThan(1);
        for (const motion of [entry, exit]) {
          for (const frame of motion.frames) {
            expect(frame.opacity).toBe(1);
            expect(frame[otherAxis]).toBe(0);
          }
        }
        const overlayExit = await samples(page.locator(OVERLAY));
        expect(overlayExit.duration).toBe(exit.duration);
        expect(overlayExit.frames[0].opacity).toBeCloseTo(0.8, 2);
        expect(overlayExit.frames.at(-1)!.opacity).toBeCloseTo(0, 2);
        await finish(page);
        await expect(panel).toHaveCount(0);
        await expect(page.locator(OVERLAY)).toHaveCount(0);
        await expect(trigger).toBeFocused();
      }
    });

    // A11Y-TEST-0051 (light, 390) / A11Y-TEST-0052 (dark, 390) / A11Y-TEST-0053 (light, 1280) / A11Y-TEST-0054 (dark, 1280)
    test.skip(`Sheet skips motion and closes with reduced motion (${theme}, ${viewport.width})`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openRoute(page, theme, true);
      const trigger = page.getByRole("button", { name: "Open left", exact: true });
      await trigger.click();
      await expect(page.locator(PANEL)).toHaveCSS("animation-name", "none");
      await expect(page.locator(PANEL)).toHaveCSS("opacity", "1");
      await expect(page.locator(OVERLAY)).toHaveCSS("animation-name", "none");
      await page.keyboard.press("Escape");
      await expect(page.locator(PANEL)).toHaveCount(0);
      await expect(page.locator(OVERLAY)).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });
  }
}
