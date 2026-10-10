import { getComponentDocsPath } from "../../docs/site/src/data/docs-routes";
import { expect, test, type Page } from "@playwright/test";

async function openComponent(page: Page, slug: string) {
  await page.addInitScript(() => {
    window.localStorage.setItem("unitary-docs-language", "en-US");
    window.localStorage.setItem("unitary-theme-preference", "light");
  });
  await page.goto(`/#${getComponentDocsPath(slug)}`);
  await page.waitForSelector('[data-slot="navbar"]');
  // 导航先于按需示例就绪；测量前等待真实示例挂载。
  // Navigation precedes lazy examples; wait for a real demo before measuring.
  await expect(page.locator('[data-demo-card]').first()).toBeAttached();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
  const sidebar = page.locator('[data-slot="docs-sidebar"]');
  await expect(sidebar.locator('[data-slot="sidebar-nav"]')).not.toHaveAttribute(
    "data-scroll-tracking-state",
    /pending|running/,
  );
  // These measurements describe the navigation layout at its content origin.
  // Initial active-item tracking now intentionally moves the sidebar on load.
  await sidebar.evaluate((node) => { node.scrollTop = 0; });
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
  const groups = page.locator(
    '[data-demo-card="Title with Icon"] [data-slot="split-button"]',
  );
  await expect(groups).toHaveCount(6);
  const count = await groups.count();

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
    window.localStorage.setItem("unitary-docs-language", "en-US");
    window.localStorage.setItem("unitary-theme-preference", "dark");
  });
  await page.goto("/#/components/status-dot");
  await page.waitForSelector('[data-slot="navbar"]');
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe("dark");
  const card = page.locator('[data-demo-container="Default"]');
  await expect(card).toBeAttached();
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

test("bottom sheet animates without moving the document", async ({ page }) => {
  await openComponent(page, "bottom-sheet");
  const trigger = page.getByRole("button", { name: /open deployment actions/i }).first();
  await trigger.scrollIntoViewIfNeeded();

  const measureDocument = () =>
    page.evaluate(() => {
      const main = document.getElementById("main-content")!.getBoundingClientRect();
      return {
        scrollY: window.scrollY,
        mainTop: main.top,
        mainLeft: main.left,
        mainWidth: main.width,
        visualViewportTop: window.visualViewport?.offsetTop ?? 0,
      };
    });

  const before = await measureDocument();
  await trigger.click();
  const sheet = page.locator('[data-slot="bottom-sheet"]');
  await expect(sheet).toBeVisible();
  await page.waitForTimeout(350);
  const afterOpen = await measureDocument();

  expect(afterOpen).toEqual(before);
  const styles = await sheet.evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      animationName: style.animationName,
      animationDuration: style.animationDuration,
      radius: style.borderRadius,
    };
  });
  expect(styles.animationName).not.toBe("none");
  // bottom-sheet 走 duration-(--uni-motion-overlay) → --uni-duration-slow = 350ms。
  // 原断言 0.3s 是 2026-09-20 动效审核把 slow 档 300ms→350ms 之前的陈旧期望
  // （docs/audits/motion-duration-audit-2026-09-20.md），与本轮 HIG 改动无关。
  expect(styles.animationDuration).toBe("0.35s");
  expect(styles.radius).toBe("6px 6px 0px 0px");

  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();
  expect(await measureDocument()).toEqual(before);
});

test("link page places forge brands before labels and generic external indicators after", async ({
  page,
}) => {
  await openComponent(page, "link");

  const github = page.locator('a[href="https://github.com/HUSTRadio/unitary-ui"]').first();
  const generic = page.locator('a[href="https://developer.mozilla.org"]').first();
  await expect(github).toBeVisible();
  await expect(generic).toBeVisible();

  const githubOrder = await github.evaluate((anchor) => {
    const icon = anchor.querySelector("span")!.getBoundingClientRect();
    const range = document.createRange();
    const text = [...anchor.childNodes].find((node) => node.nodeType === Node.TEXT_NODE)!;
    range.selectNode(text);
    const label = range.getBoundingClientRect();
    return { iconRight: icon.right, labelLeft: label.left, svgCount: anchor.querySelectorAll("svg").length };
  });
  expect(githubOrder.iconRight).toBeLessThanOrEqual(githubOrder.labelLeft);
  expect(githubOrder.svgCount).toBe(0);

  const genericOrder = await generic.evaluate((anchor) => {
    const icon = anchor.querySelector("svg")!.getBoundingClientRect();
    const range = document.createRange();
    const text = [...anchor.childNodes].find((node) => node.nodeType === Node.TEXT_NODE)!;
    range.selectNode(text);
    const label = range.getBoundingClientRect();
    return { iconLeft: icon.left, labelRight: label.right };
  });
  expect(genericOrder.iconLeft).toBeGreaterThanOrEqual(genericOrder.labelRight);
});

