import { expect, test, firefox, webkit, type Page, type Locator } from "@playwright/test";
import { PNG } from "pngjs";
import { LAYOUT_VIEWPORTS, LAYOUT_THEMES } from "./helpers/layout-matrix";

test.setTimeout(60_000);

const base = () => String(test.info().project.use.baseURL);
async function prepare(page: Page, theme: string, route = "/?lang=en-US#/materials") {
  await page.addInitScript(theme => {
    localStorage.setItem("unitary-theme-preference", theme);
    localStorage.setItem("unitary-texture-preference-v2", "glass");
  }, theme);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(base() + route);
  await expect(page.locator("html")).toHaveAttribute("data-texture", "glass");
  await page.evaluate(() => document.fonts.ready);
}
async function settled(surface: Locator) {
  await expect.poll(() => surface.evaluate(el => el.getAnimations().some(a => a.playState === "running"))).toBe(false);
}
async function requireNativeBackdropPaint(page: Page, engine: string) {
  // 独立对照区分平台合成器缺失和产品采样错误；缺失时明确保留未完成证据。
  // A CSS syntax check cannot prove native compositor support on every platform.
  await page.setContent('<body style="margin:0"><div style="position:absolute;inset:0;background:repeating-linear-gradient(45deg,black 0 2px,white 2px 4px)"></div><div id="native-blur-control" style="position:absolute;left:20px;top:20px;width:160px;height:80px;background:rgb(255 255 255 / .5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)"></div>');
  const control=page.locator('#native-blur-control');
  const before=await control.screenshot();
  await control.evaluate(el=>{(el as HTMLElement).style.setProperty('backdrop-filter','none','important');(el as HTMLElement).style.setProperty('-webkit-backdrop-filter','none','important');});
  const after=await control.screenshot();
  const supported=!PNG.sync.read(before).data.equals(PNG.sync.read(after).data);
  await test.info().attach('native-backdrop-control',{body:Buffer.from(JSON.stringify({engine,supported})),contentType:'application/json'});
  if(!supported) {
    await test.info().attach('native-blur-unavailable',{body:before,contentType:'image/png'});
    test.skip(true, `${engine} on this host declares backdrop-filter but cannot paint even the isolated blur control; native blur pixel acceptance remains incomplete.`);
  }
}
async function directionalPixels(page: Page, surface: Locator) {
  await surface.scrollIntoViewIfNeeded();
  const box = (await surface.boundingBox())!;
  const capture = async (x: number) => {
    await page.mouse.move(box.x + box.width * x, box.y + box.height / 2);
    await expect.poll(() => surface.evaluate(el => Number(el.style.getPropertyValue("--_uni-glass-pointer-x")))).toBeCloseTo(x * 2 - 1, 1);
    await settled(surface);
    return PNG.sync.read(await surface.screenshot());
  };
  const left = await capture(.05), right = await capture(.95);
  let changedRim = 0, changedCenter = 0;
  for (let y = 0; y < left.height; y++) for (let x = 0; x < left.width; x++) {
    const index = (y * left.width + x) * 4;
    const delta = Math.max(...[0, 1, 2].map(c => Math.abs(left.data[index+c] - right.data[index+c])));
    if (Math.min(x,y,left.width-1-x,left.height-1-y) < 3 && delta >= 3) changedRim++;
    if (x > 8 && y > 8 && x < left.width-8 && y < left.height-8 && delta > 1) changedCenter++;
  }
  expect(changedRim + changedCenter, "CSS glint must change visible painted pixels").toBeGreaterThan(box.width / 4);
  expect(await surface.boundingBox()).toEqual(box);
  expect(await surface.evaluate(el => getComputedStyle(el).filter)).toBe("none");
}

