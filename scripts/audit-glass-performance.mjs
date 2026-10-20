import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { startDocsPreview } from "./lib/docs-preview.mjs";

const MEASUREMENT_VERSION=9;

export function percentile(values, fraction = .95) {
  const sorted = [...values].sort((a,b) => a-b);
  return sorted[Math.max(0,Math.ceil(sorted.length*fraction)-1)] ?? null;
}

export function geometriesMatch(before, after) {
  const sameRect=(left,right)=>["x","y","width","height"].every(key=>Number.isFinite(left?.[key])&&Number.isFinite(right?.[key])&&Math.abs(left[key]-right[key])<=.01);
  return Array.isArray(before)&&Array.isArray(after)&&before.length>0&&before.length===after.length&&before.every((entry,index)=>{
    const next=after[index];
    return sameRect(entry,next)&&Boolean(entry.label)===Boolean(next.label)
      &&(!(entry.label&&next.label&&entry.label.text===next.label.text)||sameRect(entry.label,next.label));
  });
}

/** Keep hosts in viewport coordinates; optionally compare text in its native
 *  scroll content coordinates while retaining the untouched viewport evidence. */
export function measureGeometries(nodes,compensateScroll=false) {
  return nodes.map(node=>{
    const rect=node.getBoundingClientRect(),host=node.getAttribute("data-slot")==="toggle-track"?node.closest("label")??node:node;
    const doc=node.ownerDocument,walker=doc.createTreeWalker(host,doc.defaultView.NodeFilter.SHOW_TEXT);let label=null;
    while(walker.nextNode())if(walker.currentNode.textContent?.trim()){
      const range=doc.createRange();range.selectNodeContents(walker.currentNode);
      const viewportRect=range.getBoundingClientRect().toJSON();
      label={text:walker.currentNode.textContent,...viewportRect,viewportRect,scrollOffsets:[]};
      if(compensateScroll)for(let ancestor=walker.currentNode.parentElement;ancestor&&node.contains(ancestor);ancestor=ancestor.parentElement){
        const left=ancestor.scrollLeft,top=ancestor.scrollTop;
        label.x+=left;label.y+=top;label.left+=left;label.right+=left;label.top+=top;label.bottom+=top;
        if(left||top)label.scrollOffsets.push({slot:ancestor.getAttribute("data-slot"),left,top});
      }
      break;
    }
    return {...rect.toJSON(),label};
  });
}