test("scrollable sidebar keeps equal 16px top and bottom content insets", async ({ page }) => {
  await openComponent(page, "link");
  const sidebar = page.locator('[data-slot="docs-sidebar"]');
  const firstHeading = sidebar.locator('[data-slot="sidebar-nav-heading"]').first();
  const lastItem = sidebar.locator('[data-slot="sidebar-nav-item"]').last();

  const initial = await Promise.all([rect(sidebar), rect(firstHeading)]);
  const topInset = initial[1].y - initial[0].y;
  expect(Math.abs(topInset - 16)).toBeLessThanOrEqual(0.5);

  await sidebar.evaluate((node) => {
    node.scrollTop = node.scrollHeight;
  });
  const scrolled = await Promise.all([rect(sidebar), rect(lastItem)]);
  const bottomInset = scrolled[0].y + scrolled[0].height - (scrolled[1].y + scrolled[1].height);
  expect(Math.abs(bottomInset - 16)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(topInset - bottomInset)).toBeLessThanOrEqual(0.5);
});

/**
 * 侧栏观感实测（2026-09-21 修订）：条目行 36px（HIG 指针行高，token
 * --uni-nav-item-height）、圆角 6px、左右内缩 14px；小标题对齐药丸左缘（不内缩，
 * 条目标签再内缩 14px 读层级）；选中态 = 药丸底色 + 左侧 3×14px 指示条。
 */
test("sidebar rows keep the HIG 36px rhythm with aligned heading, indicator and icon", async ({
  page,
}) => {
  await openComponent(page, "link");
  const sidebar = page.locator('[data-slot="docs-sidebar"]');

  const metrics = await sidebar.evaluate((node) => {
    const round = (value: number) => Math.round(value * 100) / 100;
    const box = (element: Element | null | undefined) => {
      if (!element) return null;
      const r = element.getBoundingClientRect();
      return { x: round(r.x), y: round(r.y), w: round(r.width), h: round(r.height) };
    };
    const items = Array.from(
      node.querySelectorAll<HTMLElement>('[data-slot="sidebar-nav-item"]'),
    );
    const headings = Array.from(
      node.querySelectorAll<HTMLElement>('[data-slot="sidebar-nav-heading"]'),
    );
    const active = items.find((item) => item.getAttribute("aria-current") === "page");
    const withIcon = items.find((item) => item.querySelector("svg"));
    const indicator = active?.querySelector('[data-slot="sidebar-nav-indicator"]');
    const icon = withIcon?.querySelector("svg");
    const headingLabel = headings[0]?.querySelector("span");
    const itemLabel = withIcon?.querySelector("span.truncate");

    return {
      itemCount: items.length,
      heights: [...new Set(items.map((item) => Math.round(item.getBoundingClientRect().height)))],
      headingHeights: [
        ...new Set(headings.map((heading) => Math.round(heading.getBoundingClientRect().height))),
      ],
      radius: items[0] ? getComputedStyle(items[0]).borderRadius : null,
      padding: items[0] ? getComputedStyle(items[0]).padding : null,
      activeBox: box(active),
      indicatorBox: box(indicator),
      iconBox: box(icon),
      iconItemBox: box(withIcon),
      firstItemBox: box(items[0]),
      headingLabelBox: box(headingLabel),
      itemLabelBox: box(itemLabel),
    };
  });

  expect(metrics.itemCount).toBeGreaterThan(20);
  // 条目行 36px（HIG 指针行高 token）；小标题行仍是 32px 标签行
  expect(metrics.heights).toEqual([36]);
  expect(metrics.headingHeights).toEqual([32]);
  expect(metrics.radius).toBe("6px");
  // 行高由 token 高度承担，左右内缩仍是 14px
  expect(metrics.padding).toBe("0px 14px");

  // 层级靠对齐：小标题文字左缘 = 条目药丸左缘；条目标签再内缩 14px
  expect(Math.abs(metrics.headingLabelBox!.x - metrics.firstItemBox!.x)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(metrics.itemLabelBox!.x - (metrics.iconItemBox!.x + 38))).toBeLessThanOrEqual(0.5);

  // 指示条 3×14，垂直居中，接近 15px 中文标签墨迹高度；距药丸左缘 6px
  expect(metrics.indicatorBox?.w).toBe(3);
  expect(metrics.indicatorBox?.h).toBe(14);
  const activeCenter = metrics.activeBox!.y + metrics.activeBox!.h / 2;
  const indicatorCenter = metrics.indicatorBox!.y + metrics.indicatorBox!.h / 2;
  expect(Math.abs(activeCenter - indicatorCenter)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(metrics.indicatorBox!.x - (metrics.activeBox!.x + 6))).toBeLessThanOrEqual(0.5);

  // 图标 16px，垂直居中，与 14px 左内缩同轴
  expect(metrics.iconBox?.w).toBe(16);
  expect(metrics.iconBox?.h).toBe(16);
  const iconCenter = metrics.iconBox!.y + metrics.iconBox!.h / 2;
  const rowCenter = metrics.iconItemBox!.y + metrics.iconItemBox!.h / 2;
  expect(Math.abs(iconCenter - rowCenter)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(metrics.iconBox!.x - (metrics.iconItemBox!.x + 14))).toBeLessThanOrEqual(0.5);
});

