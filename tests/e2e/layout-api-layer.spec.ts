import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 768, 1440]) {
    test(`Grid code pairs at ${width} in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(({ theme }) => {
        localStorage.setItem("unitary-docs-language", "en-US");
        localStorage.setItem("unitary-theme-preference", theme);
      }, { theme });
      await page.goto("/#/layout/grid");
      await expect(page.locator("#main-content h1")).toHaveText("Grid");
      const sections = page.locator('[data-grid-demo]:not([data-grid-demo="best-practices"])');
      await expect(sections).toHaveCount(12);
      for (const section of await sections.all()) {
        const button = section.getByRole("button", { name: "Show code", exact: true });
        await button.click();
        await expect(button).toHaveAttribute("aria-expanded", "true");
        await expect(section.locator("pre")).toContainText("@/components/ui/grid");
        await expect(section.locator("pre")).toContainText("Grid");
        if (theme === "light" && width === 390) {
          await section.getByRole("button", { name: "Copy to clipboard", exact: true }).click();
          expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("@/components/ui/grid");
        }
        await button.click();
        await expect(button).toHaveAttribute("aria-expanded", "false");
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    });
  }

  test(`Layer stacking and open portal updates in ${theme}`, async ({ page }) => {
    await page.addInitScript(({ theme }) => {
      localStorage.setItem("unitary-docs-language", "en-US");
      localStorage.setItem("unitary-theme-preference", theme);
    }, { theme });
    await page.goto("/#/layout/layer");
    await expect(page.locator("#main-content h1")).toHaveText("Layer");
    const overlap = async () => page.locator('[data-layer-hit="popover"]').evaluate((surface) => {
      const box = surface.getBoundingClientRect();
      return document.elementFromPoint(box.left + 8, box.top + 8)?.closest("[data-layer-hit]")?.getAttribute("data-layer-hit");
    });
    await page.locator('[data-layer-hit="popover"]').scrollIntoViewIfNeeded();
    expect(await overlap()).toBe("popover");
    await page.getByRole("button", { name: "Toggle header level" }).click();
    expect(await overlap()).toBe("header");
    const scoped = page.locator('[data-layer-demo="scoped"]');
    await scoped.getByRole("combobox").click();
    const popup = page.getByRole("listbox");
    await expect(popup).toBeVisible();
    const wrapperLevel = () => popup.evaluate((node) => getComputedStyle(node.closest('[data-radix-popper-content-wrapper]')!).zIndex);
    expect(await wrapperLevel()).toBe("2100");
    // Programmatic click changes state without dismissing the open popup first.
    await scoped.getByRole("button", { name: "Change open popup level", includeHidden: true }).evaluate((button: HTMLButtonElement) => button.click());
    await expect.poll(wrapperLevel).toBe("2200");
    await expect(popup).toBeVisible();
    await page.keyboard.press("Escape");
    await page.locator('[data-layer-demo="independent"]').getByRole("combobox").click();
    await expect.poll(wrapperLevel).toBe("2001");
    await page.evaluate(() => document.documentElement.style.setProperty("--uni-z-popover", "2300"));
    await expect.poll(wrapperLevel).toBe("2300");
    await page.evaluate(() => document.documentElement.style.removeProperty("--uni-z-popover"));
    await expect.poll(wrapperLevel).toBe("2001");
    await page.keyboard.press("Escape");
    await expect(page.locator('[data-layer-demo="portal-target"] [data-slot="layer-portal"]')).toBeVisible();
  });
}

test("API navigation and directory links use their canonical categories", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("unitary-docs-language", "en-US"));
  await page.goto("/#/api");
  await expect(page.locator("#main-content h1")).toHaveText("API Overview");
  await page.locator('[data-api-directory="Design tokens"]').getByRole("link").click();
  await expect(page).toHaveURL(/#\/api\/tokens$/);
  await expect(page.locator("#main-content h1")).toHaveText("Global Tokens");
  await page.goto("/#/api/state-and-events");
  await expect(page.locator("#main-content h1")).toHaveText("State & Events");
  await page.goto("/#/components");
  for (const name of ["grid", "flex", "safe-area", "layer", "prefetch", "lazy-load", "area-chart"]) {
    await expect(page.locator(`#main-content a[data-slot="docs-card"][href$="/${name}"]`)).toHaveCount(0);
  }
});

for (const language of ["zh-CN", "en-US"] as const) {
  for (const theme of ["light", "dark"] as const) {
    for (const width of [390, 1440]) {
      test(`layout and API pages (${language}, ${theme}, ${width})`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 900 });
        await page.addInitScript(({ language, theme }) => {
          localStorage.setItem("unitary-docs-language", language);
          localStorage.setItem("unitary-theme-preference", theme);
        }, { language, theme });
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        for (const route of ["/layout/flex", "/layout/safe-area", "/layout/layer", "/api", "/api/state-and-events", "/api/tokens"]) {
          await page.goto(`/#${route}`);
          await expect(page.locator("#main-content h1")).toBeVisible();
          await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
          if (route === "/layout/layer") await page.screenshot({ path: testInfo.outputPath("layer.png") });
        }
        expect(errors).toEqual([]);
      });
    }
  }
}

for (const language of ["zh-CN", "en-US"]) {
  test(`Calendar documentation renders after layer integration (${language})`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(`/?lang=${language}#/components/calendar`);
    await expect(page.locator('[data-demo-card="default"]')).toBeVisible();
    await expect(page.locator('[data-slot="page-render-error"]')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
