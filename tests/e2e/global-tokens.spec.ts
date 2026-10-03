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
    const outsideButton = editor.getByRole("button", { name: "Blue", exact: true });
    const original = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--primary").trim(),
    );
    await editor.getByRole("button", { name: "Blue", exact: true }).click();
    await expect(button).toHaveCSS("background-color", "rgb(0, 112, 243)");
    await editor.getByRole("combobox", { name: "Feedback duration", exact: true }).click();
    await page.getByRole("option", { name: "500ms", exact: true }).click();
    await expect(button).toHaveCSS("transition-duration", "0.5s");
    await expect(outsideButton).toHaveCSS("transition-duration", "0.15s");
    expect(
      await page.evaluate(() => document.documentElement.style.getPropertyValue("--uni-duration-fast")),
    ).toBe("");
    expect(
      await page.evaluate(() => document.documentElement.style.getPropertyValue("--primary")),
    ).toBe("");
    await editor.getByRole("combobox", { name: "Radius", exact: true }).click();
    await page.getByRole("option", { name: "16px", exact: true }).click();
    await expect(preview).toHaveCSS("border-radius", "16px");
    await expect(editor.locator('[data-token-value="--radius"]')).toHaveText("16px");
    await editor.getByRole("button", { name: "Reset to theme", exact: true }).click();
    await expect(button).toHaveCSS("transition-duration", "0.15s");
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
    await editor.getByRole("combobox", { name: "Feedback duration", exact: true }).click();
    await page.getByRole("option", { name: "500ms", exact: true }).click();
    await expect(button).toHaveCSS("transition-duration", "0.5s");
    await expect(outsideButton).toHaveCSS("transition-duration", "0.5s");
    await page.evaluate(() => {
      document.documentElement.classList.toggle("dark");
      document.documentElement.dataset.theme = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    });
    await expect(editor.locator('[data-token-value="--primary"]')).toHaveText("#0b7a53");
    await editor.getByRole("button", { name: "Reset to theme", exact: true }).click();
    await expect(button).toHaveCSS("transition-duration", "0.15s");
    await expect(outsideButton).toHaveCSS("transition-duration", "0.15s");
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

  test(`responsive breakpoint remains a build configuration (${theme})`, async ({ page }) => {
    await page.addInitScript((theme) => {
      localStorage.setItem("unitary-docs-language", "en-US");
      localStorage.setItem("unitary-theme-preference", theme);
    }, theme);
    await page.goto("/#/tokens");
    await expect(page.locator('[data-token-name="--breakpoint-grid-md"]')).toContainText("Build mapping");
    await page.evaluate(() => {
      const probe = document.createElement("div");
      probe.dataset.breakpointProbe = "";
      probe.className = "max-grid-md:hidden";
      document.body.append(probe);
    });
    const probe = page.locator("[data-breakpoint-probe]");
    for (const width of [959, 960, 961]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(probe).toHaveCSS("display", width < 960 ? "none" : "block");
    }
    // 原生 CSS 写入也不会重新构建媒体查询。 / Native writes cannot rebuild queries either.
    await page.evaluate(() =>
      document.documentElement.style.setProperty("--breakpoint-grid-md", "100rem"),
    );
    await expect(probe).toHaveCSS("display", "block");
  });

  test(`catalog distinguishes deprecated and reserved entries (${theme})`, async ({ page }) => {
    await page.addInitScript((theme) => {
      localStorage.setItem("unitary-docs-language", "en-US");
      localStorage.setItem("unitary-theme-preference", theme);
    }, theme);
    await page.goto("/#/tokens");
    const search = page.getByRole("searchbox", { name: "Search tokens" });
    await search.fill("--radius-circle");
    const deprecated = page.locator('[data-token-name="--radius-circle"]');
    await expect(deprecated).toContainText("Deprecated");
    await expect(deprecated).toContainText("Prefer --radius-circular");
    await search.fill("--radius-continuous");
    await expect(page.locator('[data-token-name="--radius-continuous"]')).toContainText("Reserved");
    await search.fill("--uni-drawer-width");
    await expect(page.locator('[data-token-name="--uni-drawer-width"]')).toContainText("Layout");
  });
}
