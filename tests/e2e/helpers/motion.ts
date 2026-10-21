import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, type Page, type Locator } from "@playwright/test";
import { artifactMode, artifactModule } from "../docs-artifact";

const fixtureUrl = artifactMode ? artifactModule("site/build/browser-fixtures.ts")
  : `/@fs/${path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../docs/site/build/browser-fixtures.ts").replace(/\\/g, "/")}`;

export async function pauseWAAPI(page: Page, selector: string) {
  await page.addInitScript(selector => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<typeof animate>) {
      const animation = animate.apply(this, args);
      if (this.closest(selector)) {
        animation.pause(); animation.currentTime = 0;
        // Group code may assign startTime after animate() returns. Freeze only
        // after that assignment as well, across engines' pending-play behavior.
        queueMicrotask(() => {
          if (animation.playState !== "idle") { animation.pause(); animation.currentTime = 0; }
        });
      }
      return animation;
    };
  }, selector);
}

export async function openMotionFixture(page: Page, theme: string, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(theme => {
    localStorage.setItem("unitary-theme-preference", theme);
    localStorage.setItem("unitary-docs-language", "en-US");
  }, theme);
  await pauseWAAPI(page, "[data-motion-regression]");
  await page.goto("/#/components/motion", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-motion-demo]")).toBeVisible({ timeout: 30_000 });
  await page.evaluate(async url => { (await import(/* @vite-ignore */ url)).mountMotionRegressionFixture(); }, fixtureUrl);
  await expect(page.locator("[data-add-toast]")).toBeVisible();
}

export async function finishMotion(node: Locator) {
  await node.evaluateAll(async nodes => {
    const animations = [...new Set(nodes.flatMap(element => element.getAnimations({ subtree: true })))];
    await Promise.all(animations.map(animation => animation.ready));
    animations.filter(animation => animation.playState !== "idle" && animation.effect?.getTiming().iterations !== Infinity)
      .forEach(animation => animation.finish());
  });
}

/** Select the element's effect by properties, excluding decorative pseudo-elements. */
export async function sampleMotion(node: Locator, properties: string[], time?: number) {
  await expect.poll(() => node.evaluate((element, properties) => element.getAnimations().some(animation =>
    animation.effect instanceof KeyframeEffect && animation.effect.target === element
    && animation.effect.getKeyframes().some(frame => properties.some(property => frame[property] !== undefined))), properties)).toBe(true);
  return node.evaluate(async (element, { properties, time }) => {
    const animation = element.getAnimations().find(animation => animation.effect instanceof KeyframeEffect
      && animation.effect.target === element
      && animation.effect.getKeyframes().some(frame => properties.some(property => frame[property] !== undefined)))!;
    await animation.ready;
    if (time !== undefined) { animation.pause(); await animation.ready; animation.currentTime = time; }
    const style = getComputedStyle(element), box = element.getBoundingClientRect();
    return { duration: Number(animation.effect!.getTiming().duration), opacity: style.opacity,
      transform: style.transform, left: box.left, right: box.right };
  }, { properties, time });
}

export async function pauseCSS(page: Page) {
  await page.evaluate(() => {
    const seen = new WeakSet<Animation>();
    new MutationObserver(() => {
      document.querySelectorAll('[data-material="floating"], [data-material^="mask-"]').forEach(node => {
        node.getAnimations().forEach(animation => {
          if (!(animation instanceof CSSAnimation || animation instanceof CSSTransition) || seen.has(animation)) return;
          seen.add(animation); animation.pause(); animation.currentTime = 0;
        });
      });
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-state", "data-motion-state"] });
  });
}
