import { test, expect, type Page, type Locator } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { defaultTokens } from "../../src/lib/color-schemes/default";
import { schemes } from "../../src/lib/color-schemes/presets";
import { codeThemes, resolveCodeTheme, inlineColors } from "../../src/lib/color-schemes/code-themes";

async function color(page: Page, value: string) {
  return page.evaluate(value => {
    const el = document.createElement("span");
    el.style.setProperty("color", value, "important");
    el.style.setProperty("transition", "none", "important");
    document.body.append(el);
    const result = getComputedStyle(el).color;
    el.remove();
    return result;
  }, value);
}
async function choose(page: Page, lab: Locator, label: string, option: string) {
  const trigger = lab.getByRole("combobox", { name: label, exact: true });
  await expect(trigger).toHaveJSProperty("tagName", "BUTTON");
  await trigger.click();
  await page.getByRole("option", { name: option, exact: true }).click();
}
async function mode(lab: Locator, value: "light" | "dark") {
  await lab.locator('[data-slot="switch"] label').filter({ hasText: value === "light" ? "浅色" : "深色" }).click();
}
async function open(page: Page, docsTheme: "light" | "dark", language = "zh-CN", width = 1280) {
  await page.addInitScript(theme => localStorage.setItem("unitary-theme-preference", theme), docsTheme);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width, height: 1700 });
  await page.goto(`/?lang=${language}#/color-schemes`);
  const lab = page.locator('[data-slot="color-schemes-page"]');
  await expect(lab.locator("h1")).toHaveText(language === "zh-CN" ? "配色方案" : "Color Schemes");
  return lab;
}

