import { expect, test } from "@playwright/test";

/**
 * HIG-AUD-013 回归：触屏（pointer: coarse）下交互目标命中区 ≥44×44。
 *
 * 修复策略：组件在 `pointer-coarse:` 变体下把命中区抬到 44px（桌面维持原视觉）。
 * 本 spec 用 `hasTouch: true` 触发 coarse（实测无需 isMobile，避免移动 UA 副作用）；
 * 宽视口取 1024 以避开窄屏折叠（Toolbar 等在窄屏把项移入溢出菜单，目标不可测）。
 *
 * 经验（见台账 §5J）：
 * - `actionTimeout` 必须显式设置，否则元素缺失时 `boundingBox()` 无限等待并撞满用例上限；
 * - Radix 浮层用 zoom-in 动画，测量前需等动画收敛，否则读到 42.5px 之类的中间帧；
 * - docs 站汉堡面板传 `disableSearch` → 该路径的 `search-clear` 不可达，其命中区由
 *   `tests/touch-targets-contract.test.ts` 源码契约保证。
 */

test.describe("HIG-AUD-013 触屏命中区（宽视口 / iPad 形态）", () => {
  test.use({ hasTouch: true, viewport: { width: 1024, height: 768 }, actionTimeout: 15_000 });

  const staticTargets = [
    { route: "/components/toolbar", selector: '[data-slot="toolbar-item"]', label: "ToolbarItem" },
    {
      route: "/components/menu-bar",
      selector: '[data-slot="menu-bar-trigger"]',
      label: "MenuBarTrigger",
    },
    {
      route: "/components/multi-select",
      selector: '[data-slot="multi-select-trigger"]',
      label: "MultiSelect 触发器",
    },
    {
      route: "/components/select",
      selector: '[data-slot="select-trigger"]',
      label: "Select 触发器",
    },
    {
      route: "/components/theme-switcher",
      selector: '[role="radio"]',
      label: "ThemeSwitcher 选项",
    },
    {
      route: "/components/dots-menu",
      // Radix 的 DropdownMenuTrigger 输出 aria-haspopup="menu"；HIG-AUD-032 移除了
      // dots-menu 显式传的 "true"（那是语义降级），因此不再用 "true" 定位。
      // 必须限定在示例容器内：导航栏也有 aria-haspopup="menu" 的触发器，全局取首个会测错元素。
      selector: '[data-demo-component="dots-menu"] [aria-haspopup="menu"]',
      label: "DotsMenu 触发器",
    },
  ] as const;

  for (const target of staticTargets) {
    test(`${target.label} ≥44×44`, async ({ page }) => {
      await page.goto(`/#${target.route}`);
      await page.locator('[data-slot="navbar"]').first().waitFor({ state: "visible" });
      const el = page.locator(target.selector).first();
      await el.scrollIntoViewIfNeeded();
      const box = await el.boundingBox();
      expect(box, `${target.label} 未渲染`).not.toBeNull();
      expect(box!.height, `${target.label} 命中高度`).toBeGreaterThanOrEqual(44);
      expect(box!.width, `${target.label} 命中宽度`).toBeGreaterThanOrEqual(44);
    });
  }

  test("菜单项（MenuItem）≥44 高", async ({ page }) => {
    await page.goto("/#/components/dots-menu");
    await page.locator('[data-slot="navbar"]').first().waitFor({ state: "visible" });
    // 同样限定在示例容器内，避免点到导航栏的菜单触发器
    await page
      .locator('[data-demo-component="dots-menu"] [aria-haspopup="menu"]')
      .first()
      .click();
    const item = page.locator('[data-slot="menu-item"]').first();
    await item.waitFor({ state: "visible" });
    // Radix 浮层 zoom-in 动画（95%）期间测量会低报，等收敛
    await page.waitForTimeout(600);
    const box = await item.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test("MultiSelect 行 ≥44 高（下拉打开后）", async ({ page }) => {
    await page.goto("/#/components/multi-select");
    await page.locator('[data-slot="navbar"]').first().waitFor({ state: "visible" });
    await page.locator('[data-slot="multi-select-trigger"]').first().click();
    const row = page.locator('[data-slot="multi-select-row"]').first();
    await row.waitFor({ state: "visible" });
    await page.waitForTimeout(300);
    const box = await row.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe("HIG-AUD-013 触屏命中区（窄视口 / 手机形态）", () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 }, actionTimeout: 15_000 });

  test("Toolbar 溢出菜单项 ≥44 高（折叠后）", async ({ page }) => {
    await page.goto("/#/patterns/app-shell");
    await page.locator('[data-slot="navbar"]').first().waitFor({ state: "visible" });
    const toolbar = page.locator('[data-slot="toolbar"]').first();
    await toolbar.scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () =>
        document.querySelector('[data-slot="toolbar"]')?.getAttribute("data-collapsed") === "true",
      null,
      { timeout: 15_000 },
    );
    await toolbar.locator('[aria-haspopup="menu"]').click();
    const item = page.locator('[data-slot="menu-item"]').first();
    await item.waitFor({ state: "visible" });
    await page.waitForTimeout(600);
    const box = await item.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});
