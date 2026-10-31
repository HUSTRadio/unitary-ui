import { readFileSync } from "node:fs";
import postcss from "postcss";
import { compile } from "tailwindcss";
import { expect, test } from "@playwright/test";

// This public utility has no docs consumer. Compile its real definition instead
// of attributing the Input component's separate transition to the utility.
const stylesheet = postcss.parse(readFileSync("src/styles/index.css", "utf8"));
let focusUtility = "";
stylesheet.walkAtRules("utility", rule => {
  if (rule.params === "input-focus-ring") focusUtility = rule.toString();
});
if (!focusUtility) throw new Error("Missing public input-focus-ring utility");
const focusCss = (await compile(`${focusUtility}\n@tailwind utilities;`)).build(["input-focus-ring"]);

const consumers = [
  { name: "book", route: "book", selector: '[data-slot="book-rotate"]', token: "--uni-motion-state" },
  { name: "multi-select", route: "multi-select", selector: '[data-slot="multi-select-trigger"]', token: "--uni-motion-feedback" },
  { name: "search-input", route: "search-input", selector: '[data-slot="search-input"] [data-uni-input-wrapper]', token: "--uni-motion-feedback" },
  { name: "device", route: "device", selector: ".mockframe", token: "--uni-motion-state" },
  { name: "input-focus-ring", route: "input", selector: "[data-motion-focus-probe]", token: "--uni-motion-feedback" },
] as const;

for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 1280]) {
    for (const consumer of consumers) {
      test(`${consumer.name} follows shared transition tokens (${theme}, ${width}px)`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await page.addInitScript(value => {
          localStorage.setItem("unitary-theme-preference", value);
          localStorage.setItem("unitary-docs-language", "en-US");
        }, theme);
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/#/components/${consumer.route}`);
        if (consumer.name === "input-focus-ring") {
          await page.addStyleTag({ content: focusCss });
          await page.evaluate(() => {
            const input = document.createElement("input");
            input.dataset.motionFocusProbe = "";
            input.className = "input-focus-ring";
            input.setAttribute("aria-label", "Focus utility probe");
            document.querySelector("main")!.prepend(input);
          });
        }
        const element = page.locator(consumer.selector).first();
        await expect(element).toBeVisible();
        if (consumer.name === "device") {
          await expect(element).toHaveCSS("transition-property", "none");
          // Exercise the same public animated variant selected by Device.
          await element.evaluate(node => {
            node.classList.remove("phone-frame-static");
            node.classList.add("phone-frame-animated");
          });
        }
        const expected = await element.evaluate((node, token) => {
          const value = getComputedStyle(node).getPropertyValue(token).trim();
          return Number.parseFloat(value) / (value.endsWith("ms") ? 1000 : 1);
        }, consumer.token);
        const durations = () => element.evaluate(node => getComputedStyle(node).transitionDuration.split(",").map(Number.parseFloat));
        await expect.poll(durations).toEqual(consumer.name === "input-focus-ring" ? [expected, expected] : [expected]);
        await element.evaluate((node, token) => node.style.setProperty(token, "650ms"), consumer.token);
        await expect.poll(durations).toEqual(consumer.name === "input-focus-ring" ? [0.65, 0.65] : [0.65]);

        if (consumer.name === "book") {
          const before = await element.evaluate(node => getComputedStyle(node).transform);
          await page.locator('[data-slot="book"]').first().hover();
          await expect.poll(() => element.evaluate(node => getComputedStyle(node).transform)).not.toBe(before);
        } else if (consumer.name === "multi-select") {
          await element.click();
          await expect(page.locator('[data-slot="multi-select-content"]')).toBeVisible();
          await page.keyboard.press("Escape");
          await expect(page.locator('[data-slot="multi-select-content"]')).toHaveCount(0);
        } else if (consumer.name === "search-input") {
          const input = element.locator("input");
          await input.fill("timing tokens");
          await expect(input).toHaveValue("timing tokens");
        } else if (consumer.name === "input-focus-ring") {
          await element.focus();
          await expect(element).toBeFocused();
          await expect(element).not.toHaveCSS("box-shadow", "none");
        }

        await page.emulateMedia({ reducedMotion: "reduce" });
        await expect.poll(async () => (await durations()).every(value => value <= 0.00001)).toBe(true);
      });
    }
  }
}
