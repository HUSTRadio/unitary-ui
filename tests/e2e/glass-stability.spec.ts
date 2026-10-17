import { expect, test, firefox, webkit, type Page } from "@playwright/test";
import { LAYOUT_THEMES, LAYOUT_VIEWPORTS } from "./helpers/layout-matrix";
import { PNG } from "pngjs";

const fixture="/site/build/glass-regression.html";
async function open(page:Page,theme="light",usage="regular",extras=false) {
  await page.addInitScript(theme=>{localStorage.setItem('unitary-theme-preference',theme);localStorage.setItem('unitary-texture-preference-v2','solid');},theme);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(`${fixture}?usage=${usage}${extras?'&extras=1':''}`);
  await expect(page.locator('html')).toHaveAttribute('data-glass-fixture-ready','true');
  await page.evaluate(()=>document.fonts.ready);
  await page.getByRole('button',{name:'Glass',exact:true}).click();
  await expect(page.locator('html')).toHaveAttribute('data-texture','glass');
}
const effective=(page:Page,selector:string)=>page.locator(selector).evaluate(el=>({opacity:getComputedStyle(el).getPropertyValue('--_uni-glass-effective-opacity').trim(),sampler:getComputedStyle(el).backdropFilter,renderer:el.getAttribute('data-uni-glass-renderer')}));

test('same-key surfaces share construction and relinquish their identity while connected',async({page})=>{
  await open(page);await expect(page.getByTestId('optical-owner')).toHaveAttribute('data-uni-glass-renderer','svg');
  await page.evaluate(()=>{
    const original=HTMLCanvasElement.prototype.toBlob;let count=0;
    HTMLCanvasElement.prototype.toBlob=function(...args){count++;return original.apply(this,args);};
    Object.defineProperty(window,'__glassEncodes',{get:()=>count,configurable:true});
    for(let i=0;i<12;i++){const node=document.createElement('div');node.className='material-menu';node.id='parallel-'+i;node.style.cssText='width:120px;height:80px;border-radius:12px';document.body.append(node);}
  });
  await expect.poll(()=>page.locator('[id^="parallel-"][data-uni-glass-renderer="svg"]').count()).toBe(12);
  expect(await page.evaluate(()=>Reflect.get(window,'__glassEncodes'))).toBe(2);
  await page.locator('#parallel-0').evaluate(el=>el.className='');
  await expect(page.locator('#parallel-0')).not.toHaveAttribute('data-uni-glass-renderer');
  expect(await page.locator('#parallel-0').evaluate(el=>el.style.getPropertyValue('--_uni-glass-paint'))).toBe('');
  await page.locator('[id^="parallel-"]').evaluateAll(nodes=>nodes.forEach(node=>node.remove()));
  await expect(page.locator('[data-uni-glass-defs] filter')).toHaveCount(1);
});

test('late decode cannot revive a cancelled surface or discard another subscriber',async({page})=>{
  await open(page);await expect(page.getByTestId('optical-owner')).toHaveAttribute('data-uni-glass-renderer','svg');
  await page.evaluate(()=>{
    const original=HTMLImageElement.prototype.decode;let release!:()=>void;
    const gate=new Promise<void>(resolve=>{release=resolve;});
    Reflect.set(window,'__releaseGlassDecode',release);Reflect.set(window,'__glassDecodeWaiting',false);
    HTMLImageElement.prototype.decode=async function(){Reflect.set(window,'__glassDecodeWaiting',true);await gate;return original.call(this);};
    for(const id of ['cancelled','retained']){const node=document.createElement('div');node.id=id;node.className='material-menu';node.style.cssText='width:144px;height:88px;border-radius:12px';document.body.append(node);}
  });
  await expect.poll(()=>page.evaluate(()=>Reflect.get(window,'__glassDecodeWaiting'))).toBe(true);
  await page.locator('#cancelled').evaluate(el=>el.className='');
  await page.evaluate(()=>Reflect.get(window,'__releaseGlassDecode')());
  await expect(page.locator('#retained')).toHaveAttribute('data-uni-glass-renderer','svg');
  await expect(page.locator('#cancelled')).not.toHaveAttribute('data-uni-glass-renderer');
});

