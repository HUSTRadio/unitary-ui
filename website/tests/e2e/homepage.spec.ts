import { expect, test, type Page } from "@playwright/test";
import { LAYOUT_THEMES, LAYOUT_VIEWPORTS } from "../../../tests/e2e/helpers/layout-matrix";
import { WEBSITE_COPY, SECTION_IDS } from "../../src/content";
import { INSTALL_COMMAND } from "../../../docs/site/src/content/getting-started";

async function prepare(page: Page, theme = "light", language = "en-US") {
  await page.addInitScript(({ theme, language }) => {
    localStorage.setItem("unitary-theme-preference", theme);
    localStorage.setItem("unitary-website-language", language);
  }, { theme, language });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
}

async function progressGeometry(page: Page) {
  return page.evaluate(() => {
    const root=document.querySelector<HTMLElement>('[data-slot="full-page-scroller"]')!;
    const sections=Array.from(root.querySelectorAll<HTMLElement>('[data-slot="full-page-section"]'));
    const heights=sections.map(section=>Math.max(root.clientHeight,section.scrollHeight));
    const index=Number(root.dataset.index),total=heights.reduce((sum,height)=>sum+height,0),maximum=total-root.clientHeight;
    const position=Math.min(maximum,heights.slice(0,index).reduce((sum,height)=>sum+height,0)+sections[index].scrollTop);
    const indicator=document.querySelector<HTMLElement>('.website-scroll-progress')!,thumb=indicator.firstElementChild as HTMLElement;
    return {heights,index,top:sections[index].scrollTop,actual:Number(indicator.getAttribute('aria-valuenow')),
      expected:maximum?Math.round(position/maximum*100):0,
      actualSize:Number.parseFloat(thumb.style.height),expectedSize:root.clientHeight/total*100,
      actualOffset:Number.parseFloat(thumb.style.transform.match(/translateY\(([^%]+)%\)/)?.[1]??'NaN'),expectedOffset:position/root.clientHeight*100};
  });
}

async function expectProgressGeometry(page: Page) {
  await expect.poll(async()=>{const value=await progressGeometry(page);return value.actual===value.expected&&Math.abs(value.actualSize-value.expectedSize)<.01&&Math.abs(value.actualOffset-value.expectedOffset)<.01;}).toBe(true);
}

for (const viewport of LAYOUT_VIEWPORTS) for (const theme of LAYOUT_THEMES) for (const language of ["en-US", "zh-CN"] as const) {
  test(`${viewport.width} ${theme} ${language}: all five screens`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await prepare(page, theme, language);
    const copy = WEBSITE_COPY[language];
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const logo = page.locator(".website-logo");
    await expect(logo).toBeVisible();
    expect(await logo.evaluate((element: HTMLImageElement) => element.naturalWidth > 0)).toBe(true);
    for (let index = 0; index < 5; index++) {
      await expect(page.locator('[data-slot="full-page-scroller"]')).toHaveAttribute("data-index", String(index));
      await expect(page.locator(`#website-title-${index}`)).toBeVisible();
      await expect(page.locator('[data-slot="unitary-website"]')).toHaveAttribute("data-screen", SECTION_IDS[index]);
      await expect(page.getByRole("progressbar", { name: copy.scrollProgress })).toBeVisible();
      const section = page.locator('[data-slot="full-page-section"]').nth(index);
      await expect(section).toHaveCSS("scrollbar-width", "none");
      if (index > 0 && index < 4) {
        const slots = ["", "interaction-demo", "appearance-demo", "motion-demo"];
        await expect(page.locator(`[data-demo="${SECTION_IDS[index]}"] [data-slot="${slots[index]}"]`)).toBeVisible();
      }
      const bounds = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth <= innerWidth,
        header: document.querySelector("header")!.scrollWidth <= innerWidth,
        section: Array.from(document.querySelectorAll<HTMLElement>(".website-screen")).every(screen => screen.scrollWidth <= screen.clientWidth + 1),
      }));
      expect(bounds).toEqual({ document: true, header: true, section: true });
      if (index === 0 || (viewport.width === 1440 && language === "en-US")) {
        await page.screenshot({ path: testInfo.outputPath(`${SECTION_IDS[index]}.png`) });
      }
      if (index < 4) await page.getByRole("button", { name: copy.next, exact: true }).click();
    }
    await expect(page.locator('[data-demo="start"]')).toContainText(INSTALL_COMMAND);
    await expect(page.getByRole("link", { name: copy.completeGuide })).toHaveAttribute("href", `/docs/?lang=${language}#/`);
    expect(errors).toEqual([]);
  });
}

