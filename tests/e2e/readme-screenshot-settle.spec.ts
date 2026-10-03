import { expect, test } from "@playwright/test";
import { settle } from "../../scripts/capture-readme-screenshots.mjs";

for (const theme of ["light", "dark"]) {
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
