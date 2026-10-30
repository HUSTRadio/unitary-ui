import { expect, test } from "@playwright/test";

const card = (page: import("@playwright/test").Page) => page.locator('[data-demo-card="follow"]');

test.describe("log view follow behaviour", () => {
  test("sticks to the newest entry and pauses when the reader scrolls up", async ({ page }) => {
    await page.goto("/#/components/log-view");
    const demo = card(page);
    await demo.scrollIntoViewIfNeeded();

    const view = demo.locator('[data-slot="log-view"]');
    const scroller = demo.locator('[data-slot="log-view-scroller"]');
    await expect(view).toHaveAttribute("data-following", "true");

    const append = demo.getByRole("button", { name: "Append log" });
    await append.click();
    await append.click();

    await expect(demo.locator('[data-slot="log-view-row"]')).toHaveCount(42);

    const atBottom = await scroller.evaluate((element) => {
      const el = element as HTMLElement;
      return el.scrollHeight - el.scrollTop - el.clientHeight <= 8;
    });
    expect(atBottom).toBe(true);

    // 手动上滚：暂停跟随并给出「跳到最新」。
    await scroller.evaluate((element) => {
      const el = element as HTMLElement;
      el.scrollTop = 0;
      el.dispatchEvent(new Event("scroll", { bubbles: false }));
    });
    await expect(view).toHaveAttribute("data-following", "false");
    const jump = demo.locator('[data-slot="log-view-jump"]');
    await expect(jump).toBeVisible();

    // 新日志到达时不再自动贴底。
    await append.click();
    const stillTop = await scroller.evaluate((element) => (element as HTMLElement).scrollTop);
    expect(stillTop).toBe(0);

    await jump.click();
    await expect(view).toHaveAttribute("data-following", "true");
    const backAtBottom = await scroller.evaluate((element) => {
      const el = element as HTMLElement;
      return el.scrollHeight - el.scrollTop - el.clientHeight <= 8;
    });
    expect(backAtBottom).toBe(true);
  });

  test("filters by severity and exports the visible rows", async ({ page }) => {
    await page.goto("/#/components/log-view");
    const demo = card(page);
    await demo.scrollIntoViewIfNeeded();

    const total = await demo.locator('[data-slot="log-view-row"]').count();
    expect(total).toBeGreaterThan(20);

    await demo.locator('[data-slot="log-view-level"][data-level="warn"]').click();
    await expect(demo.locator('[data-slot="log-view"]')).toHaveAttribute('data-level', 'warn');

    const levels = await demo
      .locator('[data-slot="log-view-row"]')
      .evaluateAll((rows) => rows.map((row) => row.getAttribute('data-level')));
    expect(levels.length).toBeGreaterThan(0);
    expect(levels.length).toBeLessThan(total);
    expect(levels.every((level) => level === 'warn' || level === 'error')).toBe(true);

    await demo.locator('[data-slot="log-view-level"][data-level="all"]').click();
    await expect(demo.locator('[data-slot="log-view-row"]')).toHaveCount(total);
  });
});
