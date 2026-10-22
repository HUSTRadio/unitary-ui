import { expect, test } from "@playwright/test";
import { copy } from "../../../templates/homepage/src/content";
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
      test(`homepage layout ${locale} ${theme} ${viewport.width}`, async ({ page }) => {
        const text = copy[locale];
        await page.setViewportSize(viewport);
        await preferences(page, "homepage", locale, theme);
        await page.goto("/");
        const label = page
          .getByRole("button", { name: text.start, exact: true })
          .first()
          .locator(":scope > span")
          .first();
        expect(
          await label.evaluate(
            (element) =>
              element.getBoundingClientRect().height <=
              parseFloat(getComputedStyle(element).lineHeight) + 1,
          ),
        ).toBe(true);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(copy[locale].title);
        await layout(page, locale, theme);
        await mobileNavigation(page, copy[locale].navigation);
      });
    }
for (const locale of languages)
  test(`pricing, FAQ, trial validation and focus ${locale}`, async ({ page }) => {
    const text = copy[locale];
    await preferences(page, "homepage", locale, "light");
    await page.goto("/");
    const starter = page.locator("#pricing article").first();
    const before = await starter.textContent();
    await page.getByRole("tab", { name: text.yearly }).click();
    expect(await starter.textContent()).not.toBe(before);
    const faq = page.locator("#faq button").first();
    await faq.click();
    await expect(faq).toHaveAttribute("aria-expanded", "true");
    const trigger = page.getByRole("button", { name: `${text.choose} Starter`, exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("Starter");
    await dialog.getByRole("button", { name: text.submit, exact: true }).click();
    await expect(dialog.getByRole("status")).not.toBeVisible();
    await dialog.getByLabel(text.name, { exact: true }).fill("Alex");
    await dialog.getByLabel(text.email).fill("alex@example.com");
    await dialog.getByRole("button", { name: text.submit, exact: true }).click();
    await expect(dialog.getByRole("status")).toHaveText(text.done);
    await dialog.getByRole("button", { name: text.close, exact: true }).click();
    await expect(trigger).toBeFocused();
  });
test("portable package homepage", async ({ page }) => {
  await packageSmoke(page, "homepage");
});
test("homepage language and theme switches", async ({ page }) => {
  await switchPreferences(page, "homepage");
});
