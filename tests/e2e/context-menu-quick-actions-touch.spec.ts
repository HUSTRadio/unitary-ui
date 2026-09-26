import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Quick Actions 触屏长按回归（PLAN §十一.3 / 交接书批次 B G3）。
 *
 * 这里的长按**不是**浏览器原生手势：Radix `ContextMenuTrigger` 自己实现了触屏长按
 * —— `onPointerDown` 里当 `pointerType !== "mouse"` 时 `setTimeout(handleOpen, 700)`，
 * 并在 pointerup / pointermove / pointercancel / contextmenu 上清除（见
 * `@radix-ui/react-context-menu/dist/index.mjs`）。因此用 CDP 真实 touch 事件按住
 * 超过 700ms 即可复现，全程不会派发 `contextmenu`（探针实测事件序列只有
 * pointerdown:touch / touchstart / pointerup:touch / touchend）。
 *
 * 视口取 1024px 宽：Quick Actions 列表保持默认 224px 宽度。
 */

test.use({ hasTouch: true, isMobile: true, viewport: { width: 1024, height: 768 } });

const SCRIM_SELECTOR = '[data-slot="context-menu-quick-actions-overlay"]';

async function openQuickActionsDemo(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("geist-docs-language", "en-US");
    window.localStorage.setItem("geist-theme-preference", "light");
  });
  await page.goto("/#/components/context-menu");
  await page.waitForSelector('[data-slot="navbar"]');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
}

async function pressTrigger(page: Page, trigger: Locator, holdMs: number) {
  const box = await trigger.boundingBox();
  expect(box).not.toBeNull();
  const point = { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 };
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [point] });
  await page.waitForTimeout(holdMs);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await page.waitForTimeout(400);
}

test("touch long press opens quick actions sharing the scrim material", async ({ page }) => {
  await openQuickActionsDemo(page);

  const trigger = page.getByRole("button", { name: "Notes" }).first();
  await trigger.scrollIntoViewIfNeeded();

  const scrim = page.locator(SCRIM_SELECTOR);
  await expect(scrim).toHaveCount(0);

  await pressTrigger(page, trigger, 900);

  await expect(scrim).toBeVisible();
  const menu = page.getByRole("menu").first();
  await expect(menu).toBeVisible();

  // 触屏长按与桌面右键共用同一份遮罩材质（--uni-overlay-backdrop-blur）
  const scrimStyle = await scrim.evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      backdropFilter: style.backdropFilter || style.getPropertyValue("-webkit-backdrop-filter"),
      background: style.backgroundColor,
    };
  });
  expect(scrimStyle.backdropFilter).toBe("blur(8px)");
  expect(scrimStyle.background).toMatch(/^(oklab\(0 0 0|rgba\(0, 0, 0)/);

  // 桌面宽度下保留默认列表宽度（读计算值，不受开启动画 transform 影响）
  const menuWidth = await menu.evaluate((node) => getComputedStyle(node).width);
  expect(menuWidth).toBe("224px");
});

test("a short touch tap below the long press threshold does not open quick actions", async ({
  page,
}) => {
  await openQuickActionsDemo(page);

  const trigger = page.getByRole("button", { name: "Notes" }).first();
  await trigger.scrollIntoViewIfNeeded();

  await pressTrigger(page, trigger, 150);

  await expect(page.locator(SCRIM_SELECTOR)).toHaveCount(0);
  await expect(page.getByRole("menu")).toHaveCount(0);
});
