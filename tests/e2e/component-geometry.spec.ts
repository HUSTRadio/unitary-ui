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

test("split button size matrix keeps square flush triggers at every documented size", async ({ page }) => {
  await openComponent(page, "split-button");
  const groups = page.locator('[data-slot="split-button"]');
  const count = await groups.count();
  expect(count).toBeGreaterThanOrEqual(6);

  const heights = new Set<number>();
  for (let i = 0; i < count; i++) {
    const group = groups.nth(i);
    const main = group.locator('[data-slot="split-button-main"]');
    const minor = group.locator('[data-slot="split-button-menu"]');
    const [mainBox, minorBox] = await Promise.all([rect(main), rect(minor)]);

    expect(minorBox.width).toBe(minorBox.height);
    expect(minorBox.height).toBe(mainBox.height);
    expect(Math.abs(mainBox.x + mainBox.width - minorBox.x)).toBeLessThanOrEqual(0.5);
    heights.add(Math.round(minorBox.height));
  }
  // small/medium/large rows from the title-with-icon example (32/36/40)
  expect(heights.size).toBeGreaterThanOrEqual(3);
  expect([...heights].sort((a, b) => a - b)).toEqual([32, 36, 40]);
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

test("status dots stay distinct and opaque in the dark theme", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("geist-docs-language", "en-US");
    window.localStorage.setItem("geist-theme-preference", "dark");
  });
  await page.goto("/#/components/status-dot");
  await page.waitForSelector('[data-slot="navbar"]');
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe("dark");
  const card = page.locator('[data-demo-container="Default"]');
  const colors = await card
    .locator('[data-slot="status-dot"] > span[aria-hidden]')
    .evaluateAll((dots) =>
      dots.map((dot) => {
        const color = getComputedStyle(dot).backgroundColor;
        const alpha = color.startsWith("rgba") ? parseFloat(color.split(",")[3]) : 1;
        return { color, alpha };
      }),
    );

  expect(colors.length).toBeGreaterThanOrEqual(5);
  expect(new Set(colors.map((entry) => entry.color)).size).toBe(colors.length);
  for (const entry of colors) expect(entry.alpha).toBeGreaterThan(0.5);
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
  const inner = active.locator('[data-slot="step-dot-active-inner"]');
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

test("textarea size presets use the planned horizontal/vertical padding", async ({ page }) => {
  await openComponent(page, "textarea");
  const section = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "Sizes", exact: true }) });
  const fields = section.locator('[data-slot="textarea"]');
  await expect(fields).toHaveCount(3);
  const paddings = await fields.evaluateAll((nodes) =>
    nodes.map((node) => {
      const style = getComputedStyle(node);
      return [
        Math.round(parseFloat(style.paddingLeft)),
        Math.round(parseFloat(style.paddingTop)),
      ];
    }),
  );
  // small 10/8, medium 12/10, large 14/12
  expect(paddings).toEqual([
    [10, 8],
    [12, 10],
    [14, 12],
  ]);
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

test("toast surface keeps the 48px minimum height and 420px maximum width", async ({ page }) => {
  await openComponent(page, "toast");
  const liveSection = page.locator('[data-demo-mode="live"]');
  await liveSection.getByRole("button", { name: "Show Toast" }).click();
  // The stack <ol> has zero height (items are absolutely positioned); assert on the item.
  const toast = page.locator('[role="status"]').first();
  await expect(toast).toBeVisible();

  const metrics = await toast.evaluate((node) => {
    const box = node.getBoundingClientRect();
    const stackBox = node.closest('[data-slot="toasts"]')!.getBoundingClientRect();
    return { height: box.height, stackWidth: stackBox.width };
  });
  expect(metrics.height).toBeGreaterThanOrEqual(48);
  expect(metrics.stackWidth).toBeLessThanOrEqual(420);
});

test("multi-line toast text wraps without clipping", async ({ page }) => {
  await openComponent(page, "toast");
  const section = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "Multi-line", exact: true }) });
  await section.getByRole("button", { name: "Show Toast" }).click();
  const toast = page.locator('[role="status"]').first();
  await expect(toast).toBeVisible();

  const metrics = await toast.evaluate((node) => {
    const content = node.querySelector("div.min-w-0")!;
    return {
      scrollHeight: content.scrollHeight,
      clientHeight: content.clientHeight,
      lines: Math.round(content.getBoundingClientRect().height / 20),
    };
  });
  expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.clientHeight + 1);
  expect(metrics.lines).toBeGreaterThanOrEqual(2);
});

