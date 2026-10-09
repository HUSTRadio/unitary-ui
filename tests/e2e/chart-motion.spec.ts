import { expect, test } from "@playwright/test";
import { getComponentDocsPath } from "../../docs/site/src/data/docs-routes";

for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 1440]) {
    for (const chart of ["area-chart", "bar-chart", "line-chart", "combo-chart"]) {
      test(`${chart} Tooltip uses scoped nonlinear CSS and stops under reduced motion (${theme}, ${width}px)`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await page.addInitScript(value => {
          localStorage.setItem("unitary-docs-language", "en-US");
          localStorage.setItem("unitary-theme-preference", value);
        }, theme);
        await page.goto(`/#${getComponentDocsPath(chart)}`);
        const plot = page.locator(".recharts-wrapper").first();
        await plot.scrollIntoViewIfNeeded();
        const tooltip = plot.locator(".recharts-tooltip-wrapper");
        await expect(tooltip).toHaveCount(1);
        await expect(tooltip).toHaveCSS("transition-property", "transform");
        await expect(tooltip).toHaveCSS("transition-duration", "0.15s");
        await expect(tooltip).toHaveCSS("transition-timing-function", "cubic-bezier(0.22, 1, 0.36, 1)");
        await plot.evaluate(element => {
          const scope = element.closest<HTMLElement>("[data-demo-container]")!;
          scope.style.setProperty("--uni-motion-feedback", ".4s");
          scope.style.setProperty("--ease-snap", "cubic-bezier(.2,0,.3,1)");
        });
        await expect(tooltip).toHaveCSS("transition-duration", "0.4s");
        await expect(tooltip).toHaveCSS("transition-timing-function", "cubic-bezier(0.2, 0, 0.3, 1)");
        await page.emulateMedia({ reducedMotion: "reduce" });
        await expect(tooltip).toHaveCSS("transition-property", "none");
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await expect(tooltip).toHaveCSS("transition-property", "transform");
        await expect(tooltip).toHaveCSS("transition-duration", "0.4s");
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      });
    }
  }
}