export function evaluateSample(sample) {
  const failures=[];
  if(sample.measurementVersion!==MEASUREMENT_VERSION)failures.push("measurement:unsupported-version");
  if(sample.errors?.length)failures.push("runtime:errors");
  for(const name of ["scene-load","activation","first-input","interaction","scroll"])
    if(sample.phases?.filter(phase=>phase.name===name).length!==1)failures.push(`${name}:missing-or-duplicate`);
  const ready=sample.sceneReadiness,activation=sample.phases?.find(phase=>phase.name==="activation");
  if(!ready || ready.texture!=="solid" || ready.builds!==0 || ready.encodes!==0 || ready.samplers!==0
    || !(ready.imageDecodedAt>=ready.fontsReadyAt) || !ready.paint?.scene || ready.paint.url!==ready.imageURL
    || !(ready.paint.renderTime>0) || !(ready.paint.size>0) || !(ready.paint.observedAt>=ready.imageDecodedAt)
    || !(ready.readyAt>=Math.max(ready.paint.renderTime,ready.paint.observedAt))
    || !(activation?.start>=ready.readyAt))failures.push("scene:unready-or-prewarmed");
  if(sample.texture==="glass" && ((sample.builds?.length??0)!==0 || (sample.encodes?.length??0)!==0))failures.push("glass:unexpected-raster-work");
  const expectedSamplers=["tabs","switch"].includes(sample.usage)?2:1;
  if(sample.texture==="glass" && (sample.renderer!=="css" || sample.samplers!==expectedSamplers || sample.svgResources!==0))failures.push("glass:unexpected-sampling");
  for(const phase of sample.phases ?? []) {
    if(["interaction","scroll"].includes(phase.name)) {
      if(phase.duration<5000 || phase.frames.length<120)failures.push(`${phase.name}:insufficient-sample`);
      if(phase.p95===null || phase.p95>20)failures.push(`${phase.name}:p95`);
      if(phase.encodes)failures.push(`${phase.name}:unexpected-raster-work`);
      if(phase.longTasks.some(task=>task.duration>50))failures.push(`${phase.name}:long-task`);
    }
  }
  if((sample.phases?.find(phase=>phase.name==="scroll")?.scrollDistance??0)<120)failures.push("scroll:distance");
  if(sample.idleRafRequests!==0)failures.push("idle:raf");
  if(!sample.geometryStable)failures.push("interaction:geometry");
  const interaction=sample.phases?.find(phase=>phase.name==="interaction"),scroll=sample.phases?.find(phase=>phase.name==="scroll");
  const during=(entry,phase)=>phase && entry.at>=phase.start && entry.at<=phase.end;
  const readiness=sample.materialReadiness;
  if(!readiness || !(readiness.stableReadyAt>=readiness.warmupFinishedAt) || !(readiness.warmupFinishedAt>=readiness.warmupStartedAt+500)
    || !(interaction?.start>=readiness.stableReadyAt))failures.push("interaction:unready");
  if(sample.usage==="dense") {
    const lifecycle=sample.phases?.filter(phase=>phase.name==="selection-lifecycle")??[];
    if(lifecycle.length!==1)failures.push("selection-lifecycle:missing-or-duplicate");
    const selection=lifecycle[0],commits=sample.commits??[];
    if(!(selection?.duration>=5000))failures.push("selection-lifecycle:insufficient-sample");
    let previous=commits.filter(entry=>selection && entry.at<selection.start && typeof entry.value==="string").at(-1)?.value;
    const changed=commits.some(entry=>{
      if(!during(entry,selection) || typeof entry.value!=="string")return false;
      const differs=previous!==undefined && entry.value!==previous;previous=entry.value;return differs;
    });
    if(!changed)failures.push("selection-lifecycle:no-value-commit");
    if(!sample.events?.some(entry=>entry.trusted && during(entry,selection) && ["pointerdown","touchstart","keydown"].includes(entry.type)))failures.push("selection-lifecycle:no-trusted-input");
    const portals=(sample.portals??[]).filter(entry=>during(entry,selection));
    const closed=portals.filter(entry=>entry.kind==="closed"),opened=portals.filter(entry=>entry.kind==="opened");
    if(!closed.length || closed.length!==opened.length || !closed.every((entry,index)=>opened[index]?.at>=entry.at && opened[index]?.id!==entry.id))failures.push("selection-lifecycle:missing-portal-cycle");
    if(!(readiness?.warmupStartedAt>=selection?.end))failures.push("interaction:lifecycle-overlap");
    const changedState=(sample.states??[]).some(entry=>during(entry,interaction) && (sample.mobile
      ? entry.kind==="scroll" && entry.from!==entry.to : entry.kind==="focus" && typeof entry.value==="string"));
    if(!changedState)failures.push("interaction:no-stable-state-change");
    if(!sample.stablePortal || sample.stablePortal.before!==sample.stablePortal.after || (sample.portals??[]).some(entry=>during(entry,interaction)))failures.push("interaction:portal-recreated");
  } else if(!sample.stateChanged || !sample.commits?.some(entry=>during(entry,interaction)))failures.push("interaction:no-state-commit");
  const interactionInputs=sample.usage==="dense"?[sample.mobile?"touchmove":"keydown"]:["pointerdown","touchstart","keydown"];
  if(!sample.events?.some(entry=>entry.trusted && during(entry,interaction) && interactionInputs.includes(entry.type)))failures.push("interaction:no-trusted-input");
  if(!sample.events?.some(entry=>entry.trusted && during(entry,scroll) && ["wheel","touchmove"].includes(entry.type)))failures.push("scroll:no-trusted-input");
  return failures;
}

