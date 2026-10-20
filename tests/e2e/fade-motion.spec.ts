import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import { expect, test, type Page, type Locator } from "@playwright/test";
import { artifactMode, artifactModule } from "./docs-artifact";

const fixtureUrl = artifactMode ? artifactModule("site/build/browser-fixtures.ts")
  : `/@fs/${path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../docs/site/build/browser-fixtures.ts").replace(/\\/g, "/")}`;
test.setTimeout(60_000);

async function open(page: Page, theme: string, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(theme => {
    localStorage.setItem("unitary-theme-preference", theme);
    localStorage.setItem("unitary-docs-language", "en-US");
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<typeof animate>) {
      const animation = animate.apply(this, args);
      if (this.closest("[data-motion-regression]")) { animation.pause(); animation.currentTime = 0; }
      return animation;
    };
  }, theme);
  await page.goto("/#/components/motion");
  await expect(page.locator("[data-motion-demo]")).toBeVisible();
  await page.evaluate(async url => { (await import(/* @vite-ignore */ url)).mountMotionRegressionFixture(); }, fixtureUrl);
  await expect(page.locator("[data-add-toast]")).toBeVisible();
}

async function finish(node: Locator) {
  await node.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
}

async function pauseCSS(page: Page) {
  await page.evaluate(() => {
    const seen = new WeakSet<Animation>();
    new MutationObserver(() => {
      document.querySelectorAll('[data-material="floating"], [data-material^="mask-"]').forEach(node => {
        node.getAnimations().forEach(animation => {
          if (!(animation instanceof CSSAnimation) || seen.has(animation)) return;
          seen.add(animation); animation.pause(); animation.currentTime = 0;
        });
      });
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-state"] });
  });
}

for (const theme of ["light", "dark"]) for (const width of [390, 1280]) {
  test(`modal and drawer timelines stay coherent (${theme}, ${width})`, async ({ page }) => {
    await open(page, theme, width);
    await pauseCSS(page);
    for (const name of ["modal", "drawer", "bottom-sheet", "responsive-drawer", "side-panel", "side-panel-left"]) {
      const trigger = page.locator(`[data-open="${name}"]`);
      await trigger.click();
      const slot = name.startsWith("side-panel") ? "side-panel-content" : name === "modal" || name === "responsive-drawer" ? name + "-content" : name;
      const panel = page.locator(`[data-slot="${slot}"]`);
      await expect(panel).toBeAttached();
      if (name.startsWith("side-panel")) {
        const outside = await panel.evaluate((element, left) => {
          element.getAnimations()[0].currentTime = 0;
          const box = element.getBoundingClientRect();
          return left ? box.right <= 0 : box.left >= innerWidth;
        }, name.endsWith("left"));
        expect(outside).toBe(true);
      }
      const entry = await panel.evaluate(element => {
        const animation = element.getAnimations()[0];
        animation.currentTime = 50;
        const mask = element.parentElement?.getAttribute("data-material") === "mask-backdrop"
          ? element.parentElement! : [...document.querySelectorAll('[data-material^="mask-"]')].at(-1)!;
        const overlay = mask.getAnimations()[0];
        overlay.currentTime = 50;
        return { panel: Number(animation.effect!.getTiming().duration), mask: Number(overlay.effect!.getTiming().duration), opacity: getComputedStyle(element).opacity };
      });
      expect(entry).toEqual({ panel: 250, mask: 250, opacity: "1" });
      await page.locator('[role="dialog"]').evaluateAll(nodes => nodes.forEach(node => node.getAnimations({ subtree: true }).forEach(animation => animation.finish())));
      await page.locator('[data-material^="mask-"]').evaluateAll(nodes => nodes.forEach(node => node.getAnimations().forEach(animation => animation.finish())));
      await page.keyboard.press("Escape");
      await expect(panel).toHaveAttribute("data-state", "closed");
      expect(await panel.evaluate(element => Number(element.getAnimations()[0].effect!.getTiming().duration))).toBe(150);
      await page.locator('[data-material^="mask-"], [role="dialog"]').evaluateAll(nodes => nodes.forEach(node => node.getAnimations().forEach(animation => animation.finish())));
      await expect(panel).toHaveCount(0);
      await expect(page.locator('[data-material^="mask-"]')).toHaveCount(0);
      await expect(trigger).toBeFocused();
    }
  });

  test(`carousel stays opaque during interrupted three-way fades (${theme}, ${width})`, async ({ page }) => {
    await open(page, theme, width);
    const carousel = page.locator("[data-motion-regression] [data-slot=carousel]");
    const sections = carousel.locator("[data-slot=full-page-section]");
    await sections.locator("img").evaluateAll(images => Promise.all(images.map(image => (image as HTMLImageElement).decode())));
    for (const target of [2, 3, 1, 3]) {
      await carousel.getByRole("button", { name: `Go to image ${target}`, exact: true }).click();
      for (const progress of [0, 0.2, 0.5]) {
        const sum = await sections.evaluateAll((nodes, progress) => {
          nodes.forEach(node => node.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = Number(animation.effect!.getTiming().duration) * progress; }));
          return nodes.reduce((sum, node) => sum + Number(getComputedStyle(node).opacity), 0);
        }, progress);
        expect(sum).toBeCloseTo(1, 4);
        const image = PNG.sync.read(await carousel.locator('[data-slot="full-page-track"]').screenshot({ animations: "allow" }));
        const center = (Math.floor(image.height / 2) * image.width + Math.floor(image.width / 2)) * 4;
        // Premultiplied 8-bit layers may round by one channel value.
        expect(image.data[center]).toBeGreaterThanOrEqual(253);
        expect(image.data[center + 1]).toBeLessThanOrEqual(2);
        expect(image.data[center + 2]).toBeLessThanOrEqual(2);
      }
    }
    const beforeRender = await sections.evaluateAll(nodes => nodes.map(node => getComputedStyle(node).opacity));
    await page.locator("[data-unmount-slow]").click();
    expect(await sections.evaluateAll(nodes => nodes.map(node => getComputedStyle(node).opacity))).toEqual(beforeRender);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => sections.evaluateAll(nodes => nodes.reduce((sum, node) => sum + node.getAnimations().length, 0))).toBe(0);
    await expect(sections.nth(2)).toHaveCSS("opacity", "1");
  });

  test(`toast waits for every viewport and releases cancelled exits (${theme}, ${width})`, async ({ page }) => {
    await open(page, theme, width);
    await page.locator("[data-add-toast]").click();
    const fast = page.locator('[data-toast-view="fast"] li'), slow = page.locator('[data-toast-view="slow"] li');
    await expect(fast).toBeVisible();
    // Dismiss before the entrance finishes; opacity must continue from its current value.
    await fast.evaluate(element => element.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 50; }));
    await page.locator("[data-dismiss-toast]").click();
    await expect(fast).toHaveAttribute("data-exiting", "");
    expect(await fast.evaluate(element => Number(element.getAnimations()[0].effect!.getTiming().duration))).toBe(150);
    expect(await slow.evaluate(element => Number(element.getAnimations()[0].effect!.getTiming().duration))).toBe(400);
    await finish(fast);
    await expect(slow).toBeAttached();
    await expect(fast).toBeAttached();
    await page.locator("[data-unmount-slow]").click();
    await expect(fast).toHaveCount(0);
    await page.locator("[data-add-toast]").click();
    await page.locator("[data-dismiss-toast]").click();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(fast).toHaveCount(0);
  });

  test(`drawer swipe and expand-panel reversal continue from the current frame (${theme}, ${width})`, async ({ page }) => {
    await open(page, theme, width);
    await pauseCSS(page);
    await page.locator('[data-open="drawer"]').click();
    const drawer = page.locator('[data-slot="drawer"]');
    await finish(drawer);
    const box = (await drawer.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + 20);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + 140, { steps: 4 });
    const released = await drawer.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42);
    await page.mouse.up();
    await expect(drawer).toHaveAttribute("data-state", "closed");
    const start = await drawer.evaluate(element => {
      element.getAnimations()[0].currentTime = 0;
      return new DOMMatrixReadOnly(getComputedStyle(element).transform).m42;
    });
    expect(start).toBeCloseTo(released, 1);
    await page.locator('[role="dialog"], [data-material^="mask-"]').evaluateAll(nodes => nodes.forEach(node => node.getAnimations().forEach(animation => animation.finish())));
    await expect(drawer).toHaveCount(0);
    // A controlled consumer may reject dismissal; the panel must snap back.
    await page.locator('[data-open="drawer-reject"]').click();
    await finish(drawer);
    const rejectedBox = (await drawer.boundingBox())!;
    await page.mouse.move(rejectedBox.x + rejectedBox.width / 2, rejectedBox.y + 20);
    await page.mouse.down();
    await page.mouse.move(rejectedBox.x + rejectedBox.width / 2, rejectedBox.y + 140, { steps: 4 });
    await page.mouse.up();
    await expect(drawer).toHaveAttribute("data-state", "open");
    await expect.poll(() => drawer.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42)).toBe(0);
    await page.locator('[data-open="expand-panel"]').evaluate(element => (element as HTMLButtonElement).click());
    await finish(drawer);
    await expect(drawer).toHaveCount(0);
    const panel = page.locator('[data-slot="expand-panel"]');
    await expect(panel).toHaveAttribute("data-motion-state", "open");
    await finish(panel);
    await page.keyboard.press("Escape");
    await panel.evaluate(element => element.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 30; }));
    await page.locator('[data-open="expand-panel"]').evaluate(element => (element as HTMLButtonElement).click());
    await expect(panel).toHaveAttribute("data-motion-state", "open");
    await finish(panel);
    await expect(panel).not.toHaveAttribute("inert");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
  });

  test(`material masks preserve static accessibility fallbacks (${theme}, ${width})`, async ({ page }) => {
    await open(page, theme, width);
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const texture of ["solid", "acrylic", "glass"]) {
      await page.locator("html").evaluate((node, texture) => node.setAttribute("data-texture", texture), texture);
      await page.locator('[data-open="modal"]').click();
      const panel = page.locator('[data-slot="modal-content"]');
      await expect(panel).toHaveCSS("opacity", "1");
      await expect(panel).toHaveCSS("animation-name", "none");
      await page.keyboard.press("Escape");
      await expect(panel).toHaveCount(0);
    }
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-transparency", value: "reduce" }] });
    await page.locator('[data-open="modal"]').click();
    const mask = page.locator('[data-material="mask-backdrop"]');
    await expect(mask).toHaveCSS("backdrop-filter", "none");
    await expect(mask).toHaveCSS("opacity", "1");
    await page.keyboard.press("Escape");
    await expect(mask).toHaveCount(0);
  });
}
