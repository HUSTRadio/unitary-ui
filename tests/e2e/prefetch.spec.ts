import { expect, test } from "@playwright/test";

test.setTimeout(90_000);

for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 1440]) {
    test(`intent prefetch shares a pending request with activation (${theme}, ${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((value) => {
        localStorage.setItem("unitary-docs-language", "en-US");
        localStorage.setItem("unitary-theme-preference", value);
      }, theme);
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      let release!: () => void;
      const gate = new Promise<void>((resolve) => { release = resolve; });
      let requests = 0;
      await page.route("**/prefetch-preview.json", async (route) => {
        requests++;
        await gate;
        await route.continue();
      });
      await page.goto("/#/components/prefetch");
      await expect(page.locator("#main-content h1")).toHaveText("Prefetch");
      const demo = page.locator('[data-slot="prefetch-demo"]');
      const open = demo.getByRole("button", { name: "Open preview", exact: true });
      await expect(demo.getByRole("status")).toContainText("Not started; Requests: 0");
      await open.hover();
      await expect(demo.getByRole("status")).toContainText("Preparing; Requests: 1");
      await open.click();
      expect(requests).toBe(1);
      release();
      await expect(demo.locator('[data-slot="prefetch-preview"]')).toBeVisible();
      await expect(demo.getByRole("status")).toContainText("Ready; Requests: 1");
      await demo.getByRole("button", { name: "Clear cache" }).click();
      await expect(demo.getByRole("status")).toContainText("Not started; Requests: 1");
      await page.keyboard.press("Shift+Tab");
      await expect(open).toBeFocused();
      await expect(demo.getByRole("status")).toContainText("Ready; Requests: 2");
      expect(requests).toBe(2);
      await page.screenshot({ path: `.scratch/prefetch/intent-${theme}-${width}.png` });
      expect(errors).toEqual([]);
    });
  }

  test(`viewport and idle prepare without activating the target (${theme})`, async ({ page }) => {
    await page.addInitScript((value) => {
      localStorage.setItem("unitary-docs-language", "en-US");
      localStorage.setItem("unitary-theme-preference", value);
    }, theme);
    await page.goto("/#/components/prefetch");
    const demo = page.locator('[data-slot="prefetch-strategies-demo"]');
    const viewport = demo.locator('[data-slot="prefetch-demo-viewport"]');
    await viewport.scrollIntoViewIfNeeded();
    await expect(demo.getByRole("status")).toHaveText("Status: idle; Requests: 0");
    await viewport.evaluate((element) => { element.scrollTop = element.scrollHeight; });
    await expect(demo.getByRole("status")).toHaveText("Status: ready; Requests: 1");
    await demo.getByRole("combobox", { name: "Prefetch trigger" }).click();
    await page.getByRole("option", { name: "Browser idle", exact: true }).click();
    await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBe(0);
    await expect(demo.getByRole("status")).toHaveText("Status: ready; Requests: 2");
  });

  test(`docs link intent warms only its page and examples and click reuses them (${theme})`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript((value) => {
      localStorage.setItem("unitary-docs-language", "en-US");
      localStorage.setItem("unitary-theme-preference", value);
    }, theme);
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));
    await page.goto("/");
    await expect(page.locator("#main-content h1")).toHaveText("Unitary");
    await page.waitForLoadState("networkidle");
    expect(requests.some((url) => url.includes("/examples/"))).toBe(false);
    const link = page.locator('[data-slot="docs-sidebar"] a[href="/components/carousel"]');
    await link.hover();
    await expect.poll(() => requests.filter((url) => url.includes("registry.ts?example-component=carousel")).length).toBe(1);
    await page.waitForLoadState("networkidle");
    expect(requests.filter((url) => url.includes("registry.ts?example-component=carousel"))).toHaveLength(1);
    await expect(page.locator("#main-content h1")).toHaveText("Unitary");
    await link.click();
    await expect(page.locator("#main-content h1")).toHaveText("Carousel");
    await expect(page.locator('[data-demo-card="default"] [data-slot="carousel"]')).toBeVisible();
    expect(requests.filter((url) => url.includes("registry.ts?example-component=carousel"))).toHaveLength(1);
    expect(requests.filter((url) => url.includes("/components/docs-components-page.tsx"))).toHaveLength(1);
    const examples = requests.filter((url) => url.includes("/examples/") && !url.includes("registry.ts"));
    expect(examples.every((url) => url.includes("/examples/carousel/"))).toBe(true);
  });
}

test.describe("touch intent", () => {
  test.use({ hasTouch: true });
  test("touch press prepares one request and activation consumes it", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => localStorage.setItem("unitary-docs-language", "en-US"));
    await page.goto("/#/components/prefetch");
    const demo = page.locator('[data-slot="prefetch-demo"]');
    await demo.getByRole("button", { name: "Open preview", exact: true }).tap();
    await expect(demo.locator('[data-slot="prefetch-preview"]')).toBeVisible();
    await expect(demo.getByRole("status")).toContainText("Requests: 1");
  });
});
