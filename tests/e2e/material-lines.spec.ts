import { expect, test, type Locator, type Page } from "@playwright/test";
import { PNG } from "pngjs";

type Theme = "light" | "dark";
type Texture = "solid" | "hybrid" | "glass";

test.setTimeout(60_000);

async function frames(page: Page) {
  await page.evaluate(() => new Promise<void>(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  ));
}

async function openDrawer(page: Page, theme: Theme, width = 1280) {
  await page.addInitScript(({ theme }) => {
    localStorage.setItem("unitary-theme-preference", theme);
    localStorage.removeItem("unitary-texture-preference");
  }, { theme });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width, height: 900 });
  await page.goto("/?lang=en-US#/materials");
  const materials = page.locator('[data-slot="materials-page"]');
  await expect(materials).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-texture", "solid");
  await page.evaluate(() => document.fonts.ready);
  await materials.locator('[data-slot="texture-demo-drawer-trigger"]').click();
  const drawer = page.locator('[data-slot="texture-demo-drawer"]');
  await expect(drawer).toBeVisible();
  await frames(page);
  return drawer;
}

async function select(page: Page, drawer: Locator, texture: Texture) {
  await drawer.locator(`label:has([data-texture-option="${texture}"])`).click();
  await expect(page.locator("html")).toHaveAttribute("data-texture", texture);
  await expect(drawer.locator(`[data-texture-option="${texture}"]`)).toBeChecked();
  await frames(page);
}

const drawerLines = (drawer: Locator) => [
  { name: "header", locator: drawer.locator('[data-slot="responsive-drawer-header"]'), edge: "bottom" as const },
  { name: "footer", locator: drawer.locator('[data-slot="responsive-drawer-footer"]'), edge: "top" as const },
  { name: "close button", locator: drawer.locator('[data-slot="responsive-drawer-footer"] [data-slot="responsive-drawer-close"]'), edge: "top" as const },
];

async function computedLines(drawer: Locator) {
  return Promise.all(drawerLines(drawer).map(async line => ({
    name: line.name,
    style: await line.locator.evaluate(el => {
      const style = getComputedStyle(el);
      return { top: style.borderTopColor, bottom: style.borderBottomColor,
        width: [style.borderTopWidth, style.borderBottomWidth], background: style.backgroundColor };
    }),
  })));
}

function luminance(rgb: readonly number[]) {
  const values = rgb.map(channel => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
}

function rowColor(png: PNG, x: number, y: number) {
  const result = [0, 0, 0];
  for (let offset = -2; offset <= 2; offset++) {
    const index = (y * png.width + x + offset) * 4;
    for (let channel = 0; channel < 3; channel++) result[channel] += png.data[index + channel] / 5;
  }
  return result;
}

/** Sample a straight central edge, away from rounded corners and text. Fractional
 * layout can distribute a 1px border across two painted rows, so inspect the
 * neighboring rows and select the row carrying the strongest actual line. */
async function paintedLine(png: PNG, line: ReturnType<typeof drawerLines>[number], theme: Theme) {
  const geometry = await line.locator.evaluate((el, edge) => {
    const bounds = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const width = Number.parseFloat(edge === "top" ? style.borderTopWidth : style.borderBottomWidth);
    return { x: Math.round(bounds.left + bounds.width / 2),
      y: edge === "top" ? bounds.top + width / 2 : bounds.bottom - width / 2,
      width, surfaceY: edge === "top" ? Math.ceil(bounds.top + 5) : Math.floor(bounds.bottom - 5) };
  }, line.edge);
  expect(geometry.width, `${line.name} should retain its 1px border`).toBe(1);
  const rows = [Math.floor(geometry.y) - 1, Math.floor(geometry.y), Math.ceil(geometry.y)];
  const colors = rows.map(y => rowColor(png, geometry.x, y));
  colors.sort((left, right) => theme === "light" ? luminance(left) - luminance(right) : luminance(right) - luminance(left));
  const color = colors[0];
  const surface = rowColor(png, geometry.x, geometry.surfaceY);
  const lineLuminance = luminance(color), surfaceLuminance = luminance(surface);
  return { name: line.name, color, surface,
    direction: lineLuminance - surfaceLuminance,
    contrast: (Math.max(lineLuminance, surfaceLuminance) + .05) / (Math.min(lineLuminance, surfaceLuminance) + .05) };
}

for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 1280]) {
    for (const texture of ["hybrid", "glass"] as const) {
      test(`Material structural lines remain painted: ${theme}, ${width}, ${texture}`, async ({ page }, testInfo) => {
        const drawer = await openDrawer(page, theme, width);
        const solid = await computedLines(drawer);
        await select(page, drawer, texture);
        const buffer = await page.screenshot({ animations: "disabled", caret: "hide", scale: "css" });
        const png = PNG.sync.read(buffer);
        const samples = await Promise.all(drawerLines(drawer).map(line => paintedLine(png, line, theme)));
        await testInfo.attach("painted-drawer", { body: buffer, contentType: "image/png" });
        await testInfo.attach("painted-structural-line-colors", {
          body: JSON.stringify(samples, null, 2), contentType: "application/json",
        });
        for (const sample of samples) {
          if (theme === "light") expect(sample.direction, `${sample.name}: light lines should darken the surface`).toBeLessThan(0);
          else expect(sample.direction, `${sample.name}: dark lines should lighten the surface`).toBeGreaterThan(0);
          // This is a modest visual-regression floor for decorative boundaries,
          // not a substitute for text or interactive-control accessibility rules.
          expect(sample.contrast, `${sample.name} should separate the painted regions`).toBeGreaterThanOrEqual(1.25);
        }
        await select(page, drawer, "solid");
        expect(await computedLines(drawer), "Solid restores its exact original computed colors").toEqual(solid);
      });
    }
  }
}

