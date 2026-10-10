import { chromium, expect, test, type Locator, type Page } from "@playwright/test";
import TurndownService from "turndown";
import { extractMainHtml } from "../../scripts/lib/llm-html";

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 375, height: 812 },
] as const;

async function extractMarkdown(page: Page) {
  const html = await page.evaluate(extractMainHtml);
  const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
  turndown.keep(["table"]);
  return { html, markdown: turndown.turndown(html) };
}

async function visibleTruncateText(item: Locator) {
  return item.evaluate((element) =>
    Array.from(element.childNodes)
      .filter((node) => !(node instanceof Element && node.classList.contains("sr-only")))
      .map((node) => node.textContent)
      .join(""),
  );
}

for (const locale of ["zh-CN", "en-US"] as const) {
  for (const theme of ["light", "dark"] as const) {
    for (const viewport of VIEWPORTS) {
      const combination = `${locale}, ${theme}, ${viewport.width}px`;

      test(`Chart corpus is stable across real tooltip payloads (${combination})`, async ({
        baseURL,
      }) => {
        const browser = await chromium.launch();
        try {
          const context = await browser.newContext({ viewport, locale: "en-US" });
          const page = await context.newPage();
          await page.addInitScript((value) => {
            localStorage.setItem("unitary-theme-preference", value);
          }, theme);
          await page.goto(`${baseURL}/?lang=${locale}#/charts`, {
            waitUntil: "domcontentloaded",
          });
          const heading = locale === "zh-CN" ? "图表" : "Charts";
          await expect(page.locator("#main-content h1")).toHaveText(heading);
          await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
          const plot = page.locator('[data-demo-component="area-chart"] .recharts-wrapper');
          await expect(plot).toBeVisible();
          await page.evaluate(() => document.fonts.ready);
          await plot.scrollIntoViewIfNeeded();
          const tooltip = plot.locator(".recharts-tooltip-wrapper");
          const legend = plot.locator(".recharts-legend-wrapper");
          await expect(legend).toContainText("visitors");
          await expect(legend).toContainText("pageviews");
          await page.mouse.move(0, 0);
          await expect(tooltip).toBeEmpty();
          const baseline = await extractMarkdown(page);
          expect(baseline.markdown).toContain(`# ${heading}`);
          expect(baseline.markdown).toContain("Visitor analytics");
          expect(baseline.markdown).toContain("visitors");
          expect(baseline.markdown).toContain("pageviews");

          const payloads: string[] = [];
          for (const { month, visitors, pageviews } of [
            { month: "Jan", visitors: "2.9K", pageviews: "4.2K" },
            { month: "Jun", visitors: "3.8K", pageviews: "5.9K" },
          ]) {
            const tick = plot
              .locator(".recharts-xAxis .recharts-cartesian-axis-tick-value")
              .filter({ hasText: new RegExp(`^${month}$`) });
            const tickBox = await tick.boundingBox();
            const plotBox = await plot.boundingBox();
            expect(tickBox).not.toBeNull();
            expect(plotBox).not.toBeNull();
            await page.mouse.move(
              tickBox!.x + tickBox!.width / 2,
              plotBox!.y + plotBox!.height * 0.45,
            );
            await expect(tooltip).toBeVisible();
            await expect(tooltip).toContainText(month);
            await expect(tooltip).toContainText(visitors);
            await expect(tooltip).toContainText(pageviews);
            payloads.push((await tooltip.textContent())!);
            expect((await extractMarkdown(page)).markdown).toBe(baseline.markdown);
            await expect(legend).toContainText("visitors");
            await expect(legend).toContainText("pageviews");
          }
          expect(payloads[0]).not.toBe(payloads[1]);
          await page.mouse.move(0, 0);
          await expect(tooltip).toBeEmpty();
          expect((await extractMarkdown(page)).markdown).toBe(baseline.markdown);
        } finally {
          await browser.close();
        }
      });

      test(`MiddleTruncate corpus keeps the complete value across measured widths (${combination})`, async ({
        baseURL,
      }) => {
        const browser = await chromium.launch();
        try {
          const context = await browser.newContext({ viewport, locale: "en-US" });
          const page = await context.newPage();
          await page.addInitScript((value) => {
            localStorage.setItem("unitary-theme-preference", value);
          }, theme);
          await page.goto(`${baseURL}/?lang=${locale}#/components/middle-truncate`, {
            waitUntil: "domcontentloaded",
          });
          const heading = locale === "zh-CN" ? "中间截断" : "Middle Truncate";
          await expect(page.locator("#main-content h1")).toHaveText(heading);
          await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
          const demo = page.locator('[data-demo-component="middle-truncate"]').first();
          const item = demo.locator('[data-slot="middle-truncate"]');
          await expect(item).toBeVisible();
          await page.evaluate(() => document.fonts.ready);
          const showCode = page.getByRole("button", { name: /^(显示代码|Show code)$/ });
          for (const button of await showCode.all()) {
            if ((await button.getAttribute("aria-expanded")) !== "true") await button.click();
            await expect(button).toHaveAttribute("aria-expanded", "true");
          }
          await expect(page.locator("#main-content pre").first()).toBeVisible();
          const value = (await item.getAttribute("data-value"))!;
          expect(value).toBe(
            "https://example.com/teams/hustradio/projects/unitary-ui/deployments/latest",
          );
          const api = page.locator("#main-content table").filter({ hasText: "value" });
          await expect(api).toContainText("string");
          const baseline = await extractMarkdown(page);
          expect(baseline.markdown).toContain(`# ${heading}`);
          expect(baseline.markdown).toContain("import { MiddleTruncate }");
          expect(baseline.markdown).toContain("<MiddleTruncate value=");
          expect(baseline.markdown).toContain(value);
          expect(baseline.markdown).toContain("<table");
          expect(baseline.markdown).toContain("string");

          const rawTexts: string[] = [];
          let previousText = await visibleTruncateText(item);
          for (const width of [120, 480, 900]) {
            await item.evaluate((element, nextWidth) => {
              const parent = element.parentElement!;
              parent.style.width = `${nextWidth}px`;
              parent.style.maxWidth = "none";
            }, width);
            await expect.poll(() => visibleTruncateText(item)).not.toBe(previousText);
            previousText = await visibleTruncateText(item);
            rawTexts.push((await item.textContent())!);
            await expect(item).toHaveAttribute("data-value", value);
            await expect(item).toHaveAttribute("aria-label", value);
            const extracted = await extractMarkdown(page);
            expect(extracted.markdown).toBe(baseline.markdown);
            const normalizedValues = await page.evaluate((html) => {
              const extractedDoc = new DOMParser().parseFromString(html, "text/html");
              return Array.from(
                extractedDoc.querySelectorAll('[data-slot="middle-truncate"][data-value]'),
              ).map((element) => element.textContent);
            }, extracted.html);
            expect(normalizedValues.length).toBeGreaterThan(0);
            expect(normalizedValues.every((text) => text === value)).toBe(true);
          }
          expect(new Set(rawTexts).size).toBe(3);
          expect(previousText).toBe(value);
        } finally {
          await browser.close();
        }
      });
    }
  }
}
