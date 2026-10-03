import { test, expect } from "@playwright/test";
test.setTimeout(60_000);

for (const theme of ["light", "dark"] as const) {
  test(`global token editor and catalog (${theme})`, async ({ page }) => {
    await page.addInitScript((theme) => {
      localStorage.setItem("unitary-docs-language", "en-US");
      localStorage.setItem("unitary-theme-preference", theme);
    }, theme);
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/#/tokens");
    const editor = page.locator("[data-token-editor]");
    const preview = editor.locator("[data-token-preview]");
    const button = preview.getByRole("button", { name: "Preview button" });
    const original = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--primary").trim(),
    );
    await editor.getByRole("button", { name: "Blue", exact: true }).click();
    await expect(button).toHaveCSS("background-color", "rgb(0, 112, 243)");
    expect(
      await page.evaluate(() => document.documentElement.style.getPropertyValue("--primary")),
    ).toBe("");
    await editor.getByRole("combobox", { name: "Radius", exact: true }).click();
    await page.getByRole("option", { name: "16px", exact: true }).click();
    await expect(preview).toHaveCSS("border-radius", "16px");
    await expect(editor.locator('[data-token-value="--radius"]')).toHaveText("16px");
    await editor.getByRole("button", { name: "Reset to theme", exact: true }).click();
    await expect(button).not.toHaveCSS("background-color", "rgb(0, 112, 243)");
    await expect(editor.getByRole("combobox", { name: "Radius", exact: true })).toContainText(
      "Choose radius",
    );
    await editor.getByRole("combobox", { name: "Radius", exact: true }).click();
    await page.getByRole("option", { name: "16px", exact: true }).click();
    await expect(preview).toHaveCSS("border-radius", "16px");
    await editor.getByRole("button", { name: "Reset to theme", exact: true }).click();
    await editor.getByRole("combobox", { name: "Scope", exact: true }).click();
    await page.getByRole("option", { name: "Entire page", exact: true }).click();
    await editor.getByRole("button", { name: "Green", exact: true }).click();
    expect(
      await page.evaluate(() => document.documentElement.style.getPropertyValue("--primary")),
    ).toBe("#0b7a53");
    await expect(editor.locator('[data-token-value="--primary"]')).toHaveText("#0b7a53");
    await page.evaluate(() => {
      document.documentElement.classList.toggle("dark");
      document.documentElement.dataset.theme = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    });
    await expect(editor.locator('[data-token-value="--primary"]')).toHaveText("#0b7a53");
    await editor.getByRole("button", { name: "Reset to theme", exact: true }).click();
    const afterReset = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--primary").trim(),
    );
    expect(afterReset).not.toBe(original);
    await expect(editor.locator('[data-token-value="--primary"]')).toHaveText(afterReset);
    await page.getByRole("searchbox", { name: "Search tokens" }).fill("--uni-duration-fast");
    await expect(page.locator("[data-token-name]")).toHaveCount(3);
    await expect(page.locator('[data-token-name="--uni-duration-fast"]')).toContainText("150ms");
    await page.getByRole("searchbox", { name: "Search tokens" }).fill("does-not-exist");
    await expect(page.locator("[data-token-name]")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await page.evaluate((theme) => {
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.dataset.theme = theme;
    }, theme);
    await page.setViewportSize({ width: 1280, height: 900 });
    await editor.screenshot({ path: `.scratch/global-tokens/${theme}.png` });
  });
}