test("sidebar active indicator uses the page theme accent in both color schemes", async ({ page }) => {
  await openComponent(page, "link");
  const indicator = page.locator('[data-slot="docs-sidebar"] [data-slot="sidebar-nav-indicator"]');

  for (const theme of ["light", "dark"] as const) {
    await page.evaluate((nextTheme) => {
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      document.documentElement.dataset.theme = nextTheme;
    }, theme);
    const colors = await indicator.evaluate((node) => ({
      indicator: getComputedStyle(node).backgroundColor,
      token: getComputedStyle(document.documentElement).getPropertyValue("--theme-accent").trim(),
    }));
    expect(colors.token.toLowerCase()).toBe("#0d47a1");
    expect(colors.indicator).toBe("rgb(13, 71, 161)");
  }
});

/**
 * 侧栏层级节奏（2026-09-21 修订）：层次感由「小标题对齐药丸左缘」承担，垂直节奏只
 * 负责分组呼吸感——一级标题到首个小标题 6px，二级小组之间 9px（40×1 短分割线上下
 * 各 4px），分割线左缘与小标题同轴。
 */
test("sidebar subgroup rhythm: 6px to the first subgroup, 9px between subgroups, headings on the pill edge", async ({
  page,
}) => {
  await openComponent(page, "link");
  const sidebar = page.locator('[data-slot="docs-sidebar"]');

  const metrics = await sidebar.evaluate((node) => {
    const round = (value: number) => Math.round(value * 100) / 100;
    const groups = Array.from(
      node.querySelectorAll<HTMLElement>('[data-slot="sidebar-nav-group"]'),
    );
    const group = groups.find((candidate) =>
      candidate.querySelector('[data-slot="sidebar-nav-subgroup"]'),
    );
    if (!group) return null;

    const heading = group.querySelector<HTMLElement>('[data-slot="sidebar-nav-heading"]')!;
    const subheadings = Array.from(
      group.querySelectorAll<HTMLElement>('[data-slot="sidebar-nav-subheading"]'),
    );
    const divider = group.querySelector<HTMLElement>('[data-slot="sidebar-nav-subgroup-divider"]');
    if (subheadings.length < 2 || !divider) return null;

    const dividerRect = divider.getBoundingClientRect();
    const lastItemBeforeDivider = Array.from(
      group.querySelectorAll<HTMLElement>('[data-slot="sidebar-nav-item"]'),
    )
      .map((item) => item.getBoundingClientRect())
      .filter((rect) => rect.bottom <= dividerRect.top)
      .pop();

    return {
      parentToChild: round(subheadings[0].getBoundingClientRect().top - heading.getBoundingClientRect().bottom),
      sibling: round(
        subheadings[1].getBoundingClientRect().top -
          (lastItemBeforeDivider?.bottom ?? dividerRect.bottom),
      ),
      dividerWidth: round(dividerRect.width),
      dividerHeight: round(dividerRect.height),
      dividerX: round(dividerRect.x),
      headingLabelX: round(heading.querySelector("span")!.getBoundingClientRect().x),
      subheadingLabelX: round(subheadings[0].querySelector("span")!.getBoundingClientRect().x),
    };
  });

  expect(metrics).not.toBeNull();
  expect(metrics!.dividerWidth).toBe(40);
  expect(metrics!.dividerHeight).toBe(1);
  // token 档位：parent 6px（--uni-nav-space-parent）、sibling 4 + 1 + 4 = 9px
  expect(metrics!.parentToChild).toBe(6);
  expect(metrics!.sibling).toBe(9);
  // 层次感来自对齐：一级小标题、二级小标题、分割线三者左缘同轴（都在药丸左缘）
  expect(Math.abs(metrics!.headingLabelX - metrics!.subheadingLabelX)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(metrics!.headingLabelX - metrics!.dividerX)).toBeLessThanOrEqual(0.5);
});

