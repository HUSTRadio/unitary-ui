import { expect, test, type Locator, type Page } from "@playwright/test";
import { PNG } from "pngjs";

type Theme = "light" | "dark";
type Texture = "hybrid" | "glass";

test.setTimeout(60_000);

async function frames(page: Page) {
  await page.evaluate(() => new Promise<void>(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  ));
}

async function open(page: Page, theme: Theme, width = 1280) {
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
  return materials;
}

async function select(page: Page, owner: Locator, texture: Texture | "solid") {
  await owner.locator(`label:has([data-texture-option="${texture}"])`).first().click();
  await expect(page.locator("html")).toHaveAttribute("data-texture", texture);
  await frames(page);
}

/** A shared sharp color boundary underneath both real overlay families.
 * Its stacking level is derived from the library, and its location is checked
 * against each actual panel before sampling. No text antialiasing is involved. */
async function installBackground(page: Page) {
  await page.evaluate(() => {
    const patch = document.createElement("div");
    patch.dataset.maskBackgroundProbe = "";
    patch.setAttribute("aria-hidden", "true");
    Object.assign(patch.style, {
      position: "fixed", left: "16px", top: "16px", width: "180px", height: "120px",
      zIndex: "calc(var(--uni-z-drawer) - 1)", pointerEvents: "none",
      background: "linear-gradient(to right, rgb(24 88 148) 50%, rgb(230 172 40) 50%)",
    });
    document.body.append(patch);
  });
  return page.locator("[data-mask-background-probe]");
}

async function pixels(page: Page, patch: Locator, content?: Locator) {
  const bounds = await patch.boundingBox();
  expect(bounds).not.toBeNull();
  if (content) {
    const panel = await content.boundingBox();
    expect(panel).not.toBeNull();
    expect(bounds!.x + bounds!.width <= panel!.x || bounds!.x >= panel!.x + panel!.width ||
      bounds!.y + bounds!.height <= panel!.y || bounds!.y >= panel!.y + panel!.height,
    "The comparison patch must be outside the foreground panel").toBe(true);
  }
  // Three blur radii separate the crop from the fixture's outer edges.
  const clip = { x: bounds!.x + 24, y: bounds!.y + 24, width: bounds!.width - 48, height: bounds!.height - 48 };
  const buffer = await page.screenshot({ clip, animations: "disabled", caret: "hide", scale: "css" });
  return { buffer, png: PNG.sync.read(buffer) };
}

function pixel(png: PNG, x: number, y = Math.floor(png.height / 2)) {
  const offset = (y * png.width + x) * 4;
  return [...png.data.subarray(offset, offset + 3)];
}

function maxDifference(left: PNG, right: PNG) {
  expect([left.width, left.height]).toEqual([right.width, right.height]);
  let maximum = 0;
  for (let offset = 0; offset < left.data.length; offset++) {
    maximum = Math.max(maximum, Math.abs(left.data[offset] - right.data[offset]));
  }
  return maximum;
}

async function maskStyle(mask: Locator) {
  return mask.evaluate(el => {
    const style = getComputedStyle(el);
    return { background: style.backgroundColor, opacity: style.opacity, filter: style.backdropFilter };
  });
}

async function backgroundRGBA(mask: Locator) {
  return mask.evaluate(el => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d")!;
    context.fillStyle = getComputedStyle(el).backgroundColor;
    context.fillRect(0, 0, 1, 1);
    return [...context.getImageData(0, 0, 1, 1).data];
  });
}

