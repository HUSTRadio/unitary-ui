import { test, expect, type Page } from "@playwright/test";
import { PNG } from "pngjs";
import { artifactMode, artifactModule } from "./docs-artifact";

test.setTimeout(60_000);
const viewports = [[1440,900],[1100,800],[1024,768],[768,1024],[390,844],[320,700]] as const;
const tokenModule = artifactMode ? artifactModule("site/build/browser-fixtures.ts") : `/@fs/${process.cwd().replaceAll("\\", "/")}/src/lib/tokens.ts`;
const luminance=(rgb:number[])=>rgb.map(v=>{const c=v/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;}).reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);
async function open(page: Page, theme: string) {
  await page.addInitScript(theme => { localStorage.setItem("unitary-theme-preference", theme); localStorage.setItem("unitary-texture-preference-v2", "glass"); }, theme);
  await page.goto("/?lang=en-US#/materials");
  await expect(page.locator('[data-slot="texture-interaction-demo"]')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

for(const theme of ['light','dark'])test(`glass examples keep labels readable over black, white and photography: ${theme}`,async({page})=>{
  await open(page,theme);
  await page.addStyleTag({content:'[data-contrast-hidden] * { color:transparent !important; text-shadow:none !important; }'});
  for(const variant of ['clear','regular','dense']) {
    const example=page.locator(`[data-glass-variant-example="${variant}"]`),stage=example.locator('.materials-texture-stage');
    const owner=example.locator('[data-material]');await expect(owner).toHaveAttribute('data-uni-glass-renderer','svg');
    const label=variant==='clear'?owner.locator('span').last():variant==='regular'?owner.locator('[data-slot="toolbar-item"] span').last():owner.locator('p').first();
    await label.scrollIntoViewIfNeeded();await page.mouse.move(0,0);
    const foreground=await label.evaluate(el=>{const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')!;ctx.fillStyle=getComputedStyle(el).color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3);});
    const ink=luminance(foreground);
    for(const background of ['black','white','photo']) {
      await stage.evaluate((el:HTMLElement,background)=>{el.style.backgroundImage=background==='photo'?'':'none';el.style.backgroundColor=background==='photo'?'':background;},background);
      await owner.evaluate(el=>el.setAttribute('data-contrast-hidden',''));
      const pixels=PNG.sync.read(await label.screenshot());
      let minimum=Infinity;
      for(let i=0;i<pixels.data.length;i+=4){const backdrop=luminance(Array.from(pixels.data.subarray(i,i+3)));minimum=Math.min(minimum,(Math.max(ink,backdrop)+.05)/(Math.min(ink,backdrop)+.05));}
      expect(minimum,`${variant} ${theme} ${background}`).toBeGreaterThanOrEqual(4.5);
      await owner.evaluate(el=>el.removeAttribute('data-contrast-hidden'));
    }
  }
});

test('glass touch controls retain native toggles, selection and button feedback',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  try {
    const page=await context.newPage();await open(page,'dark');
    const group=page.locator('[data-slot="texture-gel-controls"]');
    const toggle=group.getByRole('checkbox',{name:'Live updates'});await toggle.tap();await expect(toggle).not.toBeChecked();
    await group.getByText('Grid',{exact:true}).tap();await expect(group.getByRole('radio',{name:'Grid',exact:true})).toBeChecked();
    await group.getByRole('tab',{name:'Details'}).tap();await expect(group.getByRole('tab',{name:'Details'})).toHaveAttribute('aria-selected','true');
    const clear=page.locator('[data-glass-variant-example="clear"]');await clear.getByRole('button',{name:'Play',exact:true}).tap();await expect(clear.getByRole('button',{name:'Pause',exact:true})).toBeVisible();
    expect(await page.locator('[data-slot="glass-optics"],[data-uni-glass-pressed]').count()).toBe(0);
  }finally{await context.close();}
});

for (const theme of ["light", "dark"]) for (const enhanced of [true, false]) {
  test(`glass preset cascade and dynamic contrast: ${theme} ${enhanced ? "SVG" : "CSS"}`, async ({ browser }) => {
    const context=await browser.newContext(enhanced ? {} : {userAgent:"Mozilla/5.0 Firefox/150.0"});
    try {
      const page=await context.newPage(); await open(page,theme);
      await page.evaluate(()=>{
        const host=document.createElement('div');host.id='glass-preset-probes';
        for(const [id,role,classes] of [['nav','navigation','bg-surface'],['floating','floating','material-menu'],['custom','floating','material-menu material-glass-clear']]) {
          const node=document.createElement('div');node.id='preset-'+id;node.dataset.material=role;node.className=classes;
          node.style.cssText='width:260px;height:140px;border-radius:12px';host.append(node);
        }document.body.append(host);
      });
      const owner=page.locator('#preset-custom');
      const value=(id:string,name='opacity',effective=false)=>page.locator('#preset-'+id).evaluate((el,{name,effective})=>getComputedStyle(el).getPropertyValue((effective?'--_uni-glass-effective-':'--material-texture-glass-')+name).trim(),{name,effective});
      const set=async(id:string,values:Record<string,string>)=>page.evaluate(async({id,values,url})=>{const api=await import(url);api.setTokens(values,{target:id?document.getElementById('preset-'+id):document.documentElement});},{id,values,url:tokenModule});
      const reset=async(id:string,names:string[])=>page.evaluate(async({id,names,url})=>{const api=await import(url);api.resetTokens(names,{target:document.getElementById('preset-'+id)});},{id,names,url:tokenModule});
      expect(await value('nav')).toBe(theme==='dark'?'68%':'52%');expect(await value('floating')).toBe(theme==='dark'?'90%':'82%');
      expect(await value('custom')).toBe(theme==='dark'?'36%':'24%');
      for(const [variant,opacity,refraction,width,roughness] of [
        ['clear',theme==='dark'?'36%':'24%','6px','8px','0.18'],
        ['dense',theme==='dark'?'90%':'82%','3px','8px','0.32'],
        ['regular',theme==='dark'?'68%':'52%','6px','10px','0.24'],
      ]) {
        await owner.evaluate((el,variant)=>el.className='material-menu material-glass-'+variant,variant);
        await expect.poll(()=>value('custom')).toBe(opacity);
        expect(await value('custom','refraction',true)).toBe(refraction);expect(await value('custom','edge-width',true)).toBe(width);expect(Number(await value('custom','roughness',true))).toBe(Number(roughness));
      }
      await set('',{'--material-texture-glass-opacity':'60%'});expect(await value('custom')).toBe('60%');expect(await value('floating')).toBe(theme==='dark'?'90%':'82%');
      await owner.evaluate(el=>el.className='material-menu material-glass-clear');
      await set('custom',{'--material-texture-glass-opacity':'41%','--material-texture-glass-light-intensity':'0','--material-texture-glass-ambient-intensity':'0','--material-texture-glass-absorption':'0'});
      expect(await value('custom')).toBe('41%');
      if(enhanced)await expect(owner).toHaveAttribute('data-uni-glass-renderer','svg');else await expect(owner).not.toHaveAttribute('data-uni-glass-renderer');
      const alpha=async()=>{
        if(!enhanced)return owner.evaluate(el=>{const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')!;ctx.fillStyle=getComputedStyle(el).backgroundColor;ctx.fillRect(0,0,1,1);return ctx.getImageData(0,0,1,1).data[3];});
        const data=(await owner.evaluate(el=>el.style.getPropertyValue('--_uni-glass-paint'))).match(/base64,([^")]+)/)?.[1];
        return data?PNG.sync.read(Buffer.from(data,'base64')).data[3]:null;
      };
      await expect.poll(alpha).toBe(Math.round(.41*255));
      const session=await context.newCDPSession(page);
      await session.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-contrast',value:'more'}]});
      await expect.poll(()=>value('custom','opacity',true)).toBe(theme==='dark'?'96%':'92%');
      expect(await value('custom')).toBe('41%');expect(await value('custom','refraction',true)).toBe('3px');
      await expect.poll(alpha).toBe(Math.round((theme==='dark'?.96:.92)*255));
      await set('custom',{'--material-texture-glass-refraction':'0px'});await expect(owner).not.toHaveAttribute('data-uni-glass-renderer');
      await expect(owner).toHaveCSS('backdrop-filter','blur(1px)');
      await session.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-contrast',value:'no-preference'}]});
      await reset('custom',['--material-texture-glass-opacity','--material-texture-glass-refraction']);
      expect(await value('custom')).toBe(theme==='dark'?'36%':'24%');
      if(enhanced)await expect(owner).toHaveAttribute('data-uni-glass-renderer','svg');
      await page.evaluate(()=>document.getElementById('glass-preset-probes')!.remove());
    }finally{await context.close();}
  });
}
for (const variant of ["clear", "regular", "dense"]) for (const theme of ["light", "dark"]) for (const [width, height] of viewports) {
  test(`glass ${variant} pixel displacement and stable foreground: ${theme} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height }); await open(page, theme);
    await page.evaluate((variant) => {
      const fixture = document.createElement("div"); fixture.id = "glass-pixel-fixture";
      fixture.style.cssText = "position:fixed;inset:80px 10px auto;z-index:2147483646;height:190px;background:repeating-linear-gradient(90deg,#aaa 0 4px,#555 4px 8px)";
      const owner = document.createElement("div"); owner.className = `material-menu material-glass-${variant}`; owner.dataset.material = "floating"; owner.dataset.glassProbe = "";
      owner.style.cssText = "position:absolute;left:10px;top:20px;width:260px;height:140px;border-radius:24px;padding:28px;--material-texture-glass-blur:0px;--material-texture-glass-opacity:0%;--material-texture-glass-light-intensity:0;--material-texture-glass-ambient-intensity:0;--material-texture-glass-absorption:0";
      const label = document.createElement("span"); label.textContent = "Clear foreground"; label.style.cssText = "font:16px sans-serif";
      owner.append(label); fixture.append(owner); document.body.append(fixture);
    }, variant);
    const lens = page.locator("[data-glass-probe]"); await expect(lens).toHaveAttribute("data-uni-glass-renderer", "svg");
    await expect.poll(() => lens.evaluate(el => getComputedStyle(el).backdropFilter)).toContain("url(");
    const before = PNG.sync.read(await lens.screenshot()); const geometry = await lens.boundingBox();
    await lens.evaluate((el: HTMLElement) => el.style.setProperty("--_uni-glass-backdrop", "none"));
    const flat = PNG.sync.read(await lens.screenshot());
    let edge = 0, center = 0;
    for (let y = 32; y < 108; y++) for (let x = 0; x < 260; x++) {
      const i = (y * before.width + x) * 4;
      const delta = Math.max(...[0,1,2].map(c => Math.abs(before.data[i+c] - flat.data[i+c])));
      if (x < 10 || x > 249) edge += delta > 10 ? 1 : 0;
      if (x > 40 && x < 220) center += delta > 2 ? 1 : 0;
    }
    expect(edge).toBeGreaterThan(100); expect(center).toBe(0);
    expect(await lens.boundingBox()).toEqual(geometry);
    await page.evaluate(() => document.getElementById("glass-pixel-fixture")!.remove());
    const button = page.locator('[data-slot="texture-demo-modal-trigger"]');
    await button.scrollIntoViewIfNeeded(); const bounds = await button.boundingBox();
    const label = await button.locator("span").first().boundingBox();
    await button.hover(); await page.mouse.down();
    await expect(button).not.toHaveAttribute("data-uni-glass-pressed");
    expect(await button.evaluate(el=>getComputedStyle(el).backgroundImage)).toContain("linear-gradient");
    expect(await button.boundingBox()).toEqual(bounds); expect(await button.locator("span").first().boundingBox()).toEqual(label);
    await page.mouse.up(); await expect(button).not.toHaveAttribute("data-uni-glass-pressed");
  });
}
test("glass runtime refresh, portal sampling and cleanup", async ({ page }) => {
  await open(page, "dark");
  const owner = page.locator('[data-slot="texture-interaction-demo"] > [data-material="floating"]');
  await expect(owner).toHaveAttribute("data-uni-glass-renderer", "svg");
  const original = await owner.evaluate(el => getComputedStyle(el).backdropFilter);
  await owner.evaluate((el: HTMLElement) => el.style.width = "310px");
  await expect.poll(() => owner.evaluate(el => getComputedStyle(el).backdropFilter)).not.toBe(original);
  await owner.evaluate((el: HTMLElement) => el.style.borderRadius = "50%");
  await expect(owner).not.toHaveAttribute("data-uni-glass-renderer");
  await expect(owner).toHaveCSS("backdrop-filter", "blur(1px)");
  await owner.evaluate((el: HTMLElement) => el.style.borderRadius = "24px");
  await expect(owner).toHaveAttribute("data-uni-glass-renderer", "svg");
  await owner.evaluate((el: HTMLElement) => el.style.setProperty("--material-texture-glass-refraction", "0px"));
  await expect(owner).not.toHaveAttribute("data-uni-glass-renderer"); await expect(owner).toHaveCSS("backdrop-filter", "blur(1px)");
  await page.locator('[data-slot="texture-demo-menu-trigger"]').click();
  const menu = page.locator('[data-slot="texture-demo-menu"]'); await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute("data-uni-glass-renderer", "svg");
  await menu.locator('[data-texture-menu-option="aero"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-texture", "aero");
  await expect(page.locator("[data-uni-glass-defs]")).toHaveCount(0);
});
test("reduced transparency preserves request and removes optics", async ({ page }) => {
  await open(page, "dark"); const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-transparency", value: "reduce" }] });
  await expect(page.locator("html")).toHaveAttribute("data-texture", "solid");
  await expect(page.locator("html")).toHaveAttribute("data-texture-preference", "glass");
  await expect(page.locator("[data-uni-glass-defs]")).toHaveCount(0);
});
test("unverified engine keeps modern CSS fallback", async ({ browser }) => {
  const context = await browser.newContext({ userAgent: "Mozilla/5.0 Firefox/150.0" });
  const page = await context.newPage(); await open(page, "light");
  await expect(page.locator('[data-slot="texture-interaction-demo"] > [data-material="floating"]')).toHaveCSS("backdrop-filter", "blur(1px)");
  await expect(page.locator('[data-slot="texture-interaction-demo"] > [data-material="floating"]')).toHaveCSS("background-image", "none");
  await expect(page.locator("[data-uni-glass-defs]")).toHaveCount(0); await context.close();
});


test("selection controls preserve native state and cancel on reduced motion", async ({ page }) => {
  await open(page, "light");
  const group = page.locator('[data-slot="texture-gel-controls"]');
  const tab = group.getByRole('tab', { name: 'Details' });
  await tab.scrollIntoViewIfNeeded();
  const original = await tab.boundingBox();
  await tab.hover(); await page.mouse.down();
  await expect(tab).not.toHaveAttribute('data-uni-glass-pressed');
  expect(await tab.boundingBox()).toEqual(original);
  await page.mouse.up(); await expect(tab).toHaveAttribute('aria-selected', 'true');
  const toggle = group.getByRole('checkbox', { name: 'Live updates' });
  await expect(toggle).toBeChecked(); await toggle.click(); await expect(toggle).not.toBeChecked();
  const grid = group.getByRole('radio', { name: 'Grid', exact: true });
  await group.getByText('Grid', { exact: true }).click(); await expect(grid).toBeChecked();
  await grid.press('ArrowLeft'); await expect(group.getByRole('radio', { name: 'List', exact: true })).toBeChecked();
  await tab.hover(); await page.mouse.down(); await expect(tab).not.toHaveAttribute('data-uni-glass-pressed');
  await page.emulateMedia({ reducedMotion: 'reduce' }); await expect(tab).not.toHaveAttribute('data-uni-glass-pressed');
  await page.mouse.up();
});
test("blocked map images retain readable CSS Glass", async ({ page }) => {
  await page.route('**/*', async route => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': "img-src 'self'" } });
  });
  await open(page, 'dark');
  const owner = page.locator('[data-slot="texture-interaction-demo"] > [data-material="floating"]');
  await expect(owner).toHaveCSS('backdrop-filter', 'blur(1px)');
  await expect(owner).not.toHaveAttribute('data-uni-glass-renderer');
  await expect(owner).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});

for (const theme of ["light", "dark"]) {
  test(`convex rim samples the interior without a clipped outer strip: ${theme}`, async ({ page }) => {
    await open(page, theme);
    await page.evaluate(() => {
      const fixture = document.createElement("div"); fixture.id = "glass-edge-source-fixture";
      fixture.style.cssText = "position:fixed;left:10px;top:80px;width:340px;height:190px;z-index:2147483646;background:linear-gradient(90deg,#e02020 0 44px,#20e020 44px 296px,#e02020 296px)";
      const lens = document.createElement("div"); lens.className = "material-menu"; lens.dataset.material = "floating"; lens.dataset.glassEdgeSource = "";
      lens.style.cssText = "position:absolute;left:40px;top:20px;width:260px;height:140px;border-radius:24px;box-shadow:none;border:none;outline:none;--material-texture-glass-refraction:8px;--material-texture-glass-edge-width:12px;--material-texture-glass-blur:0px;--material-texture-glass-opacity:0%;--material-texture-glass-light-intensity:0;--material-texture-glass-ambient-intensity:0;--material-texture-glass-absorption:0";
      fixture.append(lens); document.body.append(fixture);
    });
    const lens = page.locator("[data-glass-edge-source]");
    await expect(lens).toHaveAttribute("data-uni-glass-renderer", "svg");
    const bent = PNG.sync.read(await lens.screenshot());
    await lens.evaluate((el: HTMLElement) => el.style.setProperty("--_uni-glass-backdrop", "none"));
    const flat = PNG.sync.read(await lens.screenshot());
    for (const x of [1, 2, 257, 258]) {
      const offset = (70 * bent.width + x) * 4;
      expect(bent.data[offset + 1] - bent.data[offset]).toBeGreaterThan(100);
      expect(flat.data[offset] - flat.data[offset + 1]).toBeGreaterThan(100);
    }
    for (const x of [40, 130, 220]) {
      const offset = (70 * bent.width + x) * 4;
      expect(bent.data.slice(offset, offset + 4)).toEqual(flat.data.slice(offset, offset + 4));
    }
  });
}

for (const variant of ["clear", "regular", "dense"]) for (const theme of ["light", "dark"]) for (const dpr of [1, 2]) {
  test.describe(`default glass ${variant} contour: ${theme} DPR ${dpr}`, () => {
    test.use({ deviceScaleFactor: dpr });
    test("keeps the body uniform while small corners refract and foreground stays sharp", async ({ page }, testInfo) => {
      await page.setViewportSize({ width: dpr === 1 ? 1280 : 390, height: 900 }); await open(page, theme);
      await page.evaluate((variant) => {
        const fixture = document.createElement("div"); fixture.id = "glass-contour-fixture";
        fixture.style.cssText = "position:fixed;left:20px;top:100px;width:300px;height:180px;z-index:2147483646;background:repeating-conic-gradient(#000 0% 25%,#fff 0% 50%) 0 0 / 8px 8px";
        const lens = document.createElement("div"); lens.className = `material-menu material-glass-${variant}`; lens.dataset.material = "floating"; lens.dataset.glassContour = "";
        lens.style.cssText = "position:absolute;left:20px;top:20px;width:260px;height:140px;border-radius:6px;box-shadow:none;border:none;outline:none;padding:30px";
        const label = document.createElement("span"); label.textContent = "Stable foreground"; label.style.font = "16px sans-serif";
        lens.append(label); fixture.append(lens); document.body.append(fixture);
      }, variant);
      const lens = page.locator("[data-glass-contour]");
      await expect(lens).toHaveAttribute("data-uni-glass-renderer", "svg");
      const filter = await lens.evaluate(el => {
        const id = el.style.getPropertyValue("--_uni-glass-backdrop").match(/#([^")]+)/)![1];
        const node = document.getElementById(id)!;
        return { blur: node.querySelector("feGaussianBlur")!.getAttribute("stdDeviation"), scale: node.querySelector("feDisplacementMap")!.getAttribute("scale"), count: node.children.length };
      });
      expect(filter).toEqual({ blur: "1", scale: "9", count: 4 });
      const initial = PNG.sync.read(await lens.screenshot()); const label = lens.locator("span"); const ink = await label.screenshot();
      const bounds = await lens.boundingBox();
      await lens.evaluate((el: HTMLElement) => el.style.setProperty("--_uni-glass-backdrop", "blur(1px)"));
      const flat = PNG.sync.read(await lens.screenshot());
      expect(await label.screenshot()).toEqual(ink); expect(await lens.boundingBox()).toEqual(bounds);
      for (const [cx, cy] of [[0,0],[254,0],[0,134],[254,134]]) {
        let changed = 0;
        for (let y = cy * dpr; y < (cy + 6) * dpr; y++) for (let x = cx * dpr; x < (cx + 6) * dpr; x++) {
          const i = (y * initial.width + x) * 4;
          if ([0,1,2].some(c => Math.abs(initial.data[i + c] - flat.data[i + c]) > 3)) changed++;
        }
        expect(changed).toBeGreaterThan(0);
      }
      const litPaint = await lens.evaluate(el => el.style.getPropertyValue("--_uni-glass-paint"));
      await lens.evaluate((el: HTMLElement) => {
        el.style.removeProperty("--_uni-glass-backdrop");
        el.style.setProperty("--material-texture-glass-light-intensity", "0");
        el.style.setProperty("--material-texture-glass-ambient-intensity", "0");
        el.style.setProperty("--material-texture-glass-absorption", "0");
      });
      await expect(lens).toHaveAttribute("data-uni-glass-renderer", "svg");
      await expect.poll(() => lens.evaluate((el, previous) => el.dataset.uniGlassRenderer === "svg"
        && el.style.getPropertyValue("--_uni-glass-paint").includes("base64,")
        && el.style.getPropertyValue("--_uni-glass-paint") !== previous, litPaint)).toBe(true);
      const paintUrl = await lens.evaluate(el => el.style.getPropertyValue("--_uni-glass-paint"));
      const paint = PNG.sync.read(Buffer.from(paintUrl.match(/base64,([^")]+)/)![1], "base64"));
      expect(paint.data[3]).toBeGreaterThan(0);
      const alpha = (x: number) => paint.data[(70 * paint.width + x) * 4 + 3];
      expect(alpha(0)).toBe(alpha(30));
      const bodyPixel = paint.data.slice(0, 4);
      let nonUniform = 0;
      for (let i = 4; i < paint.data.length; i += 4) if ([0,1,2,3].some(c => paint.data[i + c] !== bodyPixel[c])) nonUniform++;
      expect(nonUniform).toBe(0);
      const absorptionFreePaint = paintUrl;
      await lens.evaluate((el: HTMLElement) => el.style.setProperty("--material-texture-glass-absorption", "0.4"));
      await expect.poll(() => lens.evaluate((el, previous) => el.dataset.uniGlassRenderer === "svg"
        && el.style.getPropertyValue("--_uni-glass-paint").includes("base64,")
        && el.style.getPropertyValue("--_uni-glass-paint") !== previous, absorptionFreePaint)).toBe(true);
      const absorbedUrl = await lens.evaluate(el => el.style.getPropertyValue("--_uni-glass-paint"));
      const absorbed = PNG.sync.read(Buffer.from(absorbedUrl.match(/base64,([^")]+)/)![1], "base64"));
      expect(absorbed.data[(70 * absorbed.width) * 4 + 3]).toBeGreaterThan(absorbed.data[(70 * absorbed.width + 30) * 4 + 3]);
      await testInfo.attach("default-contour", { body: PNG.sync.write(initial), contentType: "image/png" });
      await lens.evaluate((el: HTMLElement) => { el.style.zoom = "1.25"; el.style.width = "260.5px"; });
      const filterWidth = () => lens.evaluate(el => {
        const id = el.style.getPropertyValue("--_uni-glass-backdrop").match(/#([^")]+)/)?.[1];
        return id ? document.getElementById(id)?.getAttribute("width") : null;
      });
      await expect.poll(filterWidth).toBe("261");
      await expect.poll(() => lens.evaluate(el => el.getBoundingClientRect().width)).toBeCloseTo(325.625, 1);
      const zoomedInk = await label.screenshot();
      await lens.evaluate((el: HTMLElement) => el.style.setProperty("--_uni-glass-backdrop", "blur(1px)"));
      expect(await label.screenshot()).toEqual(zoomedInk);
      await lens.evaluate((el: HTMLElement) => { el.style.zoom = ""; el.style.removeProperty("--_uni-glass-backdrop"); });
      await lens.evaluate((el: HTMLElement) => { el.style.width = "2048px"; el.style.borderRadius = "4px 8px 12px 20px"; });
      await expect(lens).toHaveAttribute("data-uni-glass-renderer", "svg");
      await expect.poll(filterWidth).toBe("2048");
      await lens.evaluate((el: HTMLElement) => el.style.borderTopLeftRadius = "0px");
      await expect(lens).not.toHaveAttribute("data-uni-glass-renderer"); await expect(lens).toHaveCSS("backdrop-filter", "blur(1px)");
      await page.evaluate(() => document.getElementById("glass-contour-fixture")!.remove());
    });
  });
}

for (const theme of ["light", "dark"]) {
  test(`glass material owners share one sampler with nested controls: ${theme}`, async ({ page }) => {
    await open(page, theme);
    const owner = page.locator('[data-slot="texture-interaction-demo"] > [data-material="floating"]');
    await expect(owner).toHaveAttribute("data-uni-glass-renderer", "svg");
    const controls = owner.locator('[data-uni-button][data-type="secondary"], [data-slot="radio-item-wrapper"]:is(.bg-background,.bg-background-100,.bg-muted)');
    expect(await controls.count()).toBeGreaterThan(0);
    for (const control of await controls.all()) await expect(control).toHaveCSS("backdrop-filter", "none");
    const samplers = await owner.evaluate(el => [el, ...el.querySelectorAll("*")].filter(node => getComputedStyle(node).backdropFilter !== "none").length);
    expect(samplers).toBe(1);
  });
}