test("docs prose headings keep a 16px gap before block content", async ({ page }) => {
  await openComponent(page, "badge");
  const heading = page.getByRole("heading", { name: "Examples", exact: true }).first();
  const block = heading.locator("xpath=following-sibling::*[@data-slot='docs-prose-block'][1]");
  const [headingBox, blockBox] = await Promise.all([rect(heading), rect(block)]);
  expect(Math.abs(blockBox.y - (headingBox.y + headingBox.height) - 16)).toBeLessThanOrEqual(0.5);
});

test("docs component pages keep the 16px rhythm for live demos, extra sections, and API blocks", async ({ page }) => {
  await openComponent(page, "textarea");

  // Scope to data-slot="docs-prose-heading": the component guide also renders
  // "Sizes" article headings (h3) that would make a bare role lookup ambiguous.
  const headingFor = (name: string) =>
    page.locator(`[data-slot="docs-prose-heading"]`).filter({ hasText: name }).first();
  const blockAfter = (heading: ReturnType<Page["locator"]>) =>
    heading.locator("xpath=following-sibling::*[@data-slot='docs-prose-block'][1]");

  const liveHeading = page.getByRole("heading", { name: "Live Demo", exact: true });
  const [liveHeadingBox, liveBlockBox] = await Promise.all([
    rect(liveHeading),
    rect(blockAfter(liveHeading)),
  ]);
  expect(Math.abs(liveBlockBox.y - (liveHeadingBox.y + liveHeadingBox.height) - 16)).toBeLessThanOrEqual(0.5);

  const sizesHeading = headingFor("Sizes");
  const [sizesHeadingBox, sizesBlockBox] = await Promise.all([
    rect(sizesHeading),
    rect(blockAfter(sizesHeading)),
  ]);
  expect(Math.abs(sizesBlockBox.y - (sizesHeadingBox.y + sizesHeadingBox.height) - 16)).toBeLessThanOrEqual(0.5);

  const apiSection = page.locator("#api-reference");
  const apiParagraph = apiSection.locator('[data-slot="docs-prose-paragraph"]').first();
  const apiBlock = apiParagraph.locator(
    "xpath=following-sibling::*[@data-slot='docs-prose-block'][1]",
  );
  await expect(apiBlock).toBeVisible();
  const [apiParagraphBox, apiBlockBox] = await Promise.all([rect(apiParagraph), rect(apiBlock)]);
  expect(Math.abs(apiBlockBox.y - (apiParagraphBox.y + apiParagraphBox.height) - 16)).toBeLessThanOrEqual(0.5);
});

test("table frames keep the rounded overflow owner in both modes", async ({ page }) => {
  await openComponent(page, "table");

  const outlined = page.locator('[data-slot="table-root"]').first();
  const outlineStyles = await outlined.evaluate((node) => {
    const style = getComputedStyle(node);
    return { radius: style.borderTopLeftRadius, overflow: style.overflowX };
  });
  expect(outlineStyles.radius).toBe("8px");
  expect(outlineStyles.overflow).toBe("auto");

  const frameless = page
    .locator('[data-demo-container="Full featured table"] [data-slot="table-root"]')
    .first();
  await expect(frameless).toBeVisible();
  const framelessStyles = await frameless.evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      radius: style.borderTopLeftRadius,
      overflow: style.overflowX,
      border: style.borderTopWidth,
    };
  });
  expect(framelessStyles.radius).toBe("8px");
  expect(framelessStyles.overflow).toBe("auto");
  expect(framelessStyles.border).toBe("0px");
});

test("table column dividers are orthogonal to row separators", async ({ page }) => {
  await openComponent(page, "table");
  const card = page.locator('[data-demo-container="Full featured table"]');
  const cell = card.locator("tbody tr td").nth(1);
  await expect(cell).toBeVisible();

  const borders = await cell.evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      inlineStart: style.borderInlineStartWidth,
      inlineStartColor: style.borderInlineStartColor,
      row: node.closest("tr")!.querySelector("td") === null ? "n/a" : style.borderTopWidth,
    };
  });
  expect(parseFloat(borders.inlineStart)).toBeGreaterThan(0);
  const firstCell = card.locator("tbody tr td").first();
  const firstInlineStart = await firstCell.evaluate(
    (node) => getComputedStyle(node).borderInlineStartWidth,
  );
  expect(firstInlineStart).toBe("0px");
});
