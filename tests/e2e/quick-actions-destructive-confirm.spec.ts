import { expect, test } from "@playwright/test";

/**
 * HIG-AUD-037 回归：破坏性菜单项的「红字 + 二次确认」成对契约。
 *
 * 验收（主报告 §4.2 037）：点击 destructive 项 → 出现确认（含取消路径）；
 * 取消后状态不变。确认浮层出现在菜单之外的独立位置（Modal），需刻意关闭。
 */

test.describe("Destructive confirmation (HIG-AUD-037)", () => {
  test("破坏项先弹确认；取消后状态不变，确认后才执行", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("geist-theme-preference", "light");
    });
    await page.goto("/#/components/context-menu");
    await page.locator('[data-slot="navbar"]').first().waitFor({ state: "visible" });

    const card = page.getByRole("button", { name: "Notes", exact: true });
    await card.scrollIntoViewIfNeeded();
    const logLine = page.getByText("Long-press the card to reveal quick actions.", {
      exact: true,
    });
    await expect(logLine).toBeVisible();

    const menu = page.locator('[role="menu"]');
    const removeItem = menu.getByRole("menuitem", { name: "Remove App" });
    const dialog = page.locator('[role="dialog"]');

    // 1) 红字破坏项点击 → 菜单关闭、确认浮层出现（不直接执行）
    await card.click({ button: "right" });
    await expect(menu).toBeVisible();
    // 破坏性项保留红色语义（与组件契约一致）
    await expect(removeItem).toHaveCSS("color", "rgb(238, 0, 0)");
    await removeItem.click();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Remove App?")).toBeVisible();
    // 未确认前状态不变
    await expect(logLine).toBeVisible();

    // 2) 取消路径：浮层关闭，状态保持原样
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).not.toBeVisible();
    await expect(logLine).toBeVisible();

    // 3) 确认路径：执行并写入结果
    await card.click({ button: "right" });
    await menu.getByRole("menuitem", { name: "Remove App" }).click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Remove App" }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByText("Remove App", { exact: true })).toBeVisible();
  });

  test("ActivityView 破坏性操作同样先确认；取消后无副作用", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("geist-theme-preference", "light");
    });
    await page.goto("/#/components/activity-view");
    await page.locator('[data-slot="navbar"]').first().waitFor({ state: "visible" });

    const panel = page.locator('[data-slot="bottom-sheet"]');
    const dialog = page.locator('[role="dialog"]');
    const logLine = page.getByText("Nothing shared yet.", { exact: true });
    const openShare = async () => {
      await page.getByRole("button", { name: "Share", exact: true }).first().click();
      await expect(panel).toBeVisible();
    };

    // 1) 破坏性操作行点击 → 面板关闭（一次性活动）、确认浮层出现（不直接执行）
    await openShare();
    await panel.getByRole("button", { name: "Block User" }).click();
    await expect(panel).not.toBeVisible();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Block this user?")).toBeVisible();
    await expect(logLine).toBeVisible();

    // 2) 取消：无副作用
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).not.toBeVisible();
    await expect(logLine).toBeVisible();

    // 3) 确认：执行并写入结果
    await openShare();
    await panel.getByRole("button", { name: "Block User" }).click();
    await dialog.getByRole("button", { name: "Block User" }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByText("Block User", { exact: true })).toBeVisible();
  });
});
