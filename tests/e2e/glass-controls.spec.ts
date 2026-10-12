import { expect, test, type Locator, type Page } from "@playwright/test";
import { PNG } from "pngjs";
import { artifactMode, artifactModule } from "./docs-artifact";

type Theme = "light" | "dark";
type Texture = "solid" | "hybrid" | "glass";

test.setTimeout(60_000);

async function frames(page: Page) {
  await page.evaluate(() => new Promise<void>(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  ));
}

async function open(page: Page, theme: Theme, width = 1280) {
  await page.addInitScript(theme => {
    localStorage.setItem("unitary-theme-preference", theme);
    localStorage.removeItem("unitary-texture-preference");
  }, theme);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width, height: 1000 });
  await page.goto("/?lang=en-US#/materials");
  const materials = page.locator('[data-slot="materials-page"]');
  await expect(materials).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-texture", "solid");
  await page.evaluate(() => document.fonts.ready);
  return materials;
}

async function texture(page: Page, value: Texture) {
  // These fixtures exercise the public global CSS declaration. The live demo
  // below separately exercises the real ThemeProvider control.
  await page.locator("html").evaluate((el, value) => { el.setAttribute("data-texture", value); }, value);
  await frames(page);
}

/** Render the public components from the built fixture or the docs Vite server.
 * Source mode reads optimized dependency URLs from Vite's transformed imports;
 * no machine paths are retained. */
