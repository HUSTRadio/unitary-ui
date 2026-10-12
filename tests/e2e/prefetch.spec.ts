import { expect, test } from "@playwright/test";
import { artifactMode, artifactModule, artifactModules, requestsModule } from "./docs-artifact";

const carouselModule = "site/src/examples/registry.ts?example-component=carousel";
// Shared demos retain their .example filename when Vite removes the source path.
const exampleChunks = artifactModules(/\/examples\/|\.example(?:[-.]|$)/);
const componentChunks = artifactModules(/example-component=/);
const carouselChunks = artifactModules(/example-component=carousel$|\/examples\/carousel\//);

function expectCarouselExamples(requests: readonly string[]) {
  const examples = artifactMode
    ? requests.filter((url) => exampleChunks.includes(new URL(url).pathname))
    : requests.filter((url) => url.includes("/examples/") && !url.includes("registry.ts"));
  expect(examples.length).toBeGreaterThan(0);
  if (artifactMode) {
    const paths = examples.map((url) => new URL(url).pathname);
    expect(paths).toContain(artifactModule(carouselModule));
    expect(paths.filter((path) => !carouselChunks.includes(path))).toEqual([]);
  } else {
    expect(examples.every((url) => url.includes("/examples/carousel/"))).toBe(true);
  }
}

test.setTimeout(90_000);

test.beforeAll(() => {
  if (artifactMode) {
    expect(componentChunks.length).toBeGreaterThan(0);
    expect(exampleChunks).toEqual(expect.arrayContaining(componentChunks));
    expect(componentChunks).toContain(artifactModule(carouselModule));
    expect(carouselChunks).toContain(artifactModule(carouselModule));
  }
});

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
      await page.goto("/#/network/prefetch");
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
    await page.goto("/#/network/prefetch");
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
    const carouselRequest = (url: string) => requestsModule(url, carouselModule, "registry.ts?example-component=carousel");
    expect(requests.some(carouselRequest)).toBe(false);
    const link = page.locator('[data-slot="docs-sidebar"] a[href="/components/carousel"]');
    await link.hover();
    await expect.poll(() => requests.filter(carouselRequest).length).toBe(1);
    await page.waitForLoadState("networkidle");
    expect(requests.filter(carouselRequest)).toHaveLength(1);
    expectCarouselExamples(requests);
    await expect(page.locator("#main-content h1")).toHaveText("Unitary");
    await link.click();
    await expect(page.locator("#main-content h1")).toHaveText("Carousel");
    await expect(page.locator('[data-demo-card="default"] [data-slot="carousel"]')).toBeVisible();
    expect(requests.filter(carouselRequest)).toHaveLength(1);
    expect(requests.filter((url) => requestsModule(url, "components/docs-components-page.tsx", "/components/docs-components-page.tsx"))).toHaveLength(1);
    expectCarouselExamples(requests);
    if (artifactMode) expect(requests.every((url) => !url.includes("/site/src/"))).toBe(true);
  });
}

test.describe("touch intent", () => {
  test.use({ hasTouch: true });
  test("touch press prepares one request and activation consumes it", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => localStorage.setItem("unitary-docs-language", "en-US"));
    await page.goto("/#/network/prefetch");
    const demo = page.locator('[data-slot="prefetch-demo"]');
    await demo.getByRole("button", { name: "Open preview", exact: true }).tap();
    await expect(demo.locator('[data-slot="prefetch-preview"]')).toBeVisible();
    await expect(demo.getByRole("status")).toContainText("Requests: 1");
  });
});