for (const theme of LAYOUT_THEMES) {
  test(`${theme}: whole-page progress follows paging and hidden nested scrolling`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 540 });
    await prepare(page, theme, "zh-CN");
    const root = page.locator('[data-slot="full-page-scroller"]');
    const progress = page.getByRole("progressbar", { name: "页面滚动进度" });
    const value = async () => Number(await progress.getAttribute("aria-valuenow"));
    await expect(progress).toHaveCount(1);
    await expect(progress).toHaveAttribute("aria-valuenow", "0");
    const bar = await progress.boundingBox();
    expect(bar!.width).toBeLessThanOrEqual(3);
    await page.getByRole("button", { name: "下一屏", exact: true }).click();
    await expect(root).toHaveAttribute("data-index", "1");
    await expect.poll(value).toBeGreaterThan(0);
    const section = root.locator('[data-slot="full-page-section"]').nth(1);
    await expect(section).toHaveCSS("overflow-y", "auto");
    await expect(section).toHaveCSS("scrollbar-width", "none");
    expect(await section.evaluate(element => element.scrollHeight - element.clientHeight)).toBeGreaterThan(120);
    // The neighbour changes the denominator when its lazy demo mounts. Wait for
    // that explicit readiness condition before asserting monotonic local scrolling.
    await expect(page.locator('[data-slot="appearance-demo"]')).toBeAttached();
    await page.evaluate(()=>document.fonts.ready);
    await expectProgressGeometry(page);
    const beforeScroll = await value();
    await section.hover({ position: { x: 20, y: 80 } });
    await page.mouse.wheel(0, 120);
    await expect.poll(() => section.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
    await expect(root).toHaveAttribute("data-index", "1");
    await expect.poll(value).toBeGreaterThan(beforeScroll);
    await expectProgressGeometry(page);
    await page.screenshot({ path: testInfo.outputPath("global-progress-phone.png") });
    const scrolledTop=await section.evaluate(element=>element.scrollTop);
    await page.mouse.wheel(0,-80);
    await expect.poll(()=>section.evaluate(element=>element.scrollTop)).toBeLessThan(scrolledTop);
    await expectProgressGeometry(page);
    await page.getByRole("button", { name: "下一屏", exact: true }).click();
    await expect(root).toHaveAttribute("data-index", "2");
    await expectProgressGeometry(page);
    await page.getByRole("button", { name: "开始使用", exact: true }).click();
    await expect(root).toHaveAttribute("data-index", "4");
    await root.locator('[data-slot="full-page-section"]').nth(4).evaluate(element => { element.scrollTop = element.scrollHeight; });
    await expect(progress).toHaveAttribute("aria-valuenow", "100");
    await page.getByRole("button", { name: "返回首屏", exact: true }).click();
    await expect(progress).toHaveAttribute("aria-valuenow", "0");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addStyleTag({ content: ".website-scroller { --uni-duration-slower: 10000ms; }" });
    await page.getByRole("button", { name: "下一屏", exact: true }).click();
    await expect(root).toHaveAttribute("data-index", "1");
    const thumb = progress.locator(".website-scroll-thumb");
    await expect.poll(() => thumb.evaluate(element => element.getAnimations().length)).toBeGreaterThan(0);
    const durations = await Promise.all([root.locator('[data-slot="full-page-track"]'), thumb].map(locator => locator.evaluate(element => element.getAnimations()[0].effect!.getTiming().duration)));
    expect(durations).toEqual([10000, 10000]);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => thumb.evaluate(element => element.getAnimations().length)).toBe(0);
  });

  test(`${theme}: progress recomputes from live content when a delayed neighbour mounts`,async({page})=>{
    await page.setViewportSize({width:390,height:540});
    let release!:()=>void,requested=false;const blocked=new Promise<void>(resolve=>{release=resolve;});
    await page.route(/\/assets\/appearance-[^/]+\.js$/,async route=>{requested=true;await blocked;await route.continue();});
    try {
      await prepare(page,theme,"zh-CN");
      await page.getByRole('button',{name:'下一屏',exact:true}).click();
      const root=page.locator('[data-slot="full-page-scroller"]');await expect(root).toHaveAttribute('data-index','1');
      await expect.poll(()=>requested).toBe(true);await expectProgressGeometry(page);
      const before=await progressGeometry(page),section=root.locator('[data-slot="full-page-section"]').nth(1);
      await section.hover({position:{x:20,y:80}});await page.mouse.wheel(0,120);
      await expect.poll(()=>section.evaluate(element=>element.scrollTop)).toBeGreaterThan(0);await expectProgressGeometry(page);
      release();await expect(page.locator('[data-slot="appearance-demo"]')).toBeAttached();
      await expect.poll(async()=>(await progressGeometry(page)).heights[2]).toBeGreaterThan(before.heights[2]);
      await expectProgressGeometry(page);
      await page.setViewportSize({width:768,height:1024});await expectProgressGeometry(page);
      await page.evaluate(()=>document.documentElement.style.zoom='1.25');await expectProgressGeometry(page);
    } finally {release();}
  });
}

