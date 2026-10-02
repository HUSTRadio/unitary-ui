import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"] as const) {
  test(`rounded input affixes form one capsule (${theme})`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem("unitary-theme-preference", value), theme);
    await page.goto("/#/components/input");
    for (const demo of ["rounded-prefix-and-suffix", "rounded-prefix-and-suffix-without-styling"]) {
      const card = page.locator(`[data-demo-card="${demo}"]`);
      await card.scrollIntoViewIfNeeded();
      const geometry = await card.evaluate((element) => {
        const prefix = element.querySelector<HTMLElement>('[data-slot="input-prefix"]')!;
        const suffix = element.querySelector<HTMLElement>('[data-slot="input-suffix"]')!;
        const a = getComputedStyle(prefix);
        const b = getComputedStyle(suffix);
        return {
          inner: [a.borderTopRightRadius, a.borderBottomRightRadius, b.borderTopLeftRadius, b.borderBottomLeftRadius],
          outer: [a.borderTopLeftRadius, a.borderBottomLeftRadius, b.borderTopRightRadius, b.borderBottomRightRadius],
          wrapper: getComputedStyle(prefix.parentElement!).borderTopLeftRadius,
        };
      });
      expect(geometry.inner).toEqual(["0px", "0px", "0px", "0px"]);
      expect(geometry.outer).toEqual(Array(4).fill(geometry.wrapper));
      expect(parseFloat(geometry.wrapper)).toBeGreaterThan(0);
      await expect(card.locator("input")).toBeVisible();
    }
  });
}
