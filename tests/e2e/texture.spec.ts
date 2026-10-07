import { test, expect, type Page, type Locator } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { PNG } from "pngjs";

type Texture = "solid" | "hybrid" | "glass";
const SECONDARY_TEXT_CLASSES = [
  "text-muted-foreground", "text-gray-900", "text-gray-800",
  "text-[var(--material-texture-muted,var(--gray-700))]",
  "text-[var(--material-texture-muted,var(--uni-gray-700))]",
] as const;

async function decodeStageBackground(stage: Locator) {
  return stage.evaluate(async el => {
    const background = getComputedStyle(el).backgroundImage;
    const match = background.match(/url\((?:"([^"]+)"|'([^']+)'|([^)]*))\)/);
    const source = match?.[1] ?? match?.[2] ?? match?.[3];
    if (!source) throw new Error("The material stage requires a photographic CSS background");
    const url = new URL(source.trim(), location.href);
    const image = new Image();
    image.src = url.href;
    await image.decode();
    return { url: url.href, origin: url.origin, pageOrigin: location.origin,
      width: image.naturalWidth, height: image.naturalHeight };
  });
}

/** Normalize computed colors into the same sRGB space as the painted PNG. */
const textColor = (text: Locator, pseudo?: string) => text.evaluate((el, pseudo) => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const context = canvas.getContext("2d")!;
  context.fillStyle = getComputedStyle(el, pseudo).color;
  context.fillRect(0, 0, 1, 1);
  return Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3);
}, pseudo);

async function open(page: Page, theme = "light", language = "en-US", width = 1280) {
  await page.addInitScript(({ theme }) => {
    localStorage.setItem("unitary-theme-preference", theme);
    localStorage.removeItem("unitary-texture-preference");
  }, { theme });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width, height: 1000 });
  await page.goto(`/?lang=${language}#/materials`);
  const materials = page.locator('[data-slot="materials-page"]');
  await expect(materials).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-texture", "solid");
  await page.evaluate(() => document.fonts.ready);
  await decodeStageBackground(materials.locator('[data-slot="texture-interaction-demo"]'));
  return materials;
}

async function select(page: Page, owner: Locator, texture: Texture) {
  // Exercise the whole visible label, as a person clicks the option, rather
  // than bypassing its hit area by operating on the radio alone.
  await owner.locator(`label:has([data-texture-option="${texture}"])`).first().click();
  await expect(page.locator("html")).toHaveAttribute("data-texture", texture);
  await expect(page.locator("html")).toHaveAttribute("data-texture-preference", texture);
  await expect(owner.locator(`[data-texture-option="${texture}"]`).first()).toBeChecked();
}

const filter = (owner: Locator) => owner.evaluate(el => getComputedStyle(el).backdropFilter);

