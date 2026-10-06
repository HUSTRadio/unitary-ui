import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { getComponentDocsPath } from "../../docs/site/src/data/docs-routes";

type Theme = "light" | "dark";
type Box = { x: number; y: number; width: number; height: number };
const fixtureUrl = `/@fs/${path.resolve(path.dirname(fileURLToPath(import.meta.url)), "fixtures/toggle-motion.tsx").replace(/\\/g, "/")}`;

test.setTimeout(60_000);

async function open(page: Page, theme: Theme, reduced = false) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: reduced ? "reduce" : "no-preference" });
  await page.addInitScript((theme) => {
    localStorage.setItem("unitary-docs-language", "en-US");
    localStorage.setItem("unitary-theme-preference", theme);
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<typeof animate>) {
      const animation = animate.apply(this, args);
      if (this.getAttribute("data-slot") === "toggle-thumb") {
        animation.id = "toggle-thumb-test";
        animation.pause();
        animation.currentTime = 0;
      }
      return animation;
    };
  }, theme);
  await page.goto(`/#${getComponentDocsPath("toggle")}`);
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  await expect(page.locator('[data-demo-container="default"]').getByRole("checkbox").first()).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });
}

async function mount(page: Page) {
  await page.evaluate(async (url) => {
    const { mountToggleMotionFixture } = await import(/* @vite-ignore */ url);
    mountToggleMotionFixture();
  }, fixtureUrl);
  const fixture = page.locator("[data-test-toggle-motion-fixture]");
  await expect(fixture.getByRole("checkbox", { name: "Motion medium", exact: true })).toBeVisible();
  return fixture;
}

function parts(input: Locator) {
  const control = input.locator("..");
  return { input, thumb: control.locator('[data-slot="toggle-thumb"]'), track: control.locator('[data-slot="toggle-track"]') };
}

async function box(node: Locator): Promise<Box> {
  return node.evaluate((node) => {
    const { x, y, width, height } = node.getBoundingClientRect();
    return { x, y, width, height };
  });
}

function close(actual: Box, expected: Box) {
  for (const key of ["x", "y", "width", "height"] as const) {
    expect(Math.abs(actual[key] - expected[key]), key).toBeLessThanOrEqual(0.3);
  }
}

async function motionCount(thumb: Locator) {
  return thumb.evaluate((node) => node.getAnimations().filter((animation) => animation.id === "toggle-thumb-test").length);
}

async function scrub(thumb: Locator, progress: number) {
  return thumb.evaluate((node, progress) => {
    const animation = node.getAnimations().find((animation) => animation.id === "toggle-thumb-test");
    if (!animation?.effect) throw new Error("Expected native Toggle thumb motion");
    const timing = animation.effect.getTiming();
    const duration = Number(timing.duration);
    animation.currentTime = duration * progress;
    const { x, y, width, height } = node.getBoundingClientRect();
    return { box: { x, y, width, height }, duration, easing: timing.easing };
  }, progress);
}

async function samples(thumb: Locator) {
  return thumb.evaluate((node) => {
    const animation = node.getAnimations().find((animation) => animation.id === "toggle-thumb-test");
    if (!animation?.effect) throw new Error("Expected native Toggle thumb motion");
    const duration = Number(animation.effect.getTiming().duration);
    return Array.from({ length: 39 }, (_, index) => {
      const progress = (index + 1) / 40;
      animation.currentTime = duration * progress;
      const { x, y, width, height } = node.getBoundingClientRect();
      return { progress, box: { x, y, width, height } };
    });
  });
}

async function finish(thumb: Locator) {
  await thumb.evaluate((node) => node.getAnimations().filter((animation) => animation.id === "toggle-thumb-test")
    .forEach((animation) => animation.finish()));
  await expect.poll(() => motionCount(thumb)).toBe(0);
  return box(thumb);
}

async function activate(input: Locator, checked: boolean) {
  await input.evaluate((node) => (node as HTMLInputElement).click());
  if (checked) await expect(input).toBeChecked();
  else await expect(input).not.toBeChecked();
}

