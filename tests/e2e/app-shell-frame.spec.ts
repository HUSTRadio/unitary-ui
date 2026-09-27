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
    // 回归（用户实测 2026-09-28）：滚动 owner 必须从 topbar 底边开始——否则滚动条
    // 轨道会纵贯顶栏右侧（顶栏必须留在滚动容器之外）。
    const scrollBounds = await frame.evaluate((node) => {
      const navbarBottom = node.querySelector('[data-slot="navbar"]')!.getBoundingClientRect().bottom;
      const viewportEl = node.querySelector('[data-slot="app-shell-viewport"]') as HTMLElement;
      return { navbarBottom, viewportTop: viewportEl.getBoundingClientRect().top };
    });
    expect(scrollBounds.viewportTop).toBeCloseTo(scrollBounds.navbarBottom, 0);

    await frame.locator('[data-slot="hamburger-trigger"]').click();
    const panel = frame.locator('[data-slot="expand-panel"]');
    const search = panel.getByRole("searchbox");
    await expect(search).toBeVisible();
    await search.fill("Overview");
    await expect(panel.locator('[data-slot="menu-results-region"]')).toBeVisible();
    const menuGeometry = await frame.evaluate((node) => {
      const frameBox = node.getBoundingClientRect();
      const navbarBox = node.querySelector('[data-slot="navbar"]')!.getBoundingClientRect();
      const panelEl = node.querySelector('[data-slot="expand-panel"]') as HTMLElement;
      const panelBox = panelEl.getBoundingClientRect();
      const overlayEl = node.querySelector('[data-state="open"][class*="overlay-scrim"]') as HTMLElement;
      const overlayBox = overlayEl.getBoundingClientRect();
      const panelStyle = getComputedStyle(panelEl);
      return {
        frameBox: { left: frameBox.left, right: frameBox.right, top: frameBox.top, bottom: frameBox.bottom },
        navbarBottom: navbarBox.bottom,
        panelBox: { left: panelBox.left, right: panelBox.right, top: panelBox.top, bottom: panelBox.bottom },
        overlayTop: overlayBox.top,
        panelTransform: panelStyle.transform,
        panelClipPath: panelStyle.clipPath,
      };
    });
    expect(menuGeometry.panelBox.top).toBeCloseTo(menuGeometry.navbarBottom, 0);
    // 回归（用户实测 2026-09-28）：面板顶边即 topbar 底边，遮罩必须同界（此前 inset-0
    // 把 topbar 压暗），且面板不得做整体位移（此前 -translate-y-full 让面板从容器顶部
    // 掉下来掠过 topbar），展开由 clip-path 在顶边完成。
    expect(menuGeometry.overlayTop).toBeCloseTo(menuGeometry.navbarBottom, 0);
    expect(menuGeometry.panelTransform).toBe("none");
    expect(menuGeometry.panelClipPath).not.toContain("100%");
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