for (const theme of LAYOUT_THEMES) {
  test(`actual nested Glass button has an interpolated hover color: ${theme}`, async ({ page }) => {
    await prepare(page, theme);
    const button = page.locator('[data-slot="texture-demo-menu-trigger"]');
    await button.scrollIntoViewIfNeeded(); await page.mouse.move(1,1); await settled(button);
    const before = await button.evaluate(el => getComputedStyle(el).backgroundColor);
    await button.hover();
    const colors = await button.evaluate(el => {
      const transition = el.getAnimations().find(a => (a as CSSTransition).transitionProperty === "background-color");
      if (!transition) return null;
      transition.pause(); transition.currentTime = Number(transition.effect!.getTiming().duration) / 2;
      const middle = getComputedStyle(el).backgroundColor;
      transition.finish(); return { middle, end:getComputedStyle(el).backgroundColor };
    });
    expect(colors, "hover must interpolate a color instead of swapping background images").not.toBeNull();
    expect(colors!.middle).not.toBe(before); expect(colors!.middle).not.toBe(colors!.end);
    await button.evaluate(el => { (el as HTMLElement).style.transition = "none"; });
    await page.mouse.move(1,1); await button.hover();
    expect(await button.evaluate(el => el.getAnimations().some(a => a.playState === "running"))).toBe(false);
  });
  test(`actual Dense owner retains local CSS glint without resampling: ${theme}`, async ({ page }) => {
    await prepare(page, theme);
    const button = page.locator('[data-slot="texture-demo-menu-trigger"]');
    const owner = page.locator('[data-material-sample="floating"]');
    await expect(owner).not.toHaveAttribute("data-uni-glass-renderer");
    expect(await button.evaluate(el => getComputedStyle(el).backdropFilter)).toBe("none");
    await directionalPixels(page, button);
    const node = await button.boundingBox(); await page.mouse.down(); await page.mouse.up();
    await page.keyboard.press("Escape"); expect(await button.boundingBox()).toEqual(node);
  });
}

for (const [name, engine] of [["Firefox", firefox], ["WebKit", webkit]] as const) for (const theme of LAYOUT_THEMES) {
  test(`real ${name} CSS Glass keeps visible local input: ${theme}`, async () => {
    test.setTimeout(180_000);
    const browser = await engine.launch({channel:undefined});
    try {
      const page = await browser.newPage({viewport:{width:1280,height:900},permissions:[]});
      await prepare(page, theme);
      await directionalPixels(page, page.locator('[data-slot="texture-demo-menu-trigger"]'));
      await page.emulateMedia({reducedMotion:"reduce"});
      await expect(page.locator('[data-slot="texture-demo-menu-trigger"]')).not.toHaveAttribute("data-uni-glass-interaction");
    } finally { await browser.close(); }
  });
}

