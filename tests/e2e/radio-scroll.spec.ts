import { expect, test, type Locator, type Page } from "@playwright/test";

type Edge = "top" | "bottom";

test.setTimeout(60_000);

async function frames(page: Page) {
  await page.evaluate(() => new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  ));
}

async function openRadio(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("unitary-docs-language", "en-US");
    localStorage.setItem("unitary-theme-preference", "light");
    localStorage.removeItem("unitary-texture-preference");
  });
  await page.goto("/?lang=en-US#/components/radio");
  const group = page.locator('[data-slot="radio-group"]').first();
  const one = group.locator('input[value="one"]');
  const two = group.locator('input[value="two"]');
  const label = group.locator('[data-slot="radio-item-wrapper"]:has(input[value="two"])');
  await expect(one).toBeChecked();
  await expect(two).not.toBeChecked();
  await page.evaluate(() => document.fonts.ready);
  await frames(page);
  await group.evaluate((node) => {
    const counts = { click: 0, change: 0 };
    node.setAttribute("data-native-events", JSON.stringify(counts));
    for (const type of ["click", "change"] as const) {
      node.addEventListener(type, (event) => {
        if (event.target instanceof HTMLInputElement && event.target.type === "radio") {
          counts[type]++;
          node.setAttribute("data-native-events", JSON.stringify(counts));
        }
      }, true);
    }
  });
  return { group, one, two, label };
}

/** Pointer coordinates deliberately avoid Locator.click/check auto-scrolling. */
async function positionText(page: Page, label: Locator, edge: Edge) {
  await label.evaluate((node, edge) => {
    const main = document.getElementById("main-content")!;
    const viewport = main.getBoundingClientRect();
    const top = edge === "top" ? viewport.top + 2 : viewport.bottom - 4;
    main.scrollTop += node.getBoundingClientRect().top - top;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }, edge);
  await frames(page);
  const position = await label.evaluate((node) => {
    const main = document.getElementById("main-content")!;
    const viewport = main.getBoundingClientRect();
    const text = node.lastElementChild!.getBoundingClientRect();
    const top = Math.max(viewport.top + 1, text.top);
    const bottom = Math.min(viewport.bottom - 1, text.bottom);
    const x = text.left + text.width / 2;
    const y = (top + bottom) / 2;
    return {
      x, y, visibleTextHeight: bottom - top,
      hitsLabel: document.elementFromPoint(x, y)?.closest('[data-slot="radio-item-wrapper"]') === node,
      main: main.scrollTop, root: document.scrollingElement!.scrollTop, url: location.href,
    };
  });
  expect(position.visibleTextHeight).toBeGreaterThan(0);
  expect(position.hitsLabel).toBe(true);
  expect(position.main).toBeGreaterThan(0);
  return position;
}

async function expectPosition(page: Page, before: { main: number; root: number; url: string }) {
  await frames(page);
  const after = await page.evaluate(() => ({
    main: document.getElementById("main-content")!.scrollTop,
    root: document.scrollingElement!.scrollTop, url: location.href,
  }));
  expect(Math.abs(after.main - before.main)).toBeLessThanOrEqual(1);
  expect(after.root).toBe(before.root);
  expect(after.url).toBe(before.url);
}

for (const fixture of [
  { name: "desktop", viewport: { width: 1280, height: 700 }, deviceScaleFactor: 1, touch: false },
  { name: "touch", viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, touch: true },
  // 1280×700 physical pixels at 200% zoom have this CSS viewport and DPR.
  { name: "200% layout", viewport: { width: 640, height: 350 }, deviceScaleFactor: 2, touch: false },
] as const) {
  test.describe(`Radio label scroll (${fixture.name})`, () => {
    test.use({ viewport: fixture.viewport, deviceScaleFactor: fixture.deviceScaleFactor,
      hasTouch: fixture.touch, isMobile: fixture.touch });

    for (const edge of ["top", "bottom"] as const) {
      test(`${edge} edge text activation and repeated selection preserve scroll`, async ({ page }) => {
        const { group, two, label } = await openRadio(page);
        const before = await positionText(page, label, edge);
        const activate = async () => {
          if (fixture.touch) await page.touchscreen.tap(before.x, before.y);
          else await page.mouse.click(before.x, before.y);
        };
        await activate();
        await expect(two).toBeChecked();
        await expect(two).toBeFocused();
        await expect(group).toHaveAttribute("data-native-events", JSON.stringify({ click: 1, change: 1 }));
        await expectPosition(page, before);

        await activate();
        await expect(two).toBeChecked();
        await expect(two).toBeFocused();
        await expect(group).toHaveAttribute("data-native-events", JSON.stringify({ click: 2, change: 1 }));
        await expectPosition(page, before);
      });
    }
  });
}

test("Radio label click cancellation preserves native selection control", async ({ page }) => {
  const { group, one, two, label } = await openRadio(page);
  await label.evaluate((node) => node.addEventListener("click", (event) => event.preventDefault(), { once: true }));
  const before = await positionText(page, label, "top");
  await page.mouse.click(before.x, before.y);
  await expect(one).toBeChecked();
  await expect(two).not.toBeChecked();
  await expect(two).toBeFocused();
  await expect(group).toHaveAttribute("data-native-events", JSON.stringify({ click: 0, change: 0 }));
  await expectPosition(page, before);

  await page.mouse.click(before.x, before.y);
  await expect(two).toBeChecked();
  await expect(group).toHaveAttribute("data-native-events", JSON.stringify({ click: 1, change: 1 }));
  await expectPosition(page, before);
});

test("Radio keyboard selection, focus and group tab order remain native", async ({ page }) => {
  const { group, one, two } = await openRadio(page);
  await group.evaluate((node) => node.scrollIntoView({ block: "center" }));
  await one.focus();
  await page.keyboard.press("ArrowRight");
  await expect(two).toBeChecked();
  await expect(two).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(one).toBeChecked();
  await expect(one).toBeFocused();
  await page.keyboard.press("Space");
  await expect(one).toBeChecked();
  await expect(group).toHaveAttribute("data-native-events", JSON.stringify({ click: 2, change: 2 }));
  await two.focus();
  await expect(one).toBeChecked();
  await page.keyboard.press("Space");
  await expect(two).toBeChecked();
  await expect(two).toBeFocused();
  await expect(group).toHaveAttribute("data-native-events", JSON.stringify({ click: 3, change: 3 }));
  await page.keyboard.press("Tab");
  expect(await group.evaluate((node) => node.contains(document.activeElement))).toBe(false);
  await page.keyboard.press("Shift+Tab");
  await expect(two).toBeFocused();
});