for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 1280]) {
    for (const texture of ["hybrid", "glass"] as const) {
      test(`Modal and Drawer retain the same neutral painted context: ${theme}, ${width}, ${texture}`, async ({ page }, testInfo) => {
        const materials = await open(page, theme, width);
        const patch = await installBackground(page);
        const unmasked = await pixels(page, patch);

        await materials.locator('[data-slot="texture-demo-modal-trigger"]').click();
        const modal = page.locator('[data-slot="texture-demo-modal"]');
        await expect(modal).toBeVisible();
        const modalMask = modal.locator('xpath=..');
        await expect(modalMask).toHaveAttribute("data-material", "mask-backdrop");
        await frames(page);
        const solidModalStyle = await maskStyle(modalMask);
        const solidModal = await pixels(page, patch, modal);
        await select(page, modal, texture);
        const enhancedModal = await pixels(page, patch, modal);
        const enhancedModalStyle = await maskStyle(modalMask);

        await modal.evaluate(el => {
          const swatch = document.createElement("div");
          swatch.dataset.opaqueForegroundProbe = "";
          Object.assign(swatch.style, { position: "absolute", right: "20px", bottom: "20px",
            width: "24px", height: "24px", backgroundColor: "rgb(64 128 192)", pointerEvents: "none" });
          el.append(swatch);
        });
        const swatch = await page.locator("[data-opaque-foreground-probe]").screenshot({ animations: "disabled", scale: "css" });
        expect(pixel(PNG.sync.read(swatch), 12), "A mask must not attenuate its opaque foreground children").toEqual([64, 128, 192]);
        await expect(modalMask).toHaveCSS("opacity", "1");
        expect((await maskStyle(modal)).filter, "Do not repeat backdrop sampling inside a masked Modal").toBe("none");
        await select(page, modal, "solid");
        expect(await maskStyle(modalMask)).toEqual(solidModalStyle);
        expect(maxDifference((await pixels(page, patch, modal)).png, solidModal.png)).toBeLessThanOrEqual(1);
        await page.keyboard.press("Escape");
        await expect(modal).toHaveCount(0);

        await materials.locator('[data-slot="texture-demo-drawer-trigger"]').click();
        const drawer = page.locator('[data-slot="texture-demo-drawer"]');
        await expect(drawer).toBeVisible();
        const drawerMask = page.locator('[data-slot="responsive-drawer-overlay"]');
        await expect(drawerMask).toHaveAttribute("data-material", "mask-scrim");
        await frames(page);
        const solidDrawerStyle = await maskStyle(drawerMask);
        const solidDrawer = await pixels(page, patch, drawer);
        await select(page, drawer, texture);
        const enhancedDrawer = await pixels(page, patch, drawer);
        expect(await maskStyle(drawerMask)).toEqual(enhancedModalStyle);
        expect(maxDifference(enhancedModal.png, enhancedDrawer.png),
          "The same underlying context should not wash white for Modal and darken for Drawer").toBeLessThanOrEqual(2);

        const center = Math.floor(enhancedDrawer.png.width / 2);
        expect(Math.abs(pixel(unmasked.png, center)[0] - pixel(unmasked.png, center - 1)[0])).toBeGreaterThan(150);
        expect(Math.abs(pixel(enhancedDrawer.png, center)[0] - pixel(enhancedDrawer.png, center - 1)[0]),
          "The actual painted hard boundary should be softened, not merely tinted").toBeLessThan(30);
        for (const x of [12, enhancedDrawer.png.width - 13]) {
          const original = pixel(unmasked.png, x), actual = pixel(enhancedDrawer.png, x);
          expect(Math.max(...actual.map((value, channel) => Math.abs(value - original[channel]))),
            "The neutral veil should retain background color instead of strongly washing or dimming it").toBeLessThan(30);
        }
        await testInfo.attach("modal-neutral-mask", { body: enhancedModal.buffer, contentType: "image/png" });
        await testInfo.attach("drawer-neutral-mask", { body: enhancedDrawer.buffer, contentType: "image/png" });
        await select(page, drawer, "solid");
        expect(await maskStyle(drawerMask)).toEqual(solidDrawerStyle);
        expect(maxDifference((await pixels(page, patch, drawer)).png, solidDrawer.png)).toBeLessThanOrEqual(1);
      });
    }
  }
}

/** These static owners use the default SheetOverlay and ExpandPanel overlay
 * utility contracts. Static HTML must work without a component/provider hook. */
