import { expect, test, type Locator, type Page } from "@playwright/test";
import { getComponentDocsPath } from "../../docs/site/src/data/docs-routes";

type Theme = "light" | "dark";
type Box = { x: number; y: number; width: number; height: number };
const markerSelector = "[data-selection-indicator]";
test.setTimeout(60_000);

async function open(page: Page, route: string, theme: Theme, reducedMotion = false) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: reducedMotion ? "reduce" : "no-preference" });
  await page.addInitScript((theme) => {
    localStorage.setItem("unitary-docs-language", "en-US");
    localStorage.setItem("unitary-theme-preference", theme);
    localStorage.removeItem("unitary.docs.sidebar.collapsed-groups");
    // Freeze only selection motion at creation, so assertions do not race the
    // compositor or depend on machine speed. Other page animations keep running.
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<typeof animate>) {
      const animation = animate.apply(this, args);
      if (this.hasAttribute("data-selection-indicator")) {
        animation.id = "selection-indicator-test";
        animation.pause();
        animation.currentTime = 0;
      }
      return animation;
    };
  }, theme);
  await page.goto(`/#${route}`);
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  await expect(page.locator('[data-slot="navbar"]').first()).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });
  await expect(page.locator('[data-slot="docs-sidebar"] [data-slot="sidebar-nav"]'))
    .not.toHaveAttribute("data-scroll-tracking-state", /pending|running/);
}

async function box(marker: Locator): Promise<Box> {
  // Hidden persistent markers intentionally keep their layout geometry, so use
  // the DOM rectangle rather than Playwright's visibility-sensitive box helper.
  return marker.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });
}

function close(actual: Box, expected: Box) {
  for (const key of ["x", "y", "width", "height"] as const) {
    expect(Math.abs(actual[key] - expected[key]), key).toBeLessThanOrEqual(0.5);
  }
}

async function scrub(marker: Locator, progress: number) {
  return marker.evaluate((node, progress) => {
    const animation = node.getAnimations().find((animation) => animation.id === "selection-indicator-test");
    if (!animation?.effect) {
      const style = getComputedStyle(node);
      throw new Error(`Expected selection indicator motion: ${JSON.stringify({
        duration: style.getPropertyValue("--uni-motion-state"),
        easing: style.getPropertyValue("--ease-snap"),
        group: node.closest("[data-selection-indicator-group]")?.tagName,
      })}`);
    }
    const timing = animation.effect.getTiming();
    const duration = Number(timing.duration);
    if (!(duration > 0)) throw new Error("Expected a positive selection duration");
    animation.pause();
    animation.currentTime = duration * progress;
    const rect = node.getBoundingClientRect();
    return {
      box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      duration,
      easing: timing.easing,
      visibility: getComputedStyle(node).visibility,
    };
  }, progress);
}

async function finish(marker: Locator) {
  await marker.evaluate((node) => node.getAnimations().filter((animation) => animation.id === "selection-indicator-test").forEach((animation) => animation.finish()));
  await expect.poll(() => motionCount(marker)).toBe(0);
  return box(marker);
}

function motionCount(marker: Locator) {
  return marker.evaluate((node) => node.getAnimations().filter((animation) => animation.id === "selection-indicator-test").length);
}

async function expectAligned(marker: Locator, item: Locator, axis: "vertical" | "horizontal") {
  const indicator = await box(marker);
  const target = await box(item);
  if (axis === "vertical") {
    expect(indicator.width).toBe(2);
    expect(indicator.height).toBe(14);
    expect(Math.abs(indicator.x - target.x - 8)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(indicator.y + indicator.height / 2 - target.y - target.height / 2)).toBeLessThanOrEqual(0.5);
  } else {
    expect(indicator.height).toBe(2);
    expect(Math.abs(indicator.x - target.x)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(indicator.width - target.width)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(indicator.y + indicator.height - target.y - target.height)).toBeLessThanOrEqual(1);
  }
}