test('StrictMode and multiple roots release the last SVG and contrast subscription',async({page})=>{
  await page.addInitScript(()=>{
    const original=matchMedia;const listeners=new Set<EventListenerOrEventListenerObject>();
    Reflect.set(window,'__glassContrastListeners',listeners);
    window.matchMedia=query=>{
      const list=original.call(window,query);if(query!=='(prefers-contrast: more)')return list;
      const add=list.addEventListener.bind(list),remove=list.removeEventListener.bind(list);
      list.addEventListener=((name:string,listener:EventListenerOrEventListenerObject,options?:AddEventListenerOptions)=>{listeners.add(listener);add(name,listener,options);}) as typeof list.addEventListener;
      list.removeEventListener=((name:string,listener:EventListenerOrEventListenerObject,options?:EventListenerOptions)=>{listeners.delete(listener);remove(name,listener,options);}) as typeof list.removeEventListener;
      return list;
    };
  });
  await open(page);await expect(page.getByTestId('optical-owner')).toHaveAttribute('data-uni-glass-renderer','svg');
  expect(await page.evaluate(()=>Reflect.get(window,'__glassContrastListeners').size)).toBe(1);
  await page.evaluate(()=>window.__glassFixture.addRoot());
  await expect(page.locator('[data-uni-glass-defs] filter')).toHaveCount(2);
  await expect(page.locator('[data-uni-glass-defs]')).toHaveCount(1);
  await page.evaluate(()=>window.__glassFixture.unmount());
  await expect(page.locator('[data-uni-glass-defs]')).toHaveCount(1);
  await page.evaluate(()=>window.__glassFixture.removeRoot());
  await expect(page.locator('[data-uni-glass-defs]')).toHaveCount(0);
  expect(await page.evaluate(()=>Reflect.get(window,'__glassContrastListeners').size)).toBe(0);
});

for(const theme of LAYOUT_THEMES)for(const viewport of LAYOUT_VIEWPORTS)test(`real usages and portals: ${theme} ${viewport.width}`,async({page})=>{
  await page.setViewportSize(viewport);await open(page,theme,'dense',true);
  const dense=theme==='dark'?'90%':'82%';
  await page.getByRole('combobox',{name:'Choose file'}).click();
  const list=page.locator('[data-slot="select-content"]');await expect(list).toBeVisible();
  expect((await effective(page,'[data-slot="select-content"]')).opacity).toBe(dense);
  await expect(list).toHaveAttribute('data-uni-glass-renderer','svg');
  expect(await list.locator('[data-uni-glass-renderer]').count()).toBe(0);
  await expect(page.getByRole('option',{name:'Project file 00',exact:true})).toBeFocused();
  await page.keyboard.press('ArrowDown');await expect(page.getByRole('option',{name:'Project file 01',exact:true})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('output')).not.toHaveText('item-0');
  await page.getByRole('button',{name:'Open menu',exact:true}).click();
  await expect(page.locator('[data-slot="menu"]')).toBeVisible();
  expect((await effective(page,'[data-slot="menu"]')).opacity).toBe(dense);
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Open modal',exact:true}).click();
  await expect(page.locator('[data-slot="modal-content"]')).toBeVisible();
  expect((await effective(page,'[data-slot="modal-content"]')).opacity).toBe(dense);
  expect(await page.locator('[data-slot="modal-content"] [data-uni-glass-renderer]').count()).toBe(0);
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Open drawer',exact:true}).click();
  await expect(page.locator('[data-slot="drawer"]')).toBeVisible();
  expect((await effective(page,'[data-slot="drawer"]')).opacity).toBe(dense);
  expect(await page.locator('[data-slot="drawer"] [data-uni-glass-renderer]').count()).toBe(0);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:'Open drawer',exact:true})).toBeFocused();
});

