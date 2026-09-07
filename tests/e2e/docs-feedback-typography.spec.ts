import { expect, test } from "@playwright/test";

test.describe("docs typography geometry", () => {
  test("stacks Introduction typeface names without wrapping or overflow", async ({ page }) => {
    await page.goto("/#/introduction");

    const oppo = page.getByText("OPPO Sans 4.0", { exact: true });
    const preview = oppo.locator("..");
    const names = preview.locator(":scope > div");

    await expect(names).toHaveCount(3);
    const boxes = await names.evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          text: element.textContent?.trim(),
          x: rect.x,
          y: rect.y,
          width: rect.width,
          scrollWidth: element.scrollWidth,
          writingMode: getComputedStyle(element).writingMode,
        };
      }),
    );

    expect(boxes.map(({ text }) => text)).toEqual([
      "OPPO Sans 4.0",
      "HarmonyOS Sans SC",
      "JetBrains Maple Mono",
    ]);
    expect(new Set(boxes.map(({ x }) => Math.round(x))).size).toBe(1);
    expect(boxes[0].y).toBeLessThan(boxes[1].y);
    expect(boxes[1].y).toBeLessThan(boxes[2].y);
    expect(boxes.every(({ width, scrollWidth }) => scrollWidth <= width + 1)).toBe(true);
    expect(boxes.every(({ writingMode }) => writingMode === "horizontal-tb")).toBe(true);
  });

  test("aligns unmarked Grid best-practice items with their heading", async ({ page }) => {
    await page.goto("/#/grid");

    const section = page.locator('[data-grid-demo="best-practices"]');
    const heading = section.locator("h2");
    const firstItem = section.locator("li").first();

    const [headingBox, itemBox] = await Promise.all([heading.boundingBox(), firstItem.boundingBox()]);
    expect(headingBox).not.toBeNull();
    expect(itemBox).not.toBeNull();
    expect(Math.abs(itemBox!.x - headingBox!.x)).toBeLessThanOrEqual(1);
    await expect(section.locator("ul")).toHaveCSS("list-style-type", "none");
  });

  test("keeps both typography fixes stable across the required viewport and theme matrix", async ({
    page,
  }) => {
    await page.goto("/#/introduction");
    for (const theme of ["light", "dark"] as const) {
      await page.evaluate((nextTheme) => {
        localStorage.setItem("geist-theme-preference", nextTheme);
      }, theme);
      await page.reload();
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto("/#/introduction");
        const names = page
          .getByText("OPPO Sans 4.0", { exact: true })
          .locator("..")
          .locator(":scope > div");
        const typefaceGeometry = await names.evaluateAll((elements) =>
          elements.map((element) => ({
            x: element.getBoundingClientRect().x,
            width: element.getBoundingClientRect().width,
            scrollWidth: element.scrollWidth,
          })),
        );
        expect(new Set(typefaceGeometry.map(({ x }) => Math.round(x))).size).toBe(1);
        expect(typefaceGeometry.every(({ width: boxWidth, scrollWidth }) => scrollWidth <= boxWidth + 1)).toBe(
          true,
        );

        await page.goto("/#/grid");
        const section = page.locator('[data-grid-demo="best-practices"]');
        const [headingBox, itemBox] = await Promise.all([
          section.locator("h2").boundingBox(),
          section.locator("li").first().boundingBox(),
        ]);
        expect(Math.abs(itemBox!.x - headingBox!.x)).toBeLessThanOrEqual(1);
      }
    }
  });
});