async function installLineFixtures(page: Page, drawer: Locator) {
  await page.addStyleTag({ content: `@layer utilities {
    .material-line-author-border { border-color: rgb(90 80 70); }
    .material-line-author-background { background-color: rgb(50 60 70); }
  }` });
  await drawer.locator('[data-slot="responsive-drawer-body"]').evaluate(el => {
    const fixture = document.createElement("div");
    fixture.dataset.materialLineFixture = "inside";
    const append = (name: string, className: string, slot?: string) => {
      const item = document.createElement("div");
      item.dataset.lineProbe = name;
      item.className = className;
      if (slot) item.dataset.slot = slot;
      Object.assign(item.style, { width: "160px", height: slot ? "1px" : "24px", margin: "8px 0" });
      fixture.append(item);
      return item;
    };
    append("default-border", "border border-border");
    append("alpha-border", "border border-gray-alpha-400");
    append("separator", "h-px bg-gray-200", "separator");
    append("alpha-separator", "h-px bg-gray-alpha-400", "context-menu-separator");
    append("border-separator", "h-px bg-border", "separator");
    append("author-border", "border border-border material-line-author-border");
    append("author-separator", "h-px bg-gray-200 material-line-author-background", "separator");
    append("inline-border", "border border-border").style.borderColor = "rgb(30 40 50)";
    append("inline-separator", "h-px bg-gray-200", "separator").style.backgroundColor = "rgb(70 80 90)";
    const palette = document.createElement("div");
    palette.style.setProperty("--color-text-primary", "rgb(30 90 150)");
    const local = document.createElement("div");
    local.dataset.lineProbe = "palette-separator";
    local.dataset.slot = "separator";
    local.className = "h-px bg-gray-200";
    palette.append(local);
    fixture.append(palette);
    el.append(fixture);
    const outside = fixture.cloneNode(true) as HTMLElement;
    outside.dataset.materialLineFixture = "outside";
    Object.assign(outside.style, { position: "fixed", left: "0", top: "0", visibility: "hidden" });
    document.body.append(outside);
  });
  return {
    inside: page.locator('[data-material-line-fixture="inside"]'),
    outside: page.locator('[data-material-line-fixture="outside"]'),
  };
}

async function fixtureColors(fixture: Locator) {
  return fixture.locator("[data-line-probe]").evaluateAll(elements => Object.fromEntries(elements.map(el => {
    const style = getComputedStyle(el);
    return [(el as HTMLElement).dataset.lineProbe, { border: style.borderTopColor, background: style.backgroundColor }];
  })));
}

