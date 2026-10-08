import { expect, test, type Page } from "@playwright/test";

/**
 * HIG-AUD-016 运行验收（仅用键盘走完流程）：
 * ① `role="dialog"` 有可访问名称；② Tab 能进入面板遍历行与操作；③ Tab 能离开面板（不被锁住）。
 */
async function goto(page: Page, route: string) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.addInitScript(() => {
    window.localStorage.setItem("unitary-docs-language", "en-US");
    window.localStorage.setItem("unitary-theme-preference", "light");
  });
  await page.goto(route);
  await page.locator('[data-slot="navbar"]').first().waitFor({ state: "visible" });
}

test("keyboard-only: named dialog, Tab reaches rows, Tab leaves the panel", async ({ page }) => {
  await goto(page, "/#/components/multi-select");

  const trigger = page.locator('[data-slot="multi-select-trigger"]').first();
  await trigger.focus();
  await page.keyboard.press("Enter");

  const dialog = page.locator('[role="dialog"]').first();
  await expect(dialog).toBeVisible();
  // ① 对话框有可访问名称（缺省为本地化的通用名称）
  await expect(dialog).toHaveAttribute("aria-label", /Select options|选择选项/);

  const focusState = () =>
    page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return {
        inside: el?.closest('[data-slot="multi-select-content"]') !== null,
        slot: el?.closest("[data-slot]")?.getAttribute("data-slot") ?? el?.tagName.toLowerCase(),
      };
    });

  // ② / ③ Tab 逐格前进：先进面板内部，最终离开面板
  const trail: Array<{ inside: boolean; slot: string | undefined }> = [];
  for (let i = 0; i < 12; i += 1) {
    await page.keyboard.press("Tab");
    const state = await focusState();
    trail.push(state);
    if (!state.inside) break;
    // 边缘 Tab 已关闭面板后，等待退场 presence 与焦点归还，再判定是否离开。
    if ((await trigger.getAttribute("data-state")) === "closed") {
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
      trail.push(await focusState());
      break;
    }
  }

  expect(trail.some((step) => step.inside), `Tab 应能进入面板：${JSON.stringify(trail)}`).toBe(true);
  expect(
    trail.at(-1)?.inside,
    `Tab 最终应离开面板（不被 Tab 循环锁住）：${JSON.stringify(trail)}`,
  ).toBe(false);
});
