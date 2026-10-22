import { expect, type Page } from "@playwright/test";
import { LAYOUT_THEMES, LAYOUT_VIEWPORTS } from "../helpers/layout-matrix";

export { LAYOUT_THEMES, LAYOUT_VIEWPORTS };
export const languages = ["zh-CN", "en"] as const;
export async function preferences(page: Page, template: string, locale: string, theme: string) {
  await page.addInitScript(
    ({ template, locale, theme }) => {
      localStorage.setItem(`unitary-template-${template}-language`, locale);
      localStorage.setItem("unitary-theme-preference", theme);
      localStorage.setItem("unitary-texture-preference-v2", "solid");
    },
    { template, locale, theme },
  );
}
export async function layout(page: Page, locale: string, theme: string) {
  await expect(page.locator("html")).toHaveAttribute("lang", locale);
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  await expect(page.getByRole("main")).toBeVisible();
  expect(
    await page.getByRole("main").evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe("none");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  expect(overflow, "The page must not scroll horizontally").toBe(false);
  const names = await page
    .locator("button:visible")
    .evaluateAll(
      (buttons) =>
        buttons.filter(
          (button) =>
            !(
              button.textContent?.trim() ||
              button.getAttribute("aria-label") ||
              button.getAttribute("aria-labelledby")
            ),
        ).length,
    );
  expect(names, "Visible buttons have accessible names").toBe(0);
}
export async function mobileNavigation(page: Page, label: string) {
  const trigger = page.getByRole("button", { name: label, exact: true });
  if ((page.viewportSize()?.width ?? 1440) < 1024) {
    await expect(trigger).toBeVisible();
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(trigger).toBeFocused();
  } else {
    await expect(trigger).not.toBeVisible();
  }
}
export async function switchPreferences(page: Page, template: string) {
  await preferences(page, template, "zh-CN", "light");
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to English", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("radio", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "切换为中文", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
}
export async function packageSmoke(page: Page, template: string) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  await preferences(page, template, "en", "dark");
  await page.goto("/");
  await layout(page, "en", "dark");
  await page.evaluate(() => document.fonts.ready);
  const styles = await page.getByRole("main").evaluate((element) => ({
    color: getComputedStyle(element).color,
    background: getComputedStyle(document.body).backgroundColor,
    token: getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim(),
  }));
  expect(styles.token).not.toBe("");
  expect(styles.color).not.toBe(styles.background);
  expect(errors).toEqual([]);
}
