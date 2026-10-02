import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"] as const) {
  for (const language of ["zh-CN", "en-US"] as const) {
    test(`custom content explains selection and switches badges (${theme}, ${language})`, async ({ page }) => {
      await page.addInitScript(({ theme, language }) => {
        localStorage.setItem("unitary-theme-preference", theme);
        localStorage.setItem("unitary-docs-language", language);
      }, { theme, language });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/#/components/choicebox");
      const card = page.locator('[data-demo-card="custom-content"]');
      const section = page.locator('section[data-slot="docs-prose-section"]').filter({ has: card });
      await expect(section.locator(':scope > [data-slot="docs-prose-paragraph"]')).toHaveText(
        language === "zh-CN"
          ? "自定义内容（图标、徽章等）仅在选中该项时渲染，未选中的卡片不显示。"
          : "Custom content (icons, badges) renders only while the option is selected; unselected tiles stay plain.",
      );
      const trial = card.locator('[data-slot="badge"][data-variant="trial"]');
      await expect(trial).toHaveText("Trial");
      expect(await trial.evaluate((element) => getComputedStyle(element).backgroundImage)).toContain("linear-gradient");
      await expect(card.locator('[data-slot="badge"]')).toHaveCount(1);
      await card.getByText("Get started now", { exact: true }).click();
      await expect(trial).toHaveCount(0);
      await expect(card.locator('[data-slot="badge"][data-variant="blue"]')).toHaveText("Pro");
      await card.getByText("Free for two weeks", { exact: true }).click();
      await expect(trial).toHaveCount(1);
      await card.getByRole("button", { name: language === "zh-CN" ? "显示代码" : "Show code" }).click();
      await expect(card.locator('pre')).toContainText('variant="trial"');
    });
  }
}