export function orderedCases(profiles, repetitions=3, usages=["clear","regular","dense","tabs","switch","toggle"],textures=["solid","aero","glass"]) {
  const choices=(values,allowed,name)=>{
    if(!Array.isArray(values) || !values.length || new Set(values).size!==values.length || values.some(value=>!allowed.includes(value)))throw Error(`Invalid ${name}`);
  };
  choices(profiles,["desktop-light-1","desktop-dark-1","desktop-light-2","desktop-dark-2","mobile-light-2","mobile-dark-2"],"profiles");
  choices(usages,["clear","regular","dense","tabs","switch","toggle"],"usages");choices(textures,["solid","aero","glass"],"textures");
  if(!Number.isInteger(repetitions) || repetitions<1)throw Error("Repetitions must be a positive integer");
  let seed=20261017;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
  const cases=[];
  for(let repetition=0;repetition<repetitions;repetition++) {
    const batch=profiles.flatMap(profile=>usages.flatMap(usage=>textures.map(texture=>({profile,usage,texture,repetition}))));
    for(let index=batch.length-1;index>0;index--){const target=Math.floor(random()*(index+1));[batch[index],batch[target]]=[batch[target],batch[index]];}
    cases.push(...batch);
  }
  return cases;
}

/** Browser-only instrumentation; never imported into the product bundle.
 *  只记录真实输入、提交和帧调度；不把 RAF 当成 GPU 呈现或 INP。 */
function installProbe() {
  const audit={events:[],commits:[],states:[],portals:[],tasks:[],encodes:[],builds:[],phases:[],active:null,raf:0,last:0,scrollTops:new WeakMap()};
  const portalIds=new WeakMap();let nextPortal=0;
  audit.portalId=node=>{if(!portalIds.has(node))portalIds.set(node,++nextPortal);return portalIds.get(node);};
  audit.recordPortal=(kind,detail)=>{const entry={kind,...detail,at:performance.now(),phase:audit.active?.name??null};audit.portals.push(entry);return entry;};
  // CSS Glass must not allocate raster maps. Observe accidental work without
  // reproducing the removed encoder/decode pipeline in the test harness.
  audit.samplers=()=>{
    const nodes=new Set(document.querySelectorAll(".glass-fixture-stage, .glass-fixture-stage *, [data-slot=select-content], [data-slot=select-content] *"));
    const samplers=[];
    for(const node of nodes){
      if(!node.getClientRects().length || getComputedStyle(node).visibility==="hidden")continue;
      for(const pseudo of [null,"::before","::after"]){
        const style=getComputedStyle(node,pseudo),filter=style.backdropFilter || style.webkitBackdropFilter;
        if(pseudo && ["none","normal"].includes(style.content))continue;
        if(filter && filter!=="none")samplers.push({slot:node.getAttribute("data-slot"),id:node.id,className:node.className,pseudo,filter});
      }
    }
    return samplers;
  };
  const rasterCanvases=new WeakSet();
  for(const context of [CanvasRenderingContext2D,window.OffscreenCanvasRenderingContext2D].filter(Boolean)){
    const original=context.prototype.createImageData;
    context.prototype.createImageData=function(...args){
      if(!rasterCanvases.has(this.canvas)){
        rasterCanvases.add(this.canvas);audit.builds.push({start:performance.now(),width:this.canvas.width,height:this.canvas.height});
      }
      return original.apply(this,args);
    };
  }
  for(const method of ["toDataURL","toBlob"]){
    const original=HTMLCanvasElement.prototype[method];
    HTMLCanvasElement.prototype[method]=function(...args){
      audit.encodes.push({at:performance.now(),method,width:this.width,height:this.height});return original.apply(this,args);
    };
  }
  if(window.OffscreenCanvas?.prototype.convertToBlob){
    const original=OffscreenCanvas.prototype.convertToBlob;
    OffscreenCanvas.prototype.convertToBlob=function(...args){
      audit.encodes.push({at:performance.now(),method:"convertToBlob",width:this.width,height:this.height});return original.apply(this,args);
    };
  }
  const observer=new PerformanceObserver(list=>audit.tasks.push(...list.getEntries().map(entry=>({startTime:entry.startTime,duration:entry.duration}))));
  observer.observe({type:"longtask",buffered:false});
  for(const name of ["pointerdown","pointerup","pointermove","keydown","wheel","touchstart","touchmove","touchend"])document.addEventListener(name,event=>audit.events.push({type:name,at:performance.now(),eventTime:event.timeStamp,trusted:event.isTrusted,key:event.key}),{capture:true,passive:true});
  window.addEventListener("glass-fixture:commit",event=>audit.commits.push({at:performance.now(),...event.detail}));
  document.addEventListener("focusin",event=>{
    const node=event.target;
    if(node instanceof Element && document.activeElement===node && node.matches('[data-slot="select-item"]'))audit.states.push({kind:"focus",at:performance.now(),value:node.textContent?.trim()??""});
  },true);
  document.addEventListener("scroll",event=>{
    const node=event.target;if(!(node instanceof Element))return;
    const previous=audit.scrollTops.get(node)??0,top=node.scrollTop;audit.scrollTops.set(node,top);
    if(audit.active)audit.active.scrollDistance+=Math.abs(top-previous);
    if(top!==previous && node.closest('[data-slot="select-content"]'))audit.states.push({kind:"scroll",at:performance.now(),from:previous,to:top});
  },true);
  const frame=now=>{if(!audit.active)return;audit.active.frames.push(now);audit.raf=requestAnimationFrame(frame);};
  audit.begin=name=>{if(audit.active)throw Error("Overlapping measurement phase");audit.active={name,start:performance.now(),frames:[],scrollDistance:0};audit.raf=requestAnimationFrame(frame);};
  audit.end=()=>{
    cancelAnimationFrame(audit.raf);const phase=audit.active;audit.active=null;phase.end=performance.now();phase.duration=phase.end-phase.start;audit.phases.push(phase);
  };
  audit.finish=()=>{observer.disconnect();return {events:audit.events,commits:audit.commits,states:audit.states,portals:audit.portals,tasks:audit.tasks,encodes:audit.encodes,builds:audit.builds,phases:audit.phases};};
  window.__glassAudit=audit;
  audit.begin("scene-load");
}

