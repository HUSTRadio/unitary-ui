import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { artifactMode, artifactModule } from "./docs-artifact";

const fixtureUrl = artifactMode ? artifactModule("site/build/browser-fixtures.ts")
  : `/@fs/${path.resolve("docs/site/build/browser-fixtures.ts").replaceAll("\\", "/")}`;

async function prepare(page: Page, theme: string) {
  await page.addInitScript(theme => {
    localStorage.setItem("unitary-docs-language", "en-US");
    localStorage.setItem("unitary-theme-preference", theme);
    localStorage.setItem("unitary-texture-preference-v2", "glass");
  }, theme);
  await page.goto("/#/components/select");
  await expect(page.locator("#main-content h1")).toHaveText("Select");
  await page.evaluate(async url => { (await import(/* @vite-ignore */ url)).mountSelectLifecycleFixture(); }, fixtureUrl);
  await expect(page.locator("[data-select-lifecycle]")).toBeVisible();
}

for (const theme of ["light", "dark"]) {
  test(`Select keyboard, cancellation, controlled reopening and form reset: ${theme}`, async ({ page }) => {
    await prepare(page, theme);
    const fixture = page.locator("[data-select-lifecycle]");
    const trigger = fixture.getByRole("combobox", { name: "Controlled choice", exact: true });
    const list = page.getByRole("listbox");
    await fixture.getByRole("checkbox", { name: "Cancel item selection" }).check();
    await trigger.focus(); await page.keyboard.press("Enter");
    await expect(list).toBeVisible();
    await page.keyboard.press("Home"); await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("option", { name: "Beta" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(list).toBeVisible();
    await expect(fixture.locator("[data-select-commits]")).toHaveText("0");
    await page.getByRole("option", { name: "Beta" }).click();
    await expect(list).toBeVisible();
    await page.keyboard.press("Escape"); await expect(trigger).toBeFocused();
    await fixture.getByRole("checkbox", { name: "Cancel item selection" }).uncheck();
    await fixture.getByRole("checkbox", { name: "Decline controlled value" }).check();
    await trigger.click(); await page.getByRole("option", { name: "Beta" }).click();
    await expect(list).toBeHidden(); await expect(trigger).toContainText("Alpha");
    await expect(fixture.locator("[data-select-commits]")).toHaveText("1");
    await fixture.getByRole("checkbox", { name: "Decline controlled value" }).uncheck();
    for (let index = 0; index < 3; index++) {
      await trigger.click(); await expect(list).toBeVisible();
      await page.keyboard.press("Escape"); await expect(trigger).toBeFocused();
      await trigger.press("Enter"); await expect(list).toBeVisible();
      await page.getByRole("option", { name: "Beta" }).click();
      await expect(list).toBeHidden(); await expect(trigger).toHaveText("Beta");
    }
    await expect(fixture.locator("[data-select-value]")).toHaveText("b");
    await expect(fixture.locator("[data-select-commits]")).toHaveText("2");
    await trigger.click(); await expect(list).toBeVisible();
    // Drive the public controlled state while its modal layer keeps outside
    // controls inert, reversing close in the next frame rather than after exit.
    await fixture.getByRole("button", { name: "Interrupt controlled close", includeHidden: true }).evaluate((button: HTMLButtonElement) => button.click());
    await expect(fixture).toHaveAttribute("data-cycle", "1");
    await expect(fixture).toHaveAttribute("data-controlled-open", "true");
    await expect(list).toHaveCount(1); await expect(list).toBeVisible();
    await page.keyboard.press("Escape"); await expect(trigger).toBeFocused();
    await expect(fixture.getByRole("combobox", { name: "Disabled choice" })).toBeDisabled();
    const uncontrolled = fixture.getByRole("combobox", { name: "Uncontrolled choice" });
    await uncontrolled.click(); await page.getByRole("option", { name: "Beta" }).click();
    await expect(uncontrolled).toHaveText("Beta");
    const form = fixture.getByRole("form", { name: "Uncontrolled form" });
    await expect.poll(() => form.evaluate(node => new FormData(node as HTMLFormElement).get("choice"))).toBe("b");
    await fixture.getByRole("button", { name: "Reset choice" }).click();
    expect(await form.evaluate(node => new FormData(node as HTMLFormElement).get("choice"))).toBe("a");
    await expect(uncontrolled).toHaveText("Alpha");
  });
}

test.describe("Select trusted touch lifecycle", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  for (const theme of ["light", "dark"]) test(`touch selection and cancellation: ${theme}`, async ({ page }) => {
    await prepare(page, theme);
    const fixture = page.locator("[data-select-lifecycle]");
    const trigger = fixture.getByRole("combobox", { name: "Controlled choice", exact: true });
    await fixture.getByRole("checkbox", { name: "Cancel item selection" }).check();
    await trigger.tap(); await page.getByRole("option", { name: "Beta" }).tap();
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(fixture.locator("[data-select-commits]")).toHaveText("0");
    await page.keyboard.press("Escape");
    await fixture.getByRole("checkbox", { name: "Cancel item selection" }).uncheck();
    for (let index = 0; index < 3; index++) {
      await trigger.tap();
      await page.getByRole("option", { name: index % 2 ? "Alpha" : "Beta" }).tap();
      await expect(page.getByRole("listbox")).toBeHidden();
      await expect(trigger).toHaveText(index % 2 ? "Alpha" : "Beta");
    }
  });
});
