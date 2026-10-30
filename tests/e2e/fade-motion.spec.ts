import { PNG } from "pngjs";
import { expect, test } from "@playwright/test";
import { openMotionFixture as open, finishMotion as finish, pauseCSS, sampleMotion } from "./helpers/motion";

test.setTimeout(60_000);

test("standalone device fixture plays normally and exposes theme controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/site/build/motion-regression.html", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Motion device verification / 动画真机验收" })).toBeVisible();
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Light", exact: true }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.locator('[data-open="modal"]').click();
  await expect(page.locator('[data-slot="modal-content"]')).toBeVisible();
  await expect(page.locator('[data-slot="modal-content"]')).toHaveCSS("animation-play-state", "running");
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.locator('[data-slot="modal-content"]')).toHaveCount(0);
  await page.locator('[data-open="expand-panel"]').click();
  const panel = page.locator('[data-slot="expand-panel"]');
  await expect(panel).toHaveAttribute("data-motion-state", "open");
  await panel.evaluate(element => element.setAttribute("data-device-identity", "retained"));
  await page.getByRole("button", { name: "Close and reopen", exact: true }).click();
  await expect(panel).toHaveAttribute("data-motion-state", "open");
  await panel.evaluate(element => Promise.allSettled(element.getAnimations().map(animation => animation.finished)));
  await expect(panel).toHaveAttribute("data-device-identity", "retained");
});

for (const theme of ["light", "dark"]) for (const width of [390, 1280]) {
  test(`modal and drawer timelines stay coherent (${theme}, ${width})`, async ({ page }) => {
    await open(page, theme, width);
    await pauseCSS(page);
    for (const name of ["modal", "drawer", "bottom-sheet", "responsive-drawer", "side-panel", "side-panel-left"]) {
      const trigger = page.locator(`[data-open="${name}"]`);
      await trigger.focus();
      await expect(trigger).toBeFocused();
      // Keyboard activation preserves the return target on Safari, where a
      // pointer click intentionally does not focus buttons.
      await trigger.press("Enter");
      const slot = name.startsWith("side-panel") ? "side-panel-content" : name === "modal" || name === "responsive-drawer" ? name + "-content" : name;
      const panel = page.locator(`[data-slot="${slot}"]`);
      await expect(panel).toBeAttached();
      await expect(page.locator("body")).toHaveAttribute("data-scroll-locked");
      if (name.startsWith("side-panel")) {
        const box = await sampleMotion(panel, ["transform"], 0);
        const outside = name.endsWith("left") ? box.right <= 0 : box.left >= width;
        expect(outside).toBe(true);
      }
      const entry = await sampleMotion(panel, ["transform"], 50);
      const overlay = await sampleMotion(page.locator('[data-material^="mask-"]').last(), ["opacity"], 50);
      expect({ panel: entry.duration, mask: overlay.duration, opacity: entry.opacity }).toEqual({ panel: 250, mask: 250, opacity: "1" });
      await finish(page.locator('[role="dialog"], [data-material^="mask-"]'));
      await page.keyboard.press("Escape");
      await expect(panel).toHaveAttribute("data-state", "closed");
      expect((await sampleMotion(panel, ["transform"])).duration).toBe(150);
      expect((await sampleMotion(page.locator('[data-material^="mask-"]').last(), ["opacity"])).duration).toBe(150);
      await finish(page.locator('[data-material^="mask-"], [role="dialog"]'));
      await expect(panel).toHaveCount(0);
      await expect(page.locator('[data-material^="mask-"]')).toHaveCount(0);
      await expect(page.locator("body")).not.toHaveAttribute("data-scroll-locked");
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
        const sum = await sections.evaluateAll(async (nodes, progress) => {
          await Promise.all(nodes.flatMap(node => node.getAnimations().map(animation => animation.ready)));
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
    await pauseCSS(page);
    await page.locator("[data-add-toast]").click();
    const fast = page.locator('[data-toast-view="fast"] li'), slow = page.locator('[data-toast-view="slow"] li');
    await expect(fast).toBeVisible();
    // Dismiss before the entrance finishes; opacity must continue from its current value.
    await sampleMotion(fast, ["opacity"], 50);
    await page.locator("[data-dismiss-toast]").click();
    await expect(fast).toHaveAttribute("data-exiting", "");
    expect((await sampleMotion(fast, ["opacity"])).duration).toBe(150);
    expect((await sampleMotion(slow, ["opacity"])).duration).toBe(400);
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
    await sampleMotion(drawer, ["transform"], 0);
    const start = await drawer.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42);
    expect(start).toBeCloseTo(released, 1);
    await finish(page.locator('[role="dialog"], [data-material^="mask-"]'));
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
    await sampleMotion(panel, ["translate", "clipPath"], 30);
    await page.locator('[data-open="expand-panel"]').evaluate(element => (element as HTMLButtonElement).click());
    await expect(panel).toHaveAttribute("data-motion-state", "open");
    await finish(panel);
    await expect(panel).not.toHaveAttribute("inert");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
  });

  // A11Y-TEST-0086..0089 (${theme}, ${width} 四个参数化变体；motion 侧由 grepInvert 收集期过滤)
  test.skip(`material masks preserve static accessibility fallbacks (${theme}, ${width})`, async ({ page }) => {
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

  });
}