test("sidebar status badge is the standard compact rounded Badge, 20px tall and flush with the row's trailing padding", async ({
  page,
}) => {
  // menu-bar 在 registry 里带 new 标记，用于验证胶囊的真实落点
  await openComponent(page, "menu-bar");
  const sidebar = page.locator('[data-slot="docs-sidebar"]');
  await expect(sidebar.locator('[data-slot="badge"]').first()).toBeVisible();

  const geometry = await sidebar.evaluate((node) => {
    const badge = node.querySelector<HTMLElement>('[data-slot="badge"]');
    const item = badge?.closest<HTMLElement>('[data-slot="sidebar-nav-item"]');
    if (!badge || !item) return null;
    const badgeRect = badge.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const itemStyle = getComputedStyle(item);
    const round = (value: number) => Math.round(value * 100) / 100;
    return {
      height: round(badgeRect.height),
      variant: badge.dataset.variant ?? null,
      shape: badge.dataset.shape ?? null,
      radius: getComputedStyle(badge).borderRadius,
      itemWidth: round(itemRect.width),
      paddingRight: itemStyle.paddingRight,
      badgeRightOffset: round(badgeRect.right - itemRect.left),
      labelTruncated: badge.previousElementSibling?.className.includes("truncate") ?? false,
    };
  });

  expect(geometry).not.toBeNull();
  // 标准 Badge 档位：compact（20px 高）+ rounded（4px 圆角矩形）+ blue soft
  expect(geometry!.height).toBe(20);
  expect(geometry!.variant).toBe("blue");
  expect(geometry!.shape).toBe("rounded");
  expect(geometry!.radius).toBe("4px");
  expect(geometry!.paddingRight).toBe("14px");
  // 右缘对齐：胶囊右缘 = 药丸右缘 − 行右内缩
  expect(
    Math.abs(geometry!.badgeRightOffset - (geometry!.itemWidth - 14)),
  ).toBeLessThanOrEqual(0.5);
  // 胶囊挤在行尾时标签仍可截断，长标签不会把胶囊顶出可视区
  expect(geometry!.labelTruncated).toBe(true);
});

