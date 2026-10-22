import { test, expect, type Page, type Locator } from "@playwright/test";
import { PNG } from "pngjs";
import { arch, cpus, release } from "node:os";
import { nativeBlurMetrics } from "../../scripts/lib/native-blur.mjs";
import { captureNativeSurface, NativeCaptureError } from "../../scripts/lib/native-capture.mjs";
import { LAYOUT_VIEWPORTS, LAYOUT_THEMES } from "../e2e/helpers/layout-matrix";

const texture = "repeating-linear-gradient(90deg,#000 0 4px,#fff 4px 8px)";
let marker = 0;
test.beforeEach(async ({ browser }) => {
  await test.info().attach("native-host", { contentType: "application/json", body: Buffer.from(JSON.stringify({
    browser: browser.version(), project: test.info().project.name,
    platform: process.platform, release: release(), arch: arch(), node: process.version,
    cpuModel: cpus()[0]?.model, cpuCount: cpus().length,
    capture: process.env.UNITARY_NATIVE_GLASS_XVFB === "1" ? "isolated-x11-display" : "browser-snapshot-diagnostic",
  })) });
});
async function capture(page: Page, surface: Locator) {
  try { return await captureNativeSurface(page, surface); }
  catch (error) {
    if (error instanceof NativeCaptureError) {
      await test.info().attach("native-display-failure", { body: error.display, contentType: "image/png" });
      await test.info().attach("native-display-geometry", { body: Buffer.from(JSON.stringify(await page.evaluate(() => ({
        screenX, screenY, outerWidth, outerHeight, innerWidth, innerHeight, devicePixelRatio,
        marker: document.querySelector("[data-native-display-calibration]")?.getBoundingClientRect().toJSON(),
      })))), contentType: "application/json" });
    }
    throw error;
  }
}
async function paintReady(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(() => page.evaluate(() => document.getAnimations().some(animation => animation.playState === "running"))).toBe(false);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function compare(page: Page, surface: Locator, name: string, pseudo = "", interior = "top") {
  await expect(surface).toBeVisible();
  await paintReady(page);
  const filter = await surface.evaluate((node, pseudo) => {
    const style = getComputedStyle(node, pseudo || null);
    return style.backdropFilter || style.getPropertyValue("-webkit-backdrop-filter");
  }, pseudo);
  expect(filter, `${name}: CSS must declare a nonzero blur`).toMatch(/blur\((?!0px)[\d.]+px\)/);
  const identity = `paint-${++marker}`;
  await surface.evaluate((node, id) => node.setAttribute("data-native-blur-probe", id), identity);
  const before = await capture(page, surface);
  const zero = filter.replace(/blur\([^)]*\)/g, "blur(0px)");
  const override = await page.addStyleTag({ content: `[data-native-blur-probe="${identity}"]${pseudo}{backdrop-filter:${zero}!important;-webkit-backdrop-filter:${zero}!important}` });
  await paintReady(page);
  const without = await capture(page, surface);
  await override.evaluate(node => node.parentNode?.removeChild(node));
  await paintReady(page);
  const restored = await capture(page, surface);
  await surface.evaluate(node => node.removeAttribute("data-native-blur-probe"));
  const image = PNG.sync.read(before), scale = image.width / (await surface.boundingBox())!.width;
  // Keep text, shadows, scrollbars and rounded clipping outside the ROI.
  const roi = interior === "right"
    ? { x: Math.floor(image.width - 46 * scale), y: Math.floor(24 * scale), width: Math.floor(16 * scale), height: Math.floor(Math.min(100 * scale, image.height - 48 * scale)) }
    : { x: Math.floor(24 * scale), y: Math.floor(8 * scale), width: Math.floor(Math.min(120 * scale, image.width - 48 * scale)), height: Math.floor(6 * scale) };
  const metrics = nativeBlurMetrics(image, PNG.sync.read(without), PNG.sync.read(restored), roi);
  await test.info().attach(`${name}-metrics`, { body: Buffer.from(JSON.stringify({ filter, zero, metrics, capture: process.env.UNITARY_NATIVE_GLASS_XVFB === "1" ? "isolated-x11-display" : "browser-snapshot-diagnostic", browser: test.info().project.name, viewport: page.viewportSize(), dpr: scale, platform: process.platform })), contentType: "application/json" });
  for (const [suffix, body] of [["blur", before], ["zero", without], ["restored", restored]] as const)
    await test.info().attach(`${name}-${suffix}`, { body, contentType: "image/png" });
  expect(metrics.passed, `${name}: ${JSON.stringify(metrics)}`).toBe(true);
}