const luminance=(rgb:number[])=>rgb.map(value=>{const c=value/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;}).reduce((sum,value,i)=>sum+value*[.2126,.7152,.0722][i],0);
for(const theme of LAYOUT_THEMES)for(const usage of ['clear','regular','dense'])test(`actual state contrast: ${usage} ${theme}`,async({page})=>{
  await open(page,theme,usage);
  if(usage==='dense')await page.getByRole('combobox',{name:'Choose file'}).click();
  const owner=usage==='dense'?page.locator('[data-slot="select-content"]'):page.getByTestId('optical-owner');
  await expect(owner).toHaveAttribute('data-uni-glass-renderer','svg');
  const label=usage==='dense'?page.getByRole('option',{name:'Project file 00',exact:true}):usage==='clear'?page.getByRole('button',{name:'Playback'}):page.getByRole('button',{name:'Pin',exact:true});
  const inkLabel=label.locator(':scope > span').first();
  const ratios:Array<{state:string;minimum:number}>=[];
  // Hide glyph paint without changing computed color or triggering color transitions.
  await page.addStyleTag({content:'[data-hide-fixture-ink], [data-hide-fixture-ink] * {-webkit-text-fill-color:transparent !important;text-shadow:none !important;}'});
  for(const state of ['default','hover','focus','selected']){
    if(state==='hover')await label.hover();
    if(state==='focus')await label.focus();
    if(state==='selected'&&usage!=='dense')await label.click();
    const ink=await inkLabel.evaluate(el=>{const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')!;ctx.fillStyle=getComputedStyle(el).color;ctx.fillRect(0,0,1,1);return Array.from(ctx.getImageData(0,0,1,1).data).slice(0,3);});
    await inkLabel.evaluate(el=>el.setAttribute('data-hide-fixture-ink',''));
    const pixels=PNG.sync.read(await inkLabel.screenshot()),foreground=luminance(ink);let minimum=Infinity;
    for(let i=0;i<pixels.data.length;i+=4){const background=luminance(Array.from(pixels.data.subarray(i,i+3)));minimum=Math.min(minimum,(Math.max(foreground,background)+.05)/(Math.min(foreground,background)+.05));}
    await inkLabel.evaluate(el=>el.removeAttribute('data-hide-fixture-ink'));
    ratios.push({state,minimum});
    expect(minimum,`${usage} ${theme} ${state}`).toBeGreaterThanOrEqual(4.5);
  }
  if(usage==='dense') {
    const symbol=label.locator('svg');await expect(symbol).toBeVisible();
    const ink=await symbol.evaluate(el=>{const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')!;ctx.fillStyle=getComputedStyle(el).stroke;ctx.fillRect(0,0,1,1);return Array.from(ctx.getImageData(0,0,1,1).data).slice(0,3);});
    await symbol.evaluate(el=>el.style.stroke='transparent');
    const pixels=PNG.sync.read(await symbol.screenshot()),foreground=luminance(ink);let minimum=Infinity;
    for(let i=0;i<pixels.data.length;i+=4){const background=luminance(Array.from(pixels.data.subarray(i,i+3)));minimum=Math.min(minimum,(Math.max(foreground,background)+.05)/(Math.min(foreground,background)+.05));}
    await symbol.evaluate(el=>el.style.removeProperty('stroke'));
    ratios.push({state:'selected-symbol',minimum});expect(minimum).toBeGreaterThanOrEqual(3);
  }
  await test.info().attach('composited-contrast',{body:Buffer.from(JSON.stringify({usage,theme,ratios})),contentType:'application/json'});
  if(usage==='regular')await expect(page.getByRole('button',{name:'Share',exact:true})).toBeDisabled();
});

for(const [engine,name] of [[firefox,'Firefox'],[webkit,'WebKit']] as const)for(const theme of LAYOUT_THEMES)test(`real ${name} CSS fallback: ${theme}`,async()=>{
  const browser=await engine.launch({channel:undefined});try{
    const page=await browser.newPage({baseURL:test.info().project.use.baseURL,viewport:{width:1280,height:900},permissions:[]});await open(page,theme,'clear');
    await expect(page.locator('[data-uni-glass-defs]')).toHaveCount(0);
    const value=await effective(page,'[data-testid="optical-owner"]');
    expect(value.renderer).toBeNull();expect(value.sampler).toBe('blur(1px)');
    await page.getByRole('button',{name:'Playback'}).click();await expect(page.getByRole('button',{name:'Playback'})).toHaveAttribute('aria-pressed','true');
  }finally{await browser.close();}
});
