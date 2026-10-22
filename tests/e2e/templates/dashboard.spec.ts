import { expect, test } from "@playwright/test";
import { copy, navigation } from "../../../templates/dashboard/src/content";
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
      test(`dashboard layout ${locale} ${theme} ${viewport.width}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await preferences(page, "dashboard", locale, theme);
        for (const route of navigation) {
          await page.goto(`/#${route.to}`);
          await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
          await layout(page, locale, theme);
        }
        await mobileNavigation(page, copy[locale].navigation);
      });
    }
for (const locale of languages)
  test(`search, filter, paging, details and settings ${locale}`, async ({ page }) => {
    const text = copy[locale];
    await preferences(page, "dashboard", locale, "light");
    await page.goto("/#/projects");
    await expect(page.locator("tbody tr")).toHaveCount(5);
    await page
      .getByRole("button", { name: locale === "en" ? "Go to page 3" : "转到第 3 页", exact: true })
      .click();
    await expect(page.locator("tbody tr")).toHaveCount(2);
    await page.getByLabel(text.search, { exact: true }).fill("Atlas");
    await expect(page.locator("tbody tr")).toHaveCount(1);
    const project = page.getByRole("button", { name: "Atlas", exact: true });
    await project.click();
    await expect(page.getByRole("dialog")).toContainText("Alex");
    await page.keyboard.press("Escape");
    await expect(project).toBeFocused();
    await page.getByLabel(text.search, { exact: true }).fill("");
    await page.getByRole("combobox", { name: text.status, exact: true }).click();
    await page.getByRole("option", { name: text.archived, exact: true }).click();
    await expect(page.locator("tbody tr")).toHaveCount(2);
    await page.getByLabel(text.search, { exact: true }).fill("no-such-project");
    await expect(page.getByText(text.empty, { exact: true })).toBeVisible();
    await page.getByRole("button", { name: text.clear, exact: true }).click();
    await expect(page.locator("tbody tr")).toHaveCount(5);
    await page.goto("/#/settings");
    await page.getByLabel(text.workspaceName, { exact: true }).fill("A new team");
    await page.getByRole("button", { name: text.save, exact: true }).click();
    await expect(page.getByRole("status")).toHaveText(text.saved);
    await page.getByRole("link", { name: text.projects, exact: true }).first().click();
    await page.getByRole("link", { name: text.settings, exact: true }).first().click();
    await expect(page.getByLabel(text.workspaceName, { exact: true })).toHaveValue("A new team");
  });
test("portable package dashboard", async ({ page }) => {
  await packageSmoke(page, "dashboard");
});
test("dashboard language and theme switches", async ({ page }) => {
  await switchPreferences(page, "dashboard");
});