test("collapsing a sidebar group removes its rows, keeps the nodes, and is remembered", async ({
  page,
}) => {
  await openComponent(page, "link");
  const sidebar = page.locator('[data-slot="docs-sidebar"]');

  const probe = () =>
    sidebar.evaluate((node) => {
      const headings = Array.from(
        node.querySelectorAll<HTMLElement>('[data-slot="sidebar-nav-heading"]'),
      );
      const group = headings[0].closest('[data-slot="sidebar-nav-group"]');
      const content = group?.querySelector<HTMLElement>('[data-slot="sidebar-nav-content"]');
      const round = (value: number) => Math.round(value * 100) / 100;
      return {
        expanded: headings[0].getAttribute("aria-expanded"),
        contentHeight: round(content?.getBoundingClientRect().height ?? -1),
        links: content?.querySelectorAll("a").length ?? 0,
        inert: content?.hasAttribute("inert") ?? false,
        contentRows: content?.textContent?.trim().length ?? 0,
        nextHeadingTop: round(headings[1].getBoundingClientRect().top),
      };
    });

  const expanded = await probe();
  expect(expanded.expanded).toBe("true");
  expect(expanded.contentHeight).toBeGreaterThan(0);

  await sidebar.locator('[data-slot="sidebar-nav-heading"]').first().click();
  await page.waitForTimeout(400);
  const collapsed = await probe();

  expect(collapsed.expanded).toBe("false");
  expect(collapsed.contentHeight).toBeLessThanOrEqual(0.5);
  // 折叠只收起自身行：链接仍保留在 DOM（forceMount），但退出焦点序
  expect(collapsed.links).toBe(expanded.links);
  expect(collapsed.inert).toBe(true);
  // 后续分组标题上移，不与折叠区重叠
  expect(collapsed.nextHeadingTop).toBeLessThan(expanded.nextHeadingTop);

  // 折叠结果被记住：重载后仍是折叠态
  await page.reload();
  await page.waitForSelector('[data-slot="docs-sidebar"] [data-slot="sidebar-nav-heading"]');
  await page.waitForTimeout(300);
  const restored = await probe();
  expect(restored.expanded).toBe("false");
  expect(restored.contentHeight).toBeLessThanOrEqual(0.5);
});

test("continuous surface uses measured paths without a competing background radius", async ({
  page,
}) => {
  await openComponent(page, "continuous-surface");
  const surfaces = page.locator('[data-slot="continuous-surface"]');
  await expect(surfaces).toHaveCount(3);

  const clipPaths = await surfaces.evaluateAll((nodes) =>
    nodes.map((node) => {
      const style = window.getComputedStyle(node);
      return {
        curve: node.getAttribute("data-curve"),
        clip: style.clipPath,
        fallback: style.borderRadius,
      };
    }),
  );

  for (const surface of clipPaths) {
    // clip-path: path() lands only after ResizeObserver measured the box.
    expect(surface.clip.startsWith("path("), `curve ${surface.curve}`).toBe(true);
    expect(surface.fallback, `curve ${surface.curve}`).toBe("0px");
  }

  const superellipse = page.locator('[data-curve="superellipse"]');
  await expect(superellipse).toHaveCount(1);
  const superClip = await superellipse.evaluate(
    (node) => window.getComputedStyle(node).clipPath,
  );
  expect(superClip.startsWith("url(")).toBe(true);
});

/**
 * HIG-AUD-029 组件级响应式复核（2026-09-27 实测）。
 *
 * 审计把以下七个组件列为「无断点特化、需分别核实」：`select`、`combobox`、`drawer`、
 * `bottom-sheet`、`side-panel`、`toast`、`tooltip`。首要取证已在 320 / 390 双主题下完成，
 * **实测无缺陷**（浮层全部落在视口内、页面无横向溢出）——「缺少 `max-sm:` 类」本身不是缺陷，
 * 这正是该条审计的原始口径。本用例把这条不变量固化成永久回归，避免后续改动把它弄丢。
 *
 * 说明：
 * - `toast` 的堆叠容器 `<ol data-slot="toasts">` 高度为 0（条目绝对定位），可视区域是单条
 *   `li[role="status"]`，因此量条目而不是容器；
 * - `tooltip` 必须 hover 触发（其子元素没有 `tabIndex`，键盘聚焦不浮现）；
 * - 断言的是**浮层不越界 + 页面不横向溢出**，不锁具体尺寸（尺寸由各组件自己的契约测试守护）。
 */
const NARROW_VIEWPORT_HEIGHT = 712;

interface NarrowOverlayCase {
  slug: string;
  /** 浮层根元素；`toast` 例外，量的是单条条目。 */
  overlay: string;
  open: (page: Page) => Promise<void>;
}