test("navigation, keyboard, input focus and preserved interaction state", async ({ page }) => {
  await prepare(page);
  const root = page.locator('[data-slot="full-page-scroller"]');
  await root.focus();
  await page.keyboard.press("PageDown");
  await expect(root).toHaveAttribute("data-index", "1");
  await page.getByRole("button", { name: "Try it", exact: true }).click();
  await expect(page.getByText("1 clicks", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "Form", exact: true }).click();
  const input = page.getByRole("textbox", { name: "Project name" });
  await page.getByRole("button", { name: "Save preview", exact: true }).click();
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await input.fill("Unitary website");
  await page.keyboard.press("ArrowDown");
  await expect(root).toHaveAttribute("data-index", "1");
  await page.getByRole("button", { name: "Save preview", exact: true }).click();
  await expect(page.getByText("Preview saved: Unitary website")).toBeVisible();
  await input.focus();
  await root.hover({ position: { x: 10, y: 10 } });
  await page.mouse.wheel(0, 160);
  await expect(root).toHaveAttribute("data-index", "2");
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest("[inert]")))).toBe(false);
  await page.getByRole("button", { name: "Previous screen" }).click();
  await expect(input).toHaveValue("Unitary website");
  await page.getByRole("button", { name: "Get Started", exact: true }).click();
  await expect(root).toHaveAttribute("data-index", "4");
  await expect(page.locator("#website-title-4")).toBeFocused();
  await root.focus();
  await page.keyboard.press("Home");
  await expect(root).toHaveAttribute("data-index", "0");
  await page.keyboard.press("End");
  await expect(root).toHaveAttribute("data-index", "4");
});

for (const theme of LAYOUT_THEMES) for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`${viewport.width} ${theme}: incoming demo is laid out before the slide starts`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    let releaseAppearance!: () => void;
    let appearanceRequested!: () => void;
    const blocked = new Promise<void>(resolve => { releaseAppearance = resolve; });
    const requested = new Promise<void>(resolve => { appearanceRequested = resolve; });
    await page.route(/\/assets\/appearance-[^/]+\.js$/, async route => {
      appearanceRequested();
      await blocked;
      await route.continue();
    });
    try {
      await prepare(page, theme);
      // The first interactive screen is already mounted while the hero is active.
      await expect(page.locator('[data-slot="interaction-demo"]')).toBeAttached();
      const root = page.locator('[data-slot="full-page-scroller"]');
      await expect(root).toHaveAttribute("data-index", "0");
      await page.getByRole("button", { name: "Next screen" }).click();
      await expect(root).toHaveAttribute("data-index", "1");
      await requested;
      await page.getByRole("button", { name: "Next screen" }).click();
      // A slow chunk must leave the current screen intact until the next one is ready.
      await expect(root).toHaveAttribute("data-index", "1");
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.addStyleTag({ content: ".website-scroller { --uni-duration-slower: 10000ms; }" });
      releaseAppearance();
      await expect(root).toHaveAttribute("data-index", "2");
      await expect(page.locator('[data-slot="appearance-demo"]')).toBeAttached();
      const track = page.locator('[data-slot="full-page-track"]');
      await expect.poll(() => track.evaluate(element => element.getAnimations().length)).toBeGreaterThan(0);
      const samples = await track.evaluate(element => {
        const animation = element.getAnimations()[0];
        animation.pause();
        const duration = Number(animation.effect!.getTiming().duration);
        const section = element.querySelectorAll('[data-slot="full-page-section"]')[2];
        return [0.25, 0.5, 0.75].map(progress => {
          animation.currentTime = duration * progress;
          const top = section.getBoundingClientRect().top;
          return [".website-introduction", ".website-demo"].map(selector => {
            const rect = section.querySelector(selector)!.getBoundingClientRect();
            return { top: rect.top - top, height: rect.height };
          });
        });
      });
      for (const sample of samples) for (let part = 0; part < 2; part++) {
        expect(Math.abs(sample[part].top - samples[0][part].top)).toBeLessThan(1);
        expect(Math.abs(sample[part].height - samples[0][part].height)).toBeLessThan(1);
      }
      await track.evaluate(element => {
        const animation = element.getAnimations()[0];
        animation.currentTime = Number(animation.effect!.getTiming().duration) * 0.75;
      });
      await page.screenshot({ path: testInfo.outputPath("during-slide.png") });
      await track.evaluate(element => element.getAnimations()[0].finish());
      await expect(page.locator('[data-slot="appearance-demo"]')).toBeVisible();
      const settled = await track.evaluate(element => {
        const section = element.querySelectorAll('[data-slot="full-page-section"]')[2];
        const top = section.getBoundingClientRect().top;
        return [".website-introduction", ".website-demo"].map(selector => {
          const rect = section.querySelector(selector)!.getBoundingClientRect();
          return { top: rect.top - top, height: rect.height };
        });
      });
      for (let part = 0; part < 2; part++) {
        expect(Math.abs(settled[part].top - samples[0][part].top)).toBeLessThan(1);
        expect(Math.abs(settled[part].height - samples[0][part].height)).toBeLessThan(1);
      }
    } finally { releaseAppearance(); }
  });
}

