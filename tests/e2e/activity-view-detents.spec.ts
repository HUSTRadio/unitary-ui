import { expect, test, type Page } from "@playwright/test";

async function openActivityView(page: Page, theme: "light" | "dark") {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript((value) => localStorage.setItem("unitary-theme-preference", value), theme);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/components/activity-view");
  await page.locator('[data-demo-card="default"]').getByRole("button", { name: "Share", exact: true }).click();
  const sheet = page.locator('[data-slot="bottom-sheet"]');
  const grabber = sheet.getByRole("slider");
  await expect(grabber).toHaveAttribute("aria-valuemax", "1");
  await expect(sheet.locator('[data-slot="activity-view-targets"] button')).toHaveCount(8);
  await expect(sheet.locator('[data-slot="activity-view-actions"] button')).toHaveCount(8);
  await sheet.scrollIntoViewIfNeeded();
  const card = page.locator('[data-demo-card="default"]');
  const frameHeight = await card.locator('[data-slot="sub-frame"]').evaluate((element) => element.clientHeight);
  // A usable local preview must preserve room for the long list and both detents.
  expect(frameHeight).toBeGreaterThanOrEqual(800);
  expect(await sheet.evaluate((element) => element.offsetParent?.getAttribute("data-slot"))).toBe("sub-frame");
  return { sheet, grabber, frameHeight };
}

async function expectHeight(sheet: ReturnType<Page["locator"]>, expected: number) {
  await expect.poll(async () => Math.round((await sheet.boundingBox())?.height ?? 0)).toBeCloseTo(expected, -1);
}

for (const theme of ["light", "dark"] as const) {
  test(`source listing expands without changing the overlay viewport (${theme})`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem("unitary-theme-preference", value), theme);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/components/activity-view");
    const card = page.locator('[data-demo-card="default"]');
    const frame = card.locator('[data-slot="sub-frame"]');
    await expect(frame).toBeVisible();
    const height = await frame.evaluate((element) => element.clientHeight);
    await card.getByRole("button", { name: /Show code|显示代码/ }).click();
    const code = card.locator("pre");
    await expect(code).toBeVisible();
    expect(await frame.evaluate((element) => element.clientHeight)).toBe(height);
    const bounds = await card.evaluate((element) => ({
      cardBottom: element.getBoundingClientRect().bottom,
      codeBottom: element.querySelector("pre")!.getBoundingClientRect().bottom,
    }));
    expect(bounds.codeBottom).toBeLessThanOrEqual(bounds.cardBottom);
  });

  test(`share sheet expands and its long action list remains usable (${theme})`, async ({ page }) => {
    const { sheet, grabber, frameHeight } = await openActivityView(page, theme);
    const alignment = await sheet.evaluate((element) => {
      const sheetBox = element.getBoundingClientRect();
      const grabber = element.querySelector('[data-slot="grabber"]')!;
      const buttonBox = grabber.getBoundingClientRect();
      const barBox = grabber.querySelector("span")!.getBoundingClientRect();
      return {
        sheetCenter: sheetBox.x + sheetBox.width / 2,
        buttonCenter: buttonBox.x + buttonBox.width / 2,
        barCenter: barBox.x + barBox.width / 2,
        buttonWidth: buttonBox.width,
        sheetWidth: sheetBox.width,
      };
    });
    expect(Math.abs(alignment.barCenter - alignment.sheetCenter)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(alignment.buttonCenter - alignment.sheetCenter)).toBeLessThanOrEqual(0.5);
    expect(alignment.buttonWidth).toBeCloseTo(alignment.sheetWidth, 0);
    await expect(grabber).toHaveAttribute("aria-valuenow", "0");
    await expectHeight(sheet, frameHeight * 0.6);
    const content = sheet.locator("div.overflow-y-auto");
    const initial = await content.evaluate((node) => ({ scroll: node.scrollHeight, visible: node.clientHeight }));
    expect(initial.scroll).toBeGreaterThan(initial.visible);
    await content.evaluate((node) => { node.scrollTop = node.scrollHeight; });
    expect(await content.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
    await content.evaluate((node) => { node.scrollTop = 0; });

    await grabber.focus();
    await page.keyboard.press("ArrowUp");
    await expect(grabber).toHaveAttribute("aria-valuenow", "1");
    await expectHeight(sheet, frameHeight * 0.9);
    const expanded = await content.evaluate((node) => ({ scroll: node.scrollHeight, visible: node.clientHeight }));
    expect(expanded.visible).toBeGreaterThan(initial.visible + 200);
    expect(expanded.scroll).toBeLessThanOrEqual(expanded.visible + 1);
    await expect(sheet.getByRole("button", { name: "Report Issue" })).toBeInViewport();
    await sheet.getByRole("button", { name: "Report Issue" }).click();
    await expect(sheet).toHaveCount(0);
    await expect(page.getByText("Report Issue").last()).toBeVisible();
  });

  test(`grabber drag expands to the second detent and can collapse (${theme})`, async ({ page }) => {
    const { sheet, grabber, frameHeight } = await openActivityView(page, theme);
    const bounds = await grabber.boundingBox();
    expect(bounds).not.toBeNull();
    const x = bounds!.x + bounds!.width / 2;
    const y = bounds!.y + bounds!.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, y - 270, { steps: 8 });
    await page.mouse.up();
    await expect(grabber).toHaveAttribute("aria-valuenow", "1");
    await expectHeight(sheet, frameHeight * 0.9);
    await grabber.focus();
    await page.keyboard.press("ArrowDown");
    await expect(grabber).toHaveAttribute("aria-valuenow", "0");
    await expectHeight(sheet, frameHeight * 0.6);
  });
}