async function installStaticMasks(page: Page) {
  await page.evaluate(() => {
    const fixture = document.createElement("div");
    fixture.dataset.staticMaskFixture = "";
    Object.assign(fixture.style, { position: "fixed", left: "20px", top: "160px",
      zIndex: "calc(var(--uni-z-modal) + 1)", display: "flex", gap: "24px", pointerEvents: "none",
      forcedColorAdjust: "none" });
    for (const [name, role, className] of [
      ["sheet", "mask-backdrop", "bg-[var(--uni-overlay-backdrop-color)] opacity-[var(--uni-overlay-backdrop-opacity)]"],
      ["lifecycle", "mask-scrim", "bg-[var(--uni-overlay-scrim-color)] opacity-0 data-[motion-state=open]:opacity-100 transition-opacity motion-reduce:transition-none"],
    ]) {
      const background = document.createElement("div");
      background.dataset.staticMaskBackground = name;
      Object.assign(background.style, { position: "relative", width: "180px", height: "120px",
        background: "linear-gradient(to right, rgb(24 88 148) 50%, rgb(230 172 40) 50%)" });
      const mask = document.createElement("div");
      mask.dataset.staticMaskProbe = name;
      mask.dataset.material = role;
      mask.dataset.state = "open";
      if (name === "lifecycle") mask.dataset.motionState = "closed";
      mask.className = className;
      Object.assign(mask.style, { position: "absolute", inset: "0" });
      background.append(mask);
      fixture.append(background);
    }
    document.body.append(fixture);
  });
  return {
    sheet: page.locator('[data-static-mask-probe="sheet"]'),
    lifecycle: page.locator('[data-static-mask-probe="lifecycle"]'),
    sheetBackground: page.locator('[data-static-mask-background="sheet"]'),
    lifecycleBackground: page.locator('[data-static-mask-background="lifecycle"]'),
  };
}