test("system theme changes, texture controls, language persistence and clipboard", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/?lang=en-US");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Next screen" }).click();
  await page.getByRole("button", { name: "Next screen" }).click();
  await page.getByRole("radio", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.locator(".website-texture-option").filter({ hasText: "Glass" }).click();
  await expect(page.getByRole("radio", { name: "Glass", exact: true })).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-texture-preference", "glass");
  await page.getByRole("button", { name: "Language", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await page.getByRole("button", { name: "开始使用", exact: true }).click();
  await page.locator('[data-slot="snippet"]').first().getByRole("button").click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(INSTALL_COMMAND);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("motion plays only on its active screen and reduced motion remains static", async ({ page }) => {
  await prepare(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (let index = 0; index < 3; index++) await page.getByRole("button", { name: "Next screen" }).click();
  await expect(page.locator('[data-slot="full-page-scroller"]')).toHaveAttribute("data-index", "3");
  await expect.poll(() => page.locator('[data-slot="full-page-track"]').evaluate(element => element.getAnimations().length)).toBe(0);
  const player = page.locator('[data-slot="hitu-player"]');
  await expect(player).toBeInViewport();
  await expect(player).toHaveAttribute("data-playing", "false");
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(player).toHaveAttribute("data-playing", "true");
  await page.getByRole("button", { name: "Next screen" }).click();
  await expect(player).toHaveAttribute("data-playing", "false");
  const frame = await player.getAttribute("data-frame");
  await page.getByRole("button", { name: "Previous screen" }).click();
  await expect(player).toHaveAttribute("data-frame", frame!);
  await expect(player).toHaveAttribute("data-playing", "false");
  await page.getByRole("button", { name: "Toggle content" }).click();
  await expect(page.locator('[data-slot="website-motion-content"]')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeDisabled();
  await expect(player).toHaveAttribute("data-frame", "0");
});

test("phone touch paging and nested overflow preserve complete content", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 540 }, hasTouch: true, isMobile: true });
  try {
    const page = await context.newPage();
    await prepare(page);
    const session = await context.newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 180, y: 400 }] });
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 180, y: 240 }] });
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    const root = page.locator('[data-slot="full-page-scroller"]');
    await expect(root).toHaveAttribute("data-index", "1");
    const section = root.locator('[data-slot="full-page-section"]').nth(1);
    await expect(page.locator('[data-slot="interaction-demo"]')).toBeVisible();
    expect(await section.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true);
    await section.hover({ position: { x: 20, y: 80 } });
    await page.mouse.wheel(0, 120);
    await expect(root).toHaveAttribute("data-index", "1");
    await expect.poll(() => section.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
    await page.getByRole("button", { name: "Get Started", exact: true }).click();
    await expect(page.locator("#website-title-4")).toBeFocused();
  } finally { await context.close(); }
});

test("built website serves docs, deep links, fonts and shared media without source requests", async ({ page, request }) => {
  const sourceRequests: string[] = [];
  const failures: string[] = [];
  page.on("request", request => { if (/\/(?:src\/|site\/src\/|@vite\/|@fs\/)/.test(new URL(request.url()).pathname)) sourceRequests.push(request.url()); });
  page.on("response", response => { if (response.status() >= 400) failures.push(response.url()); });
  await prepare(page);
  await page.getByRole("link", { name: "Docs", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/\?lang=en-US#\/$/);
  await expect(page.getByRole("heading", { name: "Get Started", exact: true })).toBeVisible();
  await expect(page.locator("body")).toContainText(INSTALL_COMMAND);
  await page.goto("/docs/?lang=zh-CN#/components/button");
  await expect(page.getByRole("heading", { name: "按钮", level: 1, exact: true })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  for (const url of ["/gallery-coast.svg", "/docs/gallery-coast.svg", "/prefetch-preview.json", "/demo-poster.png"]) {
    expect((await request.get(url)).ok(), url).toBe(true);
  }
  expect(sourceRequests).toEqual([]);
  expect(failures).toEqual([]);
});