for (const theme of ["light", "dark"] as const) {
  test(`Material line contracts preserve author colors, scoped palettes and ordinary document lines: ${theme}`, async ({ page }) => {
    const drawer = await openDrawer(page, theme);
    const { inside, outside } = await installLineFixtures(page, drawer);
    const baselineInside = await fixtureColors(inside), baselineOutside = await fixtureColors(outside);
    for (const texture of ["hybrid", "glass"] as const) {
      await select(page, drawer, texture);
      const colors = await fixtureColors(inside);
      expect(colors["default-border"].border).not.toBe(baselineInside["default-border"].border);
      expect(colors["alpha-border"].border).toBe(colors["default-border"].border);
      for (const separator of ["separator", "alpha-separator", "border-separator"]) {
        expect(colors[separator].background).toBe(colors["default-border"].border);
      }
      for (const name of ["author-border", "author-separator", "inline-border", "inline-separator"]) {
        expect(colors[name], name).toEqual(baselineInside[name]);
      }
      expect(colors["palette-separator"].background, "A nested palette resolves the line from its own foreground").not.toBe(colors.separator.background);
      const paletteColor = await inside.locator('[data-line-probe="palette-separator"]').evaluate(el => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const context = canvas.getContext("2d")!;
        context.fillStyle = getComputedStyle(el).backgroundColor;
        context.fillRect(0, 0, 1, 1);
        return [...context.getImageData(0, 0, 1, 1).data];
      });
      expect(Math.abs(paletteColor[0] - 30)).toBeLessThanOrEqual(3);
      expect(Math.abs(paletteColor[1] - 90)).toBeLessThanOrEqual(3);
      expect(Math.abs(paletteColor[2] - 150)).toBeLessThanOrEqual(3);
      expect(paletteColor[3]).toBeGreaterThan(0);
      expect(paletteColor[3]).toBeLessThan(255);
      expect(await fixtureColors(outside), "Ordinary document lines retain their Solid colors").toEqual(baselineOutside);
    }
    await select(page, drawer, "solid");
    expect(await fixtureColors(inside)).toEqual(baselineInside);
    expect(await fixtureColors(outside)).toEqual(baselineOutside);
  });
}

for (const texture of ["hybrid", "glass"] as const) {
  for (const fallback of ["forced colors", "reduced transparency"] as const) {
    test(`Material line CSS fallback clears the inherited opacity gate: ${texture}, ${fallback}`, async ({ page, context }) => {
      const drawer = await openDrawer(page, "light");
      // Opt this isolated static fixture out of system color remapping so the
      // test can inspect CSS fallback independently of UA forced-color paint.
      await drawer.evaluate(el => {
        const fixture = document.createElement("div");
        fixture.dataset.staticMaterialLineFixture = "";
        fixture.dataset.material = "floating";
        fixture.className = "material-menu";
        fixture.style.forcedColorAdjust = "none";
        for (const [name, className, slot] of [
          ["border", "border border-border", ""],
          ["alpha-border", "border border-gray-alpha-400", ""],
          ["separator", "h-px bg-gray-200", "separator"],
          ["alpha-separator", "h-px bg-gray-alpha-400", "context-menu-separator"],
        ]) {
          const item = document.createElement("div");
          item.dataset.lineProbe = name;
          item.className = className;
          if (slot) item.dataset.slot = slot;
          fixture.append(item);
        }
        el.append(fixture);
      });
      const fixture = page.locator("[data-static-material-line-fixture]");
      const solid = await fixtureColors(fixture);
      await select(page, drawer, texture);
      expect(await fixture.evaluate(el => getComputedStyle(el).getPropertyValue("--_uni-material-line-opacity").trim())).not.toBe("");
      const cdp = await context.newCDPSession(page);
      try {
        await cdp.send("Emulation.setEmulatedMedia", { features: [
          { name: "forced-colors", value: fallback === "forced colors" ? "active" : "none" },
          { name: "prefers-reduced-transparency", value: fallback === "reduced transparency" ? "reduce" : "no-preference" },
          { name: "prefers-reduced-motion", value: "reduce" },
        ] });
        await expect(page.locator("html")).toHaveAttribute("data-texture", "solid");
        // Hold the enhanced declaration after the provider's state update.
        // CSS must still protect static HTML with no ThemeProvider fallback.
        await page.locator("html").evaluate((el, texture) => { el.setAttribute("data-texture", texture); }, texture);
        await frames(page);
        await expect(page.locator("html")).toHaveAttribute("data-texture", texture);
        expect(await fixture.evaluate(el => getComputedStyle(el).getPropertyValue("--_uni-material-line-opacity").trim())).toBe("");
        expect(await fixtureColors(fixture), "CSS fallback clears inherited enhancements and restores canonical line colors").toEqual(solid);
        await cdp.send("Emulation.setEmulatedMedia", { features: [
          { name: "forced-colors", value: "none" },
          { name: "prefers-reduced-transparency", value: "no-preference" },
          { name: "prefers-reduced-motion", value: "reduce" },
        ] });
        await expect(page.locator("html")).toHaveAttribute("data-texture", texture);
        await expect.poll(() => fixture.evaluate(el => getComputedStyle(el).getPropertyValue("--_uni-material-line-opacity").trim())).not.toBe("");
      } finally {
        await cdp.detach();
      }
    });
  }
}
