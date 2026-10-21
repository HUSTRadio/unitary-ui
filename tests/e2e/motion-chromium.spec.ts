import { expect, test } from "@playwright/test";
import { openMotionFixture as open } from "./helpers/motion";

test.setTimeout(60_000);

for (const theme of ["light", "dark"]) for (const width of [390, 1280]) {
  test(`reduced transparency removes the modal backdrop (${theme}, ${width})`, async ({ page }) => {
    await open(page, theme, width);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-transparency", value: "reduce" }, { name: "prefers-reduced-motion", value: "reduce" }] });
    await page.locator('[data-open="modal"]').click();
    const mask = page.locator('[data-material="mask-backdrop"]');
    await expect(mask).toHaveCSS("backdrop-filter", "none");
    await expect(mask).toHaveCSS("opacity", "1");
    await page.keyboard.press("Escape");
    await expect(mask).toHaveCount(0);
  });
}

test.describe("native touch paging", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("fade effects keep horizontal touch paging", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("unitary-docs-language", "en-US"));
  await page.goto("/#/components/carousel");
  const region = page.locator('[data-demo-container="variants"] [data-slot="full-page-scroller"]');
  await region.scrollIntoViewIfNeeded();
  const box = (await region.boundingBox())!;
  const x = box.x + box.width * 0.75,
    y = box.y + box.height / 2;
  const session = await page.context().newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: x - 90, y }],
  });
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(region).toHaveAttribute("data-index", "1");
  await expect(region.locator('[data-slot="full-page-section"]').nth(1)).toHaveCSS("opacity", "1");
  });
});