test("native blur control", async ({ page, browser }) => {
  test.info().annotations.push({ type: "engine", description: `${test.info().project.name} ${browser.version()} ${process.platform}` });
  await page.setContent(`<body style="margin:0"><div style="position:absolute;inset:0;background:${texture}"></div><div id="control" style="position:absolute;left:20px;top:20px;width:240px;height:100px;background:rgb(255 255 255 / .2);backdrop-filter:blur(8px) saturate(1.6);-webkit-backdrop-filter:blur(8px) saturate(1.6)"></div>`);
  await compare(page, page.locator("#control"), "isolated-control");
});

for (const theme of LAYOUT_THEMES) test(`local optical input: ${theme}`, async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.addInitScript(theme => {
    localStorage.setItem("unitary-theme-preference", theme);
    localStorage.setItem("unitary-texture-preference-v2", "glass");
  }, theme);
  await page.goto("/?lang=en-US#/materials");
  const surface = page.locator('[data-slot="texture-demo-menu-trigger"]');
  await surface.scrollIntoViewIfNeeded();
  const box = (await surface.boundingBox())!;
  const captures: PNG[] = [];
  for (const position of [.05, .95]) {
    await page.mouse.move(box.x + box.width * position, box.y + box.height / 2);
    await expect.poll(() => surface.evaluate(node => Number((node as HTMLElement).style.getPropertyValue("--_uni-glass-pointer-x")))).toBeCloseTo(position * 2 - 1, 1);
    await paintReady(page); captures.push(PNG.sync.read(await capture(page, surface)));
  }
  let changed = 0;
  for (let offset = 0; offset < captures[0].data.length; offset += 4)
    if (Math.max(...[0, 1, 2].map(channel => Math.abs(captures[0].data[offset + channel] - captures[1].data[offset + channel]))) >= 3) changed++;
  expect(changed).toBeGreaterThan(box.width / 4);
  expect(await surface.boundingBox()).toEqual(box);
  await expect(surface).toHaveCSS("filter", "none");
  await expect(surface).toHaveCSS("backdrop-filter", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(surface).not.toHaveAttribute("data-uni-glass-interaction");
});

async function fixture(page: Page, theme: string, usage: string) {
  await page.addInitScript(theme => localStorage.setItem("unitary-theme-preference", theme), theme);
  await page.goto(`/site/build/glass-regression.html?usage=${usage}`);
  await page.waitForFunction(() => document.documentElement.dataset.glassFixtureReady === "true");
  await page.getByRole("button", { name: "Glass", exact: true }).click();
  await page.locator(".glass-fixture-landscape").evaluate((node, pattern) => {
    (node as HTMLElement).style.backgroundImage = pattern;
    (node as HTMLElement).style.backgroundSize = "auto";
  }, texture);
  await page.mouse.move(0, 0);
  await paintReady(page);
}

for (const viewport of LAYOUT_VIEWPORTS) for (const theme of LAYOUT_THEMES) {
  test.describe(`${theme} ${viewport.width}`, () => {
    test.use({ viewport });
    test("material matrix", async ({ page, browser }) => {
      test.info().annotations.push({ type: "engine", description: `${test.info().project.name} ${browser.version()} ${process.platform}` });
      for (const usage of ["clear", "regular", "dense"]) {
        await fixture(page, theme, usage);
        if (usage === "dense") {
          await page.getByRole("combobox").click();
          await page.mouse.move(0, 0);
          await compare(page, page.locator('[data-slot="select-content"]'), "dense", "", "right");
        } else await compare(page, page.getByTestId("optical-owner"), usage);
      }
      await fixture(page, theme, "navigation");
      await compare(page, page.locator('[data-slot="navbar"]'), "fixed-header", "::before");
      if (viewport.width >= 768) {
        await page.getByRole("button", { name: "Browse", exact: true }).hover();
        await compare(page, page.locator('[data-slot="site-navigation-panel"]'), "hover-panel");
      }
    });
  });
}
