import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * HIG-AUD-027：Select / MultiSelect 与 ContextMenu 的浮层圆角契约。
 *
 * 依据是项目自定规范（`PLAN-HIG-COMPONENTS.md:118`）与既有先例 `context-menu`
 * （内容类含 `max-sm:w-full max-sm:rounded-b-none`，Quick Actions 变体同）：移动端浮层
 * **只留上缘圆角**，与桌面端的四角 `rounded-overlay` 区分。
 *
 * 判据取自**计算值**而非类名，且同时测 390（移动）与 1280（桌面）两端，这样「形态被断点
 * 限定」这件事本身也被断言，而不是只测一端。
 *
 * 实测澄清（2026-09-26）：规范里的 `max-sm:w-full` 在 Radix popper 内**是惰性的**——
 * 带该类的 `context-menu` 在 390 下实测宽 99.25px 而非视口宽（`w-full` 相对 shrink-to-fit
 * 包装器解析）。故本契约只断言真正生效的圆角形态，不把「全宽」写成承诺。
 */
test.describe.configure({ timeout: 120_000 });

const MOBILE = { width: 390, height: 844 };
const DESKTOP = { width: 1280, height: 900 };

async function openWith(page: Page, slug: string, theme: "light" | "dark") {
  await page.addInitScript((preference) => {
    localStorage.setItem("geist-docs-language", "en-US");
    localStorage.setItem("geist-theme-preference", preference);
  }, theme);
  await page.goto(`/#/components/${slug}`);
  await page.waitForSelector('[data-slot="navbar"]');
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

type Metrics = { bottomRadius: string; topRadius: string; width: number; viewport: number };

const readMetrics = (el: Element): Metrics => {
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  return {
    bottomRadius: style.borderBottomLeftRadius,
    topRadius: style.borderTopLeftRadius,
    width: Math.round(rect.width * 100) / 100,
    viewport: innerWidth,
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
  test(`浮层移动端形态：只留上缘圆角（${theme}）`, async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.addInitScript((preference) => {
      localStorage.setItem("geist-docs-language", "en-US");
      localStorage.setItem("geist-theme-preference", preference);
    }, theme);

    const overlays = await openOverlays(page);
    for (const [name, metrics] of Object.entries(overlays)) {
      expect(metrics.viewport, `${name} 视口应为 390`).toBe(390);
      expect(metrics.bottomRadius, `${name} 移动端下缘应为直角`).toBe("0px");
      expect(metrics.topRadius, `${name} 移动端上缘应保留浮层圆角`).toBe("6px");
    }
  });

  test(`浮层桌面端形态：四角圆角（${theme}）`, async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.addInitScript((preference) => {
      localStorage.setItem("geist-docs-language", "en-US");
      localStorage.setItem("geist-theme-preference", preference);
    }, theme);

    const overlays = await openOverlays(page);
    for (const [name, metrics] of Object.entries(overlays)) {
      expect(metrics.viewport, `${name} 视口应为 1280`).toBe(1280);
      expect(metrics.bottomRadius, `${name} 桌面端应为四角圆角`).toBe("6px");
      expect(metrics.topRadius, `${name} 桌面端应为四角圆角`).toBe("6px");
    }
  });
}