async function expectMotion(thumb: Locator, track: Locator, source: Box, target: Box) {
  const initial = await scrub(thumb, 0);
  close(initial.box, source);
  expect(initial.easing).toMatch(/^cubic-bezier\(/);
  const trackBox = await box(track);
  const measured = await samples(thumb);
  const peak = measured.reduce((largest, sample) => sample.box.width > largest.box.width ? sample : largest);
  expect(peak.box.width).toBeGreaterThan(target.width + 0.7);
  expect(peak.box.width).toBeLessThanOrEqual(target.width * 1.25 + 0.3);
  expect(measured.at(-1)!.box.width).toBeLessThan(peak.box.width - 0.7);
  for (const { box: frame } of measured) {
    expect(Math.abs(frame.height - target.height)).toBeLessThanOrEqual(0.2);
    expect(Math.abs(frame.y - target.y)).toBeLessThanOrEqual(0.2);
    expect(frame.x).toBeGreaterThanOrEqual(trackBox.x + 1.5 - 0.3);
    expect(frame.x + frame.width).toBeLessThanOrEqual(trackBox.x + trackBox.width - 1.5 + 0.3);
  }
  const midpoint = await scrub(thumb, 0.5);
  const center = (box: Box) => box.x + box.width / 2;
  const ratio = (center(midpoint.box) - center(source)) / (center(target) - center(source));
  expect(ratio).toBeGreaterThan(0.65);
  expect(ratio).toBeLessThan(1);
  close(await finish(thumb), target);
  return { peak, timing: initial };
}

for (const theme of ["light", "dark"] as const) {
  test(`canonical Toggle demo stretches then settles in both directions (${theme})`, async ({ page }) => {
    await open(page, theme);
    const toggle = parts(page.locator('[data-demo-container="default"]').getByRole("checkbox").first());
    await toggle.input.scrollIntoViewIfNeeded();
    expect(await motionCount(toggle.thumb)).toBe(0);
    const off = await box(toggle.thumb);
    const on = { ...off, x: off.x + 15 };
    await activate(toggle.input, true);
    const first = await expectMotion(toggle.thumb, toggle.track, off, on);
    expect(first.timing.duration).toBe(250);
    expect(off.width).toBe(10);
    await activate(toggle.input, false);
    await expectMotion(toggle.thumb, toggle.track, on, off);
    await expect(toggle.track).toHaveCSS("transition-duration", "0.25s");
    const sizes = page.locator('[data-demo-container="sizes"] [data-slot="toggle-thumb"]');
    for (const [index, diameter] of [10, 16, 20].entries()) {
      const measured = await box(sizes.nth(index));
      expect(measured.width).toBe(diameter);
      expect(measured.height).toBe(diameter);
    }
  });

  test(`all Toggle sizes use inherited nonlinear motion and retain thumb height (${theme})`, async ({ page }) => {
    await open(page, theme);
    const fixture = await mount(page);
    await fixture.evaluate((node) => {
      (node as HTMLElement).style.setProperty("--uni-motion-state", "420ms");
      (node as HTMLElement).style.setProperty("--ease-snap", "cubic-bezier(0.3, 0.8, 0.2, 1)");
    });
    for (const [size, diameter, travel] of [["small", 10, 15], ["medium", 16, 17], ["large", 20, 17]] as const) {
      const toggle = parts(fixture.getByRole("checkbox", { name: `Motion ${size}`, exact: true }));
      const off = await box(toggle.thumb);
      expect(off.width).toBe(diameter);
      const on = { ...off, x: off.x + travel };
      await activate(toggle.input, true);
      const first = await expectMotion(toggle.thumb, toggle.track, off, on);
      expect(first.timing.duration).toBe(420);
      expect(first.timing.easing).toBe("cubic-bezier(0.3, 0.8, 0.2, 1)");
      await activate(toggle.input, false);
      await expectMotion(toggle.thumb, toggle.track, on, off);
    }
  });

  test(`rapid Toggle reversals continue the current width and position without compounding (${theme})`, async ({ page }) => {
    await open(page, theme);
    const fixture = await mount(page);
    const toggle = parts(fixture.getByRole("checkbox", { name: "Motion large", exact: true }));
    const resting = await box(toggle.thumb);
    await activate(toggle.input, true);
    for (let iteration = 0; iteration < 4; iteration++) {
      const measured = await samples(toggle.thumb);
      const peak = measured.reduce((largest, sample) => sample.box.width > largest.box.width ? sample : largest);
      await scrub(toggle.thumb, peak.progress);
      await activate(toggle.input, iteration % 2 !== 0);
      close((await scrub(toggle.thumb, 0)).box, peak.box);
      expect(Math.max(...(await samples(toggle.thumb)).map((sample) => sample.box.width)))
        .toBeLessThanOrEqual(resting.width * 1.25 + 0.3);
    }
    await finish(toggle.thumb);
    const finished = await box(toggle.thumb);
    expect(finished.width).toBe(resting.width);
    expect(finished.height).toBe(resting.height);
  });

  test(`keyboard changes animate and reduced motion immediately aligns the circle (${theme})`, async ({ page }) => {
    await open(page, theme);
    const fixture = await mount(page);
    const toggle = parts(fixture.getByRole("checkbox", { name: "Motion medium", exact: true }));
    await toggle.input.focus();
    await toggle.input.press("Space");
    await expect(toggle.input).toBeChecked();
    expect(await motionCount(toggle.thumb)).toBe(1);
    await scrub(toggle.thumb, 0.15);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => motionCount(toggle.thumb)).toBe(0);
    const on = await box(toggle.thumb);
    expect(on.width).toBe(16);
    expect(on.height).toBe(16);
    await toggle.input.press("Space");
    await expect(toggle.input).not.toBeChecked();
    expect(await motionCount(toggle.thumb)).toBe(0);
    const off = await box(toggle.thumb);
    expect(on.x - off.x).toBe(17);
    expect(off.width).toBe(off.height);
  });

  test(`declined changes, disabling and native form reset keep native state semantics (${theme})`, async ({ page }) => {
    await open(page, theme);
    const fixture = await mount(page);
    const declined = parts(fixture.getByRole("checkbox", { name: "Declined controlled change", exact: true }));
    await activate(declined.input, false);
    expect(await motionCount(declined.thumb)).toBe(0);
    const toggle = parts(fixture.getByRole("checkbox", { name: "Motion small", exact: true }));
    await activate(toggle.input, true);
    await scrub(toggle.thumb, 0.15);
    await fixture.getByRole("button", { name: "Change disabled state" }).click();
    await expect(toggle.input).toBeDisabled();
    expect(await motionCount(toggle.thumb)).toBe(0);
    expect((await box(toggle.thumb)).width).toBe(10);
    const native = parts(fixture.getByRole("checkbox", { name: "Native motion reset", exact: true }));
    await activate(native.input, false);
    expect(await motionCount(native.thumb)).toBe(1);
    await fixture.getByRole("button", { name: "Reset native toggle" }).click();
    await expect(native.input).toBeChecked();
    expect(await motionCount(native.thumb)).toBe(0);
    expect((await box(native.thumb)).width).toBe(16);
    await activate(native.input, false);
    expect(await motionCount(native.thumb)).toBe(1);
  });
}