async function mountButtons(page: Page, ownerFixture = false) {
  await page.addStyleTag({ content: `@layer utilities {
    .glass-control-author-fill { background-color: rgb(80 100 120); }
    .glass-control-author-shadow { box-shadow: rgb(30 60 90) 0px 3px 9px; }
    .glass-control-author-image { background-image: linear-gradient(90deg, rgb(50 60 70), rgb(70 80 90)); }
    .glass-control-author-state:hover { background-color: rgb(70 90 110); }
    .glass-control-author-state:active { background-color: rgb(60 80 100); }
  }` });
  const moduleUrl = `/@fs/${process.cwd().replaceAll("\\", "/")}/src/components/ui/button.tsx`;
  const fixtureUrl = artifactMode ? artifactModule("site/build/browser-fixtures.ts") : undefined;
  await page.evaluate(async ({ moduleUrl, ownerFixture, fixtureUrl }) => {
    const fixtures = fixtureUrl ? await import(fixtureUrl) : undefined;
    let React: typeof import("react");
    let ReactDOM: typeof import("react-dom/client");
    let buttons: Pick<typeof import("@hustradio/unitary-ui"), "Button" | "ButtonLink">;
    let ownerModules: [
      Pick<typeof import("@hustradio/unitary-ui"), "Toolbar">,
      Pick<typeof import("@hustradio/unitary-ui"), "RadioGroup" | "RadioGroupItem">,
    ] | undefined;
    if (fixtures) {
      for (const name of ["Button", "ButtonLink", ...(ownerFixture ? ["Toolbar", "RadioGroup", "RadioGroupItem"] : [])]) {
        if (!fixtures[name]) throw new Error(`Built docs browser fixture is missing ${name}`);
      }
      React = fixtures.React;
      ReactDOM = fixtures.ReactDOM;
      buttons = fixtures;
      ownerModules = ownerFixture ? [fixtures, fixtures] : undefined;
    } else {
      const [main, button] = await Promise.all([
        fetch("/site/src/main.tsx").then(response => response.text()),
        fetch(moduleUrl).then(response => response.text()),
      ]);
      const reactUrl = button.match(/from\s*["']([^"']*\/react\.js[^"']*)["']/)?.[1];
      const clientUrl = main.match(/from\s*["']([^"']*react-dom_client\.js[^"']*)["']/)?.[1];
      if (!reactUrl || !clientUrl) throw new Error("The docs preview must expose its actual React imports");
      const [reactModule, clientModule, buttonModule] = await Promise.all([
        import(reactUrl), import(clientUrl), import(moduleUrl),
      ]);
      React = reactModule.default ?? reactModule;
      ReactDOM = clientModule.default ?? clientModule;
      buttons = buttonModule;
      ownerModules = ownerFixture ? await Promise.all([
        import(moduleUrl.replace("button.tsx", "toolbar.tsx")),
        import(moduleUrl.replace("button.tsx", "radio.tsx")),
      ]) : undefined;
    }
    const host = document.createElement("div");
    host.dataset.glassControlFixture = "";
    Object.assign(host.style, {
      position: "fixed", left: "20px", top: "20px", width: "calc(100vw - 40px)",
      maxWidth: "760px", padding: "12px", zIndex: "2147483646",
      background: "var(--color-bg-surface)", display: "grid", gap: "12px",
    });
    document.body.append(host);
    const h = React.createElement;
    const control = (name: string, props: Record<string, unknown> = {}, link = false) => {
      const shared = {
        type: "secondary" as const,
        "data-glass-control": name, style: { width: "160px" }, ...props,
      };
      return link
        ? h(buttons.ButtonLink, { href: "#glass-controls", ...shared }, "Glass link")
        : h(buttons.Button, { typeName: "button", ...shared }, "Glass action");
    };
    const row = (children: import("react").ReactNode[], props: Record<string, unknown> = {}) => h("div", {
      style: { display: "flex", flexWrap: "wrap", gap: "12px", padding: "12px" }, ...props,
    }, ...children);
    const toolbarProps = { collapse: false, "data-glass-control-owner": "toolbar" };
    ReactDOM.createRoot(host).render(h(React.Fragment, null,
      control("focus-start", { type: "tertiary", size: "tiny" }),
      row([control("button"), control("link", {}, true)], {
        "data-glass-control-stage": "plain",
        style: { display: "flex", flexWrap: "wrap", gap: "12px", padding: "12px", background: "rgb(80 120 160)" },
      }),
      row([control("contrast-button"), control("contrast-link", {}, true)], {
        "data-glass-control-stage": "contrast",
        style: { display: "flex", flexWrap: "wrap", gap: "12px", padding: "12px",
          background: "repeating-linear-gradient(90deg, #000 0 32px, #fff 32px 64px)" },
      }),
      row([...["default", "tertiary", "error", "warning"].map(type => control(type, { type })),
        control("disabled", { disabled: true }), control("disabled-link", { disabled: true }, true)]),
      row([control("author-fill", { className: "bg-[rgb(80_100_120)] glass-control-author-fill" }),
        control("author-shadow", { className: "shadow-md glass-control-author-shadow" }),
        control("author-image", { className: "glass-control-author-image" }),
        control("author-state", { className: "hover:bg-[rgb(70_90_110)] active:bg-[rgb(60_80_100)] glass-control-author-state" }),
        control("author-transition", { className: "transition-all" }),
        control("author-transition-link", { className: "transition-all" }, true),
        control("author-before", { className: "glass-control-author-before" }),
        control("author-inline", { style: { width: "160px", backgroundColor: "rebeccapurple", boxShadow: "rgb(50 60 70) 0px 4px 12px" } })]),
      ...["floating", "navigation", "mask-backdrop", "mask-scrim"].map(role => row([
        control(`nested-${role}`), control(`nested-link-${role}`, {}, true),
      ], { "data-material": role, "data-glass-control-owner": role,
        className: role === "floating" ? "material-menu" : role === "navigation" ? "bg-background" : undefined })),
      row([control("static", { className: "static" }),
        control("static-link", { className: "static" }, true),
        control("inline-static", { style: { width: "160px", position: "static" } }),
        control("inline-static-link", { style: { position: "static", width: "160px" } }, true),
        control("raw-static")], {
        "data-material": "floating", "data-glass-control-owner": "author-position", className: "material-menu",
        style: { position: "relative", width: "360px", height: "180px", padding: "12px",
          display: "flex", flexWrap: "wrap", alignContent: "flex-start", gap: "12px" },
      }),
      ...(ownerModules ? [row([h(ownerModules[0].Toolbar, toolbarProps,
        control("toolbar-button"), control("toolbar-link", {}, true),
        h(ownerModules[1].RadioGroup, { value: "option", "aria-label": "Toolbar options" },
          h(ownerModules[1].RadioGroupItem, { value: "option",
            className: "relative min-h-11 rounded-md border border-border bg-background px-3 text-foreground",
          }, "Option")))], { "data-material": "floating", className: "material-menu",
        "data-glass-control-stage": "toolbar" })] : []),
    ));
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  }, { moduleUrl, ownerFixture, fixtureUrl });
  const fixture = page.locator("[data-glass-control-fixture]");
  await expect(fixture.locator('[data-glass-control="button"]')).toHaveAttribute("data-uni-button", "");
  await expect(fixture.locator('[data-glass-control="link"]')).toHaveAttribute("href", "#glass-controls");
  return fixture;
}

const control = (fixture: Locator, name: string) => fixture.locator(`[data-glass-control="${name}"]`);


async function installAuthorPseudoUtility(page: Page) {
  await page.evaluate(() => {
    const style = document.createElement("style");
    // Preserve the declared layer order, but put the author utility before the
    // library rules so priority does not depend on being appended last.
    const order = [...document.styleSheets].flatMap(sheet => {
      try {
        return [...sheet.cssRules].map(rule => rule.cssText)
          .filter(value => /^@layer\s+[^{}]+;$/.test(value));
      } catch { return []; }
    });
    style.textContent = `${order.join("\n")}\n@layer utilities {
      .glass-control-author-before::before { content: "AUTHORED"; box-shadow: none; }
    }`;
    document.head.prepend(style);
  });
}

async function paintStyle(button: Locator) {
  return button.evaluate(el => {
    const style = getComputedStyle(el), edge = getComputedStyle(el, "::before");
    return { fill: style.backgroundColor, filter: style.backdropFilter, shadow: style.boxShadow,
      image: style.backgroundImage, color: style.color, edge: edge.content,
      edgeShadow: edge.content === "none" ? "none" : edge.boxShadow };
  });
}

function luminance(rgb: readonly number[]) {
  const values = rgb.map(channel => {
    const value = channel / 255;
    return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
  });
  return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
}

function contrast(left: readonly number[], right: readonly number[]) {
  const l = luminance(left), r = luminance(right);
  return (Math.max(l, r) + .05) / (Math.min(l, r) + .05);
}

function pixel(png: PNG, x: number, y: number) {
  const index = (Math.round(y) * png.width + Math.round(x)) * 4;
  return [...png.data.subarray(index, index + 3)];
}

async function geometry(button: Locator) {
  return button.evaluate(el => {
    const bounds = el.getBoundingClientRect(), style = getComputedStyle(el);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d")!;
    context.fillStyle = style.color;
    context.fillRect(0, 0, 1, 1);
    return { x: bounds.left, y: bounds.top, width: bounds.width, height: bounds.height,
      radius: Number.parseFloat(style.borderTopLeftRadius),
      foreground: [...context.getImageData(0, 0, 1, 1).data].slice(0, 3) };
  });
}

for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 1280]) {
    test(`Glass controls paint clear rounded boundaries and readable labels: ${theme}, ${width}`, async ({ page }, testInfo) => {
      await open(page, theme, width);
      const fixture = await mountButtons(page);
      const baseline = await Promise.all(["button", "link"].map(name => paintStyle(control(fixture, name))));
      const solidPixels = PNG.sync.read(await page.screenshot({ animations: "disabled", caret: "hide", scale: "css" }));
      for (const mode of ["solid", "hybrid"] as const) {
        await texture(page, mode);
        expect(await Promise.all(["button", "link"].map(name => paintStyle(control(fixture, name))))).toEqual(baseline);
      }
      await texture(page, "glass");
      const buffer = await page.screenshot({ animations: "disabled", caret: "hide", scale: "css" });
      const png = PNG.sync.read(buffer);
      const results = [];
      for (const name of ["button", "link"]) {
        const button = control(fixture, name);
        const style = await paintStyle(button), bounds = await geometry(button);
        expect(style.filter).toBe("blur(6px)");
        expect(style.edge).toBe('""');
        expect(style.shadow, "Optical decoration must not replace the control shadow").toBe(baseline[name === "button" ? 0 : 1].shadow);
        const pseudo = await button.evaluate(el => ({ radius: getComputedStyle(el, "::before").borderTopLeftRadius,
          pointer: getComputedStyle(el, "::before").pointerEvents, radiusOwner: getComputedStyle(el).borderTopLeftRadius }));
        expect(pseudo.radius).toBe(pseudo.radiusOwner);
        expect(pseudo.pointer).toBe("none");
        const middleY = Math.floor(bounds.y + bounds.height / 2);
        const inner = pixel(png, Math.ceil(bounds.x + 4), middleY);
        const edge = pixel(png, Math.ceil(bounds.x), middleY);
        expect(contrast(edge, inner), "The straight optical rim must actually be painted").toBeGreaterThan(1.15);
        const middleX = Math.floor(bounds.x + bounds.width / 2);
        const top = pixel(png, middleX, Math.ceil(bounds.y));
        const bottom = pixel(png, middleX, Math.floor(bounds.y + bounds.height) - 1);
        expect(luminance(top), "The grazing reflection must make the top rim lighter than its lower thickness seam").toBeGreaterThan(luminance(bottom));
        const corner = pixel(png, Math.ceil(bounds.x), Math.ceil(bounds.y));
        expect(Math.max(...corner.map((value, index) => Math.abs(value - [80, 120, 160][index]))), "A rounded corner must expose the backdrop instead of a square optical border").toBeLessThanOrEqual(3);
        results.push({ name, edge, inner, top, bottom, corner, boundaryContrast: contrast(edge, inner) });
      }
      // Suppress only the real shared controls' optical shadow. Their film,
      // backdrop sampling and empty interior padding must remain identical.
      const glassStyles = await Promise.all(["button", "link"].map(name => paintStyle(control(fixture, name))));
      const rimOverride = await page.addStyleTag({ content: `[data-glass-control-stage="plain"] [data-uni-button]::before {
        box-shadow: none !important;
      }` });
      try {
        await frames(page);
        const suppressedBuffer = await page.screenshot({ animations: "disabled", caret: "hide", scale: "css" });
        const suppressed = PNG.sync.read(suppressedBuffer);
        for (const name of ["button", "link"]) {
          const button = control(fixture, name), bounds = await geometry(button);
          const before = baseline[name === "button" ? 0 : 1];
          const style = await paintStyle(button);
          expect(style.edgeShadow, `${name}: the probe suppresses optical paint only`).toBe("none");
          expect(style.fill, `${name}: suppressing the rim keeps the same translucent film`).toBe(glassStyles[name === "button" ? 0 : 1].fill);
          expect(style.filter, `${name}: suppressing the rim keeps backdrop diffusion`).toBe("blur(6px)");
          expect(style.shadow, `${name}: suppressing the rim keeps the control's own shadow`).toBe(before.shadow);
          const middleX = Math.floor(bounds.x + bounds.width / 2), topY = Math.ceil(bounds.y);
          const top = pixel(png, middleX, topY), unadornedTop = pixel(suppressed, middleX, topY);
          expect(Math.max(...top.map((value, index) => Math.abs(value - unadornedTop[index]))),
            `${name}: the grazing reflection has visible browser paint`).toBeGreaterThan(3);
          for (const y of [Math.ceil(bounds.y + 6), Math.floor(bounds.y + bounds.height - 7)]) {
            for (let x = Math.ceil(bounds.x + bounds.radius + 6); x < bounds.x + bounds.width - bounds.radius - 6; x += 2) {
              expect(pixel(suppressed, x, y), `${name}: rim optics must not tint or solidify the transmissive center`).toEqual(pixel(png, x, y));
            }
          }
        }
        await testInfo.attach("glass-controls-without-optical-rims", { body: suppressedBuffer, contentType: "image/png" });
      } finally {
        await rimOverride.evaluate(el => el.parentNode?.removeChild(el));
        await frames(page);
      }
      for (const name of ["contrast-button", "contrast-link"]) {
        const button = control(fixture, name), bounds = await geometry(button);
        const backgrounds = [];
        // Empty top padding avoids anti-aliased text and the optical rim.
        for (let x = Math.ceil(bounds.x + bounds.radius + 4); x < bounds.x + bounds.width - bounds.radius - 4; x += 2) {
          backgrounds.push(pixel(png, x, Math.ceil(bounds.y + 5)));
        }
        const minimum = Math.min(...backgrounds.map(background => contrast(bounds.foreground, background)));
        expect(minimum, `${name}: text retains contrast over both dark and light backdrops`).toBeGreaterThanOrEqual(4.5);
        results.push({ name, foreground: bounds.foreground, minimumTextContrast: minimum });
        await button.evaluate(el => { (el as HTMLElement).style.backdropFilter = "none"; });
        await frames(page);
        const unblurred = PNG.sync.read(await page.screenshot({ animations: "disabled", caret: "hide", scale: "css" }));
        let changed = 0, count = 0;
        for (let x = Math.ceil(bounds.x + bounds.radius + 4); x < bounds.x + bounds.width - bounds.radius - 4; x++) {
          const before = pixel(png, x, Math.ceil(bounds.y + 5)), after = pixel(unblurred, x, Math.ceil(bounds.y + 5));
          if (Math.max(...before.map((value, index) => Math.abs(value - after[index]))) > 3) changed++;
          count++;
        }
        expect(changed / count, `${name}: browser paint must actually diffuse the striped backdrop`).toBeGreaterThan(.1);
        await button.evaluate(el => { (el as HTMLElement).style.removeProperty("backdrop-filter"); });
        await frames(page);
      }
      await testInfo.attach("painted-glass-controls", { body: buffer, contentType: "image/png" });
      await testInfo.attach("painted-control-colors", { body: JSON.stringify(results, null, 2), contentType: "application/json" });
      await texture(page, "solid");
      // A fixed number of animation frames does not establish computed-style
      // convergence after a texture switch, even with reduced motion enabled.
      await expect.poll(
        () => Promise.all(["button", "link"].map(name => paintStyle(control(fixture, name)))),
        { message: "Returning to Solid restores exact original fills and optics" },
      ).toEqual(baseline);
      const restored = PNG.sync.read(await page.screenshot({ animations: "disabled", caret: "hide", scale: "css" }));
      for (const name of ["button", "link"]) {
        const bounds = await geometry(control(fixture, name));
        for (let x = Math.ceil(bounds.x + bounds.radius + 4); x < bounds.x + bounds.width - bounds.radius - 4; x++) {
          expect(pixel(restored, x, Math.ceil(bounds.y + 5)), `${name}: Solid restores its exact painted padding`).toEqual(pixel(solidPixels, x, Math.ceil(bounds.y + 5)));
        }
      }
    });
  }

  test(`Glass controls preserve focus, semantic actions, disabled states, author styles and interaction: ${theme}`, async ({ page }) => {
    await open(page, theme);
    const fixture = await mountButtons(page);
    const protectedNames = ["default", "tertiary", "error", "warning", "disabled", "disabled-link"];
    const baseline = await Promise.all(protectedNames.map(name => paintStyle(control(fixture, name))));
    const authoredNames = ["author-fill", "author-shadow", "author-image", "author-inline"];
    const authorBaseline = await Promise.all(authoredNames.map(name => paintStyle(control(fixture, name))));
    const interactionStates = async (name: string) => {
      const button = control(fixture, name);
      try {
        await button.hover();
        await frames(page);
        if (name === "author-state") await expect(button).toHaveCSS("background-color", "rgb(70, 90, 110)");
        const hover = (await paintStyle(button)).fill;
        await page.mouse.down();
        await frames(page);
        await expect.poll(() => button.evaluate(el => el.matches(":active")),
          { message: `${name}: sample press paint while the control is active` }).toBe(true);
        if (name === "author-state") await expect(button).toHaveCSS("background-color", "rgb(60, 80, 100)");
        const active = (await paintStyle(button)).fill;
        return { hover, active };
      } finally {
        await page.mouse.up();
        await page.mouse.move(0, 0);
      }
    };
    const originalStates = await interactionStates("button");
    const start = control(fixture, "focus-start");
    await start.focus();
    await page.keyboard.press("Tab");
    const button = control(fixture, "button"), link = control(fixture, "link");
    await expect(button).toBeFocused();
    const originalFocus = (await paintStyle(button)).shadow;
    expect(originalFocus).not.toBe("none");
    await texture(page, "glass");
    expect((await paintStyle(button)).shadow, "Glass decoration must preserve the existing keyboard ring").toBe(originalFocus);
    await page.keyboard.press("Tab");
    await expect(link).toBeFocused();
    expect((await paintStyle(link)).shadow).toBe(originalFocus);
    await link.evaluate(el => (el as HTMLElement).blur());
    expect(await Promise.all(protectedNames.map(name => paintStyle(control(fixture, name))))).toEqual(baseline);
    const glassStates = await interactionStates("button");
    expect(glassStates.hover, "Glass hover retains its thicker readable film").not.toBe(originalStates.hover);
    expect(glassStates.active, "Glass press retains its thicker readable film").not.toBe(originalStates.active);
    expect(glassStates.active).not.toBe(glassStates.hover);
    expect(await interactionStates("author-state"), "Authored hover and active colors retain priority").toEqual({
      hover: "rgb(70, 90, 110)", active: "rgb(60, 80, 100)",
    });
    const contrasted = control(fixture, "contrast-button");
    try {
      await contrasted.hover();
      await frames(page);
      for (const state of ["hover", "active"] as const) {
        if (state === "active") {
          await page.mouse.down();
          await frames(page);
          await expect.poll(() => contrasted.evaluate(el => el.matches(":active")),
            { message: "Sample contrast while the control is active" }).toBe(true);
        }
        const painted = PNG.sync.read(await page.screenshot({ animations: "disabled", caret: "hide", scale: "css" }));
        const bounds = await geometry(contrasted);
        const backgrounds = [];
        for (let x = Math.ceil(bounds.x + bounds.radius + 4); x < bounds.x + bounds.width - bounds.radius - 4; x += 2) {
          backgrounds.push(pixel(painted, x, Math.ceil(bounds.y + 5)));
        }
        expect(Math.min(...backgrounds.map(background => contrast(bounds.foreground, background))), `${state}: Glass retains text contrast over black and white backdrops`).toBeGreaterThanOrEqual(4.5);
      }
    } finally {
      await page.mouse.up();
      await page.mouse.move(0, 0);
    }
    for (const [index, name] of authoredNames.entries()) {
      const current = await paintStyle(control(fixture, name));
      expect(current.shadow, `${name}: authored shadow`).toBe(authorBaseline[index].shadow);
      expect(current.image, `${name}: authored background image`).toBe(authorBaseline[index].image);
      if (name === "author-fill" || name === "author-inline") expect(current.fill).toBe(authorBaseline[index].fill);
    }
    await expect(control(fixture, "author-fill")).not.toHaveClass(/\bbg-background-100\b/);
    expect((await paintStyle(control(fixture, "author-fill"))).edge).toBe("none");
    expect((await paintStyle(control(fixture, "author-fill"))).filter).toBe("none");
    for (const role of ["floating", "navigation", "mask-backdrop", "mask-scrim"]) {
      for (const name of [`nested-${role}`, `nested-link-${role}`]) {
        const style = await paintStyle(control(fixture, name));
        expect(style.filter, `${name}: avoid repeated backdrop sampling`).toBe("none");
        expect(style.edge, `${name}: retain a visible optical boundary without extra blur`).toBe('""');
      }
    }
  });

  test(`The actual materials demo applies Glass to its shared secondary buttons without repeated sampling: ${theme}`, async ({ page }) => {
    const materials = await open(page, theme);
    const trigger = materials.locator('[data-slot="texture-demo-modal-trigger"]');
    const original = await paintStyle(trigger);
    await materials.locator('label:has([data-texture-option="glass"])').first().click();
    await expect(page.locator("html")).toHaveAttribute("data-texture", "glass");
    const glass = await paintStyle(trigger);
    expect(glass.fill).not.toBe(original.fill);
    expect(glass.filter).toBe("none");
    expect(glass.edge).toBe('""');
    await trigger.click();
    const modal = page.locator('[data-slot="texture-demo-modal"]');
    await expect(modal).toBeVisible();
    const close = modal.locator('[data-uni-button][data-type="secondary"]');
    await expect(close).toHaveAccessibleName("Close modal");
    expect((await paintStyle(close)).filter).toBe("none");
    expect((await paintStyle(close)).edge).toBe('""');
    await close.click();
    await expect(modal).not.toBeVisible();
  });

  test(`Transparent functional owners retain readable Glass control films: ${theme}`, async ({ page }) => {
    await open(page, theme);
    await page.setViewportSize({ width: 1280, height: 1600 });
    const fixture = await mountButtons(page, true);
    const owner = fixture.locator('[data-glass-control-owner="toolbar"]');
    const controls = [control(fixture, "toolbar-button"), control(fixture, "toolbar-link"),
      owner.locator('[data-slot="radio-item-wrapper"]')];
    const alpha = (element: Locator) => element.evaluate(el => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const context = canvas.getContext("2d")!;
      context.fillStyle = getComputedStyle(el).backgroundColor;
      context.fillRect(0, 0, 1, 1);
      return context.getImageData(0, 0, 1, 1).data[3] / 255;
    });
    await texture(page, "glass");
    for (const element of controls) {
      await expect.poll(() => alpha(element), {
        message: "The default filled Toolbar supplies the inner film's contrast after switching",
      }).toBeLessThan(.35);
    }
    for (const kind of ["transparent-class", "transparent-inline", "unfilled", "custom-black", "custom-white"] as const) {
      await owner.evaluate((el, kind) => {
        const owner = el as HTMLElement;
        owner.classList.remove("bg-transparent");
        owner.classList.add("bg-background");
        owner.style.removeProperty("background");
        if (kind === "transparent-class" || kind === "unfilled") owner.classList.remove("bg-background");
        if (kind === "transparent-class") owner.classList.add("bg-transparent");
        if (kind !== "transparent-class" && kind !== "unfilled") {
          owner.style.background = kind === "transparent-inline" ? "transparent"
            : kind === "custom-black" ? "#000" : "#fff";
        }
      }, kind);
      for (const element of controls) {
        await expect.poll(() => alpha(element), { message: `${kind}: the nearest unfilled/custom owner keeps the readable film` }).toBeGreaterThan(.7);
        expect(await alpha(element), "The readable control film still transmits the backdrop").toBeLessThan(.85);
        expect((await paintStyle(element)).filter, "The owner already samples the backdrop").toBe("none");
      }
      // Leave the outer owner filled for the custom-color cases: its film must
      // not override the nearest owner's contrast decision. For transparent
      // cases, exercise transmitted black and white regions in the real paint.
      if (kind.startsWith("transparent") || kind === "unfilled") {
        await fixture.locator('[data-glass-control-stage="toolbar"]').evaluate(el => {
          (el as HTMLElement).style.background = "repeating-linear-gradient(90deg, #000 0 32px, #fff 32px 64px)";
        });
      } else {
        await fixture.locator('[data-glass-control-stage="toolbar"]').evaluate(el => {
          (el as HTMLElement).style.removeProperty("background");
        });
      }
      const painted = PNG.sync.read(await page.screenshot({ animations: "disabled", caret: "hide", scale: "css" }));
      for (const element of controls) {
        const bounds = await geometry(element), backgrounds = [];
        for (let x = Math.ceil(bounds.x + bounds.radius + 4); x < bounds.x + bounds.width - bounds.radius - 4; x += 2) {
          backgrounds.push(pixel(painted, x, Math.ceil(bounds.y + 5)));
        }
        expect(Math.min(...backgrounds.map(background => contrast(bounds.foreground, background))),
          `${kind}: Button, ButtonLink and Radio labels stay readable over the actual backdrop`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  test(`Mask-only Glass controls retain readable films over black and white backgrounds: ${theme}`, async ({ page }) => {
    await open(page, theme);
    await page.setViewportSize({ width: 1280, height: 1400 });
    const fixture = await mountButtons(page);
    for (const role of ["mask-backdrop", "mask-scrim"]) {
      await fixture.locator(`[data-glass-control-owner="${role}"]`).evaluate(el => {
        (el as HTMLElement).style.background = "repeating-linear-gradient(90deg, #000 0 32px, #fff 32px 64px)";
      });
    }
    await texture(page, "glass");
    const painted = PNG.sync.read(await page.screenshot({ animations: "disabled", caret: "hide", scale: "css" }));
    for (const role of ["mask-backdrop", "mask-scrim"]) {
      for (const name of [`nested-${role}`, `nested-link-${role}`]) {
        const button = control(fixture, name), bounds = await geometry(button);
        expect((await paintStyle(button)).filter, "The mask already diffuses the backdrop").toBe("none");
        const backgrounds = [];
        for (let x = Math.ceil(bounds.x + bounds.radius + 4); x < bounds.x + bounds.width - bounds.radius - 4; x += 2) {
          backgrounds.push(pixel(painted, x, Math.ceil(bounds.y + 5)));
        }
        expect(Math.min(...backgrounds.map(background => contrast(bounds.foreground, background))),
          `${name}: a faint mask alone cannot replace the control's readable film`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  test(`Glass preserves unfilled, disabled and custom-filled Radio options: ${theme}`, async ({ page }) => {
    const materials = await open(page, theme);
    const cards = materials.locator('[data-slot="texture-controls"]').first().locator('[data-slot="radio-item-wrapper"]');
    await cards.nth(0).evaluate(el => el.classList.remove("bg-background", "bg-background-100", "bg-muted"));
    await cards.nth(1).evaluate(el => { el.querySelector<HTMLInputElement>("input")!.disabled = true; });
    await cards.nth(2).evaluate(el => {
      el.classList.remove("bg-background", "bg-background-100", "bg-muted");
      el.classList.add("glass-control-author-before");
      (el as HTMLElement).style.backgroundColor = "rgb(80 100 120)";
    });
    await installAuthorPseudoUtility(page);
    const original = await Promise.all((await cards.all()).map(paintStyle));
    for (const mode of ["hybrid", "glass", "solid"] as const) {
      await texture(page, mode);
      expect(await Promise.all((await cards.all()).map(paintStyle)),
        `${mode}: a Radio wrapper without an enabled canonical fill must keep its authored appearance`).toEqual(original);
    }
  });

  test(`Compact information badges retain semantic clarity inside the actual photographic material demo: ${theme}`, async ({ page }, testInfo) => {
    const materials = await open(page, theme);
    const stage = materials.locator('[data-slot="texture-interaction-demo"]');
    await stage.evaluate(async el => {
      const background = getComputedStyle(el).backgroundImage;
      const match = background.match(/url\((?:"([^"]+)"|'([^']+)'|([^)]*))\)/);
      const source = match?.[1] ?? match?.[2] ?? match?.[3];
      if (!source) throw new Error("The information demo requires its photographic CSS background");
      const image = new Image();
      image.src = new URL(source.trim(), location.href).href;
      await image.decode();
    });
    const information = stage.locator('[data-slot="texture-demo-information"]');
    await expect(information).toHaveText("Saved 3 tasks");
    const saved = information.locator('[data-slot="texture-demo-saved"]');
    const count = information.locator('[data-slot="texture-demo-task-count"]');
    const badges = [saved, count];
    await expect(saved).toHaveAttribute("data-variant", "green");
    await expect(count).toHaveAttribute("data-variant", "outline");
    const badgeStyle = (badge: Locator) => badge.evaluate(el => {
      const style = getComputedStyle(el);
      return { fill: style.backgroundColor, color: style.color, weight: style.fontWeight,
        opacity: style.opacity, filter: style.backdropFilter };
    });
    const savedBaseline = await badgeStyle(saved), countBaseline = await badgeStyle(count);
    const results: Array<{ mode: Texture; slot: string; minimumTextContrast: number; foreground: number[] }> = [];
    for (const mode of ["solid", "hybrid", "glass"] as const) {
      await materials.locator(`label:has([data-texture-option="${mode}"])`).first().click();
      await expect(page.locator("html")).toHaveAttribute("data-texture", mode);
      await information.scrollIntoViewIfNeeded();
      await frames(page);
      expect(await badgeStyle(saved), `${mode}: the saved-state color and weight retain their semantic meaning`).toEqual(savedBaseline);
      const countStyle = await badgeStyle(count);
      expect({ fill: countStyle.fill, weight: countStyle.weight, opacity: countStyle.opacity },
        `${mode}: the compact count stays transparent without losing its information weight`).toEqual({
        fill: countBaseline.fill, weight: countBaseline.weight, opacity: countBaseline.opacity,
      });
      expect(countStyle.fill).toBe("rgba(0, 0, 0, 0)");
      expect(countStyle.filter, `${mode}: compact information must not sample an already blurred parent again`).toBe("none");
      const bounds = await Promise.all(badges.map(geometry));
      expect(Math.max(...bounds[1].foreground) - Math.min(...bounds[1].foreground),
        `${mode}: neutral count text may strengthen contrast without acquiring a status hue`).toBeLessThanOrEqual(1);
      // Hide only glyph paint, preserving the actual Badge fill and parent
      // optics, to measure the background directly under its small text.
      const originalColors = await Promise.all(badges.map(badge => badge.evaluate(el => {
        const style = (el as HTMLElement).style;
        const original = { value: style.getPropertyValue("color"), priority: style.getPropertyPriority("color") };
        style.setProperty("color", "transparent", "important");
        return original;
      })));
      try {
        await frames(page);
        const painted = PNG.sync.read(await page.screenshot({ animations: "disabled", caret: "hide", scale: "css" }));
        for (const [index, badge] of badges.entries()) {
          const box = bounds[index], backgrounds = [];
          for (let y = Math.ceil(box.y + 6); y < box.y + box.height - 6; y += 2) {
            for (let x = Math.ceil(box.x + 7); x < box.x + box.width - 7; x += 2) backgrounds.push(pixel(painted, x, y));
          }
          expect(backgrounds.length, "Read the actual badge interior, excluding the rounded outline").toBeGreaterThan(0);
          const minimum = Math.min(...backgrounds.map(background => contrast(box.foreground, background)));
          const slot = (await badge.getAttribute("data-slot"))!;
          expect(minimum, `${mode} ${slot}: small information stays readable on its actual painted backdrop`).toBeGreaterThanOrEqual(4.5);
          results.push({ mode, slot, minimumTextContrast: minimum, foreground: box.foreground });
        }
      } finally {
        await Promise.all(badges.map((badge, index) => badge.evaluate((el, original) => {
          const style = (el as HTMLElement).style;
          if (original.value) style.setProperty("color", original.value, original.priority);
          else style.removeProperty("color");
        }, originalColors[index])));
      }
    }
    await testInfo.attach("compact-badge-painted-contrast", {
      body: JSON.stringify(results, null, 2), contentType: "application/json",
    });
  });

  for (const width of [390, 1280]) {
    test(`Glass option cards transmit the backdrop without stacked opaque fills: ${theme}, ${width}`, async ({ page }, testInfo) => {
      const materials = await open(page, theme, width);
      const picker = materials.locator('[data-slot="texture-controls"]').first();
      const cards = picker.locator('[data-slot="radio-item-wrapper"]');
      const alpha = (card: Locator) => card.evaluate(el => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const context = canvas.getContext("2d")!;
        context.fillStyle = getComputedStyle(el).backgroundColor;
        context.fillRect(0, 0, 1, 1);
        return context.getImageData(0, 0, 1, 1).data[3] / 255;
      });
      await expect(cards).toHaveCount(3);
      const solid = await Promise.all((await cards.all()).map(paintStyle));
      await texture(page, "hybrid");
      expect(await Promise.all((await cards.all()).map(paintStyle)),
        "Hybrid retains the original option-card fills and indicator semantics").toEqual(solid);
      await picker.locator('label:has([data-texture-option="glass"])').click();
      await expect(page.locator("html")).toHaveAttribute("data-texture", "glass");
      for (const card of await cards.all()) {
        expect(await alpha(card), "Standalone cards must transmit their backdrop").toBeLessThan(.85);
        expect((await paintStyle(card)).filter).toBe("blur(6px)");
        expect((await paintStyle(card)).edge).toBe('""');
      }
      for (const kind of ["modal", "drawer"] as const) {
        await materials.locator(`[data-slot="texture-demo-${kind}-trigger"]`).click();
        const layer = page.locator(`[data-slot="texture-demo-${kind}"]`);
        await expect(layer).toBeVisible();
        const options = layer.locator('[data-slot="radio-item-wrapper"]');
        await expect(options).toHaveCount(3);
        for (const card of await options.all()) {
          expect(await alpha(card), "An existing glass layer needs a thin inner film").toBeLessThan(.35);
          const style = await paintStyle(card);
          expect(style.filter, "Do not sample the already blurred parent again").toBe("none");
          expect(style.edge).toBe('""');
        }
        await expect(layer.locator('[data-texture-option="glass"]')).toBeChecked();
        await expect(layer.locator('label:has([data-texture-option="glass"])')).toHaveClass(/\bborder-foreground\b/);
        await testInfo.attach(`${kind}-glass-option-cards`, {
          body: await layer.screenshot({ animations: "disabled", caret: "hide", scale: "css" }),
          contentType: "image/png",
        });
        // Isolate actual control paint against a known colored backdrop. A
        // transparency declaration alone does not prove that it is visible.
        await layer.evaluate(el => {
          (el as HTMLElement).style.setProperty("background", "rgb(80 120 160)", "important");
        });
        await frames(page);
        const painted = PNG.sync.read(await page.screenshot({ animations: "disabled", caret: "hide", scale: "css" }));
        for (const card of await options.all()) {
          const bounds = await geometry(card);
          const background = pixel(painted, Math.ceil(bounds.x + bounds.radius + 5), Math.ceil(bounds.y + 5));
          const solidFill = theme === "light" ? [255, 255, 255] : [0, 0, 0];
          expect(Math.max(...background.map((value, index) => Math.abs(value - solidFill[index]))),
            "The painted card center must visibly retain the colored context").toBeGreaterThan(30);
          expect(contrast(bounds.foreground, background),
            "Thin control films must preserve readable labels").toBeGreaterThanOrEqual(4.5);
        }
        await layer.getByRole("button", { name: kind === "modal" ? "Close modal" : "Close drawer", exact: true }).click();
        await expect(layer).not.toBeVisible();
      }
    });
  }

  test(`Global Glass switches keep blur static while preserving authored transitions: ${theme}`, async ({ page }, testInfo) => {
    await open(page, theme);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const fixture = await mountButtons(page);
    for (const name of ["author-transition", "author-transition-link", "default"]) {
      await expect(control(fixture, name)).toHaveCSS("transition-property", "all");
    }
    const observed = await fixture.evaluate(async el => {
      const nodes = ["button", "link"].map(name =>
        el.querySelector<HTMLElement>(`[data-glass-control="${name}"]`)!);
      const results: Array<{ mode: Texture; values: string[][] }> = [];
      for (const mode of ["glass", "solid"] as const) {
        document.documentElement.dataset.texture = mode;
        const start = performance.now(), values: string[][] = [];
        while (performance.now() - start < 300) {
          await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
          values.push(nodes.map(node => getComputedStyle(node).backdropFilter));
        }
        results.push({ mode, values });
      }
      return results;
    });
    await testInfo.attach("normal-motion-blur-switches", {
      body: JSON.stringify(observed, null, 2), contentType: "application/json",
    });
    for (const entry of observed) {
      expect(entry.values.length).toBeGreaterThan(1);
      expect(entry.values.flat().every(value => value === "none" || value === "blur(6px)"),
        `${entry.mode}: do not interpolate the blur kernel during a global switch`).toBe(true);
      expect(entry.values.at(-1)).toEqual(Array(2).fill(entry.mode === "glass" ? "blur(6px)" : "none"));
    }
    for (const name of ["author-transition", "author-transition-link"]) {
      await expect(control(fixture, name)).toHaveCSS("transition-property", "all");
    }
  });

  test(`Glass rims respect authored positioning and earlier pseudo-element utilities: ${theme}`, async ({ page }, testInfo) => {
    await open(page, theme);
    await page.setViewportSize({ width: 1280, height: 1400 });
    const fixture = await mountButtons(page);
    // Preserve the compact style attribute emitted by server-rendered markup.
    await control(fixture, "raw-static").evaluate(el =>
      el.setAttribute("style", "width:160px;position:static"));
    await installAuthorPseudoUtility(page);
    await texture(page, "glass");
    for (const name of ["static", "static-link", "inline-static", "inline-static-link", "raw-static"]) {
      const button = control(fixture, name);
      await expect(button).toHaveCSS("position", "static");
      await expect(button).toHaveCSS("backdrop-filter", "none");
      expect((await paintStyle(button)).edge,
        `${name}: do not draw an ancestor-sized absolute rim`).toBe("none");
    }
    const owner = fixture.locator('[data-glass-control-owner="author-position"]');
    // Isolate rim positioning from the owner's translucent fill, gradients and
    // backdrop sampling: their rerasterization can quantize unchanged pixels.
    await owner.evaluate(el => {
      const style = (el as HTMLElement).style;
      style.background = "var(--color-bg-surface)";
      style.backdropFilter = "none";
      style.setProperty("-webkit-backdrop-filter", "none");
    });
    await expect(owner).toHaveCSS("backdrop-filter", "none");
    await expect(owner).toHaveCSS("background-image", "none");
    await expect(owner).toHaveCSS("background-color",
      await fixture.evaluate(el => getComputedStyle(el).backgroundColor));
    const ownerBounds = await owner.boundingBox();
    const original = await owner.screenshot({ animations: "disabled", caret: "hide", scale: "css" });
    await page.addStyleTag({ content: `[data-glass-control-owner="author-position"] [data-uni-button]::before {
      content: none !important;
    }` });
    const suppressed = await owner.screenshot({ animations: "disabled", caret: "hide", scale: "css" });
    expect(await owner.boundingBox(), "Suppressing decoration preserves the captured geometry").toEqual(ownerBounds);
    await testInfo.attach("author-positioning", { body: original, contentType: "image/png" });
    await testInfo.attach("author-positioning-suppressed", { body: suppressed, contentType: "image/png" });
    expect(PNG.sync.read(suppressed).data.equals(PNG.sync.read(original).data),
      "Suppressing nonexistent decoration must not change ancestor or control pixels").toBe(true);
    const authored = await paintStyle(control(fixture, "author-before"));
    expect(authored.edge).toBe('"AUTHORED"');
    expect(authored.edgeShadow).toBe("none");
    expect((await paintStyle(control(fixture, "button"))).edge,
      "Default relative controls retain their optical rim").toBe('""');
  });
}

for (const preference of ["forced colors", "reduced transparency"] as const) {
  test(`CSS alone restores solid controls for ${preference}, even with a Glass declaration`, async ({ page, context }) => {
    const materials = await open(page, "light");
    const picker = materials.locator('[data-slot="texture-controls"]').first();
    await picker.evaluate(el => { (el as HTMLElement).style.forcedColorAdjust = "none"; });
    const cards = picker.locator('[data-slot="radio-item-wrapper"]');
    await cards.nth(1).evaluate(el => el.classList.add("glass-control-author-before"));
    const fixture = await mountButtons(page);
    await fixture.evaluate(el => { (el as HTMLElement).style.forcedColorAdjust = "none"; });
    await installAuthorPseudoUtility(page);
    const button = control(fixture, "button"), link = control(fixture, "link");
    const authored = control(fixture, "author-before");
    const original = await Promise.all([button, link].map(paintStyle));
    const originalAuthor = await paintStyle(authored);
    const originalCards = await Promise.all((await cards.all()).map(paintStyle));
    expect(originalCards[1].edge).toBe('"AUTHORED"');
    expect(originalAuthor.edge).toBe('"AUTHORED"');
    await texture(page, "glass");
    expect((await paintStyle(button)).filter).toBe("blur(6px)");
    const cdp = await context.newCDPSession(page);
    try {
      await cdp.send("Emulation.setEmulatedMedia", { features: [
        { name: "forced-colors", value: preference === "forced colors" ? "active" : "none" },
        { name: "prefers-reduced-transparency", value: preference === "reduced transparency" ? "reduce" : "no-preference" },
        { name: "prefers-reduced-motion", value: "reduce" },
      ] });
      expect(await page.evaluate(preference => matchMedia(preference === "forced colors"
        ? "(forced-colors: active)" : "(prefers-reduced-transparency: reduce)").matches, preference)).toBe(true);
      for (const mode of ["solid", "hybrid", "glass"] as const) {
        await texture(page, mode);
        expect(await Promise.all([button, link].map(paintStyle)),
          `${mode}: static declarations must retain the CSS accessibility fallback`).toEqual(original);
        expect(await paintStyle(authored),
          `${mode}: accessibility fallback must preserve the author's pseudo-element`).toEqual(originalAuthor);
        expect(await Promise.all((await cards.all()).map(paintStyle)),
          `${mode}: restore the selected and unselected card fills without replacing authored edges`).toEqual(originalCards);
      }
    } finally { await cdp.detach(); }
  });
}
