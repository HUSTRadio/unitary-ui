import { expect, test, type Page } from "@playwright/test";

async function openComponent(page: Page, slug: string) {
  await page.addInitScript(() => {
    window.localStorage.setItem("geist-docs-language", "en-US");
    window.localStorage.setItem("geist-theme-preference", "light");
  });
  await page.goto(`/#/components/${slug}`);
  await page.waitForSelector('[data-slot="navbar"]');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
}

async function rect(locator: ReturnType<Page["locator"]>) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return box!;
}

test("split button minor trigger is square, equal-height, and flush", async ({ page }) => {
  await openComponent(page, "split-button");
  const group = page.locator('[data-slot="split-button"]').first();
  const main = group.locator('[data-slot="split-button-main"]');
  const minor = group.locator('[data-slot="split-button-menu"]');
  const [mainBox, minorBox] = await Promise.all([rect(main), rect(minor)]);

  expect(minorBox.width).toBe(minorBox.height);
  expect(minorBox.height).toBe(mainBox.height);
  expect(Math.abs(mainBox.x + mainBox.width - minorBox.x)).toBeLessThanOrEqual(0.5);
});

test("status dots use distinct visible colors for the documented states", async ({ page }) => {
  await openComponent(page, "status-dot");
  const card = page.locator('[data-demo-container="Default"]');
  const colors = await card
    .locator('[data-slot="status-dot"] > span[aria-hidden]')
    .evaluateAll((dots) => dots.map((dot) => getComputedStyle(dot).backgroundColor));

  expect(colors.length).toBeGreaterThanOrEqual(5);
  expect(new Set(colors).size).toBe(colors.length);
});

test("step point outer circles match and active inner point is a centered 6px circle", async ({ page }) => {
  await openComponent(page, "step-point");
  const dots = page.locator('[data-slot="step-dot"]');
  await expect(dots).toHaveCount(3);

  for (const dot of await dots.all()) {
    const box = await rect(dot);
    expect(box.width).toBe(16);
    expect(box.height).toBe(16);
  }

  const active = dots.nth(1);
  const inner = active.locator("span:not([data-slot])").first();
  const [outerBox, innerBox] = await Promise.all([rect(active), rect(inner)]);
  expect(innerBox.width).toBe(6);
  expect(innerBox.height).toBe(6);
  expect(Math.abs(innerBox.x + innerBox.width / 2 - (outerBox.x + outerBox.width / 2))).toBeLessThanOrEqual(
    0.5,
  );
  expect(
    Math.abs(innerBox.y + innerBox.height / 2 - (outerBox.y + outerBox.height / 2)),
  ).toBeLessThanOrEqual(0.5);

  const stateStyles = await dots.evaluateAll((nodes) =>
    nodes.slice(0, 2).map((node) => {
      const style = getComputedStyle(node);
      return { background: style.backgroundColor, border: style.borderTopColor };
    }),
  );
  for (const style of stateStyles) {
    expect(style.border).toBe(style.background);
  }
});

test("textarea size presets have 80/100/120px geometry", async ({ page }) => {
  await openComponent(page, "textarea");
  const section = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "Sizes", exact: true }) });
  const fields = section.locator('[data-slot="textarea"]');
  await expect(fields).toHaveCount(3);
  const heights = await fields.evaluateAll((nodes) =>
    nodes.map((node) => Math.round(node.getBoundingClientRect().height)),
  );
  expect(heights).toEqual([80, 100, 120]);
});

test("toast undo action has a 32px box with vertically centered text", async ({ page }) => {
  await openComponent(page, "toast");
  const undoSection = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "Undo", exact: true }) });
  await undoSection.getByRole("button", { name: "Show Toast" }).click();
  const action = page.locator('[data-slot="toast-action"]');
  await expect(action).toBeVisible();

  const metrics = await action.evaluate((button) => {
    const box = button.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(button);
    const text = range.getBoundingClientRect();
    return {
      height: box.height,
      centerDelta: Math.abs(text.top + text.height / 2 - (box.top + box.height / 2)),
    };
  });
  expect(metrics.height).toBe(32);
  expect(metrics.centerDelta).toBeLessThanOrEqual(0.5);
});

test("docs prose headings keep a 16px gap before block content", async ({ page }) => {
  await openComponent(page, "badge");
  const heading = page.getByRole("heading", { name: "Examples", exact: true }).first();
  const block = heading.locator("xpath=following-sibling::*[@data-slot='docs-prose-block'][1]");
  const [headingBox, blockBox] = await Promise.all([rect(heading), rect(block)]);
  expect(Math.abs(blockBox.y - (headingBox.y + headingBox.height) - 16)).toBeLessThanOrEqual(0.5);
});
