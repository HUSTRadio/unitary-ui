import { expect, test, type Locator, type Page } from "@playwright/test";

type Theme = "light" | "dark";
type Kind = "sidebar-nav" | "tabs";
type Mode = "Disabled" | "On reload" | "Always";

async function openDocs(page: Page, path: string, theme: Theme, collapsed: string[] = []) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.addInitScript(({ theme, collapsed }) => {
    localStorage.setItem("unitary-docs-language", "en-US");
    localStorage.setItem("unitary-theme-preference", theme);
    localStorage.setItem("unitary.docs.sidebar.collapsed-groups", JSON.stringify(collapsed));
  }, { theme, collapsed });
  await page.goto(`/#${path}`);
  await expect(page.locator('[data-slot="navbar"]').first()).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
  await settled(page.locator('[data-slot="docs-sidebar"] [data-slot="sidebar-nav"]'));
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
}

async function settled(root: Locator) {
  await expect(root).not.toHaveAttribute("data-scroll-tracking-state", /pending|running/);
}

async function frames(page: Page, count = 12) {
  await page.evaluate((count) => new Promise<void>((resolve) => {
    const next = () => { if (--count <= 0) resolve(); else requestAnimationFrame(next); };
    requestAnimationFrame(next);
  }), count);
}

async function verticalGeometry(owner: Locator, item: Locator) {
  const itemBox = await item.boundingBox();
  expect(itemBox).not.toBeNull();
  return owner.evaluate((node, top) => {
    const box = node.getBoundingClientRect();
    return {
      position: node.scrollTop,
      maximum: node.scrollHeight - node.clientHeight,
      offset: top - box.top - node.clientTop,
    };
  }, itemBox!.y);
}

async function expectVerticalPosition(owner: Locator, item: Locator, inset = 8) {
  await expect.poll(async () => {
    const geometry = await verticalGeometry(owner, item);
    const expected = Math.min(geometry.maximum, Math.max(0, geometry.position + geometry.offset - inset));
    return Math.abs(geometry.position - expected);
  }).toBeLessThanOrEqual(1);
}

function demo(page: Page, kind: Kind) {
  const fixture = page.locator(`[data-slot="${kind}-scroll-tracking-demo"]`);
  const root = fixture.locator(`[data-slot="${kind}"]`);
  const owner = kind === "tabs" ? root : fixture.locator('[data-slot="scroll-tracking-viewport"]');
  const item = (index: number) => kind === "tabs"
    ? root.getByRole("tab", { name: `View ${index}`, exact: true })
    : root.getByRole("link", { name: `Page ${index}`, exact: true });
  const active = kind === "tabs"
    ? root.locator('[role="tab"][aria-selected="true"]')
    : root.locator('[data-slot="sidebar-nav-item"][aria-current="page"]');
  return { page, kind, fixture, root, owner, item, active };
}

type Demo = ReturnType<typeof demo>;

async function openDemo(page: Page, kind: Kind, theme: Theme) {
  await openDocs(page, `/components/${kind}`, theme);
  const surface = demo(page, kind);
  await surface.fixture.scrollIntoViewIfNeeded();
  await expect(surface.fixture).toBeVisible();
  await settled(surface.root);
  await expectDemoPosition(surface, 6);
  return surface;
}

async function selectControl(surface: Demo, slot: string, label: string) {
  await surface.fixture.locator(`[data-slot="${slot}"]`).getByRole("combobox").click();
  await surface.page.getByRole("option", { name: label, exact: true }).click();
}

async function setMode(surface: Demo, mode: Mode) {
  await selectControl(surface, "scroll-tracking-mode", mode);
}

async function setTarget(surface: Demo, index: number) {
  await selectControl(surface, "scroll-tracking-target", `${surface.kind === "tabs" ? "View" : "Page"} ${index}`);
  await expect(surface.active).toHaveText(`${surface.kind === "tabs" ? "View" : "Page"} ${index}`);
}