async function expectNonlinear(marker: Locator, origin: Box, axis: "x" | "y") {
  const start = await scrub(marker, 0);
  close(start.box, origin);
  expect(start.visibility).toBe("visible");
  expect(start.easing).toMatch(/^cubic-bezier\(/);
  // Leave a margin for browser time rounding so fill:none stays discoverable.
  const destination = await scrub(marker, 0.99);
  const midpoint = await scrub(marker, 0.5);
  const distance = destination.box[axis] - origin[axis];
  expect(Math.abs(distance)).toBeGreaterThan(10);
  const ratio = (midpoint.box[axis] - origin[axis]) / distance;
  expect(ratio).toBeGreaterThan(0.65);
  expect(ratio).toBeLessThan(1);
  expect(midpoint.duration).toBe(start.duration);
  return { midpoint: midpoint.box, destination: destination.box };
}

async function activate(item: Locator, kind: "link" | "tab") {
  // DOM activation avoids Playwright scrolling an offscreen row before the
  // state change; this lets the test isolate indicator motion from scroll motion.
  await item.evaluate((node) => (node as HTMLElement).click());
  await expect(item).toHaveAttribute(kind === "link" ? "aria-current" : "aria-selected", kind === "link" ? "page" : "true");
}

for (const theme of ["light", "dark"] as const) {
  test(`docs blue indicator slides nonlinearly and continues interrupted motion (${theme})`, async ({ page }) => {
    await open(page, "/materials", theme);
    const sidebar = page.locator('[data-slot="docs-sidebar"] [data-slot="sidebar-nav"]');
    const active = sidebar.locator('[data-slot="sidebar-nav-indicator"]');
    await expect(active).toHaveCount(1);
    expect(await motionCount(active)).toBe(0);
    const origin = await box(active);
    const colors = sidebar.getByRole("link", { name: "Colors", exact: true });
    await activate(colors, "link");
    const { midpoint } = await expectNonlinear(active, origin, "y");
    const schemes = sidebar.locator('[data-slot="sidebar-nav-item"][href="/color-schemes"]');
    await activate(schemes, "link");
    close((await scrub(active, 0)).box, midpoint);
    await expect(active).toHaveCSS("background-color", "rgb(13, 71, 161)");
    await finish(active);
    await expectAligned(active, schemes, "vertical");
    await expect(sidebar.locator('[aria-current="page"]')).toHaveCount(1);
    await expect(sidebar.locator(`${markerSelector}:visible`)).toHaveCount(1);
    await expect(page).toHaveURL(/#\/color-schemes$/);
  });

  test(`sidebar indicator stays inside its lowest subgroup (${theme})`, async ({ page }) => {
    await open(page, getComponentDocsPath("sidebar-nav"), theme);
    const fixture = page.locator('[data-slot="sidebar-nav-scroll-tracking-demo"]');
    await fixture.scrollIntoViewIfNeeded();
    const sidebar = fixture.locator('[data-slot="sidebar-nav"]');
    await expect(sidebar).not.toHaveAttribute("data-scroll-tracking-state", /pending|running/);
    const page6 = sidebar.getByRole("link", { name: "Page 6", exact: true });
    const page9 = sidebar.getByRole("link", { name: "Page 9", exact: true });
    const scopes = await Promise.all([page6, page9].map((item) => item.evaluate((node) => {
      const scope = node.closest("[data-selection-indicator-group]");
      return { tag: scope?.tagName, text: scope?.textContent };
    })));
    expect(scopes[0].tag).toBe("UL");
    expect(scopes[1].tag).toBe("UL");
    expect(scopes[0].text).not.toBe(scopes[1].text);
    await activate(page9, "link");
    const active = sidebar.locator('[data-slot="sidebar-nav-indicator"]');
    expect(await motionCount(active)).toBe(0);
    await expectAligned(active, page9, "vertical");
    const origin = await box(active);
    const page12 = sidebar.getByRole("link", { name: "Page 12", exact: true });
    await activate(page12, "link");
    await expectNonlinear(active, origin, "y");
    await finish(active);
    await expectAligned(active, page12, "vertical");
  });

  test(`primary tabs slide and resize their underline without changing selection semantics (${theme})`, async ({ page }) => {
    await open(page, getComponentDocsPath("tabs"), theme);
    const tabs = page.getByRole("tablist", { name: "Component documentation", exact: true });
    await tabs.scrollIntoViewIfNeeded();
    const active = tabs.locator('[data-slot="tabs-indicator"]');
    expect(await motionCount(active)).toBe(0);
    const origin = await box(active);
    const usage = tabs.getByRole("tab", { name: "Usage", exact: true });
    await activate(usage, "tab");
    const { midpoint, destination } = await expectNonlinear(active, origin, "x");
    expect(Math.abs(destination.width - origin.width)).toBeGreaterThan(5);
    expect(midpoint.width).toBeLessThan(origin.width);
    expect(midpoint.width).toBeGreaterThan(destination.width);
    const api = tabs.getByRole("tab", { name: "API", exact: true });
    await activate(api, "tab");
    close((await scrub(active, 0)).box, midpoint);
    await finish(active);
    await expectAligned(active, api, "horizontal");
    await expect(tabs.locator('[aria-selected="true"]')).toHaveCount(1);
    await expect(tabs.locator(`${markerSelector}:visible`)).toHaveCount(1);
    const color = await active.evaluate((node) => getComputedStyle(node).backgroundColor);
    await expect(api).toHaveCSS("color", color);
  });

  test(`keyboard activation moves the primary underline correctly in RTL (${theme})`, async ({ page }) => {
    await open(page, getComponentDocsPath("tabs"), theme);
    const fixture = page.locator('[data-slot="tabs-scroll-tracking-demo"]');
    await fixture.scrollIntoViewIfNeeded();
    await fixture.locator('[data-slot="scroll-tracking-direction"]').getByRole("combobox").click();
    await page.getByRole("option", { name: "Right to left", exact: true }).click();
    await fixture.locator('[data-slot="scroll-tracking-remount"]').click();
    const tabs = fixture.getByRole("tablist");
    await expect(tabs).not.toHaveAttribute("data-scroll-tracking-state", /pending|running/);
    const active = tabs.locator('[data-slot="tabs-indicator"]');
    const view6 = tabs.getByRole("tab", { name: "View 6", exact: true });
    await view6.focus();
    const origin = await box(active);
    await page.keyboard.press("ArrowRight");
    const view7 = tabs.getByRole("tab", { name: "View 7", exact: true });
    await expect(view7).toHaveAttribute("aria-selected", "true");
    await expect(view7).toBeFocused();
    const { destination } = await expectNonlinear(active, origin, "x");
    expect(destination.x).toBeLessThan(origin.x);
    await finish(active);
    await expectAligned(active, view7, "horizontal");
  });

  test(`primary tabs keep indicator coordinates in a scaled container (${theme})`, async ({ page }) => {
    await open(page, getComponentDocsPath("tabs"), theme);
    const tabs = page.getByRole("tablist", { name: "Component documentation", exact: true });
    await tabs.scrollIntoViewIfNeeded();
    await tabs.evaluate((node) => {
      node.parentElement!.style.transform = "scale(0.8)";
      node.parentElement!.style.transformOrigin = "top left";
    });
    const active = tabs.locator('[data-slot="tabs-indicator"]');
    const origin = await box(active);
    const usage = tabs.getByRole("tab", { name: "Usage", exact: true });
    const destination = await box(usage.locator(markerSelector));
    await activate(usage, "tab");
    close((await scrub(active, 0)).box, origin);
    close(await finish(active), destination);
  });

  test(`reduced motion places vertical and horizontal indicators immediately (${theme})`, async ({ page }) => {
    await open(page, getComponentDocsPath("sidebar-nav"), theme, true);
    const sidebar = page.locator('[data-demo-container="default"] [data-slot="sidebar-nav"]');
    const projects = sidebar.getByRole("link", { name: "Projects", exact: true });
    await activate(projects, "link");
    const vertical = sidebar.locator('[data-slot="sidebar-nav-indicator"]');
    expect(await motionCount(vertical)).toBe(0);
    await expectAligned(vertical, projects, "vertical");
    await page.goto(`/#${getComponentDocsPath("tabs")}`);
    const tabs = page.getByRole("tablist", { name: "Component documentation", exact: true });
    const usage = tabs.getByRole("tab", { name: "Usage", exact: true });
    await activate(usage, "tab");
    const horizontal = tabs.locator('[data-slot="tabs-indicator"]');
    expect(await motionCount(horizontal)).toBe(0);
    await expectAligned(horizontal, usage, "horizontal");
  });
}