for (const theme of ["light", "dark"] as const) {
  for (const fixture of [
    { name: "desktop", width: 1280, height: 700, touch: false },
    { name: "touch", width: 390, height: 844, touch: true },
  ]) {
    test.describe(`Local appearance selection: ${theme}, ${fixture.name}`, () => {
      test.use({ hasTouch: fixture.touch, isMobile: fixture.touch });
      test("visible option text keeps the current route and scroll position", async ({ page }) => {
        const materials = await open(page, theme, "zh-CN", fixture.width);
        await page.setViewportSize({ width: fixture.width, height: fixture.height });
        const input = materials.locator('[data-texture-option="glass"]').first();
        const circle = input.locator('xpath=following-sibling::span');
        const label = input.locator('xpath=ancestor::label');
        await label.evaluate(el => {
          const main = document.getElementById("main-content")!;
          main.scrollTop += el.getBoundingClientRect().top - main.getBoundingClientRect().top - 2;
          if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        });
        await page.evaluate(() => new Promise<void>(resolve =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
        const position = await label.evaluate(el => {
          const text = el.lastElementChild!.getBoundingClientRect();
          const main = document.getElementById("main-content")!;
          const x = text.left + text.width / 2, y = text.top + text.height / 2;
          return { x, y, hit: el.contains(document.elementFromPoint(x, y)),
            scroll: main.scrollTop, rootScroll: document.scrollingElement!.scrollTop, url: location.href };
        });
        expect(position.hit).toBe(true);
        for (let selection = 0; selection < 2; selection++) {
          if (fixture.touch) await page.touchscreen.tap(position.x, position.y);
          else await page.mouse.click(position.x, position.y);
          await expect(input).toBeChecked();
          await expect(input).toBeFocused();
          await expect(circle).toHaveCSS("box-shadow", "none");
          await expect(page.locator("html")).toHaveAttribute("data-texture", "glass");
          const after = await page.evaluate(() => ({ scroll: document.getElementById("main-content")!.scrollTop,
            rootScroll: document.scrollingElement!.scrollTop, url: location.href }));
          expect(Math.abs(after.scroll - position.scroll)).toBeLessThanOrEqual(1);
          expect(after.rootScroll).toBe(position.rootScroll);
          expect(after.url).toBe(position.url);
          await page.keyboard.press("Space");
          await expect(input).toBeChecked();
          await expect(circle).not.toHaveCSS("box-shadow", "none");
        }
      });
    });
  }
}

/** Read only the empty upper padding: text/focus antialiasing cannot stand in
 * for a visible material change. Derive the region from actual layout rather
 * than keeping a second fixture geometry or matching a particular pattern.
 * The first four pixels are excluded so the one-pixel edge is not the signal. */
async function materialPixels(page: Page, surface: Locator) {
  await surface.scrollIntoViewIfNeeded();
  await page.evaluate(() => new Promise<void>(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  const clip = await surface.evaluate(el => {
    const bounds = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const left = Number.parseFloat(style.paddingLeft);
    const right = Number.parseFloat(style.paddingRight);
    const top = Number.parseFloat(style.paddingTop);
    const height = Math.floor(top / 2);
    return {
      x: Math.ceil(bounds.left + left),
      y: Math.ceil(bounds.top + Math.max(4, (top - height) / 2)),
      width: Math.floor(bounds.width - left - right),
      height,
    };
  });
  expect(clip.height, "The material sample needs an empty padding strip").toBeGreaterThanOrEqual(4);
  expect(clip.width).toBeGreaterThan(100);
  const buffer = await page.screenshot({ clip, animations: "disabled", caret: "hide", scale: "css" });
  return { buffer, pixels: PNG.sync.read(buffer) };
}

function visiblePixelChange(before: PNG, after: PNG) {
  expect([after.width, after.height]).toEqual([before.width, before.height]);
  let visible = 0;
  let totalDelta = 0;
  let maximum = 0;
  const total = before.width * before.height;
  for (let offset = 0; offset < before.data.length; offset += 4) {
    const delta = Math.max(
      Math.abs(before.data[offset] - after.data[offset]),
      Math.abs(before.data[offset + 1] - after.data[offset + 1]),
      Math.abs(before.data[offset + 2] - after.data[offset + 2]),
    );
    // More than 3/255 in an RGB channel exceeds small rasterization noise.
    if (delta > 3) visible++;
    totalDelta += delta;
    maximum = Math.max(maximum, delta);
  }
  return { visibleFraction: visible / total, meanChannelDelta: totalDelta / total, maximum };
}

function relativeLuminance(rgb: readonly number[]) {
  const linear = rgb.map(channel => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function minimumPaintedContrast(background: PNG, foreground: readonly number[]) {
  const text = relativeLuminance(foreground);
  let minimum = Number.POSITIVE_INFINITY;
  for (let offset = 0; offset < background.data.length; offset += 4) {
    const surface = relativeLuminance([
      background.data[offset], background.data[offset + 1], background.data[offset + 2],
    ]);
    const ratio = (Math.max(text, surface) + 0.05) / (Math.min(text, surface) + 0.05);
    minimum = Math.min(minimum, ratio);
  }
  return minimum;
}

test("material photography loads from the local site at high resolution", async ({ page }) => {
  const materials = await open(page);
  const stage = materials.locator('[data-slot="texture-interaction-demo"]');
  const image = await decodeStageBackground(stage);
  expect(image.origin, "The material backdrop must not hotlink a remote image").toBe(image.pageOrigin);
  expect(new URL(image.url).pathname).toMatch(/materials-alpsee(?:-[\w-]+)?\.jpg$/);
  expect(image.width).toBeGreaterThanOrEqual(3840);
  expect(image.height).toBeGreaterThanOrEqual(2160);
  expect(await stage.evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(320);
});

for (const theme of ["light", "dark"] as const) {
  for (const language of ["en-US", "zh-CN"] as const) {
    for (const width of [390, 1280]) {
      test(`material controls use shared prose spacing and a small photo caption: ${theme}, ${language}, ${width}`, async ({ page }) => {
        const materials = await open(page, theme, language, width);
        const controls = materials.locator('[data-slot="texture-controls"]').first();
        const rhythm = await controls.evaluate(el => {
          const block = el.closest('[data-slot="docs-prose-block"]');
          if (!block) throw new Error("The local control needs the shared docs block rhythm");
          const preceding = block.previousElementSibling!;
          const probe = document.createElement("div");
          probe.style.height = "var(--uni-doc-space-heading-body)";
          document.body.append(probe);
          const expected = probe.getBoundingClientRect().height;
          probe.remove();
          return { gap: el.getBoundingClientRect().top - preceding.getBoundingClientRect().bottom, expected };
        });
        expect(rhythm.gap).toBeGreaterThanOrEqual(rhythm.expected);
        const caption = materials.locator('[data-texture-photo-credit]');
        await expect(caption).toHaveText(/^Photograph by /);
        expect(await caption.evaluate(el => ({
          tag: el.tagName, figure: el.parentElement?.tagName,
        }))).toEqual({ tag: "FIGCAPTION", figure: "FIGURE" });
        const typography = await caption.evaluate(el => {
          const probe = document.createElement("span");
          probe.style.fontSize = "var(--uni-text-footnote)";
          probe.style.lineHeight = "var(--uni-leading-footnote)";
          document.body.append(probe);
          const expected = getComputedStyle(probe);
          const actual = getComputedStyle(el);
          const result = { font: actual.fontSize, leading: actual.lineHeight,
            expectedFont: expected.fontSize, expectedLeading: expected.lineHeight };
          probe.remove();
          return result;
        });
        expect(typography.font).toBe(typography.expectedFont);
        expect(typography.leading).toBe(typography.expectedLeading);
        for (const mode of ["solid", "hybrid", "glass"]) {
          await expect(controls.locator(`[data-texture-option="${mode}"]`)).toHaveAccessibleName(
            mode[0].toUpperCase() + mode.slice(1),
          );
        }
      });
    }
  }

  test(`mask scenes share a rounded clip without an opaque scene border in ${theme}`, async ({ page }, testInfo) => {
    const materials = await open(page, theme);
    for (const texture of ["solid", "hybrid", "glass"] as const) {
      await select(page, materials, texture);
      for (const name of ["mask-backdrop", "mask-scrim"]) {
        const mask = materials.locator(`[data-material-sample="${name}"]`);
        const geometry = await mask.evaluate(el => {
          const scene = el.parentElement!;
          const sceneStyle = getComputedStyle(scene);
          const maskStyle = getComputedStyle(el);
          return {
            border: [sceneStyle.borderTopWidth, sceneStyle.borderRightWidth,
              sceneStyle.borderBottomWidth, sceneStyle.borderLeftWidth],
            clip: sceneStyle.overflow,
            radius: sceneStyle.borderTopLeftRadius,
            maskRadius: maskStyle.borderTopLeftRadius,
            scene: [scene.clientWidth, scene.clientHeight],
            mask: [el.clientWidth, el.clientHeight],
          };
        });
        expect(geometry.border).toEqual(["0px", "0px", "0px", "0px"]);
        expect(geometry.clip).toBe("hidden");
        expect(Number.parseFloat(geometry.radius)).toBeGreaterThan(0);
        expect(geometry.maskRadius).toBe(geometry.radius);
        expect(geometry.mask).toEqual(geometry.scene);
        await testInfo.attach(`${theme}-${texture}-${name}`, {
          body: await mask.locator('xpath=..').screenshot({ animations: "disabled", scale: "css" }),
          contentType: "image/png",
        });
      }
    }
  });

  test(`enhanced mask foregrounds replace opaque shadow rings while preserving authored shadows in ${theme}`, async ({ page }) => {
    const materials = await open(page, theme);
    const foreground = materials.locator('[data-material-sample="mask-backdrop"]')
      .locator('xpath=..').locator('[data-material="floating"]');
    const alphas = () => foreground.evaluate(el => {
      const colors = getComputedStyle(el).boxShadow.match(/(?:rgba?|color)\([^)]*\)/g) ?? [];
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const context = canvas.getContext("2d")!;
      return colors.map(color => {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        return context.getImageData(0, 0, 1, 1).data[3];
      });
    });
    const classic = await foreground.evaluate(el => getComputedStyle(el).boxShadow);
    expect(await alphas(), "Solid retains its measured opaque material edge").toContain(255);
    for (const texture of ["hybrid", "glass"] as const) {
      await select(page, materials, texture);
      const shadowAlphas = await alphas();
      expect(shadowAlphas.length).toBeGreaterThan(0);
      expect(shadowAlphas.every(alpha => alpha < 255), "Transmitted foregrounds need alpha contours without a solid ring").toBe(true);
    }
    await select(page, materials, "solid");
    await expect(foreground).toHaveCSS("box-shadow", classic);
    await select(page, materials, "glass");
    await page.addStyleTag({ content: "@layer utilities { .texture-author-shadow { box-shadow: rgb(20 30 40) 0px 3px 9px; border: 2px solid rgb(90 80 70); } }" });
    await foreground.evaluate(el => el.classList.add("texture-author-shadow"));
    await expect(foreground).toHaveCSS("box-shadow", "rgb(20, 30, 40) 0px 3px 9px 0px");
    await expect(foreground).toHaveCSS("border-top-color", "rgb(90, 80, 70)");
    await expect(foreground).toHaveCSS("border-top-width", "2px");
    await foreground.evaluate((el: HTMLElement) => { el.style.boxShadow = "rgb(50 60 70) 0px 4px 12px"; });
    await expect(foreground).toHaveCSS("box-shadow", "rgb(50, 60, 70) 0px 4px 12px 0px");
  });
}

for (const theme of ["light", "dark"] as const) {
  test(`painted material surfaces preserve secondary text contrast in ${theme}`, async ({ page }, testInfo) => {
    const materials = await open(page, theme);
    const results: Array<{ texture: Texture; material: string; textClass: string; foreground: number[]; minimumContrast: number }> = [];
    const classicColors = new Map<string, number[]>();
    for (const texture of ["solid", "hybrid", "glass"] as const) {
      await select(page, materials, texture);
      await page.evaluate(({ theme, textClasses }) => {
        const fixture = document.createElement("div");
        fixture.dataset.textureContrastFixture = "";
        Object.assign(fixture.style, {
          position: "fixed", left: "20px", top: "100px", width: "720px",
          padding: "24px", display: "flex", gap: "24px", boxSizing: "border-box",
          zIndex: "2147483646", backgroundColor: theme === "light" ? "black" : "white",
        });
        for (const material of ["menu", "modal"]) {
          const surface = document.createElement("div");
          surface.className = `material-${material} p-5`;
          surface.dataset.material = "floating";
          surface.dataset.contrastMaterial = material;
          Object.assign(surface.style, { width: "300px", height: "140px", boxSizing: "border-box", flexShrink: "0" });
          for (const textClass of textClasses) {
            const text = document.createElement("p");
            text.className = `text-copy-14 ${textClass}`;
            text.dataset.contrastText = textClass;
            text.textContent = "Secondary text";
            surface.append(text);
          }
          fixture.append(surface);
        }
        document.body.append(fixture);
      }, { theme, textClasses: SECONDARY_TEXT_CLASSES });
      const fixture = page.locator("[data-texture-contrast-fixture]");
      try {
        for (const material of ["menu", "modal"]) {
          const surface = fixture.locator(`[data-contrast-material="${material}"]`);
          const sample = await materialPixels(page, surface);
          await testInfo.attach(`${theme}-${texture}-${material}-painted-padding`, {
            body: sample.buffer, contentType: "image/png",
          });
          for (const textClass of SECONDARY_TEXT_CLASSES) {
            const foreground = await textColor(surface.locator(`[data-contrast-text="${textClass}"]`));
            if (texture === "solid") classicColors.set(`${material}/${textClass}`, foreground);
            const minimumContrast = minimumPaintedContrast(sample.pixels, foreground);
            results.push({ texture, material, textClass, foreground, minimumContrast });
            // Existing classic calendar colors stay unchanged. All enhanced
            // secondary copy must meet the same contrast on a transmitted fill.
            if (texture !== "solid" || ["text-muted-foreground", "text-gray-900"].includes(textClass)) {
              expect(minimumContrast, `${theme} ${texture} material-${material} ${textClass} over the worst neutral backdrop`).toBeGreaterThanOrEqual(4.5);
            }
          }
        }
        if (texture === "glass") {
          const cdp = await page.context().newCDPSession(page);
          try {
            await cdp.send("Emulation.setEmulatedMedia", { features: [
              { name: "prefers-reduced-transparency", value: "reduce" },
              { name: "prefers-reduced-motion", value: "reduce" },
            ] });
            await expect(page.locator("html")).toHaveAttribute("data-texture", "solid");
            for (const material of ["menu", "modal"]) {
              const surface = fixture.locator(`[data-contrast-material="${material}"]`);
              expect(await filter(surface)).toBe("none");
              for (const textClass of SECONDARY_TEXT_CLASSES) {
                expect(await textColor(surface.locator(`[data-contrast-text="${textClass}"]`)),
                  "Accessibility fallback restores the classic secondary color").toEqual(classicColors.get(`${material}/${textClass}`));
              }
            }
          } finally {
            await cdp.send("Emulation.setEmulatedMedia", { features: [
              { name: "prefers-reduced-transparency", value: "no-preference" },
              { name: "prefers-reduced-motion", value: "reduce" },
            ] });
            await expect(page.locator("html")).toHaveAttribute("data-texture", "glass");
            await cdp.detach();
          }
        }
      } finally {
        await fixture.evaluate(el => el.remove());
      }
    }
    await testInfo.attach("painted-material-contrast", {
      body: JSON.stringify(results, null, 2), contentType: "application/json",
    });
  });
}

for (const theme of ["light", "dark"] as const) {
  test(`label clicks visibly distinguish and reset material modes in ${theme}`, async ({ page, context }, testInfo) => {
    const materials = await open(page, theme);
    const surface = materials.locator('[data-material-sample="floating"]');
    const solid = await materialPixels(page, surface);
    await select(page, materials, "hybrid");
    const hybrid = await materialPixels(page, surface);
    await select(page, materials, "glass");
    const glass = await materialPixels(page, surface);
    const changes = {
      solidToHybrid: visiblePixelChange(solid.pixels, hybrid.pixels),
      hybridToGlass: visiblePixelChange(hybrid.pixels, glass.pixels),
    };
    await testInfo.attach("material-pixel-changes", {
      body: JSON.stringify(changes, null, 2), contentType: "application/json",
    });
    for (const [name, sample] of Object.entries({ solid, hybrid, glass })) {
      await testInfo.attach(`material-padding-${name}`, { body: sample.buffer, contentType: "image/png" });
    }
    expect(changes.solidToHybrid.visibleFraction, "Solid and Hybrid need a perceptible surface difference").toBeGreaterThanOrEqual(0.1);
    expect(changes.hybridToGlass.visibleFraction, "Hybrid and Glass need a perceptible surface difference").toBeGreaterThanOrEqual(0.1);

    // A separately loaded page restores the selected global preference; a
    // portal control also changes the original sample and the other page.
    const independent = await context.newPage();
    try {
      await independent.emulateMedia({ reducedMotion: "reduce" });
      await independent.goto("/?lang=en-US#/materials");
      await expect(independent.locator("html")).toHaveAttribute("data-texture", "glass");
      await expect(independent.locator("html")).toHaveAttribute("data-texture-preference", "glass");
      await expect.poll(() => filter(independent.locator('[data-material-sample="floating"]'))).toContain("blur(");
      await materials.locator('[data-slot="texture-demo-menu-trigger"]').click();
      const portal = page.locator('[data-slot="texture-demo-menu"]');
      await expect(portal).toBeVisible();
      await expect.poll(() => filter(portal)).toContain("blur(");
      await portal.locator('[data-texture-menu-option="solid"]').click();
      await expect(portal).toBeVisible();
      for (const current of [page, independent]) {
        await expect(current.locator("html")).toHaveAttribute("data-texture", "solid");
        await expect(current.locator("html")).toHaveAttribute("data-texture-preference", "solid");
      }
      await expect(materials.locator('[data-texture-option="solid"]').first()).toBeChecked();
      await expect(independent.locator('[data-texture-option="solid"]').first()).toBeChecked();
      expect(await filter(portal)).toBe("none");
      await page.keyboard.press("Escape");
      await expect(portal).not.toBeVisible();
      await select(page, materials, "solid");
      const reset = await materialPixels(page, surface);
      expect(reset.pixels.data.equals(solid.pixels.data), "Returning to Solid must restore the same empty surface pixels").toBe(true);
    } finally {
      await independent.close();
    }
  });
}

for (const theme of ["light", "dark"] as const) {
  for (const language of ["en-US", "zh-CN"] as const) {
    for (const width of [390, 1280]) {
      test(`global texture and open layers: ${theme}, ${language}, ${width}`, async ({ page }, testInfo) => {
        const errors: string[] = [];
        page.on("pageerror", error => errors.push(error.message));
        const materials = await open(page, theme, language, width);
        const surface = materials.locator('[data-material-sample="floating"]');
        const geometry = await surface.evaluate(el => [el.clientWidth, el.clientHeight]);
        const titleColor = await materials.locator("h1").evaluate(el => getComputedStyle(el).color);
        await expect.poll(() => filter(surface)).toBe("none");
        for (const texture of ["hybrid", "glass"] as const) {
          await select(page, materials, texture);
          await expect.poll(() => filter(surface)).toContain("blur(");
          expect(await surface.evaluate(el => [el.clientWidth, el.clientHeight])).toEqual(geometry);
          await expect(materials.locator("h1")).toHaveCSS("color", titleColor);
          await materials.locator('[data-slot="texture-demo-menu-trigger"]').click();
          const menu = page.locator('[data-slot="texture-demo-menu"]');
          await expect(menu).toBeVisible();
          await expect.poll(() => filter(menu)).toContain("blur(");
          await menu.locator('[data-texture-menu-option="solid"]').click();
          await expect(menu).toBeVisible();
          await expect(page.locator("html")).toHaveAttribute("data-texture", "solid");
          await expect.poll(() => filter(menu)).toBe("none");
          await menu.locator(`[data-texture-menu-option="${texture}"]`).click();
          await expect.poll(() => filter(menu)).toContain("blur(");
          await page.keyboard.press("Escape");
          const trigger = materials.locator('[data-slot="texture-demo-modal-trigger"]');
          await trigger.click();
          const modal = page.locator('[data-slot="texture-demo-modal"]');
          await expect(modal).toBeVisible();
          // The scrim is the filter owner: child content may deliberately avoid a second pass.
          await expect.poll(() => filter(modal.locator('xpath=..'))).toContain("blur(");
          await select(page, modal, "solid");
          await expect(modal).toBeVisible();
          await expect.poll(() => filter(modal.locator('xpath=..'))).toBe("none");
          await select(page, modal, texture);
          await page.keyboard.press("Escape");
          await expect(trigger).toBeFocused();
        }
        await materials.locator('[data-slot="texture-demo-drawer-trigger"]').click();
        const drawer = page.locator('[data-slot="texture-demo-drawer"]');
        await expect(drawer).toBeVisible();
        await select(page, drawer, "hybrid");
        await select(page, drawer, "solid");
        await expect(drawer).toBeVisible();
        await page.keyboard.press("Escape");
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await select(page, materials, "glass");
        await materials.locator('[data-slot="texture-interaction-demo"]').screenshot({
          path: `.scratch/texture/${testInfo.project.name}-${theme}-${language}-${width}.png`,
        });
        expect(errors).toEqual([]);
      });
    }
  }
}

test("stored choice restores; forced colors and reduced transparency restore it after fallback", async ({ page, context }) => {
  const materials = await open(page);
  await select(page, materials, "glass");
  expect(await page.evaluate(() => localStorage.getItem("unitary-texture-preference"))).toBe("glass");
  // Remove the helper boot script that deliberately resets storage before this reload.
  const another = await context.newPage();
  await another.goto("/?lang=en-US#/materials");
  await expect(another.locator("html")).toHaveAttribute("data-texture", "glass");
  await another.close();
  await page.emulateMedia({ forcedColors: "active" });
  await expect(page.locator("html")).toHaveAttribute("data-texture", "solid");
  await expect(page.locator("html")).toHaveAttribute("data-texture-preference", "glass");
  await expect(materials.locator('[data-slot="texture-fallback"]')).toBeVisible();
  for (const owner of await materials.locator("[data-material-sample]").all()) {
    expect(await filter(owner)).toBe("none");
    await expect(owner).toHaveCSS("background-image", "none");
  }
  await page.emulateMedia({ forcedColors: "none", reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-texture", "glass");
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setEmulatedMedia", { features: [
    { name: "prefers-reduced-transparency", value: "reduce" },
    { name: "prefers-reduced-motion", value: "reduce" },
  ] });
  await expect(page.locator("html")).toHaveAttribute("data-texture", "solid");
  await expect(page.locator("html")).toHaveAttribute("data-texture-preference", "glass");
  await cdp.send("Emulation.setEmulatedMedia", { features: [
    { name: "prefers-reduced-transparency", value: "no-preference" },
    { name: "prefers-reduced-motion", value: "reduce" },
  ] });
  await expect(page.locator("html")).toHaveAttribute("data-texture", "glass");
  await cdp.detach();
});

test("unsupported backdrop capabilities retain selection with readable Solid rendering", async ({ page }) => {
  await page.addInitScript(() => {
    const supports = CSS.supports.bind(CSS);
    CSS.supports = ((...args: string[]) => args.some(arg => arg.includes("backdrop-filter")) ? false :
      args.length === 1 ? supports(args[0]) : supports(args[0], args[1])) as typeof CSS.supports;
  });
  const materials = await open(page);
  await materials.locator('label:has([data-texture-option="glass"])').first().click();
  await expect(page.locator("html")).toHaveAttribute("data-texture-preference", "glass");
  await expect(page.locator("html")).toHaveAttribute("data-texture", "solid");
  expect(await filter(materials.locator('[data-material-sample="floating"]'))).toBe("none");
  await expect(materials.locator('[data-slot="texture-fallback"]')).toBeVisible();
  await materials.locator('label:has([data-texture-option="solid"])').first().click();
  await expect(materials.locator('[data-slot="texture-fallback"]')).toHaveCount(0);
});

test("texture preserves scoped UI palettes, code themes, and SubFrame layers", async ({ page }) => {
  const materials = await open(page, "dark");
  await select(page, materials, "glass");
  await page.evaluate(() => { location.hash = "/color-schemes"; });
  const lab = page.locator('[data-slot="color-schemes-page"]');
  const ui = lab.locator("[data-ui-preview]");
  await expect(ui).toBeVisible();
  const before = await ui.evaluate(el => ({ color: getComputedStyle(el).color,
    background: getComputedStyle(el).backgroundColor, primary: getComputedStyle(el).getPropertyValue("--primary") }));
  const code = lab.locator('[data-slot="code-block"]').first();
  const codeColor = await code.evaluate(el => getComputedStyle(el).backgroundColor);
  for (const texture of ["solid", "hybrid", "glass"] as const) {
    await page.evaluate(texture => document.documentElement.dataset.texture = texture, texture);
    expect(await ui.evaluate(el => ({ color: getComputedStyle(el).color,
      background: getComputedStyle(el).backgroundColor, primary: getComputedStyle(el).getPropertyValue("--primary") }))).toEqual(before);
    await expect(code).toHaveCSS("background-color", codeColor);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  }
  await ui.getByRole("button", { name: "Preview local overlay", exact: true }).click();
  const sheet = ui.locator('[data-slot="bottom-sheet"]');
  await expect(sheet).toBeVisible();
  await expect(sheet).toHaveAttribute("data-material", "floating");
  await page.keyboard.press("Escape");
});

test("authored fills, text colors and background images retain priority over material optics", async ({ page }) => {
  const materials = await open(page);
  const surface = materials.locator('[data-material-sample="floating"]');
  await surface.evaluate(el => el.setAttribute("data-texture", "glass"));
  expect(await filter(surface)).toBe("none");
  await select(page, materials, "glass");
  await materials.locator('[data-slot="texture-demo-menu-trigger"]').click();
  const menu = page.locator('[data-slot="texture-demo-menu"]');
  await expect(menu).toBeVisible();
  const classicSecondary = await page.evaluate(textClasses => {
    const colors: Record<string, string> = {};
    for (const textClass of textClasses) {
      const probe = document.createElement("p");
      probe.className = textClass;
      document.body.append(probe);
      colors[textClass] = getComputedStyle(probe).color;
      probe.remove();
    }
    return colors;
  }, SECONDARY_TEXT_CLASSES);
  await page.addStyleTag({ content: "@layer utilities { .texture-author-text { color: rgb(100 50 150); } }" });
  await menu.evaluate((el, textClasses) => {
    for (const textClass of textClasses) {
      const text = document.createElement("p");
      text.className = textClass;
      text.dataset.authorSecondary = textClass;
      text.textContent = "Authored background secondary text";
      el.append(text);
    }
    const authored = document.createElement("p");
    authored.className = "text-gray-900 texture-author-text";
    authored.dataset.authorText = "class";
    authored.textContent = "Custom class color";
    el.append(authored);
    const inline = document.createElement("p");
    inline.className = "text-muted-foreground";
    inline.style.color = "rebeccapurple";
    inline.dataset.authorText = "inline";
    inline.textContent = "Custom inline color";
    el.append(inline);
  }, SECONDARY_TEXT_CLASSES);
  await expect(menu.locator('[data-author-text="class"]')).toHaveCSS("color", "rgb(100, 50, 150)");
  await expect(menu.locator('[data-author-text="inline"]')).toHaveCSS("color", "rgb(102, 51, 153)");
  await menu.evaluate(el => {
    el.classList.remove("bg-surface");
    el.classList.add("bg-primary");
  });
  const primary = await page.evaluate(() => {
    const probe = document.createElement("div");
    probe.style.backgroundColor = "var(--primary)";
    document.body.append(probe);
    const color = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return color;
  });
  await expect(menu).toHaveCSS("background-color", primary);
  for (const textClass of SECONDARY_TEXT_CLASSES) {
    await expect(menu.locator(`[data-author-secondary="${textClass}"]`)).toHaveCSS("color", classicSecondary[textClass]);
  }
  await page.addStyleTag({ content: "@layer utilities { .texture-author-image { background-image: linear-gradient(90deg, rgb(50 60 70), rgb(70 80 90)); } }" });
  await menu.evaluate((el: HTMLElement) => {
    el.classList.add("texture-author-image");
    el.style.backgroundColor = "rebeccapurple";
  });
  await expect(menu).toHaveCSS("background-color", "rgb(102, 51, 153)");
  await expect(menu).toHaveCSS("background-image", "linear-gradient(90deg, rgb(50, 60, 70), rgb(70, 80, 90))");
  await expect(menu.locator('[data-author-text="class"]')).toHaveCSS("color", "rgb(100, 50, 150)");
  await expect(menu.locator('[data-author-text="inline"]')).toHaveCSS("color", "rgb(102, 51, 153)");
  // Match the class combination returned by cn() for an authored size/color.
  await menu.evaluate((el: HTMLElement) => {
    el.classList.remove("shadow-[var(--material-shadow-menu)]");
    el.classList.add("shadow-md");
    el.style.setProperty("--tw-shadow-color", "rgb(80 60 120)");
  });
  await menu.locator('[data-texture-menu-option="solid"]').click();
  const authoredShadow = await menu.evaluate(el => getComputedStyle(el).boxShadow);
  expect(authoredShadow).toContain("rgb(80, 60, 120)");
  for (const texture of ["hybrid", "glass"] as const) {
    await menu.locator(`[data-texture-menu-option="${texture}"]`).click();
    await expect(menu).toHaveCSS("box-shadow", authoredShadow);
  }
});

test("command mask animation keeps enhanced alpha separate and accessible masks opaque", async ({ page }) => {
  const materials = await open(page);
  await page.keyboard.press("Control+k");
  const input = page.locator("input[cmdk-input]");
  await expect(input).toBeVisible();
  const classicPlaceholder = await textColor(input, "::placeholder");
  await page.keyboard.press("Escape");
  await expect(input).not.toBeVisible();
  await select(page, materials, "glass");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.keyboard.press("Control+k");
  const mask = page.locator('[data-slot="command-menu-overlay"]');
  await expect(mask).toBeVisible();
  await expect(mask).toHaveCSS("animation-name", "material-mask-in");
  await expect(mask).toHaveCSS("opacity", "1");
  await expect.poll(() => filter(mask)).toContain("blur(");
  const materialPlaceholder = await input.evaluate(el => {
    const probe = document.createElement("span");
    probe.style.color = "var(--material-texture-muted)";
    el.parentElement!.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  });
  await expect.poll(() => input.evaluate(el => getComputedStyle(el, "::placeholder").color)).toBe(materialPlaceholder);
  expect(await textColor(input, "::placeholder")).not.toEqual(classicPlaceholder);
  const cdp = await page.context().newCDPSession(page);
  try {
    await cdp.send("Emulation.setEmulatedMedia", { features: [
      { name: "prefers-reduced-transparency", value: "reduce" },
    ] });
    await expect(page.locator("html")).toHaveAttribute("data-texture", "solid");
    expect(await textColor(input, "::placeholder")).toEqual(classicPlaceholder);
  } finally {
    await cdp.send("Emulation.setEmulatedMedia", { features: [
      { name: "prefers-reduced-transparency", value: "no-preference" },
    ] });
    await expect(page.locator("html")).toHaveAttribute("data-texture", "glass");
    await cdp.detach();
  }
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveAttribute("data-texture", "solid");
  await expect(mask).toHaveCSS("animation-name", "none");
  await expect(mask).toHaveCSS("opacity", "1");
  expect(await filter(mask)).toBe("none");
  await page.keyboard.press("Escape");
  await expect(mask).not.toBeVisible();
});

for (const theme of ["light", "dark"]) {
  test(`default tooltip stems and authored context-card borders keep their contracts in ${theme}`, async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const materials = await open(page, theme);
    await select(page, materials, "glass");
    await page.evaluate(() => { location.hash = "/components/tooltip"; });
    await page.locator('[data-demo-card="Components"]').getByRole("button", { name: "Bottom", exact: true }).hover();
    const tooltip = page.locator('[data-material-surface="default"]').first();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveAttribute("data-material-stem", "true");
    expect(await filter(tooltip)).toBe("none");
    const tip = tooltip.locator('[data-slot="tooltip-tip"] path');
    const fill = await tip.evaluate(el => getComputedStyle(el).fill);
    await expect(tooltip).toHaveCSS("background-color", fill);
    await testInfo.attach(`${theme}-opaque-tooltip-stem`, {
      body: await page.screenshot({ animations: "disabled" }), contentType: "image/png",
    });
    await page.mouse.move(0, 0);
    await page.keyboard.press("Escape");
    await expect(tooltip).not.toBeVisible();
    await page.locator('[data-demo-card="Other"]').getByText("No tip indicator", { exact: true }).hover();
    await expect(tooltip).toBeVisible();
    expect(await tooltip.getAttribute("data-material-stem")).toBeNull();
    await expect.poll(() => filter(tooltip)).toContain("blur(");
    await page.mouse.move(0, 0);
    await page.keyboard.press("Escape");
    await page.evaluate(() => { location.hash = "/components/context-card"; });
    await page.locator('[data-demo-component="context-card"] [data-demo-card="default"]').getByText("Top", { exact: true }).hover();
    const card = page.locator('[data-slot="context-card-popover"]');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute("data-material-stem", "true");
    expect(await filter(card)).toBe("none");
    const cardFill = await card.locator('[data-slot="context-card-tip"] path').evaluate(el => getComputedStyle(el).fill);
    await expect(card).toHaveCSS("background-color", cardFill);
    await page.addStyleTag({ content: "@layer utilities { .texture-author-border { border-color: rgb(90 80 70); } }" });
    await card.evaluate(el => el.classList.add("texture-author-border"));
    await expect(card).toHaveCSS("border-top-color", "rgb(90, 80, 70)");
    await card.evaluate((el: HTMLElement) => { el.style.borderColor = "rgb(30 40 50)"; });
    await expect(card).toHaveCSS("border-top-color", "rgb(30, 40, 50)");
  });

  test(`semantic tooltip and toast preserve opaque colors and stems in ${theme}`, async ({ page }) => {
    const materials = await open(page, theme);
    await select(page, materials, "glass");
    await page.evaluate(() => { location.hash = "/components/tooltip"; });
    const demo = page.locator('[data-demo-card="Custom type"]');
    await expect(demo).toBeVisible();
    for (const [label, type] of [["Top", "success"], ["Bottom", "error"], ["Left", "warning"], ["Right", "violet"]]) {
      await demo.getByText(label, { exact: true }).hover();
      const tooltip = page.locator(`[data-material-surface="${type}"]`).first();
      await expect(tooltip).toBeVisible();
      const fill = await tooltip.locator("svg path").evaluate(el => getComputedStyle(el).fill);
      await expect(tooltip).toHaveCSS("background-color", fill);
      expect(await filter(tooltip)).toBe("none");
      await expect(tooltip).toHaveCSS("background-image", "none");
      await page.mouse.move(0, 0);
      await page.keyboard.press("Escape");
      await expect(tooltip).not.toBeVisible();
    }
    await page.evaluate(() => { location.hash = "/components/toast"; });
    await page.locator('[data-demo-card="Success"]').getByRole("button", { name: "Show Toast", exact: true }).click();
    const toast = page.locator('[data-material="floating"][data-kind="success"]').first();
    await expect(toast).toBeVisible();
    expect(await filter(toast)).toBe("none");
    await expect(toast).toHaveCSS("background-image", "none");
    expect(await toast.evaluate(el => getComputedStyle(el).backgroundColor)).toMatch(/^rgb\(/);
  });
}

test("local material rendering records warmed scroll frame times", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const materials = await open(page);
  const samples: Record<string, { p95: number; max: number; longTasks: number[]; scrollDistance: number }> = {};
  for (const texture of ["solid", "hybrid", "glass"] as const) {
    await select(page, materials, texture);
    await materials.locator('[data-slot="texture-interaction-demo"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    samples[texture] = await page.evaluate(() => new Promise(resolve => {
      const gaps: number[] = [];
      const tasks: number[] = [];
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) tasks.push(entry.duration);
      });
      observer.observe({ type: "longtask", buffered: false });
      let scroller = document.querySelector<HTMLElement>('[data-slot="texture-interaction-demo"]')!;
      while (scroller.parentElement && !(scroller.scrollHeight > scroller.clientHeight &&
        /auto|scroll/.test(getComputedStyle(scroller).overflowY))) scroller = scroller.parentElement;
      let scrollDistance = 0;
      let last = 0;
      let frames = 0;
      const frame = (now: number) => {
        if (last) gaps.push(now - last);
        last = now;
        const before = scroller.scrollTop;
        scroller.scrollTop += frames < 90 ? 2 : -2;
        scrollDistance += Math.abs(scroller.scrollTop - before);
        if (++frames < 180) requestAnimationFrame(frame);
        else {
          observer.disconnect();
          gaps.sort((a, b) => a - b);
          resolve({ p95: gaps[Math.ceil(gaps.length * .95) - 1], max: gaps.at(-1)!, longTasks: tasks, scrollDistance });
        }
      };
      requestAnimationFrame(frame);
    }));
  }
  await testInfo.attach("texture-frame-times", { body: JSON.stringify(samples, null, 2), contentType: "application/json" });
  await mkdir(".scratch/texture", { recursive: true });
  await writeFile(`.scratch/texture/frame-times-${testInfo.project.name}.json`, JSON.stringify(samples, null, 2));
  for (const texture of ["hybrid", "glass"] as const) {
    expect(samples[texture].scrollDistance).toBeGreaterThan(120);
    expect(samples[texture].p95).toBeLessThanOrEqual(20);
    expect(samples[texture].longTasks.filter(duration => duration > 50)).toHaveLength(0);
  }
});