async function digest(directory) {
  const hash=crypto.createHash("sha256");
  async function visit(relative="") {
    const entries=await fs.readdir(path.join(directory,relative),{withFileTypes:true});
    for(const entry of entries.sort((a,b)=>a.name.localeCompare(b.name))) {
      const name=path.join(relative,entry.name);
      if(entry.isDirectory())await visit(name);else {hash.update(name.replaceAll("\\","/"));hash.update(await fs.readFile(path.join(directory,name)));}
    }
  }
  await visit();return hash.digest("hex");
}

async function touchScroll(session,box,direction) {
  const x=box.x+box.width/2,y=box.y+box.height*.65;
  await session.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y,id:1}]});
  for(let step=1;step<=6;step++) {
    await session.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x,y:y-direction*step*14,id:1}]});
    await new Promise(resolve=>setTimeout(resolve,16));
  }
  await session.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
}

async function measure(origin,condition,artifactHash) {
  const started=Date.now(),[device,theme,dprString]=condition.profile.split("-");
  const mobile=device==="mobile",dpr=Number(dprString),viewport=mobile?{width:390,height:844}:{width:1280,height:900};
  const browser=await chromium.launch({channel:"chromium"});let context,timeout;
  try {
    context=await browser.newContext({viewport,deviceScaleFactor:dpr,hasTouch:mobile,isMobile:mobile,
      ...(mobile?{userAgent:`Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browser.version()} Mobile Safari/537.36`}:{})});
    timeout=setTimeout(()=>void context.close(),45000);
    await context.addInitScript(({theme})=>{localStorage.setItem("unitary-theme-preference",theme);localStorage.setItem("unitary-texture-preference-v2","solid");},{theme});
    await context.addInitScript(installProbe);
    const page=await context.newPage();page.setDefaultTimeout(10000);
    const errors=[];page.on("pageerror",error=>errors.push(error.message));
    await page.goto(`${origin}/site/build/glass-regression.html?usage=${condition.usage}`);
    await page.waitForFunction(()=>document.documentElement.dataset.glassFixtureReady==="true");
    const sceneReadiness=await page.evaluate(async()=>{
      await document.fonts.ready;const fontsReadyAt=performance.now();
      const image=new Image();image.src=getComputedStyle(document.querySelector(".glass-fixture-landscape")).backgroundImage.match(/url\("?([^")]+)"?\)/)[1];await image.decode();
      const imageDecodedAt=performance.now(),imageURL=image.src;
      // decode() can finish before Chromium's separate GPU JPEG decode. Wait for the
      // actual background's reported paint; never initialize Glass or capture a screenshot.
      const paint=await new Promise((resolve,reject)=>{
        const timer=setTimeout(()=>{observer.disconnect();reject(new Error("Scene photo did not report LCP"));},10000);
        const observer=new PerformanceObserver(list=>{
          for(const entry of list.getEntries())if(entry.url===imageURL&&entry.renderTime>0){
            clearTimeout(timer);observer.disconnect();
            resolve({renderTime:entry.renderTime,loadTime:entry.loadTime,size:entry.size,url:entry.url,
              observedAt:performance.now(),scene:entry.element===document.querySelector(".glass-fixture-landscape")});return;
          }
        });
        observer.observe({type:"largest-contentful-paint",buffered:true});
      });
      const ready={fontsReadyAt,imageDecodedAt,imageURL,paint,readyAt:performance.now(),texture:document.documentElement.dataset.texture,
        builds:window.__glassAudit.builds.length,encodes:window.__glassAudit.encodes.length,samplers:window.__glassAudit.samplers().length};
      window.__glassAudit.end();return ready;
    });
    const dense=condition.usage==="dense";
    const grouped=["tabs","switch"].includes(condition.usage);
    const surfaces=condition.usage==="tabs"?page.getByRole("tab"):condition.usage==="switch"?page.locator('[data-slot="switch-control"]')
      :condition.usage==="toggle"?page.locator('[data-slot="toggle-track"]'):dense?page.locator('[data-slot="select-content"]'):page.getByTestId("optical-owner");
    const owner=surfaces.first();
    const actions=condition.usage==="tabs"?page.getByRole("tab"):condition.usage==="switch"?page.locator('[data-slot="switch"]>label'):null;
    const action=actions?actions.nth(1):condition.usage==="toggle"?page.getByRole("checkbox"):dense?page.locator('[data-slot="select-trigger"]'):page.getByRole("button",{name:condition.usage==="clear"?"Playback":"Pin",exact:true});
    const begin=name=>page.evaluate(name=>window.__glassAudit.begin(name),name),end=()=>page.evaluate(()=>window.__glassAudit.end());
    const recordOpen=iteration=>owner.evaluate((el,iteration)=>window.__glassAudit.recordPortal("opened",{id:window.__glassAudit.portalId(el),iteration}),iteration);
    const recordClose=(id,iteration)=>page.evaluate(({id,iteration})=>window.__glassAudit.recordPortal("closed",{id,iteration}),{id,iteration});
    let portalId;
    await begin("activation");await page.evaluate(texture=>window.__glassFixture.activate(texture),condition.texture);
    await page.waitForFunction(texture=>document.documentElement.dataset.texture===texture,condition.texture);
    if(!dense && condition.texture==="glass" && !mobile)await owner.waitFor({state:"visible"});
    if(!dense && condition.texture==="glass" && !mobile)await owner.waitFor({state:"attached"});
    if(!dense && condition.texture==="glass")await owner.evaluate(el=>{if(!getComputedStyle(el).backdropFilter.includes("blur("))throw Error("CSS Glass sampler unavailable");});
    await end();
    const materialReadiness={beforeFirstInput:await page.evaluate(()=>({at:performance.now(),interactiveSurfaces:document.querySelectorAll('[data-uni-glass-interaction]').length}))};
    await begin("first-input");if(mobile)await action.tap();else await action.click();
    if(dense){
      await owner.waitFor({state:"visible"});
      portalId=(await recordOpen(-1)).id;
      if(condition.texture==="glass")await owner.evaluate(el=>{if(!getComputedStyle(el).backdropFilter.includes("blur("))throw Error("CSS portal sampler unavailable");});
      if(mobile)await page.getByRole("option",{name:"Project file 01",exact:true}).tap();
      else {
        await page.waitForFunction(()=>document.activeElement?.getAttribute('data-slot')==='select-item');
        await page.keyboard.press("ArrowDown");
        await page.waitForFunction(()=>document.activeElement?.textContent?.includes('Project file 01'));
        await page.keyboard.press("Enter");
      }
      await owner.waitFor({state:"hidden"});
      await recordClose(portalId,-1);
    }
    await end();
    if(dense){
      await begin("portal-reopen");if(mobile)await action.tap();else await action.click();await owner.waitFor({state:"visible"});
      portalId=(await recordOpen(-1)).id;
      if(condition.texture==="glass")await owner.evaluate(el=>{if(!getComputedStyle(el).backdropFilter.includes("blur("))throw Error("CSS portal sampler unavailable");});
      await end();
    }
    if(dense){
      // This is the real selection/close/reopen workflow, including Portal
      // creation, positioning, focus restoration and transitions. It is reported
      // separately from stable interaction and never relabeled as steady work.
      await page.waitForFunction(()=>document.getAnimations().every(animation=>animation.playState!=="running"));
      await begin("selection-lifecycle");let iteration=0;const selectionStart=Date.now();
      while(Date.now()-selectionStart<5050){
        if(mobile)await page.getByRole("option",{name:`Project file ${iteration%2?"01":"00"}`,exact:true}).tap();
        else {
          await page.keyboard.press("Home");
          await page.waitForFunction(()=>document.activeElement?.getAttribute("data-slot")==="select-item" && document.activeElement.textContent?.includes("Project file 00"));
          if(iteration%2){
            await page.keyboard.press("ArrowDown");
            await page.waitForFunction(()=>document.activeElement?.getAttribute("data-slot")==="select-item" && document.activeElement.textContent?.includes("Project file 01"));
          }
          await page.keyboard.press("Enter");
        }
        await owner.waitFor({state:"hidden"});await recordClose(portalId,iteration);
        if(mobile)await action.tap();else await action.click();await owner.waitFor({state:"visible"});
        portalId=(await recordOpen(iteration)).id;
        iteration++;await page.waitForTimeout(100);
      }
      await page.waitForFunction(()=>document.getAnimations().every(animation=>animation.playState!=="running"));
      await end();
    }
    // CSS material and native first input above receive no hidden prewarming.
    await page.waitForFunction(()=>document.getAnimations().every(animation=>animation.playState!=="running"));
    materialReadiness.warmupStartedAt=await page.evaluate(()=>performance.now());
    await page.waitForTimeout(500); // Explicit stable-phase warm-up; first input above has none.
    materialReadiness.warmupFinishedAt=await page.evaluate(()=>performance.now());
    materialReadiness.stableReadyAt=materialReadiness.warmupFinishedAt;
    const geometrySnapshot=()=>surfaces.evaluateAll(measureGeometries,dense);
    const geometry=await geometrySnapshot(),actionBox=dense?null:await action.boundingBox();
    const session=await context.newCDPSession(page);
    const stableBox=dense?await owner.boundingBox():null;
    const stablePortal=dense?{before:await owner.evaluate(el=>window.__glassAudit.portalId(el))}:null;
    await begin("interaction");let index=0;const interactionStart=Date.now();
    while(Date.now()-interactionStart<5050) {
      if(dense && mobile) {
        // A touch selection closes Select. Stable touch interaction therefore
        // means native scrolling within the already-open option list.
        await touchScroll(session,stableBox,Math.floor(index/3)%2?-1:1);
      }
      else if(dense){
        await page.keyboard.press(index%2?"End":"Home");
        await page.waitForFunction(last=>document.activeElement?.getAttribute("data-slot")==="select-item" && document.activeElement.textContent?.includes(last?"Project file 29":"Project file 00"),Boolean(index%2));
      }
      else if(mobile)await (actions?actions.nth(index%2):action).tap();
      else {
        await page.mouse.move(actionBox.x+actionBox.width*(.2+.6*(index%10)/10),actionBox.y+actionBox.height/2);
        if(index%10===0)await (actions?actions.nth(Math.floor(index/10)%2):action).click();
        if(index%10===5)await page.keyboard.press(grouped?(Math.floor(index/10)%2?"ArrowLeft":"ArrowRight"):"Space");
      }
      index++;await page.waitForTimeout(dense||mobile?100:30);
    }
    await page.waitForFunction(()=>document.getAnimations().every(animation=>animation.playState!=="running"));
    await end();const afterGeometry=await geometrySnapshot();
    if(dense)stablePortal.after=await owner.evaluate(el=>window.__glassAudit.portalId(el));
    const scrollOwner=dense?owner:page.getByTestId("scroll-stage"),scrollBox=await scrollOwner.boundingBox();
    if(!mobile)await scrollOwner.hover({position:{x:scrollBox.width*.7,y:scrollBox.height*.55}});
    await begin("scroll");index=0;const scrollStart=Date.now();
    while(Date.now()-scrollStart<5050) {
      const direction=Math.floor(index/(mobile?3:20))%2?-1:1;
      if(mobile)await touchScroll(session,scrollBox,direction);else await page.mouse.wheel(0,48*direction);
      index++;await page.waitForTimeout(mobile?120:35);
    }
    await end();await page.mouse.move(1,1);await page.waitForTimeout(600);
    const snapshot=await owner.evaluate(el=>{
      const samplerDetails=window.__glassAudit.samplers();
      return {renderer:samplerDetails.some(surface=>surface.filter.includes("url("))?"svg":"css",
        effectiveOpacity:getComputedStyle(el).getPropertyValue("--_uni-glass-effective-opacity"),
        samplers:samplerDetails.length,samplerDetails,
        svgResources:document.querySelectorAll("[data-uni-glass-defs], [data-uni-glass-renderer], feDisplacementMap").length,
        interactiveSurfaces:document.querySelectorAll("[data-uni-glass-interaction]").length};
    });
    const idleRafRequests=await page.evaluate(async()=>{let count=0;const original=requestAnimationFrame;window.requestAnimationFrame=callback=>{count++;return original.call(window,callback);};await new Promise(resolve=>setTimeout(resolve,1000));window.requestAnimationFrame=original;return count;});
    const raw=await page.evaluate(()=>window.__glassAudit.finish());
    const phases=raw.phases.map(phase=>{
      const gaps=phase.frames.slice(1).map((timestamp,index)=>timestamp-phase.frames[index]);
      const portals=raw.portals.filter(entry=>entry.at>=phase.start&&entry.at<=phase.end);
      return {...phase,median:percentile(gaps,.5),p95:percentile(gaps),max:gaps.length?Math.max(...gaps):null,
        portalCounts:{opened:portals.filter(entry=>entry.kind==="opened").length,closed:portals.filter(entry=>entry.kind==="closed").length,mounted:new Set(portals.filter(entry=>entry.kind==="opened").map(entry=>entry.id)).size},
        encodes:raw.encodes.filter(entry=>entry.at>=phase.start&&entry.at<phase.end).length,longTasks:raw.tasks.filter(entry=>entry.startTime<phase.end&&entry.startTime+entry.duration>phase.start)};
    });
    const interaction=phases.find(phase=>phase.name==="interaction");
    const stateChanged=(dense?raw.states:raw.commits).some(entry=>entry.at>=interaction.start&&entry.at<=interaction.end);
    const result={measurementVersion:MEASUREMENT_VERSION,...condition,startedAt:new Date(started).toISOString(),wallTimeMs:Date.now()-started,artifactHash,browser:browser.version(),userAgent:await page.evaluate(()=>navigator.userAgent),viewport,dpr,mobile,theme,...snapshot,sceneReadiness,materialReadiness,
      interactionMode:dense?(mobile?"open-list-touch-scroll":"open-list-keyboard-navigation"):"control-activation",stablePortal,
      phases,events:raw.events,commits:raw.commits,states:raw.states,portals:raw.portals,
      portalCounts:{opened:raw.portals.filter(entry=>entry.kind==="opened").length,closed:raw.portals.filter(entry=>entry.kind==="closed").length,mounted:new Set(raw.portals.filter(entry=>entry.kind==="opened").map(entry=>entry.id)).size},
      longTasks:raw.tasks,encodes:raw.encodes,builds:raw.builds,idleRafRequests,stateChanged,
      geometry:{before:geometry,after:afterGeometry,textCoordinates:dense?"native scroll content coordinates; raw viewportRect retained":"viewport coordinates"},geometryStable:geometriesMatch(geometry,afterGeometry),errors};
    result.failures=[...evaluateSample(result),...errors.map(error=>`page:${error}`)];return result;
  }finally{clearTimeout(timeout);await context?.close();await browser.close();}
}