test.describe("Feedback official interaction and geometry", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/#/components/feedback");
  });

  test("default uses an anchored 340px Popover, restores focus and preserves a dismissed draft", async ({
    page,
  }) => {
    const trigger = page.locator('[data-demo-card="Default"] [data-slot="feedback-trigger"]');
    await expect(trigger).toBeVisible();
    await expect(page.locator('[data-slot="feedback-popup"]')).toHaveCount(0);

    await trigger.click();
    const popup = page.locator('[data-slot="feedback-popup"]');
    await expect(popup).toBeVisible();
    await expect
      .poll(async () => (await popup.boundingBox())?.width)
      .toBeGreaterThanOrEqual(339);
    expect((await popup.boundingBox())?.width).toBeLessThanOrEqual(341);
    expect(await page.locator("body").getAttribute("data-scroll-locked")).toBeNull();

    const textarea = popup.locator('[data-slot="feedback-textarea"]');
    await textarea.fill("Preserve this draft");
    await page.keyboard.press("Escape");
    await expect(popup).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(
      page.locator('[data-slot="feedback-popup"] [data-slot="feedback-textarea"]'),
    ).toHaveValue("Preserve this draft");
  });

  test("Inline expands in place, clears rating on dismissal and preserves its draft", async ({
    page,
  }) => {
    const capsule = page.locator('[data-demo-card="Inline"] [data-slot="rating-pill"]');
    const ratings = capsule.getByRole("radio");
    await expect(capsule).toHaveAttribute("data-state", "closed");
    const closedBox = await capsule.boundingBox();
    expect(closedBox?.width).toBe(274);
    expect(closedBox?.height).toBe(48);

    await ratings.last().click();
    await expect(capsule).toHaveAttribute("data-state", "open");
    await expect.poll(async () => (await capsule.boundingBox())?.width).toBe(336);
    await expect
      .poll(async () => (await capsule.boundingBox())?.height)
      .toBeGreaterThanOrEqual(242);
    expect((await capsule.boundingBox())?.height).toBeLessThanOrEqual(246);
    expect(await capsule.evaluate((node) => getComputedStyle(node).borderRadius)).toBe("12px");

    const selected = ratings.last();
    expect(await selected.evaluate((node) => getComputedStyle(node).backgroundColor)).toBe(
      "rgb(224, 240, 255)",
    );
    expect(
      await selected.locator("path").first().evaluate((node) => getComputedStyle(node).fill),
    ).toBe("rgb(0, 104, 214)");

    const textarea = capsule.locator('[data-slot="feedback-textarea"]');
    await textarea.fill("Inline draft");
    await page.keyboard.press("Escape");
    await expect(capsule).toHaveAttribute("data-state", "closed");
    await expect.poll(async () => (await capsule.boundingBox())?.height).toBe(48);
    for (const radio of await ratings.all()) await expect(radio).toHaveAttribute("aria-checked", "false");
    await expect(textarea).toHaveValue("Inline draft");

    await ratings.last().click();
    await expect(capsule).toHaveAttribute("data-state", "open");
    await expect(textarea).toHaveValue("Inline draft");
  });

  test("caps the expanded Inline width on narrow screens and honors reduced motion", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#/components/feedback");
    const capsule = page.locator('[data-demo-card="Inline"] [data-slot="rating-pill"]');
    await capsule.getByRole("radio").last().click();
    const box = await capsule.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(288);
    expect(await capsule.evaluate((node) => getComputedStyle(node).transitionProperty)).toBe(
      "none",
    );
  });

  test("matches the measured selected colors in dark mode", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem("geist-theme-preference", "dark");
    });
    await page.reload();
    const capsule = page.locator('[data-demo-card="Inline"] [data-slot="rating-pill"]');
    const selected = capsule.getByRole("radio").last();
    await selected.click();
    await expect
      .poll(() => selected.evaluate((node) => getComputedStyle(node).backgroundColor))
      .toBe("rgb(15, 47, 87)");
    await expect
      .poll(() =>
        selected.locator("path").first().evaluate((node) => getComputedStyle(node).fill),
      )
      .toBe("rgb(82, 168, 255)");
  });

  test("renders the six official demos and keeps select, metadata and adornment variants usable", async ({
    page,
  }) => {
    const demoIds = [
      "Default",
      "Inline",
      "Feedback with Select",
      "Feedback with metadata",
      "Feedback with prefix",
      "Feedback with suffix",
    ];
    for (const id of demoIds) await expect(page.locator(`[data-demo-card="${id}"]`)).toHaveCount(1);
    const localExtension = page.locator('[data-demo-card="Local RatingPill extension"]');
    await expect(localExtension).toHaveCount(1);
    await expect(localExtension.locator('[data-slot="rating-pill"]').first()).toHaveClass(
      /bg-success-soft/,
    );

    const selectCard = page.locator('[data-demo-card="Feedback with Select"]');
    await selectCard.locator('[data-slot="feedback-trigger"]').click();
    const topicSelect = page.locator('[data-slot="feedback-popup"] select');
    await topicSelect.selectOption("AI");
    await expect(topicSelect).toHaveValue("AI");
    await page.keyboard.press("Escape");

    await expect(
      page.locator('[data-demo-card="Feedback with metadata"] [data-slot="feedback-trigger"]'),
    ).toBeVisible();
    await expect(page.locator('[data-demo-card="Feedback with prefix"] svg')).not.toHaveCount(0);
    await expect(page.locator('[data-demo-card="Feedback with suffix"] svg')).not.toHaveCount(0);
  });

  test("uses the compact localized footer label without clipping", async ({ page }) => {
    await page.goto("/#/grid");
    const footer = page.locator('[data-slot="feedback-anchor"] [data-slot="rating-pill"]');
    const label = footer.locator("p");
    await expect(label).toHaveText("提供反馈");
    expect(await label.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
  });
});