function narrowOverlayCases(page: Page): NarrowOverlayCase[] {
  return [
    {
      slug: "select",
      overlay: '[data-slot="select-content"]',
      open: async () => {
        await page.locator('[data-slot="select-trigger"]').first().click();
      },
    },
    {
      slug: "combobox",
      overlay: '[data-slot="combobox-content"]',
      open: async () => {
        await page.locator('[data-slot="combobox-root"]').first().click();
      },
    },
    {
      slug: "drawer",
      overlay: '[data-slot="drawer"]',
      open: async () => {
        await page.getByRole("button", { name: "Open", exact: true }).first().click();
      },
    },
    {
      slug: "bottom-sheet",
      overlay: '[data-slot="bottom-sheet"]',
      open: async () => {
        await page.getByRole("button", { name: "Open Deployment Actions" }).first().click();
      },
    },
    {
      slug: "side-panel",
      overlay: '[data-slot="side-panel-content"]',
      open: async () => {
        await page.getByRole("button", { name: "Open details" }).first().click();
      },
    },
    {
      slug: "toast",
      overlay: '[data-slot="toasts"] li[role="status"]',
      open: async () => {
        await page.getByRole("button", { name: "Show Toast" }).first().click();
      },
    },
    {
      slug: "tooltip",
      overlay: '[role="tooltip"]',
      open: async () => {
        await page.getByText("Top", { exact: true }).first().hover();
      },
    },
  ];
}

async function assertNarrowOverlayFits(
  page: Page,
  width: number,
  theme: "light" | "dark",
): Promise<void> {
  for (const item of narrowOverlayCases(page)) {
    await page.setViewportSize({ width, height: NARROW_VIEWPORT_HEIGHT });
    await page.goto(`/#${getComponentDocsPath(item.slug)}`);
    await page.waitForSelector('[data-slot="navbar"]');

    await item.open(page);

    const overlay = page.locator(`${item.overlay}:visible`).first();
    await expect(overlay, `${item.slug} 的浮层应打开`).toBeVisible();
    // 等入场动画真正结束再量：底部锚定的浮层（drawer / bottom-sheet）在滑入过程中
    // 会短暂越出视口下缘，按固定时长等待会把它误判成越界缺陷。
    await overlay.evaluate(async (node) => {
      const finite = node.getAnimations({ subtree: true }).filter((animation) => {
        const timing = animation.effect?.getComputedTiming();
        return timing ? Number.isFinite(timing.endTime ?? Number.POSITIVE_INFINITY) : false;
      });
      await Promise.allSettled(finite.map((animation) => animation.finished));
    });

    const box = await overlay.boundingBox();
    expect(box, `${item.slug} 的浮层应有几何盒`).not.toBeNull();
    const context = `${item.slug} @ ${width}px ${theme}：x=${box!.x.toFixed(1)} w=${box!.width.toFixed(1)} y=${box!.y.toFixed(1)} h=${box!.height.toFixed(1)}`;
    expect(box!.x, `${context} 不应超出左缘`).toBeGreaterThanOrEqual(-1);
    expect(box!.x + box!.width, `${context} 不应超出右缘`).toBeLessThanOrEqual(width + 1);
    expect(box!.y, `${context} 不应超出上缘`).toBeGreaterThanOrEqual(-1);
    expect(box!.y + box!.height, `${context} 不应超出下缘`).toBeLessThanOrEqual(
      NARROW_VIEWPORT_HEIGHT + 1,
    );

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, `${context} 不应制造页面横向溢出`).toBeLessThanOrEqual(0);

    await page.keyboard.press("Escape");
  }
}

for (const width of [320, 390] as const) {
  test(`narrow viewport ${width}px: overlays stay inside the viewport in both themes`, async ({
    page,
  }) => {
    test.setTimeout(240_000);
    for (const theme of ["light", "dark"] as const) {
      // 主题通过 init 脚本注入：每次导航都生效，且后注册的深色脚本覆盖前者。
      await page.addInitScript((preference: "light" | "dark") => {
        window.localStorage.setItem("unitary-docs-language", "en-US");
        window.localStorage.setItem("unitary-theme-preference", preference);
      }, theme);
      await assertNarrowOverlayFits(page, width, theme);
    }
  });
}
