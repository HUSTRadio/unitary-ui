import { expect, test } from "@playwright/test";
import { documentRegistry } from "../../../templates/docs/src/documents";
import {
  languages,
  LAYOUT_THEMES,
  LAYOUT_VIEWPORTS,
  layout,
  mobileNavigation,
  packageSmoke,
  preferences,
  switchPreferences,
} from "./helpers";

for (const locale of languages)
  for (const theme of LAYOUT_THEMES)
    for (const viewport of LAYOUT_VIEWPORTS) {
      test(`docs layout ${locale} ${theme} ${viewport.width}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await preferences(page, "docs", locale, theme);
        for (const document of documentRegistry) {
          await page.goto(`/#/${document.id}`);
          await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
          await layout(page, locale, theme);
        }
        await mobileNavigation(page, locale === "en" ? "Documentation navigation" : "文档导航");
      });
    }
for (const locale of languages)
  test(`Markdown, search, heading links and copy ${locale}`, async ({ page }) => {
    await preferences(page, "docs", locale, "light");
    await page.goto("/#/introduction");
    await expect(page.getByRole("table")).toBeVisible();
    const search = page.getByRole("button", {
      name: locale === "en" ? "Search documentation" : "搜索文档",
      exact: true,
    });
    await search.click();
    const input = page.getByRole("combobox");
    await input.fill("weeklyDigest");
    await page
      .getByRole("option", { name: locale === "en" ? "Configuration" : "配置指南", exact: true })
      .click();
    await expect(page).toHaveURL(/#\/configuration$/);
    await expect(page.getByRole("dialog")).not.toBeVisible();
    const outline = page.getByRole("complementary", {
      name: locale === "en" ? "On this page" : "本页目录",
    });
    await outline.getByRole("link").first().click();
    await expect(page).toHaveURL(/#\/configuration#/);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      locale === "en" ? "Configuration" : "配置指南",
    );
    await page.locator('[data-slot="code-block"] button').first().click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain('"weeklyDigest": true');
    await page
      .getByRole("link", { name: /FAQ|常见问题/ })
      .last()
      .click();
    await expect(page).toHaveURL(/#\/faq$/);
    await search.click();
    await page.keyboard.press("Escape");
    await expect(search).toBeFocused();
  });
test("portable package docs", async ({ page }) => {
  await packageSmoke(page, "docs");
});
test("docs language and theme switches", async ({ page }) => {
  await switchPreferences(page, "docs");
});