export async function runAudit(options) {
  const artifact=path.resolve(options.artifact),output=path.resolve(options.output??".scratch/glass-performance");
  const cases=orderedCases(options.profiles??["desktop-light-1","desktop-dark-1","desktop-light-2","desktop-dark-2","mobile-light-2","mobile-dark-2"],options.repetitions??3,options.usages,options.textures);
  await fs.access(path.join(artifact,"site/build/glass-regression.html"));
  const run=path.join(output,new Date().toISOString().replaceAll(/[:.]/g,"-")+"-"+crypto.randomBytes(3).toString("hex"));await fs.mkdir(run,{recursive:true});
  const hash=await digest(artifact),preview=await startDocsPreview(artifact),results=[];
  const sourceCSSHash=crypto.createHash("sha256").update(await fs.readFile(new URL("../src/styles/index.css",import.meta.url))).digest("hex");
  const harnessHash=crypto.createHash("sha256").update(await fs.readFile(new URL(import.meta.url))).digest("hex");
  await fs.writeFile(path.join(run,"manifest.json"),JSON.stringify({startedAt:new Date().toISOString(),artifactHash:hash,sourceCSSHash,harnessHash,measurementVersion:MEASUREMENT_VERSION,sceneBoundary:"fonts + image decode + matching background photo LCP while Solid; zero CSS samplers/raster work before activation; no screenshots or material prewarming; first input has no warm-up",samplerContract:"all visible fixture and portal nodes including rendered pseudo-elements",
    interactionContract:"5 s trusted stable input after animations and explicit 500 ms warm-up; non-Dense controls require React state commits; Dense keeps one Portal open and requires actual focus changes on desktop or native touch scroll changes on mobile",
    selectionLifecycleContract:"Dense normal value selection, close and Portal reopen measured separately for 5 s with real React value commits, visible-node IDs, open/close timestamps and all long tasks retained; lifecycle costs are reported separately and are not steady-budget passes",
    historicalEvidence:"Version 7/8 raw runs and failures remain unchanged; only fresh version 9 evidence is evaluated against these distinct lifecycle and steady contracts",
    host:{platform:process.platform,arch:process.arch,node:process.version},seed:20261017,cases,phase:options.phase??"verification",budget:{stableWindowMs:5000,p95Ms:20,longTaskMs:50,appliesTo:["interaction","scroll"]}},null,2));
  try {
    for(const [index,condition] of cases.entries()) {
      let result;try{result=await measure(preview.url,condition,hash);}catch(error){result={...condition,failures:[String(error)],wallTimeMs:null};}
      results.push(result);await fs.writeFile(path.join(run,`${String(index).padStart(3,"0")}.json`),JSON.stringify(result,null,2));
      const lifecycle=result.phases?.find(phase=>phase.name==="selection-lifecycle");
      console.log(JSON.stringify({index:index+1,total:cases.length,...condition,p95:result.phases?.filter(p=>["interaction","scroll"].includes(p.name)).map(p=>({phase:p.name,p95:p.p95})),
        selectionLifecycle:lifecycle?{duration:lifecycle.duration,p95:lifecycle.p95,max:lifecycle.max,longTasks:lifecycle.longTasks,portalCounts:lifecycle.portalCounts,budgetApplied:false}:null,failures:result.failures}));
    }
  }finally{await preview.close();}
  const unstableControls=results.filter(result=>result.texture==="solid"&&result.failures.length).map(({profile,usage,repetition})=>({profile,usage,repetition}));
  const lifecycleCosts=results.filter(result=>result.usage==="dense").map(result=>{
    const phase=result.phases?.find(phase=>phase.name==="selection-lifecycle");
    return {profile:result.profile,texture:result.texture,repetition:result.repetition,
      phase:phase?{name:phase.name,duration:phase.duration,median:phase.median,p95:phase.p95,max:phase.max,longTasks:phase.longTasks}:null,
      portalCounts:phase?.portalCounts??null,budgetApplied:false};
  });
  const summary={run,measurementVersion:MEASUREMENT_VERSION,artifactHash:hash,results:results.length,failed:results.filter(result=>result.failures.length).length,unstableControls,lifecycleCosts,complete:results.length===cases.length&&results.every(result=>!result.failures.length)};
  await fs.writeFile(path.join(run,"summary.json"),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));return summary;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  const values={};for(let index=2;index<process.argv.length;index+=2){const key=process.argv[index]?.replace(/^--/,"");if(!["artifact","output","phase","profiles","repetitions","usages","textures"].includes(key)||!process.argv[index+1])throw Error("Expected a known --key and value");values[key]=process.argv[index+1];}
  if(!values.artifact)throw Error("--artifact must name a production docs build with UNITARY_DOCS_TEST_FIXTURES=1");
  const summary=await runAudit({artifact:values.artifact,output:values.output,phase:values.phase,repetitions:values.repetitions?Number(values.repetitions):3,profiles:values.profiles?.split(","),usages:values.usages?.split(","),textures:values.textures?.split(",")});
  process.exitCode=summary.complete?0:1;
}
