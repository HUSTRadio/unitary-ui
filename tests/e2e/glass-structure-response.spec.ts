import { expect, test } from "@playwright/test";
import { PNG } from "pngjs";

test.setTimeout(60_000);

async function open(page: import("@playwright/test").Page, usage: string, theme = "light") {
  await page.addInitScript(theme => { localStorage.setItem("unitary-theme-preference", theme); localStorage.setItem("unitary-texture-preference-v2", "solid"); }, theme);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(`${test.info().project.use.baseURL}/site/build/glass-regression.html?usage=${usage}`);
  await expect(page.locator("html")).toHaveAttribute("data-glass-fixture-ready", "true");
  await page.getByRole("button", { name: "Glass", exact: true }).click();
}

async function labelGeometry(surface: import("@playwright/test").Locator) {
  return surface.evaluate(el => {
    const text = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (text.nextNode()) if (text.currentNode.textContent?.trim()) {
      const range = document.createRange(); range.selectNodeContents(text.currentNode);
      return range.getBoundingClientRect().toJSON();
    }
    return null;
  });
}

for (const theme of ["light", "dark"]) for (const usage of ["clear", "regular", "tabs", "switch", "toggle"]) {
  test(`CSS sheen preserves native ${usage} state and geometry: ${theme}`, async ({ page }) => {
    await open(page, usage, theme);
    const surfaces = usage === "tabs" ? page.getByRole("tab") : usage === "switch" ? page.locator('[data-slot="switch-control"]')
      : usage === "toggle" ? page.locator('[data-slot="toggle-track"]') : page.getByTestId("optical-owner");
    const surface = surfaces.first();
    const target = usage === "regular" ? page.getByRole("button", { name: "Pin", exact: true }) : usage === "switch" ? page.locator('[data-slot="switch"] > label').first() : usage === "toggle" ? page.getByRole("checkbox") : surface;
    const foreground = usage === "toggle" ? surface.locator("xpath=ancestor::label[1]") : surface;
    await expect(surface).toHaveAttribute("data-uni-glass-interaction", "");
    const box = (await surface.boundingBox())!, labelBox = await labelGeometry(foreground);
    await page.mouse.move(box.x + box.width * .75, box.y + box.height * .5);
    await expect.poll(() => surface.evaluate(el => Number(el.style.getPropertyValue("--_uni-glass-pointer-x")))).toBeCloseTo(.5, 1);
    await page.mouse.down(); await expect(surface).toHaveAttribute("data-uni-glass-contact", "");
    const held = await surface.evaluate(el => el.style.getPropertyValue("--_uni-glass-pointer-x"));
    await page.mouse.move(box.x + box.width * .25, box.y + box.height * .5);
    expect(await surface.evaluate(el => el.style.getPropertyValue("--_uni-glass-pointer-x"))).toBe(held);
    await page.mouse.up(); await expect(surface).not.toHaveAttribute("data-uni-glass-contact");
    await target.click();
    expect(await surface.boundingBox()).toEqual(box); expect(await labelGeometry(foreground)).toEqual(labelBox);
    await expect(page.locator('[data-uni-glass-defs], [data-uni-glass-renderer], feDisplacementMap')).toHaveCount(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(surface).not.toHaveAttribute("data-uni-glass-interaction"); await expect(surface).not.toHaveAttribute("data-uni-glass-contact");
    expect(await surface.evaluate(el => el.style.getPropertyValue("--_uni-glass-pointer-x"))).toBe("");
  });
}

for (const theme of ["light", "dark"]) for (const dpr of [1, 2]) test(`CSS pointer sheen changes painted pixels without moving text: ${theme} DPR${dpr}`, async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: dpr });
  try {
    const page = await context.newPage(); await open(page, "clear", theme);
    const surface = page.getByTestId("optical-owner"); const box = (await surface.boundingBox())!, label = await surface.locator("span").first().boundingBox();
    const capture = async (fraction: number) => {
      await page.mouse.move(box.x + box.width * fraction, box.y + box.height / 2);
      await expect.poll(() => surface.evaluate(el => Number(el.style.getPropertyValue("--_uni-glass-pointer-x")))).toBeCloseTo(fraction * 2 - 1, 1);
      await expect.poll(() => surface.evaluate(el => el.getAnimations().some(animation => animation.playState === "running"))).toBe(false);
      return PNG.sync.read(await surface.screenshot());
    };
    const left = await capture(.05), right = await capture(.95); let changed = 0;
    for (let i = 0; i < left.data.length; i += 4) if (Math.max(...[0, 1, 2].map(c => Math.abs(left.data[i+c] - right.data[i+c]))) >= 2) changed++;
    expect(changed, "coordinates alone are not visible interaction feedback").toBeGreaterThan(40 * dpr);
    expect(await surface.boundingBox()).toEqual(box); expect(await surface.locator("span").first().boundingBox()).toEqual(label);
    expect(await surface.evaluate(el => getComputedStyle(el).filter)).toBe("none");
  } finally { await context.close(); }
});

for (const theme of ["light", "dark"]) test(`touch Glass preserves native state and clears contact: ${theme}`, async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  try {
    const page = await context.newPage(); await open(page, "clear", theme);
    const control = page.getByRole("button", { name: "Playback" });
    await control.tap(); await expect(control).toHaveAttribute("aria-pressed", "true");
    await expect(control).not.toHaveAttribute("data-uni-glass-contact");
    expect(await control.evaluate(el => el.style.getPropertyValue("--_uni-glass-pointer-x"))).toBe("");
    await expect(page.locator('[data-uni-glass-defs], [data-uni-glass-renderer]')).toHaveCount(0);
  } finally { await context.close(); }
});

// A11Y-TEST-0082..0085 (clear/regular/switch/toggle 四个参数化变体)
for (const usage of ["clear", "regular", "switch", "toggle"]) test.skip(`local MotionProvider disables Glass tracking and hover animation: ${usage}`, async ({ page }) => {
  await open(page, usage + "&motion=reduced");
  const surface = usage === "switch" ? page.locator('[data-slot="switch-control"]').first() : usage === "toggle" ? page.locator('[data-slot="toggle-track"]') : page.getByTestId("optical-owner");
  const target = usage === "switch" ? page.locator('[data-slot="switch"] > label').first() : usage === "toggle" ? page.getByRole("checkbox") : usage === "regular" ? page.getByRole("button", { name: "Pin", exact: true }) : surface;
  await expect(surface).not.toHaveAttribute("data-uni-glass-interaction");
  await target.hover();
  expect(await surface.evaluate(el => el.getAnimations().some(animation => animation.playState === "running"))).toBe(false);
  expect(await surface.evaluate(el => el.style.getPropertyValue("--_uni-glass-pointer-x"))).toBe("");
});
