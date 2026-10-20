import { test, expect, type Page } from "@playwright/test";
import { PNG } from "pngjs";
import { artifactMode, artifactModule } from "./docs-artifact";
import { LAYOUT_THEMES, LAYOUT_VIEWPORTS } from "./helpers/layout-matrix";

test.setTimeout(60_000);

const tokenModule = artifactMode ? artifactModule("site/build/browser-fixtures.ts") : `/@fs/${process.cwd().replaceAll("\\", "/")}/src/lib/tokens.ts`;
async function open(page: Page, theme: string) {
  await page.addInitScript(theme => { localStorage.setItem("unitary-theme-preference", theme); localStorage.setItem("unitary-texture-preference-v2", "glass"); }, theme);
  await page.goto("/?lang=en-US#/materials");
  await expect(page.locator('[data-slot="texture-interaction-demo"]')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

for (const theme of LAYOUT_THEMES) test(`CSS Glass preset cascade, author tokens and dynamic contrast: ${theme}`, async ({ page }) => {
  await open(page, theme);
  await page.evaluate(() => {
    const host = document.createElement("div"); host.id = "glass-preset-probes";
    for (const [id, role, classes] of [["nav", "navigation", "bg-surface"], ["floating", "floating", "material-menu"], ["custom", "floating", "material-menu material-glass-clear"]]) {
      const node = document.createElement("div"); node.id = "preset-" + id; node.dataset.material = role; node.className = classes;
      node.style.cssText = "width:260px;height:140px;border-radius:12px"; host.append(node);
    }
    document.body.append(host);
  });
  const value = (id: string, name = "opacity", effective = true) => page.locator("#preset-" + id).evaluate((el, { name, effective }) => getComputedStyle(el).getPropertyValue((effective ? "--_uni-glass-effective-" : "--material-texture-glass-") + name).trim(), { name, effective });
  const owner = page.locator("#preset-custom");
  for (const [variant, opacity, blur] of [["clear", theme === "dark" ? "36%" : "28%", "8px"], ["dense", theme === "dark" ? "86%" : "80%", "20px"], ["regular", theme === "dark" ? "76%" : "56%", "10px"]]) {
    await owner.evaluate((el, variant) => el.className = "material-menu material-glass-" + variant, variant);
    expect(await value("custom")).toBe(opacity); expect(await value("custom", "blur")).toBe(blur);
  }
  await page.evaluate(async url => { const api = await import(url); api.setTokens({ "--material-texture-glass-opacity": "64%" }); }, tokenModule);
  expect(await value("custom")).toBe("64%");
  expect(await value("floating")).toBe(theme === "dark" ? "86%" : "80%");
  await owner.evaluate(el => el.className = "material-menu material-glass-clear");
  await page.evaluate(async url => { const api = await import(url); api.setTokens({ "--material-texture-glass-opacity": "41%", "--material-texture-glass-blur": "5px" }, { target: document.getElementById("preset-custom") }); }, tokenModule);
  expect(await value("custom")).toBe("41%"); expect(await value("custom", "blur")).toBe("5px");
  await page.emulateMedia({ contrast: "more" });
  expect(await value("custom")).toBe(theme === "dark" ? "96%" : "92%");
  expect(await value("custom", "blur")).toBe("20px");
  expect(await value("custom", "opacity", false)).toBe("41%");
  expect(await value("custom", "blur", false)).toBe("5px");
  await page.emulateMedia({ contrast: "no-preference" });
  await page.evaluate(async url => { const api = await import(url); api.resetTokens(["--material-texture-glass-opacity", "--material-texture-glass-blur"], { target: document.getElementById("preset-custom") }); }, tokenModule);
  expect(await value("custom")).toBe(theme === "dark" ? "36%" : "28%"); expect(await value("custom", "blur")).toBe("8px");
  await expect(page.locator('[data-uni-glass-defs], [data-uni-glass-renderer], feDisplacementMap')).toHaveCount(0);
});

for (const dpr of [1, 2]) test.describe(`native CSS material DPR${dpr}`, () => {
  test.use({ deviceScaleFactor: dpr });
  for (const variant of ["clear", "regular", "dense"]) for (const theme of LAYOUT_THEMES) for (const viewport of LAYOUT_VIEWPORTS) {
  test(`native CSS ${variant} blurs the scene and keeps foreground stable: ${theme} ${viewport.width}`, async ({ page }, info) => {
    await page.setViewportSize(viewport); await open(page, theme);
    await page.evaluate(variant => {
      const fixture = document.createElement("div"); fixture.id = "glass-pixel-fixture";
      fixture.style.cssText = "position:fixed;left:10px;top:80px;z-index:2147483646;width:280px;height:190px;background:repeating-linear-gradient(90deg,#000 0 3px,#fff 3px 6px)";
      const surface = document.createElement("div"); surface.className = `material-menu material-glass-${variant}`; surface.dataset.material = "floating"; surface.dataset.glassProbe = "";
      surface.style.cssText = "position:absolute;left:10px;top:20px;width:260px;height:140px;border-radius:6px;padding:28px;color:black;background-color:transparent;background-image:none;border:none;box-shadow:none;outline:none;--material-texture-glass-opacity:0%";
      const label = document.createElement("span"); label.textContent = "Sharp foreground"; label.style.cssText = "font:20px sans-serif;color:black";
      surface.append(label); fixture.append(surface); document.body.append(fixture);
    }, variant);
    const surface = page.locator("[data-glass-probe]");
    await expect(surface).toHaveCSS("backdrop-filter", `blur(${variant === "clear" ? 8 : variant === "dense" ? 20 : 10}px) saturate(${theme === "dark" ? 1.5 : 1.6})`);
    const box = await surface.boundingBox(), label = await surface.locator("span").boundingBox();
    const blurred = PNG.sync.read(await surface.screenshot({ scale: "css" }));
    await surface.evaluate(el => { (el as HTMLElement).style.setProperty("backdrop-filter", "none", "important"); (el as HTMLElement).style.setProperty("-webkit-backdrop-filter", "none", "important"); });
    const sharp = PNG.sync.read(await surface.screenshot({ scale: "css" }));
    let changed = 0, stableInk = 0;
    for (let y = 20; y < 120; y++) for (let x = 10; x < 250; x++) {
      const i = (y * blurred.width + x) * 4;
      if (Math.max(...[0, 1, 2].map(c => Math.abs(blurred.data[i + c] - sharp.data[i + c]))) > 20) changed++;
      if (y > 28 && y < 52 && x > 28 && x < 210 && [0, 1, 2].every(c => blurred.data[i + c] < 3 && sharp.data[i + c] < 3)) stableInk++;
    }
    expect(changed, "native backdrop blur must change rendered pixels").toBeGreaterThan(3000);
    expect(stableInk, "foreground glyph ink must stay at the same pixel coordinates").toBeGreaterThan(80);
    expect(await surface.boundingBox()).toEqual(box); expect(await surface.locator("span").boundingBox()).toEqual(label);
    await expect(page.locator('[data-uni-glass-defs], [data-uni-glass-renderer]')).toHaveCount(0);
    await info.attach("css-material-blur", { body: PNG.sync.write(blurred), contentType: "image/png" });
  });
  }
});

test("Glass reduced transparency and forced colors preserve the preference and recover", async ({ page }) => {
  await open(page, "dark"); const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-transparency", value: "reduce" }] });
  await expect(page.locator("html")).toHaveAttribute("data-texture", "solid"); await expect(page.locator("html")).toHaveAttribute("data-texture-preference", "glass");
  await session.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-transparency", value: "no-preference" }] });
  await expect(page.locator("html")).toHaveAttribute("data-texture", "glass");
  await page.emulateMedia({ forcedColors: "active" }); await expect(page.locator("html")).toHaveAttribute("data-texture", "solid");
  await page.emulateMedia({ forcedColors: "none" }); await expect(page.locator("html")).toHaveAttribute("data-texture", "glass");
});

test("CSS Glass paints with a self-only image policy and no generated resources", async ({ page }) => {
  await page.route("**/*", async route => {
    if (route.request().resourceType() !== "document") return route.continue();
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), "content-security-policy": "img-src 'self'" } });
  });
  await open(page, "dark");
  const surface = page.locator('[data-slot="texture-interaction-demo"] > [data-material="floating"]');
  await expect(surface).toHaveCSS("backdrop-filter", "blur(20px) saturate(1.5)");
  await expect(surface).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(page.locator('[data-uni-glass-defs], [data-uni-glass-renderer]')).toHaveCount(0);
});