for (const viewport of LAYOUT_VIEWPORTS) for (const theme of LAYOUT_THEMES) {
  test(`fixed Glass topbar and flyout transmit their actual background: ${theme} ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await prepare(page, theme, "/site/build/glass-regression.html?usage=navigation");
    // Fixture starts Solid so it can also measure real material activation.
    await page.getByRole("button",{name:"Glass",exact:true}).click();
    const header = page.locator('[data-slot="navbar"]');
    const paint = await header.evaluate(el => { const body=getComputedStyle(el), layer=getComputedStyle(el,"::before");return {position:body.position,background:body.backgroundColor,filter:body.backdropFilter,blur:layer.backdropFilter,fill:layer.backgroundColor}; });
    expect(paint.position).toBe("fixed"); expect(paint.background).toBe("rgba(0, 0, 0, 0)"); expect(paint.filter).toBe("none"); expect(paint.blur).toBe(`blur(24px) saturate(${theme === "dark" ? 1.5 : 1.6})`);
    expect(paint.fill).toMatch(/\/\s*0\./);
    const first = PNG.sync.read(await header.screenshot());
    await page.locator('[data-testid="scroll-stage"]').evaluate(el => { el.scrollTop=320; });
    const second = PNG.sync.read(await header.screenshot());
    expect(first.data.equals(second.data), "scrolling content must remain visible through the fixed header").toBe(false);
    if (viewport.width >= 768) {
      await page.getByRole("button",{name:"Browse",exact:true}).hover();
      const panel=page.locator('[data-slot="site-navigation-panel"]'); await expect(panel).toBeVisible();
      const values=await panel.evaluate(el=>{const s=getComputedStyle(el);return {fill:s.backgroundColor,filter:s.backdropFilter,root:el.closest('[data-slot="navbar"]')!==null};});
      expect(values.root).toBe(true); expect(values.filter).toBe(`blur(20px) saturate(${theme === "dark" ? 1.5 : 1.6})`); expect(values.fill).toMatch(/\/\s*0\./);
      const filtered=PNG.sync.read(await panel.screenshot());
      if(viewport.width === 1440) await test.info().attach(`topbar-${theme}`, { body: await page.screenshot(), contentType:"image/png" });
      await panel.evaluate(el=>{(el as HTMLElement).style.setProperty("backdrop-filter","none","important");(el as HTMLElement).style.setProperty("-webkit-backdrop-filter","none","important");});
      const unfiltered=PNG.sync.read(await panel.screenshot());
      let blurredPixels=0; for(let i=0;i<filtered.data.length;i+=4) if(Math.max(...[0,1,2].map(c=>Math.abs(filtered.data[i+c]-unfiltered.data[i+c])))>2)blurredPixels++;
      expect(blurredPixels,"the flyout must blur the scene, not only declare a filter").toBeGreaterThan(viewport.width);
      await panel.evaluate(el=>{(el as HTMLElement).style.removeProperty("backdrop-filter");(el as HTMLElement).style.removeProperty("-webkit-backdrop-filter");});
      await page.getByRole("button",{name:"Browse",exact:true}).focus();
      await page.keyboard.press("ArrowDown"); await expect(page.getByRole("link",{name:"Photo collection",exact:false})).toBeFocused();
      await page.keyboard.press("Escape"); await expect(panel).not.toBeVisible(); await expect(page.getByRole("button",{name:"Browse",exact:true})).toBeFocused();
    }
  });
}

for (const [name, engine] of [["Firefox", firefox], ["WebKit", webkit]] as const) for (const theme of LAYOUT_THEMES) {
  test(`real ${name} fixed header and hover panel retain blur: ${theme}`, async () => {
    test.setTimeout(180_000);
    const browser = await engine.launch({channel:undefined});
    try {
      const page = await browser.newPage({viewport:{width:1280,height:900},permissions:[]});
      await requireNativeBackdropPaint(page, name);
      await prepare(page, theme, "/site/build/glass-regression.html?usage=navigation");
      await page.getByRole("button",{name:"Glass",exact:true}).click();
      expect(await page.locator('[data-slot="navbar"]').evaluate(el=>getComputedStyle(el,"::before").backdropFilter)).toBe(`blur(24px) saturate(${theme === "dark" ? 1.5 : 1.6})`);
      await page.getByRole("button",{name:"Browse",exact:true}).hover();
      const panel = page.locator('[data-slot="site-navigation-panel"]');
      await expect(panel).toBeVisible(); await expect(panel).toHaveCSS("backdrop-filter",`blur(20px) saturate(${theme === "dark" ? 1.5 : 1.6})`);
      const before = await panel.screenshot();
      await panel.evaluate(el=>(el as HTMLElement).style.setProperty("backdrop-filter","none","important"));
      expect((await panel.screenshot()).equals(before), "actual fallback panel must blur the background").toBe(false);
      await expect(panel).not.toHaveAttribute("data-uni-glass-renderer");
    } finally { await browser.close(); }
  });
}

for(const theme of LAYOUT_THEMES) {
  test(`navigation respects local blur, presets and dynamic accessibility: ${theme}`, async({page})=>{
    await page.setViewportSize({width:1280,height:900});
    await prepare(page, theme, "/site/build/glass-regression.html?usage=navigation");
    await page.getByRole("button",{name:"Glass",exact:true}).click();
    const header=page.locator('[data-slot="navbar"]');
    await page.getByRole("button",{name:"Browse",exact:true}).hover();
    const panel=page.locator('[data-slot="site-navigation-panel"]');
    await expect(panel).toBeVisible();
    await page.evaluate(()=>document.documentElement.style.setProperty("--material-texture-glass-overlay-blur","6px"));
    expect(await header.evaluate(el=>getComputedStyle(el,"::before").backdropFilter)).toBe(`blur(24px) saturate(${theme === "dark" ? 1.5 : 1.6})`);
    await header.evaluate(el=>(el as HTMLElement).style.setProperty("--material-texture-glass-blur","7px"));
    expect(await header.evaluate(el=>getComputedStyle(el,"::before").backdropFilter)).toBe(`blur(7px) saturate(${theme === "dark" ? 1.5 : 1.6})`);
    await expect(panel).toHaveCSS("backdrop-filter",`blur(6px) saturate(${theme === "dark" ? 1.5 : 1.6})`);
    await panel.evaluate(el=>(el as HTMLElement).style.setProperty("--material-texture-glass-overlay-blur","10px"));
    await expect(panel).toHaveCSS("backdrop-filter",`blur(10px) saturate(${theme === "dark" ? 1.5 : 1.6})`);
    await panel.evaluate(el=>(el as HTMLElement).style.removeProperty("--material-texture-glass-overlay-blur"));
    await expect(panel).toHaveCSS("backdrop-filter",`blur(6px) saturate(${theme === "dark" ? 1.5 : 1.6})`);
    const opacity=()=>panel.evaluate(el=>getComputedStyle(el).getPropertyValue("--_uni-glass-effective-opacity").trim());
    await panel.evaluate(el=>el.classList.add("material-glass-regular"));
    expect(await opacity()).toBe(theme==="dark"?"76%":"56%");
    await panel.evaluate(el=>el.classList.remove("material-glass-regular"));
    expect(await opacity()).toBe(theme==="dark"?"86%":"80%");
    await page.emulateMedia({contrast:"more"});
    expect(await opacity()).toBe(theme==="dark"?"96%":"92%");
    await page.emulateMedia({contrast:"no-preference",forcedColors:"active"});
    await expect(page.locator("html")).toHaveAttribute("data-texture","solid");
    await expect(panel).toHaveCSS("backdrop-filter","none");
    expect(await header.evaluate(el=>getComputedStyle(el,"::before").content)).toBe("none");
    await page.emulateMedia({forcedColors:"none"});
    await expect(page.locator("html")).toHaveAttribute("data-texture","glass");
    const session=await page.context().newCDPSession(page);
    await session.send("Emulation.setEmulatedMedia",{features:[{name:"prefers-reduced-transparency",value:"reduce"}]});
    await expect(page.locator("html")).toHaveAttribute("data-texture","solid");
    await expect(panel).toHaveCSS("backdrop-filter","none");
    await session.send("Emulation.setEmulatedMedia",{features:[{name:"prefers-reduced-transparency",value:"no-preference"}]});
    await expect(page.locator("html")).toHaveAttribute("data-texture","glass");
    await expect(panel).toHaveCSS("backdrop-filter",`blur(6px) saturate(${theme === "dark" ? 1.5 : 1.6})`);
  });
  for(const custom of ["fill","filter"])test(`navigation preserves author ${custom}: ${theme}`,async({page})=>{
    await page.setViewportSize({width:1280,height:900});
    await prepare(page,theme,`/site/build/glass-regression.html?usage=navigation&chrome=${custom}&panel=${custom}`);
    await page.getByRole("button",{name:"Glass",exact:true}).click();
    const header=page.locator('[data-slot="navbar"]');
    await expect(header).not.toHaveAttribute("data-uni-glass-chrome");
    await page.getByRole("button",{name:"Browse",exact:true}).hover();
    const panel=page.locator('[data-slot="site-navigation-panel"]');
    await expect(panel).toBeVisible(); await expect(panel).not.toHaveAttribute("data-uni-glass-independent");
    if(custom==="filter") {
      await expect(header).toHaveCSS("backdrop-filter","none"); await expect(panel).toHaveCSS("backdrop-filter","none");
    } else {
      const fill=await header.evaluate(el=>getComputedStyle(el).backgroundColor);
      expect(fill).not.toMatch(/\/\s*0\./); await expect(panel).toHaveCSS("background-color",fill);
    }
  });
}

test("local CSS feedback needs no raster work or idle frame loop",async({page})=>{
  await prepare(page,"light");
  await expect(page.locator('[data-material-sample="floating"]')).not.toHaveAttribute("data-uni-glass-renderer");
  // Observe steady CSS feedback separately from activation and first input.
  await expect(page.locator('[data-glass-variant-example="clear"] button')).toHaveAttribute("data-uni-glass-interaction","");
  await expect(page.locator('[data-glass-variant-example="regular"] [data-slot="toolbar"]')).toHaveAttribute("data-uni-glass-interaction","");
  await expect(page.locator('[data-glass-variant-example="dense"] [data-material]')).not.toHaveAttribute("data-uni-glass-renderer");
  await page.evaluate(()=>{
    const original=HTMLCanvasElement.prototype.toBlob;
    Reflect.set(window,"__feedbackEncodes",0);
    HTMLCanvasElement.prototype.toBlob=function(...args){Reflect.set(window,"__feedbackEncodes",Reflect.get(window,"__feedbackEncodes")+1);return original.apply(this,args);};
  });
  const button=page.locator('[data-slot="texture-demo-menu-trigger"]');
  await directionalPixels(page,button); await page.mouse.move(1,1); await settled(button);
  expect(await page.evaluate(()=>Reflect.get(window,"__feedbackEncodes"))).toBe(0);
  // 等有限的 transitionend 失效完成，再观测空闲。Drain finite transition-end invalidation.
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
  await page.evaluate(()=>{
    const original=window.requestAnimationFrame;
    Reflect.set(window,"__feedbackRaf",0);
    window.requestAnimationFrame=callback=>{Reflect.set(window,"__feedbackRaf",Reflect.get(window,"__feedbackRaf")+1);return original.call(window,callback);};
  });
  await page.waitForTimeout(1000);
  expect(await page.evaluate(()=>Reflect.get(window,"__feedbackRaf"))).toBe(0);
});