for (const texture of ["hybrid", "glass"] as const) {
  test(`Public neutral mask opacity, legacy alias, and local palette remain effective: ${texture}`, async ({ page }) => {
    const materials = await open(page, "light");
    const fixture = await installStaticMasks(page);
    await fixture.lifecycle.evaluate(el => { (el as HTMLElement).dataset.motionState = "open"; });
    await select(page, materials, texture);
    const baselinePaint = await pixels(page, fixture.sheetBackground);
    const baseline = await backgroundRGBA(fixture.sheet);
    expect(Math.abs(baseline[3] - 255 * .08)).toBeLessThanOrEqual(1);
    await page.locator("html").evaluate(el => {
      (el as HTMLElement).style.setProperty("--material-texture-mask-opacity", "20%");
    });
    await frames(page);
    for (const mask of [fixture.sheet, fixture.lifecycle]) {
      expect((await backgroundRGBA(mask))[3], "The public root opacity controls both mask families").toBe(51);
    }
    expect(maxDifference(baselinePaint.png, (await pixels(page, fixture.sheetBackground)).png),
      "The public knob must also change painted output").toBeGreaterThan(5);
    await page.locator("html").evaluate(el => {
      (el as HTMLElement).style.setProperty("--material-texture-mask-backdrop-opacity", "35%");
    });
    for (const mask of [fixture.sheet, fixture.lifecycle]) {
      expect(Math.abs((await backgroundRGBA(mask))[3] - 255 * .35),
        "Existing opacity alias overrides still apply to both families").toBeLessThanOrEqual(1);
    }
    await page.locator("html").evaluate(el => {
      (el as HTMLElement).style.removeProperty("--material-texture-mask-backdrop-opacity");
    });
    await fixture.sheet.evaluate(el => {
      const owner = el as HTMLElement;
      owner.style.setProperty("--color-bg-surface", "rgb(20 40 60)");
      owner.style.setProperty("--color-text-primary", "rgb(140 160 180)");
    });
    await frames(page);
    const local = await backgroundRGBA(fixture.sheet);
    for (const [channel, expected] of [80, 100, 120].entries()) {
      expect(Math.abs(local[channel] - expected), "Resolve the neutral midpoint in the local palette").toBeLessThanOrEqual(2);
    }
    expect(local[3]).toBe(51);
    expect(local.slice(0, 3)).not.toEqual((await backgroundRGBA(fixture.lifecycle)).slice(0, 3));
    await page.locator("html").evaluate(el => {
      (el as HTMLElement).style.removeProperty("--material-texture-mask-opacity");
    });
    expect(Math.abs((await backgroundRGBA(fixture.lifecycle))[3] - 255 * .08)).toBeLessThanOrEqual(1);
  });

  test(`Static Sheet alpha and scrim lifecycle retain their distinct contracts: ${texture}`, async ({ page }) => {
    const materials = await open(page, "light");
    const fixture = await installStaticMasks(page);
    const solidSheet = await maskStyle(fixture.sheet);
    const solidPaint = await pixels(page, fixture.sheetBackground);
    expect(solidSheet.opacity).toBe("0.8");
    await select(page, materials, texture);
    await expect(fixture.sheet).toHaveCSS("opacity", "1");
    await expect(fixture.lifecycle).toHaveCSS("opacity", "0");
    await fixture.lifecycle.evaluate(el => { (el as HTMLElement).dataset.motionState = "open"; });
    await expect(fixture.lifecycle).toHaveCSS("opacity", "1");
    await frames(page);
    expect(maxDifference((await pixels(page, fixture.sheetBackground)).png,
      (await pixels(page, fixture.lifecycleBackground)).png),
    "Static color + opacity Sheet must not double-attenuate the shared neutral veil").toBeLessThanOrEqual(2);
    await fixture.lifecycle.evaluate(el => { (el as HTMLElement).dataset.motionState = "closed"; });
    await expect(fixture.lifecycle).toHaveCSS("opacity", "0");
    await select(page, materials, "solid");
    expect(await maskStyle(fixture.sheet)).toEqual(solidSheet);
    expect(maxDifference((await pixels(page, fixture.sheetBackground)).png, solidPaint.png)).toBe(0);
  });

  for (const fallback of ["forced colors", "reduced transparency"] as const) {
    test(`Static masks stay opaque and preserve closed lifecycle in CSS fallback: ${texture}, ${fallback}`, async ({ page, context }) => {
      const materials = await open(page, "dark");
      const fixture = await installStaticMasks(page);
      await fixture.lifecycle.evaluate(el => { (el as HTMLElement).dataset.motionState = "open"; });
      await select(page, materials, texture);
      const cdp = await context.newCDPSession(page);
      try {
        await cdp.send("Emulation.setEmulatedMedia", { features: [
          { name: "forced-colors", value: fallback === "forced colors" ? "active" : "none" },
          { name: "prefers-reduced-transparency", value: fallback === "reduced transparency" ? "reduce" : "no-preference" },
          { name: "prefers-reduced-motion", value: "reduce" },
        ] });
        await expect(page.locator("html")).toHaveAttribute("data-texture", "solid");
        // Retain the enhanced marker to check CSS independently of provider state.
        await page.locator("html").evaluate((el, texture) => { el.setAttribute("data-texture", texture); }, texture);
        await frames(page);
        for (const mask of [fixture.sheet, fixture.lifecycle]) {
          const style = await maskStyle(mask);
          expect(style.filter).toBe("none");
          expect(style.opacity).toBe("1");
          await expect(mask).toHaveCSS("animation-name", "none");
          await expect(mask).toHaveCSS("transition-property", "none");
        }
        const opaque = await pixels(page, fixture.sheetBackground);
        await fixture.sheetBackground.evaluate(el => { (el as HTMLElement).style.background = "rgb(240 20 30)"; });
        await frames(page);
        expect(maxDifference(opaque.png, (await pixels(page, fixture.sheetBackground)).png),
          "The fallback painted mask must not transmit a changed background").toBe(0);
        await fixture.lifecycle.evaluate(el => { (el as HTMLElement).dataset.motionState = "closed"; });
        await expect(fixture.lifecycle).toHaveCSS("opacity", "0");
        await cdp.send("Emulation.setEmulatedMedia", { features: [
          { name: "forced-colors", value: "none" },
          { name: "prefers-reduced-transparency", value: "no-preference" },
          { name: "prefers-reduced-motion", value: "reduce" },
        ] });
        await expect(page.locator("html")).toHaveAttribute("data-texture", texture);
        await expect.poll(() => maskStyle(fixture.sheet).then(style => style.filter)).toContain("blur(");
        await expect(fixture.lifecycle).toHaveCSS("opacity", "0");
      } finally {
        await cdp.detach();
      }
    });
  }
}
