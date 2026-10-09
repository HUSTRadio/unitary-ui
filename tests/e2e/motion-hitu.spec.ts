import { expect, test, type Locator, type Page } from "@playwright/test";
import { cubicProgress } from "../../src/lib/motion-easing";
import { MOTION_EASINGS } from "../../src/lib/motion-easing-defaults";

test.setTimeout(90_000);

async function openDemo(page: Page, theme: "light" | "dark", width = 1440) {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(value => {
    localStorage.setItem("unitary-docs-language", "en-US");
    localStorage.setItem("unitary-theme-preference", value);
  }, theme);
  await page.goto("/#/components/hitu-player");
  await expect(page.locator("#main-content h1")).toHaveText("Hitu Player");
  const demo = page.locator("[data-motion-hitu-demo]").first();
  const player = demo.locator('[data-slot="hitu-player"]');
  await player.scrollIntoViewIfNeeded();
  await expect(player).toBeVisible();
  return { demo, player, errors };
}

for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 1440]) {
    test(`Motion uses the response curve at intermediate browser progress (${theme}, ${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.addInitScript(value => {
        localStorage.setItem("unitary-docs-language", "en-US");
        localStorage.setItem("unitary-theme-preference", value);
      }, theme);
      await page.goto("/#/components/motion");
      const demo = page.locator("[data-motion-demo]");
      const content = demo.locator("[data-motion-content]");
      await expect(content).toBeVisible();
      await page.locator("html").evaluate(element => element.style.setProperty("--uni-motion-state", "2s"));
      await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
      await demo.locator("[data-motion-toggle]").click();
      await expect.poll(() => content.evaluate(element => element.getAnimations().filter(animation =>
        animation.effect instanceof KeyframeEffect && animation.effect.getKeyframes().some(keyframe => keyframe.opacity !== undefined)).length)).toBeGreaterThan(0);
      const opacity = await content.evaluate(element => {
        const animation = element.getAnimations().find(item => item.effect instanceof KeyframeEffect
          && item.effect.getKeyframes().some(keyframe => keyframe.opacity !== undefined))!;
        animation.pause();
        animation.currentTime = Number(animation.effect!.getTiming().duration) * 0.2;
        return Number(getComputedStyle(element).opacity);
      });
      expect(opacity).toBeCloseTo(1 - cubicProgress(0.2, MOTION_EASINGS["--ease-snap"]), 3);
      expect(opacity).toBeLessThan(0.4);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(content).toHaveCount(0);
    });
  }

  test(`Motion content completes entry and exit instantly under reduced motion (${theme})`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(value => {
      localStorage.setItem("unitary-docs-language", "en-US");
      localStorage.setItem("unitary-theme-preference", value);
    }, theme);
    await page.goto("/#/components/motion");
    const demo = page.locator("[data-motion-demo]");
    const content = demo.locator("[data-motion-content]");
    await expect(content).toBeVisible();
    await demo.locator("[data-motion-toggle]").click();
    await expect(content).toHaveCount(0);
    await demo.locator("[data-motion-toggle]").click();
    await expect(content).toBeVisible();
    const presentation = await content.evaluate(element => {
      const style = getComputedStyle(element);
      return { opacity: style.opacity, x: style.transform === "none" ? 0 : new DOMMatrixReadOnly(style.transform).m41 };
    });
    expect(presentation).toEqual({ opacity: "1", x: 0 });
    await page.screenshot({ path: `.scratch/motion-hitu/motion-${theme}.png` });
    expect(errors).toEqual([]);
  });
}

test("the introduction stays usable while its viewport illustration loads, then plays once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => localStorage.setItem("unitary-docs-language", "en-US"));
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/site/src/examples/hitu-player/default.example.tsx*", async route => {
    await pending;
    await route.continue();
  });
  await page.goto("/");
  await expect(page.locator("#main-content h1")).toHaveText("Unitary");
  await expect(page.locator('[data-slot="navbar"]').first()).toBeVisible();
  const intro = page.locator("[data-motion-intro]");
  await intro.scrollIntoViewIfNeeded();
  await expect(intro).toContainText("Loading illustration");
  await expect(page.getByRole("link", { name: "GitHub Repository", exact: true })).toBeAttached();
  release();
  const player = intro.locator('[data-slot="hitu-player"]');
  await player.scrollIntoViewIfNeeded();
  await expect(player).toHaveAttribute("data-playing", "true");
  await expectAdvancing(player);
  await expect(player).toHaveAttribute("data-frame", "119");
  await expectStopped(player);
  await player.evaluate(element => { element.style.transform = "translateX(-200vw)"; });
  await expectStopped(player);
  await player.evaluate(element => { element.style.removeProperty("transform"); });
  await expectStopped(player);
  await expect(player).toHaveAttribute("data-frame", "119");
  await page.screenshot({ path: ".scratch/motion-hitu/introduction.png" });
});

test("changing reduced-motion preferences stops an in-flight Motion exit", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => localStorage.setItem("unitary-docs-language", "en-US"));
  await page.goto("/#/components/motion");
  const demo = page.locator("[data-motion-demo]");
  const content = demo.locator("[data-motion-content]");
  await expect(content).toBeVisible();
  // Make completion timing distinguishable from the ordinary short state tier.
  await page.locator("html").evaluate(element => { element.style.setProperty("--uni-motion-state", "2s"); });
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await demo.locator("[data-motion-toggle]").click();
  await expect.poll(() => content.evaluate(element => Number(getComputedStyle(element).opacity))).toBeLessThan(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(content).toHaveCount(0, { timeout: 500 });
});

test("reduced motion completes an infinite native exit without a finish exception", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => localStorage.setItem("unitary-docs-language", "en-US"));
  await page.goto("/#/components/motion");
  const demo = page.locator("[data-motion-demo]");
  const content = demo.locator("[data-motion-content]");
  await expect(content).toBeVisible();
  await page.locator("html").evaluate(element => { element.style.setProperty("--uni-motion-state", "2s"); });
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await demo.locator("[data-motion-toggle]").click();
  await expect.poll(() => content.evaluate(element => element.getAnimations().filter(animation =>
    animation.playState === "running" && animation.effect instanceof KeyframeEffect
      && animation.effect.getKeyframes().some(keyframe => keyframe.opacity !== undefined)).length)).toBeGreaterThan(0);
  const changed = await content.evaluate(element => {
    let count = 0;
    for (const animation of element.getAnimations()) {
      if (!(animation.effect instanceof KeyframeEffect)
        || !animation.effect.getKeyframes().some(keyframe => keyframe.opacity !== undefined)) continue;
      animation.effect.updateTiming({ iterations: Infinity });
      count++;
    }
    return count;
  });
  expect(changed).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(content).toHaveCount(0, { timeout: 500 });
  expect(errors).toEqual([]);
});

async function frame(player: Locator) {
  return Number(await player.getAttribute("data-frame"));
}

async function expectAdvancing(player: Locator) {
  const before = await frame(player);
  await expect.poll(() => frame(player), { message: "the RAF timeline advances" }).not.toBe(before);
}

async function expectStopped(player: Locator) {
  await expect(player).toHaveAttribute("data-playing", "false");
  const before = await frame(player);
  // This samples the actual timeline across browser rendering opportunities;
  // a CSS animation-name assertion cannot prove that a JS RAF loop has stopped.
  await player.evaluate(() => new Promise<void>(resolve => {
    let remaining = 12;
    const sample = () => --remaining > 0 ? requestAnimationFrame(sample) : resolve();
    requestAnimationFrame(sample);
  }));
  expect(await frame(player)).toBe(before);
}

for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 1440]) {
    test(`Hitu controls advance, pause and replay real SVG layers (${theme}, ${width}px)`, async ({ page }) => {
      const { demo, player, errors } = await openDemo(page, theme, width);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await demo.locator("[data-motion-loop]").check();
      await demo.locator("[data-motion-replay]").click();
      await expect(player).toHaveAttribute("data-playing", "true");
      const layer = player.locator("[data-hitu-layer]").first();
      const initialTransform = await layer.getAttribute("transform");
      await expectAdvancing(player);
      await expect.poll(() => layer.getAttribute("transform")).not.toBe(initialTransform);

      await demo.locator("[data-motion-pause]").click();
      await expectStopped(player);
      const pausedFrame = await frame(player);
      expect(pausedFrame).toBeGreaterThan(0);
      const y = await layer.evaluate(element => (element as SVGGraphicsElement).transform.baseVal.consolidate()!.matrix.f);
      const progress = pausedFrame <= 60 ? pausedFrame / 60 : (pausedFrame - 60) / 59;
      const displacement = cubicProgress(progress, MOTION_EASINGS["--ease-in-out"]);
      expect(y).toBeCloseTo(pausedFrame <= 60 ? 32 + 64 * displacement : 96 - 64 * displacement, 3);
      await demo.locator("[data-motion-play]").click();
      await expectAdvancing(player);
      await demo.locator("[data-motion-pause]").click();
      await expectStopped(player);

      const geometry = await player.boundingBox();
      expect(geometry!.width).toBeGreaterThan(0);
      expect(geometry!.width).toBeLessThanOrEqual(width);
      expect(geometry!.height).toBeGreaterThan(0);
      await expect(player).toHaveAttribute("aria-hidden", "true");
      await expect(player).not.toHaveAttribute("role", "img");
      await page.screenshot({ path: `.scratch/motion-hitu/playback-${theme}-${width}.png` });
      expect(errors).toEqual([]);
    });
  }

  test(`dynamic reduced motion resets and stops the JS timeline (${theme})`, async ({ page }) => {
    const { demo, player, errors } = await openDemo(page, theme);
    await demo.locator("[data-motion-loop]").check();
    await demo.locator("[data-motion-replay]").click();
    await expect.poll(() => frame(player)).toBeGreaterThan(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(player).toHaveAttribute("data-frame", "0");
    await expectStopped(player);
    await demo.locator("[data-motion-play]").click();
    await expectStopped(player);
    await expect(player).toHaveAttribute("data-frame", "0");
    await demo.locator("[data-motion-pause]").click();
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expectStopped(player);
    await demo.locator("[data-motion-play]").click();
    await expectAdvancing(player);
    expect(errors).toEqual([]);
  });
}

test("offscreen and page visibility pauses preserve intent, including a manual pause", async ({ page }) => {
  const { demo, player, errors } = await openDemo(page, "light");
  await demo.locator("[data-motion-loop]").check();
  await demo.locator("[data-motion-replay]").click();
  await expectAdvancing(player);
  // Move the rendered SVG outside the viewport and exercise the browser's real
  // IntersectionObserver, without depending on a docs page's scroll length.
  await player.evaluate(element => { element.style.transform = "translateX(-200vw)"; });
  await expectStopped(player);
  await player.evaluate(element => { element.style.removeProperty("transform"); });
  await expect(player).toHaveAttribute("data-playing", "true");
  await expectAdvancing(player);

  // Headless Chromium does not consistently hide background tabs. Dispatch the
  // browser visibility event with its read-only state represented explicitly.
  const visibility = async (hidden: boolean) => page.evaluate(value => {
    Object.defineProperty(document, "hidden", { configurable: true, value });
    Object.defineProperty(document, "visibilityState", { configurable: true, value: value ? "hidden" : "visible" });
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);
  await visibility(true);
  await expectStopped(player);
  await visibility(false);
  await expect(player).toHaveAttribute("data-playing", "true");
  await expectAdvancing(player);
  await visibility(true);
  await expectStopped(player);
  await demo.locator("[data-motion-pause]").click();
  await visibility(false);
  await expectStopped(player);
  await player.evaluate(element => { element.style.transform = "translateX(-200vw)"; });
  await expectStopped(player);
  await player.evaluate(element => { element.style.removeProperty("transform"); });
  await expectStopped(player);
  expect(errors).toEqual([]);
});
