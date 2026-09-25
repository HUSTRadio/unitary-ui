import { expect, test, type Locator, type Page } from "@playwright/test";

const themes = ["light", "dark"] as const;
const heights = [700, 320] as const;

type Surface = "command" | "modal" | "destructive";

async function openSurface(page: Page, surface: Surface, theme: (typeof themes)[number]) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript((value) => {
    localStorage.setItem("geist-theme-preference", value);
    localStorage.setItem("geist-docs-language", "en-US");
  }, theme);
  const demo = {
    command: { route: "command-menu", card: "with-suffix", button: "Open Command Menu" },
    modal: { route: "modal", card: "sticky", button: "Open Modal" },
    destructive: {
      route: "destructive-action-modal",
      card: "With error",
      button: "Delete Project",
    },
  }[surface];
  await page.setViewportSize({ width: 390, height: heights[0] });
  await page.goto(`/#/components/${demo.route}`);
  await page.locator(`[data-demo-card="${demo.card}"]`).getByRole("button", { name: demo.button }).click();
  const selector = {
    command: '[data-slot="command-menu-content"]',
    modal: '[data-slot="modal-content"]',
    destructive: '[data-slot="destructive-action-modal"]',
  }[surface];
  const dialog = page.locator(selector);
  await expect(dialog).toBeVisible();
  return dialog;
}

async function checkViewport(page: Page, dialog: Locator, surface: Surface, height: number) {
  await page.setViewportSize({ width: 390, height });
  await expect.poll(() => dialog.evaluate((element) => Math.round(element.getBoundingClientRect().height))).toBeLessThanOrEqual(Math.round(height * 0.8) + 1);
  const geometry = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const css = getComputedStyle(element);
    return { top: rect.top, bottom: rect.bottom, height: rect.height, maxHeight: css.maxHeight, actualHeight: css.height };
  });
  expect(geometry.top, `${surface} should stay inside the visible viewport`).toBeGreaterThanOrEqual(-1);
  expect(geometry.bottom, `${surface} should stay inside the visible viewport`).toBeLessThanOrEqual(height + 1);
  expect(parseFloat(geometry.maxHeight)).toBeCloseTo(Math.min(800, height * 0.8), 0);
  if (surface === "command") expect(parseFloat(geometry.actualHeight)).toBeCloseTo(height * 0.8, 0);
  return geometry;
}

for (const theme of themes) {
  for (const surface of ["command", "modal", "destructive"] as const) {
    test(`${surface} follows the mobile visible viewport (${theme})`, async ({ page }) => {
      const dialog = await openSurface(page, surface, theme);
      expect(await page.evaluate(() => CSS.supports("height", "100dvh"))).toBe(true);
      const expanded = await checkViewport(page, dialog, surface, heights[0]);
      const compact = await checkViewport(page, dialog, surface, heights[1]);
      expect(compact.height).toBeLessThan(expanded.height);
      const scrollArea = surface === "modal" ? dialog.locator(":scope > div").first() : dialog;
      if (surface !== "destructive") {
        const scrollable = await scrollArea.evaluate((element) => element.scrollHeight > element.clientHeight);
        expect(scrollable, `${surface} should scroll when the viewport shrinks`).toBe(true);
        await scrollArea.evaluate((element) => { element.scrollTop = element.scrollHeight; });
        expect(await scrollArea.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
      }
    });
  }
}
