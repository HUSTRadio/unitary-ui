import { expect, test, type Page } from "@playwright/test";

test.setTimeout(60_000);

/**
 * HIG-AUD-033：Combobox 面板曾自写字面量阴影，与 select / menu 浮层材质不一致。
 * 验收口径是「Popover 族面板阴影 computed 值同源」，所以这里直接比较真实浏览器里
 * Combobox 与 Select 面板的 computed box-shadow，而不是断言源码里的类名。
 */
/**
 * Tailwind 的 `shadow-[…]` 会把值写进 `--tw-shadow`，再与 inset / ring 槽位组合成
 * `box-shadow`，因此 computed 值前面会多出四个全透明零层；`material-menu` utility
 * 是直接赋值。为保证「同源」判定比较的是真实生效的阴影层，这里剔除透明零层。
 */
function effectiveShadow(value: string) {
  return value
    .split(/,\s*(?![^(]*\))/)
    .map((layer) => layer.trim())
    .filter((layer) => layer !== "rgba(0, 0, 0, 0) 0px 0px 0px 0px")
    .join(", ");
}

async function openWithTheme(page: Page, theme: "light" | "dark") {
  await page.addInitScript((preferredTheme) => {
    localStorage.setItem("geist-docs-language", "en-US");
    localStorage.setItem("geist-theme-preference", preferredTheme);
  }, theme);
}

/** 打开页面首个 Combobox 面板，返回其 computed box-shadow。 */
async function comboboxPanelShadow(page: Page) {
  await page.goto("/#/components/combobox");
  const input = page.locator('[data-slot="combobox-root"] [role="searchbox"]').first();
  await input.click();
  const panel = page.locator('[data-slot="combobox-content"]:visible').first();
  await expect(panel).toBeVisible();
  return panel.evaluate((node) => getComputedStyle(node).boxShadow);
}

/** 打开 Select 页面首个面板，返回其 computed box-shadow 作为材质基准。 */
async function selectPanelShadow(page: Page) {
  await page.goto("/#/components/select");
  const trigger = page.locator('[data-slot="select-content"]').first();
  await page.locator('[data-slot="select-trigger"]').first().click();
  await expect(trigger).toBeVisible();
  return trigger.evaluate((node) => getComputedStyle(node).boxShadow);
}

for (const theme of ["light", "dark"] as const) {
  test(`Combobox panel shares the popover material shadow (${theme})`, async ({ page }) => {
    await openWithTheme(page, theme);

    const comboboxShadow = effectiveShadow(await comboboxPanelShadow(page));
    expect(comboboxShadow).not.toBe("none");

    const selectShadow = effectiveShadow(await selectPanelShadow(page));
    // 同源：面板阴影逐层一致（含双主题 1px 描边色）
    expect(comboboxShadow).toBe(selectShadow);
    // 材质 token 的双主题差异必须真实生效（浅色白描边 / 暗色黑描边）
    expect(comboboxShadow).toContain(
      theme === "light" ? "rgb(250, 250, 250) 0px 0px 0px 1px" : "rgb(0, 0, 0) 0px 0px 0px 1px",
    );
  });
}
