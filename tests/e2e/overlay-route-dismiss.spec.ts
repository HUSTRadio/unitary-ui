import { expect, test, type Page } from "@playwright/test";

/**
 * HIG-AUD-017 运行验收：导航之后已打开的浮层必须收起。
 *
 * 两条互补路径：
 * ① 点击浮层内的导航条目 → `HamburgerMenu` 自身关闭（+ 消费方 onNavigate 兜底）；
 * ② 浏览器后退 / 程序化导航 → 只能由 `useDismissOnNavigate`（hashchange + popstate）覆盖。
 */
const VIEWPORT = { width: 768, height: 1024 };

async function openPanelAt(page: Page, route: string) {
  await page.setViewportSize(VIEWPORT);
  await page.addInitScript(() => {
    window.localStorage.setItem("geist-docs-language", "en-US");
    window.localStorage.setItem("geist-theme-preference", "light");
  });
  await page.goto(route);
  await page.locator('[data-slot="navbar"]').first().waitFor({ state: "visible" });

  await page.locator('[data-slot="hamburger-trigger"]').click();
  const panel = page.locator('[data-slot="expand-panel"]');
  await expect(panel).toBeVisible();
  return panel;
}

test("clicking a nav entry closes the panel and navigates", async ({ page }) => {
  const panel = await openPanelAt(page, "/#/components/button");

  const link = panel.locator('a[href^="/components/"]').first();
  const href = (await link.getAttribute("href"))!;
  await link.click();

  await expect(panel).not.toBeVisible();
  await expect(page).toHaveURL(new RegExp(`#${href}$`));
});

test("browser back closes an open panel (non-click route change)", async ({ page }) => {
  const panel = await openPanelAt(page, "/#/components/button");

  const link = panel.locator('a[href^="/components/"]').first();
  const href = (await link.getAttribute("href"))!;
  await link.click();
  await expect(panel).not.toBeVisible();
  await expect(page).toHaveURL(new RegExp(`#${href}$`));

  // 面板再次打开后，用历史后退改变路由——没有任何点击回调会运行
  await page.locator('[data-slot="hamburger-trigger"]').click();
  await expect(panel).toBeVisible();
  await page.evaluate(() => window.history.back());

  await expect(page).toHaveURL(/#\/components\/button$/);
  await expect(panel).not.toBeVisible();
});
