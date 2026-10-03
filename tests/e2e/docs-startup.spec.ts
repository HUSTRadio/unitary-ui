import { expect, test } from "@playwright/test";

test.setTimeout(90_000);

for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 1440]) {
    test(`docs home defers demos and keeps navigation usable during loading (${theme}, ${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((value) => {
        localStorage.setItem("unitary-theme-preference", value);
        localStorage.setItem("unitary-docs-language", "en-US");
      }, theme);
      const errors: string[] = [];
      const requests: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("request", (request) => requests.push(request.url()));

      let release!: () => void;
      const pending = new Promise<void>((resolve) => { release = resolve; });
      await page.route("**/site/src/pages/tokens.tsx*", async (route) => {
        await pending;
        await route.continue();
      });

      await page.goto("/");
      await expect(page.locator("#main-content h1")).toHaveText("Unitary");
      await page.waitForLoadState("networkidle");
      expect(requests.filter((url) => url.includes("/examples/"))).toEqual([]);
      expect(requests.some((url) => /docs-components-page|charts-gallery|pages\/tokens/.test(url))).toBe(false);
      const dependencies = requests.filter((url) => url.includes("/node_modules/.vite/"));
      expect(dependencies.length).toBeGreaterThan(0);
      expect(dependencies.every((url) => url.includes("/node_modules/.vite/docs/"))).toBe(true);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const navbar = page.locator('[data-slot="navbar"]').first();
      const headerBounds = await navbar.boundingBox();
      const mainBounds = await page.locator("#main-content").boundingBox();
      expect(mainBounds!.y).toBe(headerBounds!.y + headerBounds!.height);
      expect(mainBounds!.y + mainBounds!.height).toBe(900);

      // The command menu belongs to the ready shell, even when the destination is delayed.
      await page.keyboard.press("Control+k");
      await page.getByRole("combobox").fill("Global Tokens");
      await page.getByRole("option", { name: "Global Tokens", exact: true }).click();
      await expect(page.locator('[data-slot="docs-page-loading"]')).toHaveText("Loading...");
      await expect(page.locator('[data-slot="navbar"]').first()).toBeVisible();
      await page.getByRole("link", { name: "Unitary home", exact: true }).click();
      await expect(page.locator("#main-content h1")).toHaveText("Unitary");
      await page.goBack();
      await expect(page.locator('[data-slot="docs-page-loading"]')).toHaveText("Loading...");
      release();
      await expect(page.locator("#main-content h1")).toHaveText("Global Tokens");
      await expect(page.locator("[data-token-editor]")).toBeVisible();

      await page.goBack();
      await expect(page.locator("#main-content h1")).toHaveText("Unitary");
      await page.goForward();
      await expect(page.locator("#main-content h1")).toHaveText("Global Tokens");
      expect(requests.filter((url) => url.includes("/site/src/pages/tokens.tsx"))).toHaveLength(1);
      expect(requests.filter((url) => url.includes("/site/src/examples/"))).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}

test("a component deep link finishes loading its live demos and show code", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("unitary-docs-language", "en-US"));
  const errors: string[] = [];
  const requests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => requests.push(request.url()));
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/registry.ts?example-component=carousel", async (route) => {
    await pending;
    await route.continue();
  });
  await page.goto("/#/components/carousel");
  await expect(page.locator("#main-content h1")).toHaveText("Carousel");
  await expect(page.locator('[data-slot="docs-examples-loading"]')).toBeVisible();
  await expect(page.locator('[data-slot="navbar"]').first()).toBeVisible();
  release();
  await expect(page.locator('[data-demo-card="default"] [data-slot="carousel"]')).toBeVisible();
  await page.locator('[data-demo-card="default"]').getByRole("button", { name: "Show code" }).click();
  await expect(page.locator('[data-demo-card="default"] pre')).toContainText("Carousel");
  await page.waitForLoadState("networkidle");
  const exampleFiles = requests.filter((url) => url.includes("/examples/") && !url.includes("/registry.ts"));
  expect(exampleFiles.length).toBeGreaterThan(0);
  expect(exampleFiles.every((url) => url.includes("/examples/carousel/"))).toBe(true);
  await page.getByRole("link", { name: "Back to Components", exact: true }).click();
  await expect(page.locator("#main-content h1")).toHaveText("Components");
  await page.goBack();
  await expect(page.locator('[data-demo-card="default"] [data-slot="carousel"]')).toBeVisible();
  expect(requests.filter((url) => url.includes("registry.ts?example-component=carousel"))).toHaveLength(1);
  expect(errors).toEqual([]);
});

test("the component index loads without requesting any live example files", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("unitary-docs-language", "en-US"));
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/#/components");
  await expect(page.locator("#main-content h1")).toHaveText("Components");
  await page.waitForLoadState("networkidle");
  expect(requests.some((url) => /\/examples\/(?!registry\.ts)/.test(url))).toBe(false);
  expect(requests.some((url) => url.includes("?example-component="))).toBe(false);
});
