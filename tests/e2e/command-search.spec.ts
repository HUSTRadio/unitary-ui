import { expect, test, type Page } from "@playwright/test";

async function openHome(page: Page, lang: "zh-CN" | "en-US") {
  await page.addInitScript((l) => {
    window.localStorage.setItem("unitary-docs-language", l);
    window.localStorage.setItem("unitary-theme-preference", "light");
  }, lang);
  await page.goto("/#/components");
  await page.waitForSelector('[data-slot="navbar"]');
}

async function openCommandMenu(page: Page) {
  await page.keyboard.press("Control+k");
  const input = page.getByRole("combobox");
  await expect(input).toBeVisible();
  return input;
}

async function searchAndSelect(page: Page, term: string, expectedHeading: RegExp) {
  const input = await openCommandMenu(page);
  await input.fill(term);
  const option = page.getByRole("option").first();
  await expect(option).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(expectedHeading);
}

test("english search: typeahead, arrow keys, and enter navigate", async ({ page }) => {
  await openHome(page, "en-US");
  await searchAndSelect(page, "status dot", /Status Dot/i);
  // keyboard-only second query from a detail page
  const input = await openCommandMenu(page);
  await input.fill("table");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Table/i);
});

test("chinese search finds the same routes while ui is zh-CN", async ({ page }) => {
  await openHome(page, "zh-CN");
  await searchAndSelect(page, "状态圆点", /状态圆点/);
  const input = await openCommandMenu(page);
  await input.fill("表格");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/表格/);
});

test("english search still works after switching ui to zh-CN", async ({ page }) => {
  await openHome(page, "zh-CN");
  const input = await openCommandMenu(page);
  await input.fill("toast");
  const selected = page.locator('[role="option"][data-selected="true"]');
  await expect(selected).toHaveText("轻提示");
  await expect(page.getByRole("option").first()).toHaveText("轻提示");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/轻提示/);
});

test("chinese search works while the ui is en-US", async ({ page }) => {
  await openHome(page, "en-US");
  await searchAndSelect(page, "表格", /Table/i);
});

test("unknown term shows an empty state and escapes cleanly", async ({ page }) => {
  await openHome(page, "en-US");
  const input = await openCommandMenu(page);
  await input.fill("zzzznotacomponent");
  await expect(page.getByRole("option")).toHaveCount(0);
  const empty = page.getByRole("status");
  await expect(empty).toHaveText('No results found for "zzzznotacomponent".');
  await expect(empty).toHaveAttribute("aria-live", "polite");
  await expect(empty).toHaveAttribute("aria-atomic", "true");
  await expect(input).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});