async function position(surface: Demo) {
  return surface.owner.evaluate((node, kind) => kind === "tabs" ? node.scrollLeft : node.scrollTop, surface.kind);
}

async function expectDemoPosition(surface: Demo, index: number) {
  if (surface.kind === "sidebar-nav") {
    await expectVerticalPosition(surface.owner, surface.item(index), (index - 1) % 4 === 0 ? 4 : 8);
    return;
  }
  await expect.poll(async () => surface.owner.evaluate((node, index) => {
    const tab = node.querySelectorAll<HTMLElement>('[role="tab"]')[index - 1];
    const ownerBox = node.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    const rtl = getComputedStyle(node).direction === "rtl";
    const viewportStart = rtl
      ? ownerBox.left + node.clientLeft + node.clientWidth
      : ownerBox.left + node.clientLeft;
    const offset = rtl ? viewportStart - tabBox.right : tabBox.left - viewportStart;
    const current = rtl ? -node.scrollLeft : node.scrollLeft;
    const maximum = node.scrollWidth - node.clientWidth;
    const expected = Math.min(maximum, Math.max(0, current + offset - 16));
    return Math.abs(current - expected);
  }, index)).toBeLessThanOrEqual(1);
}

async function motionDuration(surface: Demo, duration: string) {
  await surface.fixture.evaluate((node, value) => {
    (node as HTMLElement).style.setProperty("--uni-motion-state", value);
  }, duration);
}

