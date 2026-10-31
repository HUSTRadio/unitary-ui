import { expect, test } from "@playwright/test";

const card = (page: import("@playwright/test").Page) => page.locator('[data-demo-card="editing"]');

test.describe("data table cell editing", () => {
  test("commits a double-click edit and reports the change", async ({ page }) => {
    await page.goto("/#/components/data-table");
    const demo = card(page);
    await demo.scrollIntoViewIfNeeded();

    const firstNote = demo.locator('tbody tr[data-row-index="0"] td').nth(1);
    await firstNote.dblclick();

    const editor = demo.locator('[data-slot="data-table-editor"]');
    await expect(editor).toBeVisible();
    await editor.fill("edited in the browser");
    await editor.press("Tab");

    await expect(editor).toHaveCount(0);
    await expect(firstNote).toContainText("edited in the browser");
    await expect(demo.locator("[data-demo-status]")).toContainText("Saved 1 change");
  });

  test("blocks an invalid edit and cancels with Escape", async ({ page }) => {
    await page.goto("/#/components/data-table");
    const demo = card(page);
    await demo.scrollIntoViewIfNeeded();

    const firstNote = demo.locator('tbody tr[data-row-index="0"] td').nth(1);
    const before = (await firstNote.textContent())?.trim();
    await firstNote.dblclick();

    const editor = demo.locator('[data-slot="data-table-editor"]');
    await editor.fill("   ");
    await editor.press("Tab");

    // 校验失败：编辑态保留并给出错误，状态行不变。
    await expect(editor).toBeVisible();
    await expect(demo.locator('[data-slot="data-table-cell-error"]')).toContainText("Note is required");
    await expect(demo.locator("[data-demo-status]")).toContainText("Saved 0 changes");

    await editor.press("Escape");
    await expect(editor).toHaveCount(0);
    await expect(firstNote).toContainText(before ?? "");
  });
});
