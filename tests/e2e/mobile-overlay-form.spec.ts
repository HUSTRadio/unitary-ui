import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * HIG-AUD-027：三个锚定式浮层在移动端和桌面端均保留四角圆角。
 *
 * 390 与 1280 视口、明暗主题下以计算样式及几何值确认：浮层在视口内，
 * 不误作全宽贴底面板。`max-sm:w-full` 在 Radix popper 包裹层中并不产生视口全宽。
 */
test.describe.configure({ timeout: 120_000 });

const MOBILE = { width: 390, height: 844 };
const DESKTOP = { width: 1280, height: 900 };

async function openWith(page: Page, slug: string, theme: "light" | "dark") {
  await page.addInitScript((preference) => {
    localStorage.setItem("unitary-docs-language", "en-US");
    localStorage.setItem("unitary-theme-preference", preference);
  }, theme);
  await page.goto(`/#/components/${slug}`);
  await page.waitForSelector('[data-slot="navbar"]');
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

type Metrics = { bottomRadius: string; topRadius: string; width: number; x: number; bottom: number; viewport: number; height: number };

const readMetrics = (el: Element): Metrics => {
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  return {
    bottomRadius: style.borderBottomLeftRadius,
    topRadius: style.borderTopLeftRadius,
    width: Math.round(rect.width * 100) / 100,
    x: rect.x,
    bottom: rect.bottom,
    viewport: innerWidth,
    height: innerHeight,
  };
};

/** 逐个打开三个浮层，返回各自的几何与圆角。 */
async function openOverlays(page: Page): Promise<Record<string, Metrics>> {
  const result: Record<string, Metrics> = {};

  // 1) 标准 ContextMenu（示例触发区是文本 "Right click here"）
  await openWith(page, "context-menu", (await currentTheme(page)) as "light" | "dark");
  const trigger = page.getByText("Right click here", { exact: true }).first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click({ button: "right" });
  const contextMenu = page.locator('[role="menu"]:visible').first();
  await expect(contextMenu).toBeVisible();
  await page.waitForTimeout(250);
  result["context-menu"] = await contextMenu.evaluate(readMetrics);

  // 2) Select
  await openWith(page, "select", (await currentTheme(page)) as "light" | "dark");
  await page.locator('[data-slot="select-trigger"]').first().click();
  const selectContent: Locator = page.locator('[data-slot="select-content"]:visible').first();
  await expect(selectContent).toBeVisible();
  await page.waitForTimeout(250);
  result.select = await selectContent.evaluate(readMetrics);

  // 3) MultiSelect
  await openWith(page, "multi-select", (await currentTheme(page)) as "light" | "dark");
  await page.locator('[data-slot="multi-select-trigger"]').first().click();
  const multiContent: Locator = page.locator('[data-slot="multi-select-content"]:visible').first();
  await expect(multiContent).toBeVisible();
  await page.waitForTimeout(250);
  result["multi-select"] = await multiContent.evaluate(readMetrics);

  return result;
}

/** 读取当前文档站主题（页面内），用于在多次导航之间保持一致。 */
async function currentTheme(page: Page): Promise<string> {
  return page.evaluate(() => document.documentElement.className.includes("dark") ? "dark" : "light");
}

for (const theme of ["light", "dark"] as const) {
  test(`Quick Actions 移动端锚定菜单不越界（${theme}）`, async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await openWith(page, "context-menu", theme);
    const trigger = page.getByRole("button", { name: "Notes", exact: true });
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click({ button: "right" });
    const menu = page.locator('[role="menu"]:visible').first();
    await expect(menu).toBeVisible();
    await expect(menu).toHaveCSS("width", "224px");
    await expect.poll(async () => {
      const rect = await menu.boundingBox();
      return rect ? rect.x + rect.width : Infinity;
    }).toBeLessThanOrEqual(MOBILE.width - 8);
    const rect = await menu.boundingBox();
    expect(rect).not.toBeNull();
    expect(rect!.x).toBeGreaterThanOrEqual(8);
  });

  test(`浮层移动端仍为锚定式四角圆角（${theme}）`, async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.addInitScript((preference) => {
      localStorage.setItem("unitary-docs-language", "en-US");
      localStorage.setItem("unitary-theme-preference", preference);
    }, theme);

    const overlays = await openOverlays(page);
    for (const [name, metrics] of Object.entries(overlays)) {
      expect(metrics.viewport, `${name} 视口应为 390`).toBe(390);
      expect(metrics.bottomRadius, `${name} 移动端下缘应保留浮层圆角`).toBe("6px");
      expect(metrics.topRadius, `${name} 移动端上缘应保留浮层圆角`).toBe("6px");
      expect(metrics.x, `${name} 不得超出视口左缘`).toBeGreaterThanOrEqual(-1);
      expect(metrics.x + metrics.width, `${name} 不得超出视口右缘`).toBeLessThanOrEqual(391);
      expect(metrics.width, `${name} 不应误作全屏底部面板`).toBeLessThan(389);
      expect(metrics.bottom, `${name} 不应贴在视口底部`).toBeLessThan(metrics.height - 20);
    }
  });

  test(`浮层桌面端形态：四角圆角（${theme}）`, async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.addInitScript((preference) => {
      localStorage.setItem("unitary-docs-language", "en-US");
      localStorage.setItem("unitary-theme-preference", preference);
    }, theme);

    const overlays = await openOverlays(page);
    for (const [name, metrics] of Object.entries(overlays)) {
      expect(metrics.viewport, `${name} 视口应为 1280`).toBe(1280);
      expect(metrics.bottomRadius, `${name} 桌面端应为四角圆角`).toBe("6px");
      expect(metrics.topRadius, `${name} 桌面端应为四角圆角`).toBe("6px");
    }
  });
}