async function observeMotion(surface: Demo) {
  await surface.fixture.evaluate((node, kind) => {
    const root = node.querySelector<HTMLElement>(`[data-slot="${kind}"]`)!;
    const owner = kind === "tabs" ? root : node.querySelector<HTMLElement>('[data-slot="scroll-tracking-viewport"]')!;
    const fixture = node as HTMLElement;
    fixture.dataset.motionTrace = "[]";
    fixture.dataset.sawRunning = "false";
    const trace: { elapsed: number; position: number }[] = [];
    let started: number | undefined;
    let sampling = false;
    const sample = (now: number) => {
      started ??= now;
      trace.push({ elapsed: now - started, position: kind === "tabs" ? owner.scrollLeft : owner.scrollTop });
      fixture.dataset.motionTrace = JSON.stringify(trace);
      if (root.dataset.scrollTrackingState === "running") requestAnimationFrame(sample);
    };
    const observer = new MutationObserver(() => {
      if (root.dataset.scrollTrackingState === "running") {
        fixture.dataset.sawRunning = "true";
        if (!sampling) { sampling = true; requestAnimationFrame(sample); }
      }
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-scroll-tracking-state"] });
  }, surface.kind);
}

for (const theme of ["light", "dark"] as const) {
  test(`docs direct load and reload align the active category heading (${theme})`, async ({ page }) => {
    await openDocs(page, "/components/lazy-load", theme);
    const sidebar = page.locator('[data-slot="docs-sidebar"]');
    const root = sidebar.locator('[data-slot="sidebar-nav"]');
    const button = sidebar.getByRole("link", { name: "Lazy Load", exact: true });
    await expect(button).toHaveAttribute("aria-current", "page");
    const heading = root.locator('[data-scroll-tracking-category]');
    await expect(heading).toHaveText("Network & Async");
    await expectVerticalPosition(sidebar, heading, 16);
    expect((await verticalGeometry(sidebar, button)).offset).toBeGreaterThan(16);
    expect(await sidebar.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);

    await sidebar.evaluate((node) => { node.scrollTop = 0; });
    await page.reload();
    await expect(root).toBeVisible();
    await settled(root);
    await expectVerticalPosition(sidebar, heading, 16);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test(`docs on-reload preserves manual sidebar position on subsequent route activation (${theme})`, async ({ page }) => {
    await openDocs(page, "/components/button", theme);
    const sidebar = page.locator('[data-slot="docs-sidebar"]');
    await sidebar.evaluate((node) => { node.scrollTop = 240; });
    const before = await sidebar.evaluate((node) => node.scrollTop);
    await page.evaluate(() => { location.hash = "/components/link"; });
    await expect(sidebar.getByRole("link", { name: "Link", exact: true })).toHaveAttribute("aria-current", "page");
    await frames(page);
    await settled(sidebar.locator('[data-slot="sidebar-nav"]'));
    expect(await sidebar.evaluate((node) => node.scrollTop)).toBe(before);
  });

  test(`docs reload alignment uses restored group geometry and opens the active group (${theme})`, async ({ page }) => {
    await openDocs(page, "/components/button", theme, ["foundations", "layout", "api", "components"]);
    const sidebar = page.locator('[data-slot="docs-sidebar"]');
    for (const label of ["Foundations", "Layout & Organization", "API"]) {
      const heading = sidebar.getByRole("button", { name: label, exact: true });
      await expect(heading).toHaveAttribute("aria-expanded", "false");
      await expect.poll(() => heading.locator("..").locator('[data-slot="sidebar-nav-content"]').evaluate((node) => node.getBoundingClientRect().height)).toBeLessThanOrEqual(1);
    }
    await expect(sidebar.getByRole("button", { name: "Components", exact: true })).toHaveAttribute("aria-expanded", "true");
    const category = sidebar.locator('[data-scroll-tracking-category]');
    await expect(category).toHaveText("Actions");
    await expectVerticalPosition(sidebar, category, 8);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });

  test(`docs ungrouped category clamps at the sidebar scroll limit (${theme})`, async ({ page }) => {
    await openDocs(page, "/patterns/app-shell", theme);
    const sidebar = page.locator('[data-slot="docs-sidebar"]');
    const target = sidebar.locator('[data-scroll-tracking-category]');
    await expect(target).toHaveAttribute("data-slot", "sidebar-nav-heading");
    await expectVerticalPosition(sidebar, target, 16);
    const geometry = await verticalGeometry(sidebar, target);
    expect(geometry.maximum).toBeGreaterThan(0);
    expect(Math.abs(geometry.position - geometry.maximum)).toBeLessThanOrEqual(1);
    expect(geometry.offset).toBeGreaterThan(16);
  });

  test(`sidebar optionally aligns category headings and switches back to the active item (${theme})`, async ({ page }) => {
    const surface = await openDemo(page, "sidebar-nav", theme);
    const loaded = await position(surface);
    await selectControl(surface, "scroll-tracking-alignment", "Category heading");
    await frames(page);
    expect(await position(surface)).toBe(loaded);
    await surface.fixture.locator('[data-slot="scroll-tracking-remount"]').click();
    await settled(surface.root);
    const heading = surface.root.locator('[data-scroll-tracking-category]');
    await expect(heading).toHaveText("Category 2");
    await expectVerticalPosition(surface.owner, heading, 16);
    await expect(surface.active).toHaveText("Page 6");
    await setMode(surface, "Always");
    await setTarget(surface, 2);
    await settled(surface.root);
    await expect(heading).toHaveText("Category 1");
    await expectVerticalPosition(surface.owner, heading, 8);
    await setTarget(surface, 10);
    await settled(surface.root);
    await expect(heading).toHaveText("Category 3");
    await expectVerticalPosition(surface.owner, heading, 16);
    await selectControl(surface, "scroll-tracking-alignment", "Current item");
    await settled(surface.root);
    await expectDemoPosition(surface, 10);
  });

  test(`sidebar primary position leaves spacing but no previous text fragment (${theme})`, async ({ page }) => {
    const surface = await openDemo(page, "sidebar-nav", theme);
    const previousText = surface.item(5).locator("span.truncate");
    const previousBox = await previousText.boundingBox();
    const viewportTop = await surface.owner.evaluate((node) => node.getBoundingClientRect().top + node.clientTop);
    expect(previousBox!.y + previousBox!.height).toBeLessThan(viewportTop);
    expect((await verticalGeometry(surface.owner, surface.item(6))).offset).toBeCloseTo(8);
  });

  for (const kind of ["sidebar-nav", "tabs"] as const) {
    test(`${kind} disabled and on-reload modes leave later activations under user control (${theme})`, async ({ page }) => {
      const surface = await openDemo(page, kind, theme);
      const loaded = await position(surface);
      expect(Math.abs(loaded)).toBeGreaterThan(0);
      await setTarget(surface, 9);
      await frames(page);
      await settled(surface.root);
      expect(await position(surface)).toBe(loaded);

      await surface.fixture.locator('[data-slot="scroll-tracking-remount"]').click();
      await settled(surface.root);
      await expectDemoPosition(surface, 9);
      await setMode(surface, "Disabled");
      await surface.fixture.locator('[data-slot="scroll-tracking-remount"]').click();
      await frames(page);
      expect(await position(surface)).toBe(0);
      await expect(surface.root).not.toHaveAttribute("data-scroll-tracking-state", /.+/);
      await setTarget(surface, 4);
      await frames(page);
      expect(await position(surface)).toBe(0);
      await expect(surface.root).not.toHaveAttribute("data-scroll-tracking-state", /.+/);
    });

    test(`${kind} always follows external selection and clamps both content boundaries (${theme})`, async ({ page }) => {
      const surface = await openDemo(page, kind, theme);
      await setMode(surface, "Always");
      await settled(surface.root);
      for (const index of [9, 1, 12, 5]) {
        await setTarget(surface, index);
        await settled(surface.root);
        await expectDemoPosition(surface, index);
        if (kind === "tabs" && index === 1) expect(await position(surface)).toBe(0);
        if (index === 12) {
          const maximum = await surface.owner.evaluate((node, kind) => kind === "tabs"
            ? node.scrollWidth - node.clientWidth : node.scrollHeight - node.clientHeight, kind);
          expect(Math.abs(await position(surface) - maximum)).toBeLessThanOrEqual(1);
        }
      }
      const bounds = await surface.owner.evaluate((node, kind) => ({
        maximum: kind === "tabs" ? node.scrollWidth - node.clientWidth : node.scrollHeight - node.clientHeight,
        crossAxis: kind === "tabs" ? node.scrollTop : node.scrollLeft,
      }), kind);
      expect(bounds.maximum).toBeGreaterThan(0);
      expect(bounds.crossAxis).toBe(0);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
    });

    test(`${kind} uses inherited project motion duration and a nonlinear curve (${theme})`, async ({ page }) => {
      const surface = await openDemo(page, kind, theme);
      await setMode(surface, "Always");
      await settled(surface.root);
      await surface.owner.evaluate((node, kind) => {
        if (kind === "tabs") node.scrollLeft = 0; else node.scrollTop = 0;
      }, kind);
      await motionDuration(surface, "2s");
      await observeMotion(surface);
      await setTarget(surface, 9);
      await settled(surface.root);
      await expectDemoPosition(surface, 9);
      const trace = await surface.fixture.evaluate((node) => JSON.parse((node as HTMLElement).dataset.motionTrace!) as { elapsed: number; position: number }[]);
      expect(trace.length).toBeGreaterThan(10);
      const midpoint = trace.find((sample) => sample.elapsed >= 950);
      expect(midpoint).toBeDefined();
      const final = await position(surface);
      const fraction = (midpoint!.position - trace[0].position) / (final - trace[0].position);
      // cubic-bezier(0.4, 0, 0.2, 1) travels roughly 77% at half its duration.
      expect(fraction).toBeGreaterThan(0.65);
      expect(fraction).toBeLessThan(0.9);
      expect(trace.at(-1)!.elapsed).toBeGreaterThanOrEqual(1800);
      expect(trace.at(-1)!.elapsed).toBeLessThan(2400);
    });

    test(`${kind} manual scrolling cancels an in-flight animation until the next activation (${theme})`, async ({ page }) => {
      const surface = await openDemo(page, kind, theme);
      await setMode(surface, "Always");
      await settled(surface.root);
      await motionDuration(surface, "2s");
      await setTarget(surface, 10);
      await expect(surface.root).toHaveAttribute("data-scroll-tracking-state", "running");
      await surface.owner.dispatchEvent("wheel", { deltaY: kind === "tabs" ? 0 : 80, deltaX: kind === "tabs" ? 80 : 0 });
      await settled(surface.root);
      await surface.owner.evaluate((node, kind) => {
        if (kind === "tabs") node.scrollLeft = 30; else node.scrollTop = 30;
      }, kind);
      const manual = await position(surface);
      await frames(page, 18);
      expect(await position(surface)).toBe(manual);
      await motionDuration(surface, "150ms");
      await setTarget(surface, 4);
      await settled(surface.root);
      await expectDemoPosition(surface, 4);
    });

    test(`${kind} rapid activation finishes at the latest target (${theme})`, async ({ page }) => {
      const surface = await openDemo(page, kind, theme);
      await setMode(surface, "Always");
      await settled(surface.root);
      await motionDuration(surface, "2s");
      await setTarget(surface, 11);
      await expect(surface.root).toHaveAttribute("data-scroll-tracking-state", "running");
      await setTarget(surface, 3);
      await settled(surface.root);
      await expectDemoPosition(surface, 3);
      await frames(page);
      await expectDemoPosition(surface, 3);
    });

    test(`${kind} reduced motion places the active item without animation (${theme})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      const surface = await openDemo(page, kind, theme);
      await setMode(surface, "Always");
      await settled(surface.root);
      await motionDuration(surface, "2s");
      await observeMotion(surface);
      await setTarget(surface, 9);
      await settled(surface.root);
      await expectDemoPosition(surface, 9);
      const trace = await surface.fixture.evaluate((node) => JSON.parse((node as HTMLElement).dataset.motionTrace!) as { elapsed: number; position: number }[]);
      const final = await position(surface);
      for (const sample of trace) expect(Math.abs(sample.position - final)).toBeLessThanOrEqual(1);
      expect(trace.at(-1)?.elapsed ?? 0).toBeLessThan(100);
    });
  }

  test(`Tabs aligns the active item from the logical inline start in RTL (${theme})`, async ({ page }) => {
    const surface = await openDemo(page, "tabs", theme);
    await selectControl(surface, "scroll-tracking-direction", "Right to left");
    await setMode(surface, "Always");
    await settled(surface.root);
    for (const index of [8, 1, 12]) {
      await setTarget(surface, index);
      await settled(surface.root);
      await expectDemoPosition(surface, index);
      expect(await position(surface)).toBeLessThanOrEqual(0);
    }
    expect(await surface.root.evaluate((node) => node.scrollTop)).toBe(0);
  });

  test(`Tabs keyboard activation follows the selected tab while retaining focus (${theme})`, async ({ page }) => {
    const surface = await openDemo(page, "tabs", theme);
    await setMode(surface, "Always");
    await settled(surface.root);
    await surface.item(6).evaluate((node) => (node as HTMLElement).focus({ preventScroll: true }));
    await page.keyboard.press("End");
    await expect(surface.item(12)).toHaveAttribute("aria-selected", "true");
    await settled(surface.root);
    await expectDemoPosition(surface, 12);
    await expect(surface.item(12)).toBeFocused();
    await page.keyboard.press("Home");
    await expect(surface.item(1)).toHaveAttribute("aria-selected", "true");
    await settled(surface.root);
    await expectDemoPosition(surface, 1);
    await expect(surface.item(1)).toBeFocused();
    expect(await position(surface)).toBe(0);
  });
}