for (const docsTheme of ["light", "dark"] as const) {
  test(`standard components, saved Default and palette states in ${docsTheme} docs`, async ({ page }) => {
    test.setTimeout(180_000);
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    const lab = await open(page, docsTheme);
    const ui = lab.locator("[data-ui-preview]");
    const root = await page.evaluate(expected => {
      const style = getComputedStyle(document.documentElement);
      const probe = document.createElement("span");
      probe.style.setProperty("transition", "none", "important");
      document.body.append(probe);
      // The browser resolves equivalent color spellings; other token values
      // retain their exact strings, including missing or invalid colors.
      const normalize = (name: string, value: string) => {
        if (name === "--focus-ring-outline" && CSS.supports("box-shadow", value)) {
          probe.style.setProperty("box-shadow", value, "important");
          return getComputedStyle(probe).boxShadow;
        }
        if (!CSS.supports("color", value)) return value;
        probe.style.setProperty("color", value, "important");
        return getComputedStyle(probe).color;
      };
      try {
        return {
          control: { white: normalize("", "#fff"), black: normalize("", "#000") },
          actual: Object.fromEntries(Object.keys(expected).map(name =>
            [name, normalize(name, style.getPropertyValue(name).trim())])),
          expected: Object.fromEntries(Object.entries(expected).map(([name, value]) =>
            [name, normalize(name, value)])),
        };
      } finally {
        probe.remove();
      }
    }, defaultTokens[docsTheme]);
    expect(root.control.white, "CSS color probe must distinguish white from black").not.toBe(root.control.black);
    expect(root.actual).toEqual(root.expected);
    await expect(ui).toHaveAttribute("data-slot", "sub-frame");
    for (const slot of ["navbar", "sidebar-nav", "breadcrumb", "fieldset", "badge", "status-dot", "input"]) await expect(ui.locator(`[data-slot="${slot}"]`).first()).toBeVisible();
    const save = ui.getByRole("button", { name: "保存更改", exact: true });
    const shellColor = await lab.locator("h1").evaluate(el => getComputedStyle(el).color);
    for (const uiMode of ["light", "dark"] as const) {
      await mode(lab, uiMode);
      for (const s of schemes) {
        await choose(page, lab, "UI 配色", `${s.name} / ${s.english}`);
        const t = s.ui[uiMode];
        await page.mouse.move(0, 0);
        await expect(ui).toHaveCSS("background-color", await color(page, t["--background"]!));
        await expect(save).toHaveCSS("background-color", await color(page, t["--primary"]!));
        await expect(save).toHaveCSS("color", await color(page, t["--primary-foreground"]!));
        await save.hover();
        await expect(save).toHaveCSS("background-color", await color(page, t["--action-hover"]!));
        await save.focus();
        await page.keyboard.press("Tab");
        await page.keyboard.press("Shift+Tab");
        await expect(save).toBeFocused();
        const focusRing = await color(page, t["--focus-ring-color"]!);
        await expect.poll(() => save.evaluate(el => getComputedStyle(el).boxShadow)).toContain(focusRing);
        await expect(ui.getByRole("button", { name: "已归档", exact: true })).toBeDisabled();
        const input = ui.getByRole("textbox", { name: "项目名称", exact: true });
        await input.fill("Palette preview");
        await expect(input).toHaveCSS("color", await color(page, t["--foreground"]!));
        await save.click();
        await expect(ui.getByRole("status")).toHaveText("更改已保存");
        await ui.getByRole("button", { name: "取消", exact: true }).click();
        await expect(ui.getByRole("status")).toBeEmpty();
        const swatch = lab.locator('[data-color-role="--primary"]');
        await expect(swatch).toHaveAttribute("data-color-value", t["--primary"]!);
        await expect(swatch.locator('[data-slot="palette-swatch"]')).toHaveCSS("background-color", await color(page, t["--primary"]!));
        const logo = ui.locator(".workspace-brand svg");
        await expect(logo).toHaveAttribute("viewBox", "83.26 -244.64 1278.06 289.28");
        await expect(logo.locator("path").first()).toHaveCSS("fill", uiMode === "light" ? "rgb(13, 71, 161)" : "rgb(255, 255, 255)");
        await expect(logo.locator("path").nth(1)).toHaveCSS("fill", await color(page, t["--foreground"]!));
        await expect(page.locator("html")).toHaveAttribute("data-theme", docsTheme);
        await expect(lab.locator("h1")).toHaveCSS("color", shellColor);
        await ui.screenshot({ path: `.scratch/color-schemes/ui-${docsTheme}-${s.id}-${uiMode}.png` });
        for (const width of [320, 768, 1024]) {
          await page.setViewportSize({ width, height: 900 });
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
          expect(await ui.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
        }
        await page.setViewportSize({ width: 1280, height: 1700 });
      }
    }
    // Standard SidebarNav selection updates locally without navigating the docs route.
    await ui.getByRole("link", { name: "设计资源", exact: true }).click();
    await expect(ui.getByRole("link", { name: "设计资源", exact: true })).toHaveAttribute("aria-current", "page");
    await expect(page).toHaveURL(/#\/color-schemes$/);
    expect(errors).toEqual([]);
  });

  test(`independent inline/block themes and syntax roles in ${docsTheme} docs`, async ({ page }) => {
    test.setTimeout(180_000);
    const lab = await open(page, docsTheme);
    const ui = lab.locator("[data-ui-preview]");
    const code = ui.locator("[data-code-preview]");
    const inline = ui.locator('[data-slot="inline-code"]').first();
    const save = ui.getByRole("button", { name: "保存更改", exact: true });
    for (const theme of codeThemes) {
      await choose(page, lab, "代码块主题", theme.name);
      for (const uiMode of ["light", "dark"] as const) {
        await mode(lab, uiMode);
        const resolved = resolveCodeTheme(theme, schemes[0], uiMode);
        await expect(code).toHaveAttribute("data-theme", resolved.mode);
        await expect(code.locator('[data-slot="code-block-content"]')).toHaveCSS("background-color", await color(page, resolved.colors.background));
        for (const role of ["keyword", "string", "number", "boolean", "function", "comment"] as const) await expect(code.locator(`[data-slot="code-block"] .token.${role}`).first()).toHaveCSS("color", await color(page, resolved.colors[role]));
        for (const [line, role] of [[2, "highlight"], [4, "added"], [5, "removed"], [6, "referenced"]] as const) await expect(code.locator(`[data-code-line="${line}"]`)).toHaveCSS("background-color", await color(page, resolved.colors[role]));
        await lab.getByRole("tab", { name: "代码块主题", exact: true }).click();
        await expect(lab.locator('[data-color-role="--scheme-code-number"]')).toHaveAttribute("data-color-value", resolved.colors.number);
        await choose(page, lab, "行内代码主题", theme.name);
        await lab.getByRole("tab", { name: "行内代码主题", exact: true }).click();
        const inlinePalette = inlineColors(theme, schemes[0], uiMode);
        await expect(inline).toHaveCSS("color", await color(page, inlinePalette.foreground));
        await expect(inline).toHaveCSS("background-color", await color(page, inlinePalette.background));
        await expect(lab.locator('[data-color-role="--scheme-inline-background"]')).toHaveAttribute("data-color-value", inlinePalette.background);
        await page.mouse.move(0, 0);
        await expect(save).toHaveCSS("background-color", await color(page, schemes[0].ui[uiMode]["--primary"]!));
      }
    }
    await choose(page, lab, "代码块主题", "Monokai");
    await choose(page, lab, "行内代码主题", "Light (VS Code)");
    for (const s of schemes.slice(1)) {
      await choose(page, lab, "UI 配色", `${s.name} / ${s.english}`);
      await expect(code.locator(".token.number").first()).toHaveCSS("color", "rgb(174, 129, 255)");
      await expect(inline).toHaveCSS("background-color", "rgb(255, 255, 255)");
    }
    await code.getByRole("button", { name: "查看基础 Code 组件", exact: true }).click();
    await expect(code.locator('[data-slot="code"] .token.number')).toHaveCSS("color", "rgb(174, 129, 255)");
    await code.getByRole("button", { name: "复制到剪贴板", exact: true }).first().click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("loadProject");
    const pending = page.waitForEvent("download");
    await lab.getByRole("button", { name: "导出 CSS", exact: true }).click();
    const file = await pending;
    expect(file.suggestedFilename()).toBe("unitary-amber-light-monokai.css");
    await file.saveAs(`.scratch/color-schemes/independent-${docsTheme}.css`);
    const css = await readFile((await file.path())!, "utf8");
    await ui.evaluate(el => el.removeAttribute("style"));
    await code.evaluate(el => el.removeAttribute("style"));
    await ui.locator("[data-inline-code-theme]").evaluate(el => el.removeAttribute("style"));
    await page.addStyleTag({ content: css });
    for (const uiMode of ["light", "dark"] as const) {
      await page.evaluate(mode => {
        document.querySelector<HTMLElement>("[data-ui-preview]")!.dataset.theme = mode;
        for (const el of document.querySelectorAll<HTMLElement>("[data-ui-theme]")) el.dataset.uiTheme = mode;
      }, uiMode);
      await expect(save).toHaveCSS("background-color", await color(page, schemes[3].ui[uiMode]["--primary"]!));
      await expect(inline).toHaveCSS("background-color", "rgb(255, 255, 255)");
      await expect(code.locator('[data-slot="code-block-content"]')).toHaveCSS("background-color", "rgb(39, 40, 34)");
    }
  });
}

for (const [language, docsTheme, width] of [["zh-CN", "light", 1280], ["en-US", "dark", 390]] as const) {
  test(`public API documentation and showcase navigation (${language})`, async ({ page }) => {
    const lab = await open(page, docsTheme, language, width);
    await lab.getByRole("link", { name: language === "en-US" ? "Read the Color Scheme API →" : "查看配色 API →" }).click();
    await expect(page).toHaveURL(/#\/api\/color-schemes$/);
    const main = page.locator("#main-content");
    await expect(main.getByRole("heading", { name: "Color Scheme API", exact: true })).toBeVisible();
    await expect(main).toContainText("applyColorScheme");
    await expect(main).toContainText("createColorSchemeCSS");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await main.getByRole("link", { name: language === "en-US" ? "Open the interactive palette showcase →" : "打开交互配色展示 →" }).click();
    await expect(lab.locator("h1")).toBeVisible();
  });
  test(`localized standard frame and contained overlay (${language}, ${width}px)`, async ({ page }) => {
    const lab = await open(page, docsTheme, language, width);
    const en = language === "en-US";
    const ui = lab.locator("[data-ui-preview]");
    await choose(page, lab, en ? "UI palette" : "UI 配色", en ? "Green" : "绿色 / Green");
    const trigger = ui.getByRole("button", { name: en ? "Preview local overlay" : "预览局部浮层", exact: true });
    await trigger.click();
    const sheet = ui.locator('[data-slot="bottom-sheet"]');
    await expect(sheet).toBeVisible();
    await expect(sheet).toHaveCSS("position", "absolute");
    await expect(sheet).toHaveCSS("background-color", await color(page, schemes[2].ui.light["--background"]!));
    const bounds = await ui.evaluate(el => {
      const frame = el.getBoundingClientRect();
      const children = [el.querySelector('[class*="overlay-scrim"]')!, el.querySelector('[data-slot="bottom-sheet"]')!].map(el => el.getBoundingClientRect());
      return { frame: [frame.left, frame.top, frame.right, frame.bottom], children: children.map(c => [c.left, c.top, c.right, c.bottom]) };
    });
    for (const box of bounds.children) {
      expect(box[0]).toBeGreaterThanOrEqual(bounds.frame[0]);
      expect(box[1]).toBeGreaterThanOrEqual(bounds.frame[1]);
      expect(box[2]).toBeLessThanOrEqual(bounds.frame[2]);
      expect(box[3]).toBeLessThanOrEqual(bounds.frame[3]);
    }
    await page.keyboard.press("Escape");
    await expect(sheet).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await ui.evaluate(el => el.style.width = "280px");
    await expect(ui.locator(".workspace-nav")).toBeHidden();
    expect(await ui.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    await lab.getByRole("link", { name: en ? "Explore global tokens →" : "查看全局变量 →" }).click();
    await expect(page).toHaveURL(/#\/(api\/)?tokens$/);
    await expect(lab).toHaveCount(0);
    await expect(page.locator("html")).toHaveAttribute("data-theme", docsTheme);
  });
}
