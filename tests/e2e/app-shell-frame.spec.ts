import { expect, test, type Page } from "@playwright/test";

const frameSelector = '[data-slot="app-shell-demo"]';

async function openDemo(page: Page, width: number, theme: "light" | "dark") {
  await page.setViewportSize({ width, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript((value) => localStorage.setItem("unitary-theme-preference", value), theme);
  await page.goto("/#/patterns/app-shell");
  return page.locator(frameSelector);
}

for (const [width, theme] of [[1080, "light"], [390, "dark"]] as const) {
  test(`App Shell menus and sheet stay inside their frame (${width}px, ${theme})`, async ({ page }) => {
    const frame = await openDemo(page, width, theme);
    const viewport = frame.locator('[data-slot="app-shell-viewport"]');
    await expect.poll(() => viewport.evaluate((node) => node.scrollHeight > node.clientHeight)).toBe(true);

    await frame.locator('[data-slot="hamburger-trigger"]').click();
    const panel = frame.locator('[data-slot="expand-panel"]');
    const search = panel.getByRole("searchbox");
    await expect(search).toBeVisible();
    await search.fill("Overview");
    await expect(panel.locator('[data-slot="menu-results-region"]')).toBeVisible();
    const menuGeometry = await frame.evaluate((node) => {
      const frameBox = node.getBoundingClientRect();
      const navbarBox = node.querySelector('[data-slot="navbar"]')!.getBoundingClientRect();
      const panelBox = node.querySelector('[data-slot="expand-panel"]')!.getBoundingClientRect();
      return { frameBox: { left: frameBox.left, right: frameBox.right, top: frameBox.top, bottom: frameBox.bottom }, navbarBottom: navbarBox.bottom, panelBox: { left: panelBox.left, right: panelBox.right, top: panelBox.top, bottom: panelBox.bottom } };
    });
    expect(menuGeometry.panelBox.top).toBeCloseTo(menuGeometry.navbarBottom, 0);
    expect(menuGeometry.panelBox.left).toBeGreaterThanOrEqual(menuGeometry.frameBox.left);
    expect(menuGeometry.panelBox.right).toBeLessThanOrEqual(menuGeometry.frameBox.right);
    expect(menuGeometry.panelBox.bottom).toBeLessThanOrEqual(menuGeometry.frameBox.bottom);
    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);

    await frame.getByRole("button", { name: /打开 BottomSheet|Open BottomSheet/ }).click();
    const sheet = frame.locator('[data-slot="bottom-sheet"]');
    await expect(sheet).toBeVisible();
    const bounds = await frame.evaluate((node) => {
      const frameBox = node.getBoundingClientRect();
      const sheetBox = node.querySelector('[data-slot="bottom-sheet"]')!.getBoundingClientRect();
      const overlay = node.querySelector('[data-state="open"][class*="overlay-scrim"]')!;
      const overlayBox = overlay.getBoundingClientRect();
      return {
        frame: { left: frameBox.left, right: frameBox.right, top: frameBox.top, bottom: frameBox.bottom, height: node.clientHeight },
        sheet: { left: sheetBox.left, right: sheetBox.right, bottom: sheetBox.bottom, height: sheetBox.height },
        overlay: { left: overlayBox.left, right: overlayBox.right, top: overlayBox.top, bottom: overlayBox.bottom },
      };
    });
    expect(bounds.frame.top).toBeGreaterThanOrEqual(-1);
    expect(bounds.frame.bottom).toBeLessThanOrEqual(801);
    expect(bounds.sheet.bottom).toBeCloseTo(bounds.frame.bottom - 1, 0);
    expect(bounds.sheet.height).toBeCloseTo(bounds.frame.height * 0.4, 0);
    expect(bounds.sheet.left).toBeGreaterThanOrEqual(bounds.frame.left);
    expect(bounds.sheet.right).toBeLessThanOrEqual(bounds.frame.right);
    expect(bounds.overlay.left).toBeCloseTo(bounds.frame.left + 1, 0);
    expect(bounds.overlay.top).toBeCloseTo(bounds.frame.top + 1, 0);
    expect(bounds.overlay.bottom).toBeCloseTo(bounds.frame.bottom - 1, 0);
    expect(bounds.overlay.right).toBeCloseTo(bounds.frame.right - 1, 0);

    const grabber = sheet.getByRole("slider");
    await grabber.focus();
    await page.keyboard.press("ArrowUp");
    await expect(grabber).toHaveAttribute("aria-valuenow", "1");
    await expect.poll(() => sheet.evaluate((node) => Math.round(node.getBoundingClientRect().height))).toBeCloseTo(Math.round(bounds.frame.height * 0.8), 0);
    await page.keyboard.press("Escape");
    await expect(sheet).toHaveCount(0);
  });
}
