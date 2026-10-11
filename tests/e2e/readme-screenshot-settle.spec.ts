import { chromium, expect, test } from "@playwright/test";
import {
  createCapturePage,
  settle,
  startPreview,
  stopPreview,
} from "../../scripts/capture-readme-screenshots.mjs";
import { cleanupReadmePreview } from "../../scripts/lib/readme-preview.mjs";

test("README production preview renders the real styleguide with the capture browser", async () => {
  const preview = await startPreview();
  let browser;
  try {
    browser = await chromium.launch();
    const page = await createCapturePage(browser);
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));
    await page.goto(preview.url, { waitUntil: "networkidle", timeout: 120_000 });
    await expect(page.locator("header nav")).toBeVisible();
    expect(await page.locator("header nav [data-styleguide-page]").count()).toBeGreaterThan(0);
    expect(requests.some((url) => new URL(url).pathname === "/@vite/client")).toBe(false);
    expect(requests.some((url) => new URL(url).pathname.startsWith("/src/"))).toBe(false);
    await settle(page);
    const session = await page.context().newCDPSession(page);
    await session.send("DOM.enable");
    await session.send("CSS.enable");
    const { root } = await session.send("DOM.getDocument");
    const { nodeId } = await session.send("DOM.querySelector", {
      nodeId: root.nodeId,
      selector: 'header nav [data-styleguide-page="tokens"]',
    });
    const { fonts } = await session.send("CSS.getPlatformFontsForNode", { nodeId });
    expect(fonts.length).toBeGreaterThan(0);
    expect(
      fonts.every((font) => font.isCustomFont),
      "README captures use shipped fonts even when full fonts are installed",
    ).toBe(true);
    await session.detach();
    expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
      true,
    );
    await page.close();
  } finally {
    try {
      if (browser) await browser.close();
    } finally {
      try {
        stopPreview(preview.child);
      } finally {
        await cleanupReadmePreview(preview.buildDir);
      }
    }
  }
});

for (const theme of ["light", "dark"]) {
  test(`README illustration is visible before lazy animation features load (${theme})`, async ({
    browser,
    baseURL,
  }) => {
    const page = await createCapturePage(browser);
    let release!: () => void;
    const ready = new Promise<void>((resolve) => {
      release = resolve;
    });
    let featuresRequested = false;
    await page.route("**/src/lib/motion-features.ts*", async (route) => {
      featuresRequested = true;
      await ready;
      await route.continue();
    });
    await page.addInitScript((value) => {
      localStorage.setItem("unitary-theme-preference", value);
    }, theme);
    try {
      await page.goto(`${baseURL}/#/components/hitu-player`, { waitUntil: "domcontentloaded" });
      const player = page.locator('[data-motion-hitu-demo] [data-slot="hitu-player"]').first();
      await player.scrollIntoViewIfNeeded();
      await expect.poll(() => featuresRequested).toBe(true);
      expect(
        await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches),
      ).toBe(true);
      await settle(page);
      await expect(player.locator("..")).toHaveCSS("opacity", "1");
      await expect(player).toHaveAttribute("data-playing", "false");
      await expect(player).toHaveAttribute("data-frame", "0");
      await expect(player.locator("[data-hitu-layer]")).toHaveCount(2);
      expect(
        await player.evaluate((element) =>
          [...element.querySelectorAll("[data-hitu-layer]")].every(
            (layer) => (layer as SVGGraphicsElement).getBBox().width > 0,
          ),
        ),
      ).toBe(true);
    } finally {
      release();
      await page.close();
    }
  });

  test(`README capture stops JavaScript motion and shows the static illustration (${theme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addInitScript((value) => {
      localStorage.setItem("unitary-theme-preference", value);
    }, theme);
    await page.goto("/#/components/hitu-player");
    const demo = page.locator("[data-motion-hitu-demo]").first();
    const player = demo.locator('[data-slot="hitu-player"]');
    await player.scrollIntoViewIfNeeded();
    await demo.locator("[data-motion-play]").click();
    await expect(player).toHaveAttribute("data-playing", "true");
    await expect.poll(() => player.getAttribute("data-frame")).not.toBe("0");

    await settle(page);

    expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
      true,
    );
    await expect(player).toHaveAttribute("data-playing", "false");
    await expect(player).toHaveAttribute("data-frame", "0");
    await expect(player.locator("..")).toHaveCSS("opacity", "1");
    expect(
      await demo.evaluate(
        (element) =>
          element
            .getAnimations({ subtree: true })
            .filter((animation) => animation.playState === "running" || animation.pending).length,
      ),
    ).toBe(0);
    await settle(page);
    await expect(player).toHaveAttribute("data-frame", "0");
    await expect(player.locator("..")).toHaveCSS("opacity", "1");
  });

  test(`README capture waits for newly mounted images (${theme})`, async ({ page }) => {
    let releaseImage!: () => void;
    const ready = new Promise<void>((resolve) => {
      releaseImage = resolve;
    });
    await page.route("**/delayed.svg", async (route) => {
      await ready;
      await route.fulfill({
        contentType: "image/svg+xml",
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="red"/></svg>',
      });
    });
    await page.route("**/clipped.svg", async (route) => {
      await ready;
      await route.abort();
    });
    await page.setContent(
      `<html class="${theme}"><body><img src="https://fixture.test/delayed.svg" width="80" height="80"><img loading="lazy" src="https://fixture.test/offscreen.svg" style="position:absolute;top:10000px" width="80" height="80"><div style="overflow:hidden;width:80px;height:80px"><img loading="lazy" src="https://fixture.test/clipped.svg" style="margin-left:160px" width="80" height="80"></div></body></html>`,
      { waitUntil: "domcontentloaded" },
    );
    let finished = false;
    const settling = settle(page).then(() => {
      finished = true;
    });
    try {
      await page.waitForTimeout(500);
      expect(finished).toBe(false);
    } finally {
      releaseImage();
    }
    await settling;
    expect(
      await page
        .locator("img")
        .first()
        .evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth === 80),
    ).toBe(true);
    expect(
      await page
        .locator("img")
        .nth(1)
        .evaluate((image: HTMLImageElement) => image.complete),
    ).toBe(false);
  });
}
